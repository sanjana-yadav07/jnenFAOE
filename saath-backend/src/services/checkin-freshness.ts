import { normalizeRiskLevel, type CanonicalRiskLevel } from './recommendations.js';

export type FreshnessStatus = 'CURRENT' | 'STALE_CHECKIN' | 'NO_CHECKIN_HISTORY';

export interface CheckInFreshnessPolicy {
  thresholdHours: number;
  flagCounsellor: boolean;
}

/**
 * Centralized risk-based check-in freshness policy configuration:
 * - LOW: 72h (3 days) threshold, informational only (does not flag counsellor escalation)
 * - MODERATE: 48h (2 days) threshold, flags counsellor attention
 * - HIGH: 24h (1 day) threshold, flags counsellor attention
 * - CRITICAL: 0h (immediate eligibility when missing/overdue), flags urgent counsellor attention
 */
export const CHECK_IN_FRESHNESS_POLICY: Record<CanonicalRiskLevel, CheckInFreshnessPolicy> = {
  LOW: {
    thresholdHours: 72,
    flagCounsellor: false,
  },
  MODERATE: {
    thresholdHours: 48,
    flagCounsellor: true,
  },
  HIGH: {
    thresholdHours: 24,
    flagCounsellor: true,
  },
  CRITICAL: {
    thresholdHours: 0,
    flagCounsellor: true,
  },
};

export interface CheckInFreshnessInput {
  victimToken?: string;
  riskLevel?: string | null;
  lastCheckInAt?: string | null | Date;
  now?: string | null | Date | number;
}

export interface CheckInFreshnessEvaluation {
  status: FreshnessStatus;
  riskLevel: CanonicalRiskLevel;
  lastCheckInAt: string | null;
  thresholdHours: number;
  elapsedHours: number | null;
  shouldFlagCounsellor: boolean;
  priority?: 'P1' | 'P2' | 'P3' | 'P4';
  reason: string;
}

/**
 * Evaluates the freshness of a survivor's check-in activity based on their current risk level.
 *
 * Rule:
 * STALE_CHECKIN / NO_CHECKIN_HISTORY + MODERATE/HIGH/CRITICAL = COUNSELLOR FLAG
 * LOW risk never creates a counsellor escalation flag.
 */
export function evaluateCheckInFreshness(input: CheckInFreshnessInput): CheckInFreshnessEvaluation {
  const canonicalRisk: CanonicalRiskLevel = normalizeRiskLevel(input.riskLevel) ?? 'LOW';
  const policy = CHECK_IN_FRESHNESS_POLICY[canonicalRisk];

  const nowMs = typeof input.now === 'number'
    ? input.now
    : input.now
    ? new Date(input.now).getTime()
    : Date.now();

  // 1. If no check-in history exists
  if (!input.lastCheckInAt) {
    const shouldFlag = policy.flagCounsellor;
    const priority = canonicalRisk === 'CRITICAL' ? 'P1' : canonicalRisk === 'HIGH' ? 'P2' : 'P3';
    return {
      status: 'NO_CHECKIN_HISTORY',
      riskLevel: canonicalRisk,
      lastCheckInAt: null,
      thresholdHours: policy.thresholdHours,
      elapsedHours: null,
      shouldFlagCounsellor: shouldFlag,
      priority: shouldFlag ? priority : undefined,
      reason: shouldFlag
        ? `${canonicalRisk}-risk case has no recorded check-in history. Counsellor review recommended.`
        : 'No check-in history recorded for low-risk case.',
    };
  }

  const lastCheckInTime = new Date(input.lastCheckInAt).getTime();
  if (isNaN(lastCheckInTime)) {
    return {
      status: 'NO_CHECKIN_HISTORY',
      riskLevel: canonicalRisk,
      lastCheckInAt: null,
      thresholdHours: policy.thresholdHours,
      elapsedHours: null,
      shouldFlagCounsellor: policy.flagCounsellor,
      priority: policy.flagCounsellor ? (canonicalRisk === 'CRITICAL' ? 'P1' : canonicalRisk === 'HIGH' ? 'P2' : 'P3') : undefined,
      reason: 'Invalid check-in timestamp provided.',
    };
  }

  const elapsedMs = Math.max(0, nowMs - lastCheckInTime);
  const elapsedHours = Math.round((elapsedMs / (1000 * 60 * 60)) * 10) / 10;
  const isoLastCheckIn = new Date(lastCheckInTime).toISOString();

  // Special CRITICAL handling:
  // Immediate eligibility if any delay / missed window occurs (0h threshold).
  if (canonicalRisk === 'CRITICAL') {
    const isOverdue = elapsedMs > 0;
    return {
      status: isOverdue ? 'STALE_CHECKIN' : 'CURRENT',
      riskLevel: 'CRITICAL',
      lastCheckInAt: isoLastCheckIn,
      thresholdHours: policy.thresholdHours,
      elapsedHours,
      shouldFlagCounsellor: isOverdue,
      priority: isOverdue ? 'P1' : undefined,
      reason: isOverdue
        ? `Critical-risk case has no recent check-in (${elapsedHours}h since last check-in). Immediate counsellor review recommended.`
        : 'Critical-risk case check-in is current.',
    };
  }

  // MODERATE / HIGH / LOW threshold comparison
  const isStale = elapsedHours > policy.thresholdHours;

  if (isStale) {
    const shouldFlag = policy.flagCounsellor;
    const priority = canonicalRisk === 'HIGH' ? 'P2' : 'P3';
    return {
      status: 'STALE_CHECKIN',
      riskLevel: canonicalRisk,
      lastCheckInAt: isoLastCheckIn,
      thresholdHours: policy.thresholdHours,
      elapsedHours,
      shouldFlagCounsellor: shouldFlag,
      priority: shouldFlag ? priority : undefined,
      reason: shouldFlag
        ? `${canonicalRisk}-risk survivor has not checked in within the expected ${policy.thresholdHours}-hour window (${elapsedHours}h elapsed). Human review recommended.`
        : `Check-in inactive for ${elapsedHours}h (informational threshold ${policy.thresholdHours}h for low risk).`,
    };
  }

  return {
    status: 'CURRENT',
    riskLevel: canonicalRisk,
    lastCheckInAt: isoLastCheckIn,
    thresholdHours: policy.thresholdHours,
    elapsedHours,
    shouldFlagCounsellor: false,
    reason: 'Check-in is within the expected risk-based window.',
  };
}
