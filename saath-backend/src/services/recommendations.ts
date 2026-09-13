import type { CaseRecord } from '../types/domain.js';

export type CanonicalRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type SupportCategory =
  | 'COUNSELLING'
  | 'LEGAL_AID'
  | 'MEDICAL_ASSISTANCE'
  | 'POLICE_INTERVENTION'
  | 'WITNESS_PROTECTION'
  | 'EMERGENCY_SUPPORT'
  | 'IMMEDIATE_COUNSELLOR_ALERT';

export type RecommendationPriority = 'SUPPORTIVE' | 'RECOMMENDED' | 'PRIORITY' | 'URGENT';

export type RecommendationStatus =
  | 'RECOMMENDED'
  | 'REVIEW_REQUIRED'
  | 'ALREADY_CONNECTED'
  | 'ALERT_DISPATCHED';

export type RecommendationActionType =
  | 'SELF_HELP'
  | 'COUNSELLING_ACCESS'
  | 'LEGAL_INFORMATION'
  | 'MEDICAL_REVIEW'
  | 'POLICE_REVIEW'
  | 'PROTECTION_REVIEW'
  | 'EMERGENCY_ESCALATION'
  | 'COUNSELLOR_ESCALATION';

export interface SupportRecommendation {
  category: SupportCategory;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  title: string;
  description: string;
  reason: string;
  actionType: RecommendationActionType;
}

export interface RecommendationContext {
  legalAidStatus?: string | null;
  protectionStatus?: string | null;
  caseCategory?: string | null;
  [key: string]: unknown;
}

/**
 * Normalizes input risk strings to canonical 4-tier risk levels.
 */
export const normalizeRiskLevel = (rawRisk?: string | null): CanonicalRiskLevel | null => {
  if (!rawRisk) return null;
  const upper = String(rawRisk).trim().toUpperCase();
  if (upper === 'LOW') return 'LOW';
  if (upper === 'MODERATE' || upper === 'MEDIUM') return 'MODERATE';
  if (upper === 'HIGH') return 'HIGH';
  if (upper === 'CRITICAL' || upper === 'CRISIS') return 'CRITICAL';
  return null;
};

/**
 * Checks whether legal aid is already connected/assigned in the existing case context.
 */
const isLegalAidConnected = (status?: string | null): boolean => {
  if (!status) return false;
  const s = String(status).trim().toLowerCase();
  return ['assigned', 'provided', 'active', 'connected', 'granted', 'in progress', 'counsel_assigned'].includes(s);
};

/**
 * Checks whether witness protection is already active/assigned in the existing case context.
 */
const isProtectionConnected = (status?: string | null): boolean => {
  if (!status) return false;
  const s = String(status).trim().toLowerCase();
  return ['active', 'provided', 'assigned', 'granted', 'under protection'].includes(s);
};

/**
 * Institutional Recommendation Engine
 * -----------------------------------------------------------------------
 * Product Statement Requirement:
 * "Automatically recommend counselling, legal aid, medical assistance,
 *  police intervention, witness protection, or emergency support based on risk level."
 *
 * Deterministic rule-based mapping:
 * - LOW:
 *     → COUNSELLING (SUPPORTIVE)
 * - MODERATE:
 *     → COUNSELLING (RECOMMENDED)
 *     → LEGAL_AID (RECOMMENDED / ALREADY_CONNECTED)
 * - HIGH:
 *     → COUNSELLING (PRIORITY)
 *     → LEGAL_AID (PRIORITY / ALREADY_CONNECTED)
 *     → MEDICAL_ASSISTANCE (PRIORITY / REVIEW_REQUIRED)
 * - CRITICAL:
 *     → POLICE_INTERVENTION (URGENT / REVIEW_REQUIRED)
 *     → WITNESS_PROTECTION (URGENT / REVIEW_REQUIRED / ALREADY_CONNECTED)
 *     → EMERGENCY_SUPPORT (URGENT / REVIEW_REQUIRED)
 *     → IMMEDIATE_COUNSELLOR_ALERT (URGENT / ALERT_DISPATCHED)
 *
 * CRITICAL SAFETY NOTE:
 * Recommendations are review & escalation signals for human workflows.
 * They DO NOT execute autonomous real-world actions (e.g. no automated police calls,
 * no autonomous hospitalizations, no automated relocations).
 */
