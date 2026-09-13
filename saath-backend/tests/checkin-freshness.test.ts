import { describe, it, expect } from 'vitest';
import {
  evaluateCheckInFreshness,
  CHECK_IN_FRESHNESS_POLICY,
} from '../src/services/checkin-freshness.js';

describe('Risk-Based Stale Check-in Flag Evaluation', () => {
  const now = new Date('2026-09-14T12:00:00.000Z').getTime();
  const hoursAgo = (h: number) => new Date(now - h * 3600 * 1000).toISOString();

  // CASE 1: LOW + last check-in 2 days ago (48h) -> no counsellor escalation
  it('CASE 1: LOW risk with check-in 2 days ago (48h) does not flag counsellor', () => {
    const res = evaluateCheckInFreshness({
      riskLevel: 'LOW',
      lastCheckInAt: hoursAgo(48),
      now,
    });
    expect(res.status).toBe('CURRENT');
    expect(res.shouldFlagCounsellor).toBe(false);
    expect(res.riskLevel).toBe('LOW');
  });

  // CASE 2: LOW + last check-in 4 days ago (96h) -> stale informational condition, but NO counsellor escalation
  it('CASE 2: LOW risk with check-in 4 days ago (96h) is STALE_CHECKIN but shouldFlagCounsellor is false', () => {
    const res = evaluateCheckInFreshness({
      riskLevel: 'LOW',
      lastCheckInAt: hoursAgo(96),
      now,
    });
    expect(res.status).toBe('STALE_CHECKIN');
    expect(res.shouldFlagCounsellor).toBe(false);
    expect(res.thresholdHours).toBe(72);
  });

  // CASE 3: MODERATE + last check-in 1 day ago (24h) -> no alert
  it('CASE 3: MODERATE risk with check-in 1 day ago (24h) is CURRENT and does not flag counsellor', () => {
    const res = evaluateCheckInFreshness({
      riskLevel: 'MODERATE',
      lastCheckInAt: hoursAgo(24),
      now,
    });
    expect(res.status).toBe('CURRENT');
    expect(res.shouldFlagCounsellor).toBe(false);
  });

  // CASE 4: MODERATE + last check-in > 2 days ago (50h) -> counsellor flag
  it('CASE 4: MODERATE risk with check-in > 2 days ago (50h) flags counsellor attention with P3 priority', () => {
    const res = evaluateCheckInFreshness({
      riskLevel: 'MODERATE',
      lastCheckInAt: hoursAgo(50),
      now,
    });
    expect(res.status).toBe('STALE_CHECKIN');
    expect(res.shouldFlagCounsellor).toBe(true);
    expect(res.priority).toBe('P3');
    expect(res.thresholdHours).toBe(48);
  });

  // CASE 5: HIGH + last check-in 23 hours ago -> no alert
  it('CASE 5: HIGH risk with check-in 23 hours ago is CURRENT and does not flag counsellor', () => {
    const res = evaluateCheckInFreshness({
      riskLevel: 'HIGH',
      lastCheckInAt: hoursAgo(23),
      now,
    });
    expect(res.status).toBe('CURRENT');
    expect(res.shouldFlagCounsellor).toBe(false);
  });

  // CASE 6: HIGH + last check-in > 24 hours ago (26h) -> counsellor flag
  it('CASE 6: HIGH risk with check-in > 24 hours ago (26h) flags counsellor attention with P2 priority', () => {
    const res = evaluateCheckInFreshness({
      riskLevel: 'HIGH',
      lastCheckInAt: hoursAgo(26),
      now,
    });
    expect(res.status).toBe('STALE_CHECKIN');
    expect(res.shouldFlagCounsellor).toBe(true);
    expect(res.priority).toBe('P2');
    expect(res.thresholdHours).toBe(24);
  });

  // CASE 7: CRITICAL + missed expected check-in -> immediate counsellor flag (P1)
  it('CASE 7: CRITICAL risk with any elapsed time flags immediate counsellor review (P1)', () => {
    const res = evaluateCheckInFreshness({
      riskLevel: 'CRITICAL',
      lastCheckInAt: hoursAgo(2),
      now,
    });
    expect(res.status).toBe('STALE_CHECKIN');
    expect(res.shouldFlagCounsellor).toBe(true);
    expect(res.priority).toBe('P1');
    expect(res.thresholdHours).toBe(0);
  });

  // CASE 8: MODERATE/HIGH/CRITICAL + no check-in history -> NO_CHECKIN_HISTORY + counsellor flag
  it('CASE 8: MODERATE/HIGH/CRITICAL with no check-in history yields NO_CHECKIN_HISTORY and flags counsellor', () => {
    const modRes = evaluateCheckInFreshness({ riskLevel: 'MODERATE', lastCheckInAt: null, now });
    expect(modRes.status).toBe('NO_CHECKIN_HISTORY');
    expect(modRes.shouldFlagCounsellor).toBe(true);
    expect(modRes.priority).toBe('P3');

    const highRes = evaluateCheckInFreshness({ riskLevel: 'HIGH', lastCheckInAt: null, now });
    expect(highRes.status).toBe('NO_CHECKIN_HISTORY');
    expect(highRes.shouldFlagCounsellor).toBe(true);
    expect(highRes.priority).toBe('P2');

    const critRes = evaluateCheckInFreshness({ riskLevel: 'CRITICAL', lastCheckInAt: null, now });
    expect(critRes.status).toBe('NO_CHECKIN_HISTORY');
    expect(critRes.shouldFlagCounsellor).toBe(true);
    expect(critRes.priority).toBe('P1');

    // LOW with no check-in history should not flag counsellor
    const lowRes = evaluateCheckInFreshness({ riskLevel: 'LOW', lastCheckInAt: null, now });
    expect(lowRes.status).toBe('NO_CHECKIN_HISTORY');
    expect(lowRes.shouldFlagCounsellor).toBe(false);
  });

  // CASE 9: new check-in arrives -> stale condition becomes CURRENT
  it('CASE 9: When a fresh check-in arrives, evaluation returns CURRENT', () => {
    const freshCheckIn = hoursAgo(1);
    const res = evaluateCheckInFreshness({
      riskLevel: 'HIGH',
      lastCheckInAt: freshCheckIn,
      now,
    });
    expect(res.status).toBe('CURRENT');
    expect(res.shouldFlagCounsellor).toBe(false);
  });

  // CASE 10: centralized configuration is verified
  it('CASE 10: CHECK_IN_FRESHNESS_POLICY defines expected thresholds for all canonical tiers', () => {
    expect(CHECK_IN_FRESHNESS_POLICY.LOW.thresholdHours).toBe(72);
    expect(CHECK_IN_FRESHNESS_POLICY.LOW.flagCounsellor).toBe(false);

    expect(CHECK_IN_FRESHNESS_POLICY.MODERATE.thresholdHours).toBe(48);
    expect(CHECK_IN_FRESHNESS_POLICY.MODERATE.flagCounsellor).toBe(true);

    expect(CHECK_IN_FRESHNESS_POLICY.HIGH.thresholdHours).toBe(24);
    expect(CHECK_IN_FRESHNESS_POLICY.HIGH.flagCounsellor).toBe(true);

    expect(CHECK_IN_FRESHNESS_POLICY.CRITICAL.thresholdHours).toBe(0);
    expect(CHECK_IN_FRESHNESS_POLICY.CRITICAL.flagCounsellor).toBe(true);
  });
});
