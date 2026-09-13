import { describe, expect, it } from 'vitest';
import {
  getRecommendationsForRisk,
  getSupportRecommendations,
  normalizeRiskLevel,
  type SupportRecommendation,
} from '../src/services/recommendations.js';

describe('Institutional Recommendation Layer (Rule-Based & Deterministic)', () => {
  describe('1. Risk Level Normalization', () => {
    it('normalizes canonical risk levels regardless of casing or whitespace', () => {
      expect(normalizeRiskLevel('LOW')).toBe('LOW');
      expect(normalizeRiskLevel('low')).toBe('LOW');
      expect(normalizeRiskLevel('  Low  ')).toBe('LOW');

      expect(normalizeRiskLevel('MODERATE')).toBe('MODERATE');
      expect(normalizeRiskLevel('moderate')).toBe('MODERATE');
      expect(normalizeRiskLevel('medium')).toBe('MODERATE');

      expect(normalizeRiskLevel('HIGH')).toBe('HIGH');
      expect(normalizeRiskLevel('high')).toBe('HIGH');

      expect(normalizeRiskLevel('CRITICAL')).toBe('CRITICAL');
      expect(normalizeRiskLevel('critical')).toBe('CRITICAL');
      expect(normalizeRiskLevel('crisis')).toBe('CRITICAL');
    });

    it('returns null for unknown or empty risk levels', () => {
      expect(normalizeRiskLevel(undefined)).toBeNull();
      expect(normalizeRiskLevel(null)).toBeNull();
      expect(normalizeRiskLevel('')).toBeNull();
      expect(normalizeRiskLevel('UNKNOWN_LEVEL')).toBeNull();
    });
  });

  describe('2. LOW Risk Mapping', () => {
    it('explicitly maps LOW risk to counselling & self-help support only', () => {
      const recs = getRecommendationsForRisk('LOW');
      expect(recs).toHaveLength(1);

      const [counselling] = recs;
      expect(counselling.category).toBe('COUNSELLING');
      expect(counselling.priority).toBe('SUPPORTIVE');
      expect(counselling.status).toBe('RECOMMENDED');
      expect(counselling.actionType).toBe('SELF_HELP');
      expect(counselling.reason).toContain('supportive counselling');
    });
  });

  describe('3. MODERATE Risk Mapping', () => {
    it('explicitly maps MODERATE risk to counselling + legal aid information', () => {
      const recs = getRecommendationsForRisk('MODERATE');
      expect(recs).toHaveLength(2);

      const categories = recs.map((r) => r.category);
      expect(categories).toEqual(['COUNSELLING', 'LEGAL_AID']);

      const counselling = recs.find((r) => r.category === 'COUNSELLING')!;
      expect(counselling.priority).toBe('RECOMMENDED');
      expect(counselling.status).toBe('RECOMMENDED');
      expect(counselling.actionType).toBe('COUNSELLING_ACCESS');

      const legalAid = recs.find((r) => r.category === 'LEGAL_AID')!;
      expect(legalAid.priority).toBe('RECOMMENDED');
      expect(legalAid.status).toBe('RECOMMENDED');
      expect(legalAid.actionType).toBe('LEGAL_INFORMATION');
    });

    it('refines legal aid status to ALREADY_CONNECTED if case has active legal aid without removing category', () => {
      const recs = getRecommendationsForRisk('MODERATE', { legalAidStatus: 'Assigned' });
      expect(recs).toHaveLength(2);

      const legalAid = recs.find((r) => r.category === 'LEGAL_AID')!;
      expect(legalAid.status).toBe('ALREADY_CONNECTED');
      expect(legalAid.priority).toBe('RECOMMENDED');
    });
  });

  describe('4. HIGH Risk Mapping', () => {
    it('explicitly maps HIGH risk to counselling + legal aid + medical assistance', () => {
      const recs = getRecommendationsForRisk('HIGH');
      expect(recs).toHaveLength(3);

      const categories = recs.map((r) => r.category);
      expect(categories).toEqual(['COUNSELLING', 'LEGAL_AID', 'MEDICAL_ASSISTANCE']);

      const counselling = recs.find((r) => r.category === 'COUNSELLING')!;
      expect(counselling.priority).toBe('PRIORITY');
      expect(counselling.status).toBe('RECOMMENDED');

      const legalAid = recs.find((r) => r.category === 'LEGAL_AID')!;
      expect(legalAid.priority).toBe('PRIORITY');
      expect(legalAid.status).toBe('RECOMMENDED');

      const medical = recs.find((r) => r.category === 'MEDICAL_ASSISTANCE')!;
      expect(medical.priority).toBe('PRIORITY');
      expect(medical.status).toBe('REVIEW_REQUIRED');
      expect(medical.actionType).toBe('MEDICAL_REVIEW');
      expect(medical.reason).toContain('medical assistance review');
    });
  });

  describe('5. CRITICAL Risk Mapping & Safety Semantics', () => {
    it('explicitly maps CRITICAL risk to police intervention + witness protection + emergency support + immediate counsellor alert', () => {
      const recs = getRecommendationsForRisk('CRITICAL');
      expect(recs).toHaveLength(4);

      const categories = recs.map((r) => r.category);
      expect(categories).toEqual([
        'POLICE_INTERVENTION',
        'WITNESS_PROTECTION',
        'EMERGENCY_SUPPORT',
        'IMMEDIATE_COUNSELLOR_ALERT',
      ]);

      // All CRITICAL recommendations have URGENT priority
      for (const rec of recs) {
        expect(rec.priority).toBe('URGENT');
        expect(rec.reason).toContain('Critical risk requires immediate human review');
      }

      const police = recs.find((r) => r.category === 'POLICE_INTERVENTION')!;
      expect(police.actionType).toBe('POLICE_REVIEW');
      expect(police.status).toBe('REVIEW_REQUIRED');
      // Safety guarantee: Ensure title/description denotes review flag, not autonomous police contact
      expect(police.title).toContain('Review');
      expect(police.description).not.toContain('contacted automatically');

      const protection = recs.find((r) => r.category === 'WITNESS_PROTECTION')!;
      expect(protection.actionType).toBe('PROTECTION_REVIEW');
      expect(protection.status).toBe('REVIEW_REQUIRED');

      const emergency = recs.find((r) => r.category === 'EMERGENCY_SUPPORT')!;
      expect(emergency.actionType).toBe('EMERGENCY_ESCALATION');
      expect(emergency.status).toBe('REVIEW_REQUIRED');

      const alert = recs.find((r) => r.category === 'IMMEDIATE_COUNSELLOR_ALERT')!;
      expect(alert.actionType).toBe('COUNSELLOR_ESCALATION');
      expect(alert.status).toBe('ALERT_DISPATCHED');
    });

    it('refines witness protection status to ALREADY_CONNECTED if protection is already active', () => {
      const recs = getRecommendationsForRisk('CRITICAL', { protectionStatus: 'Active' });
      const protection = recs.find((r) => r.category === 'WITNESS_PROTECTION')!;
      expect(protection.status).toBe('ALREADY_CONNECTED');
      // Other recommendations remain unaffected
      expect(recs.find((r) => r.category === 'POLICE_INTERVENTION')?.status).toBe('REVIEW_REQUIRED');
    });
  });

  describe('6. CaseRecord Helper Integration', () => {
    it('generates recommendations directly from partial or full CaseRecord', () => {
      const caseRecord = {
        id: 'test-case-1',
        docket: 'NHAA-DL-2026-0099',
        victimToken: 'VIC_123',
        survivorName: 'Test Survivor',
        riskLevel: 'HIGH',
        legalAidStatus: 'Provided',
        protectionStatus: 'Not requested',
      };

      const recs = getSupportRecommendations(caseRecord as any);
      expect(recs).toHaveLength(3);

      const legalAid = recs.find((r) => r.category === 'LEGAL_AID')!;
      expect(legalAid.status).toBe('ALREADY_CONNECTED');
    });

    it('handles null/undefined case record gracefully with low-risk default', () => {
      const recsNull = getSupportRecommendations(null);
      expect(recsNull).toHaveLength(1);
      expect(recsNull[0].category).toBe('COUNSELLING');

      const recsUndefined = getSupportRecommendations(undefined);
      expect(recsUndefined).toHaveLength(1);
      expect(recsUndefined[0].category).toBe('COUNSELLING');
    });
  });
});