export const getRecommendationsForRisk = (
  riskLevel?: string | null,
  context?: RecommendationContext | null
): SupportRecommendation[] => {
  const canonical = normalizeRiskLevel(riskLevel);

  if (!canonical) {
    // Graceful fallback for unrated / null risk
    return [
      {
        category: 'COUNSELLING',
        priority: 'SUPPORTIVE',
        status: 'RECOMMENDED',
        title: 'Counselling & Self-Help Support',
        description: 'Supportive counselling and gentle self-help resources tailored for grounding and recovery.',
        reason: 'Current risk level indicates supportive counselling and self-help resources are appropriate.',
        actionType: 'SELF_HELP',
      },
    ];
  }

  switch (canonical) {
    case 'LOW':
      return [
        {
          category: 'COUNSELLING',
          priority: 'SUPPORTIVE',
          status: 'RECOMMENDED',
          title: 'Counselling & Self-Help Support',
          description: 'Supportive counselling and gentle self-help resources tailored for grounding and recovery.',
          reason: 'Current risk level indicates supportive counselling and self-help resources are appropriate.',
          actionType: 'SELF_HELP',
        },
      ];

    case 'MODERATE':
      return [
        {
          category: 'COUNSELLING',
          priority: 'RECOMMENDED',
          status: 'RECOMMENDED',
          title: 'Counselling Support',
          description: 'Continuous trauma-informed counselling and regular check-in support with an assigned counsellor.',
          reason: 'Moderate risk indicates continued counselling support and access to verified legal-aid information.',
          actionType: 'COUNSELLING_ACCESS',
        },
        {
          category: 'LEGAL_AID',
          priority: 'RECOMMENDED',
          status: isLegalAidConnected(context?.legalAidStatus) ? 'ALREADY_CONNECTED' : 'RECOMMENDED',
          title: 'Legal Aid Information',
          description: 'Verified, rights-based legal information and free legal-aid assistance under the PoA Act.',
          reason: 'Moderate risk indicates continued counselling support and access to verified legal-aid information.',
          actionType: 'LEGAL_INFORMATION',
        },
      ];

    case 'HIGH':
      return [
        {
          category: 'COUNSELLING',
          priority: 'PRIORITY',
          status: 'RECOMMENDED',
          title: 'Priority Counselling Support',
          description: 'Dedicated one-on-one psychological support and accelerated check-in cadences.',
          reason: 'High risk indicates counselling and legal support, with medical assistance review recommended.',
          actionType: 'COUNSELLING_ACCESS',
        },
        {
          category: 'LEGAL_AID',
          priority: 'PRIORITY',
          status: isLegalAidConnected(context?.legalAidStatus) ? 'ALREADY_CONNECTED' : 'RECOMMENDED',
          title: 'Legal Aid & Advocacy',
          description: 'Expedited legal aid coordination, advocate assignment, and victim compensation tracking.',
          reason: 'High risk indicates counselling and legal support, with medical assistance review recommended.',
          actionType: 'LEGAL_INFORMATION',
        },
        {
          category: 'MEDICAL_ASSISTANCE',
          priority: 'PRIORITY',
          status: 'REVIEW_REQUIRED',
          title: 'Medical Assistance Review',
          description: 'Medical assistance evaluation and trauma-informed health support recommended for review.',
          reason: 'High risk indicates counselling and legal support, with medical assistance review recommended.',
          actionType: 'MEDICAL_REVIEW',
        },
      ];

    case 'CRITICAL':
      return [
        {
          category: 'POLICE_INTERVENTION',
          priority: 'URGENT',
          status: 'REVIEW_REQUIRED',
          title: 'Police Intervention Review',
          description: 'Urgent police intervention and physical protection review recommended by authorised personnel.',
          reason: 'Critical risk requires immediate human review and urgent support escalation.',
          actionType: 'POLICE_REVIEW',
        },
        {
          category: 'WITNESS_PROTECTION',
          priority: 'URGENT',
          status: isProtectionConnected(context?.protectionStatus) ? 'ALREADY_CONNECTED' : 'REVIEW_REQUIRED',
          title: 'Witness Protection Review',
          description: 'Formal witness protection and immediate security assessment review recommended.',
          reason: 'Critical risk requires immediate human review and urgent support escalation.',
          actionType: 'PROTECTION_REVIEW',
        },
        {
          category: 'EMERGENCY_SUPPORT',
          priority: 'URGENT',
          status: 'REVIEW_REQUIRED',
          title: 'Emergency Support Review',
          description: 'Immediate human-review crisis escalation and emergency support coordination.',
          reason: 'Critical risk requires immediate human review and urgent support escalation.',
          actionType: 'EMERGENCY_ESCALATION',
        },
        {
          category: 'IMMEDIATE_COUNSELLOR_ALERT',
          priority: 'URGENT',
          status: 'ALERT_DISPATCHED',
          title: 'Immediate Counsellor Alert',
          description: 'Urgent priority alert raised for immediate human review by the assigned counselling team.',
          reason: 'Critical risk requires immediate human review and urgent support escalation.',
          actionType: 'COUNSELLOR_ESCALATION',
        },
      ];
  }
};

/**
 * Convenience helper that extracts riskLevel, legalAidStatus, protectionStatus from a CaseRecord.
 */
export const getSupportRecommendations = (
  caseRecord?: Partial<CaseRecord> | null
): SupportRecommendation[] => {
  if (!caseRecord) {
    return getRecommendationsForRisk('LOW');
  }

  return getRecommendationsForRisk(caseRecord.riskLevel, {
    legalAidStatus: caseRecord.legalAidStatus,
    protectionStatus: caseRecord.protectionStatus,
    caseCategory: caseRecord.caseCategory,
  });
};
