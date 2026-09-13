import { describe, expect, it, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { store } from '../src/db/store.js';
import * as ml from '../src/services/ml.js';

const docket = 'NHAA-RJ-2026-004821';
const connect = async () => {
  const response = await request(app).post('/api/v1/cases/connect').send({ reference_id: docket });
  return response.body.data.accessToken as string;
};
const grant = (token:string, consent_type:'wellbeing_monitoring'|'text_analysis'|'voice_analysis', granted=true) => request(app).post('/api/v1/consents').set('Authorization', `Bearer ${token}`).send({ consent_type, granted, version:'test-1' });

describe('SAATH API', () => {
  beforeEach(() => { vi.restoreAllMocks(); store.users.clear(); store.records.clear(); store.blocklist.clear(); });

  it('connects a canonical synthetic docket without a phone or OTP step', async () => {
    const response = await request(app).post('/api/v1/cases/connect').send({ reference_id:docket });
    expect(response.status).toBe(200);
    expect(response.body.data.case.reference_id).toBe(docket);
    expect(response.body.data.case.registeredPhone).toBeUndefined();
    expect(response.body.data.user.phone).toBeUndefined();
  });
  it('rejects an invalid or malformed case reference', async () => {
    expect((await request(app).post('/api/v1/cases/connect').send({ reference_id:'INVALID-DOCKET' })).status).toBe(404);
    expect((await request(app).post('/api/v1/cases/connect').send({ reference_id:'' })).status).toBe(400);
  });
  it('requires authentication for case access', async () => expect((await request(app).get('/api/v1/cases/synthetic-case-002')).status).toBe(401));
  it('records a consent grant and revocation', async () => {
    const token = await connect();
    expect((await grant(token, 'text_analysis')).status).toBe(201);
    expect((await grant(token, 'text_analysis', false)).body.data[0].state).toBe('REVOKED');
    expect((await request(app).get('/api/v1/consents').set('Authorization', `Bearer ${token}`)).body.data).toHaveLength(2);
  });
  it('accepts valid text only with text-analysis consent and reports ML unavailability', async () => {
    vi.spyOn(ml, 'analyzeText').mockResolvedValue({ distressScore:null, recoveryScore:null, confidence:0, escalationProbability:null, modelName:'unavailable', modelVersion:'none', pipelineVersion:'none', signals:{}, contributingFactors:[], crisis:false, insufficientEvidence:true, status:'unavailable' });
    const token = await connect(); await grant(token, 'text_analysis');
    const response = await request(app).post('/api/v1/check-ins/text').set('Authorization', `Bearer ${token}`).send({ text:'I am having a difficult day.', language:'en' });
    expect(response.status).toBe(201); expect(response.body.data.ml.status).toBe('unavailable'); expect(response.body.data.analyticalState).toBe('insufficient_evidence');
  });
  it('rejects invalid text and check-ins without their relevant consent', async () => {
    const token = await connect();
    expect((await request(app).post('/api/v1/check-ins/text').set('Authorization', `Bearer ${token}`).send({ text:'hello' })).status).toBe(403);
    await grant(token, 'text_analysis');
    expect((await request(app).post('/api/v1/check-ins/text').set('Authorization', `Bearer ${token}`).send({ text:'   ' })).status).toBe(400);
  });
  it('does not infer distress when there is no check-in evidence', async () => {
    const token = await connect(); const response = await request(app).get('/api/v1/monitoring/distress').set('Authorization', `Bearer ${token}`);
    expect(response.body.data).toMatchObject({ state:'insufficient_evidence', score:null, summary:'no_data' });
  });
  it('detects danger language independently and creates a human-review alert', async () => {
        vi.spyOn(ml, 'analyzeText').mockResolvedValue({ distressScore:null, recoveryScore:null, confidence:0, escalationProbability:null, modelName:'unavailable', modelVersion:'none', pipelineVersion:'none', signals:{}, contributingFactors:[], crisis:false, insufficientEvidence:true, status:'unavailable' });
        const token = await connect();
        const response = await request(app).post('/api/v1/ai/crisis-screen').set('Authorization', `Bearer ${token}`).send({ text:'I cannot stay safe tonight.' });
        expect(response.status).toBe(200);
        expect(response.body.data).toMatchObject({ crisis:true, riskLevel:'critical', humanReviewRequired:true });
        expect(response.body.data.response).toContain('immediate human support');
        expect((store.records.get('alerts:all') || []).some((alert:any) => alert.crisis)).toBe(true);
  });
  it('interrupts TAARA with the approved supportive crisis response', async () => {
        vi.spyOn(ml, 'analyzeText').mockResolvedValue({ distressScore:null, recoveryScore:null, confidence:0, escalationProbability:null, modelName:'unavailable', modelVersion:'none', pipelineVersion:'none', signals:{}, contributingFactors:[], crisis:false, insufficientEvidence:true, status:'unavailable' });
        const token = await connect();
        await grant(token, 'wellbeing_monitoring');
        const response = await request(app).post('/api/v1/ai/taara').set('Authorization', `Bearer ${token}`).send({ message:'I want to die.' });
        expect(response.status).toBe(200);
        expect(response.body.data.crisis_detected).toBe(true);
        expect(response.body.data.reply).toContain('Are you in immediate danger right now?');
  });
  it('handles a valid voice upload as controlled unavailable when no ML service is configured', async () => {
    vi.spyOn(ml, 'analyzeVoice').mockRejectedValue(new Error('Voice AI provider is not configured'));
    const token = await connect(); await grant(token, 'voice_analysis');
    const response = await request(app).post('/api/v1/check-ins/voice').set('Authorization', `Bearer ${token}`).attach('audio', Buffer.from('synthetic audio'), { filename:'checkin.wav', contentType:'audio/wav' });
    expect(response.status).toBe(503); expect(response.body.error.code).toBe('VOICE_ANALYSIS_UNAVAILABLE');
  });
  it('rejects an invalid voice MIME type and oversized voice upload', async () => {
    const token = await connect(); await grant(token, 'voice_analysis');
    const invalid = await request(app).post('/api/v1/check-ins/voice').set('Authorization', `Bearer ${token}`).attach('audio', Buffer.from('x'), { filename:'checkin.txt', contentType:'text/plain' });
    expect(invalid.status).toBe(400); expect(invalid.body.error.code).toBe('INVALID_AUDIO_MIME');
    const oversized = await request(app).post('/api/v1/check-ins/voice').set('Authorization', `Bearer ${token}`).attach('audio', Buffer.alloc(10 * 1024 * 1024 + 1), { filename:'large.wav', contentType:'audio/wav' });
    expect(oversized.status).toBe(413); expect(oversized.body.error.code).toBe('AUDIO_TOO_LARGE');
  });
  it('enforces RBAC and returns a safe health envelope', async () => {
    expect((await request(app).get('/api/v1/alerts')).status).toBe(401);
    const health = await request(app).get('/health'); expect(health.status).toBe(200); expect(health.body).toMatchObject({ success:true, data:{status:'ok'} });
  });
    it('enforces RBAC and returns a safe health envelope', async () => {
    expect((await request(app).get('/api/v1/alerts')).status).toBe(401);
    const health = await request(app).get('/health'); expect(health.status).toBe(200); expect(health.body).toMatchObject({ success:true, data:{status:'ok'} });
  });

  // D16/D15 — Gentle reminder escalation: the tone must step forward one rung at a
  // time through light -> warm -> encouraging -> gentle-firm, never jumping straight
  // to the harshest tone even when daysSinceLastCheckin is already large, and it must
  // never repeat/regress on a later call with the same or a smaller day count.
  describe('check-in reminder escalation (D15/D16)', () => {
    it('starts at the lightest tone regardless of days missed on the very first reminder', async () => {
      const token = await connect();
      const res = await request(app).post('/api/v1/notifications/reminder').set('Authorization', `Bearer ${token}`).send({ daysSinceLastCheckin: 20 });
      expect(res.status).toBe(201);
      expect(res.body.data.tone).toBe('light');
    });

    it('steps forward one rung at a time on successive reminders instead of jumping to the day-matched stage', async () => {
      const token = await connect();
      const first = await request(app).post('/api/v1/notifications/reminder').set('Authorization', `Bearer ${token}`).send({ daysSinceLastCheckin: 1 });
      expect(first.body.data.tone).toBe('light');

      // daysSinceLastCheckin jumps to 10 (which alone would match 'encouraging'), but since
      // the survivor's last reminder was only 'light', the tone should only step to 'warm'.
      const second = await request(app).post('/api/v1/notifications/reminder').set('Authorization', `Bearer ${token}`).send({ daysSinceLastCheckin: 10 });
      expect(second.body.data.tone).toBe('warm');

      // A third call, even with a huge gap, only steps one rung further to 'encouraging'.
      const third = await request(app).post('/api/v1/notifications/reminder').set('Authorization', `Bearer ${token}`).send({ daysSinceLastCheckin: 30 });
      expect(third.body.data.tone).toBe('encouraging');
    });

    it('never regresses to an earlier tone once escalated', async () => {
      const token = await connect();
      await request(app).post('/api/v1/notifications/reminder').set('Authorization', `Bearer ${token}`).send({ daysSinceLastCheckin: 10 });
      await request(app).post('/api/v1/notifications/reminder').set('Authorization', `Bearer ${token}`).send({ daysSinceLastCheckin: 15 });
      // A later call with a *smaller* day count must not step the tone backwards.
      const res = await request(app).post('/api/v1/notifications/reminder').set('Authorization', `Bearer ${token}`).send({ daysSinceLastCheckin: 0 });
      expect(['warm', 'encouraging', 'gentle-firm']).toContain(res.body.data.tone);
      expect(res.body.data.tone).not.toBe('light');
    });
  });

  // E08 — Gentle re-engagement messages: TAARA should only nudge the survivor after a
  // real inactivity threshold, never right after an active conversation.
  describe('TAARA gentle re-engagement (E08)', () => {
    it('sends a re-engagement message when there is no prior TAARA interaction', async () => {
      const token = await connect();
      const res = await request(app).post('/api/v1/notifications/taara-reengagement').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('sent');
    });

    it('does not re-engage immediately after an active TAARA conversation', async () => {
      vi.spyOn(ml, 'analyzeText').mockResolvedValue({ distressScore: 20, recoveryScore: 60, confidence: 0.8, escalationProbability: 0.1, modelName: 'test', modelVersion: 'test', pipelineVersion: 'test', signals: {}, contributingFactors: [], crisis: false, insufficientEvidence: false, status: 'available' });
      vi.spyOn(ml, 'generateTaaraReply').mockResolvedValue({ reply: 'I hear you.', suggestedAction: 'Take a slow breath', provider: 'test', model: 'test-model' });

      const token = await connect();
      await grant(token, 'wellbeing_monitoring');
      const taaraRes = await request(app).post('/api/v1/ai/taara').set('Authorization', `Bearer ${token}`).send({ message: 'Just checking in.' });
      expect(taaraRes.status).toBe(200);

      const reengage = await request(app).post('/api/v1/notifications/taara-reengagement').set('Authorization', `Bearer ${token}`);
      expect(reengage.body.data.status).toBe('not_needed');
    });
  });

  describe('Admin Counsellors Roster (ADM-04)', () => {
    it('returns counsellor summaries for authenticated admin and enforces RBAC', async () => {
      // Unauthenticated
      const unauth = await request(app).get('/api/v1/admin/counsellors');
      expect(unauth.status).toBe(401);

      // Survivor role
      const survivorToken = await connect();
      const forbidden = await request(app).get('/api/v1/admin/counsellors').set('Authorization', `Bearer ${survivorToken}`);
      expect(forbidden.status).toBe(403);

      // Admin role
      const adminLogin = await request(app).post('/api/v1/auth/staff-token').send({ role: 'NATIONAL_ADMIN', staffId: 'ADM-001' });
      const adminToken = adminLogin.body.data.accessToken;

      const res = await request(app).get('/api/v1/admin/counsellors').set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const first = res.body.data[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('name');
      expect(first).toHaveProperty('email');
      expect(first).toHaveProperty('specialisation');
      expect(first).toHaveProperty('casesAssigned');
      expect(first.password).toBeUndefined();
    });
  });

  describe('POST /api/v1/auth/staff-token', () => {
    it('issues valid tokens for the frontend admin accounts (district, state, national)', async () => {
      const accounts = [
        { role: 'DISTRICT_ADMIN', staffId: 'district@saath' },
        { role: 'STATE_ADMIN', staffId: 'state@saath' },
        { role: 'NATIONAL_ADMIN', staffId: 'national@saath' },
      ] as const;

      for (const acc of accounts) {
        const res = await request(app)
          .post('/api/v1/auth/staff-token')
          .send({ role: acc.role, staffId: acc.staffId });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data.tokenType).toBe('Bearer');
        expect(res.body.data.user).toMatchObject({ id: acc.staffId, role: acc.role });
      }
    });

    it('rejects invalid or unauthorized roles', async () => {
      const invalidRoles = ['COUNSELLOR', 'SURVIVOR', 'ADMIN', 'UNKNOWN'];
      for (const role of invalidRoles) {
        const res = await request(app)
          .post('/api/v1/auth/staff-token')
          .send({ role, staffId: 'test@saath' });
        expect(res.status).toBe(400);
      }
    });

    it('enforces STAFF_TOKEN_DISABLED 403 when feature flag is disabled outside of test environment', async () => {
      const { env } = await import('../src/config/env.js');
      const originalNodeEnv = env.NODE_ENV;
      const originalFlag = env.ALLOW_DEV_STAFF_TOKEN;
      try {
        (env as any).NODE_ENV = 'development';
        (env as any).ALLOW_DEV_STAFF_TOKEN = false;

        const res = await request(app)
          .post('/api/v1/auth/staff-token')
          .send({ role: 'NATIONAL_ADMIN', staffId: 'national@saath' });
        expect(res.status).toBe(403);
        expect(res.body.error.code).toBe('STAFF_TOKEN_DISABLED');
      } finally {
        (env as any).NODE_ENV = originalNodeEnv;
        (env as any).ALLOW_DEV_STAFF_TOKEN = originalFlag;
      }
    });
  });

  describe('voice analysis escalation and fallback', () => {
    it('includes voice_features in escalation input when acoustic features are present', async () => {
      const { buildEscalationInput } = await import('../src/services/escalation.js');
      const mockVoiceFeatures = {
        speakingPaceWpm: 124.5,
        pauseCount: 4,
        avgPauseDurationSec: 0.52,
        pitchMeanHz: 185.0,
        energyRms: 0.045,
        confidence: 0.88,
      };
      const input = buildEscalationInput('user-1', 'victim-token-1', {
        distressScore: 65,
        signals: {
          voiceFeatures: mockVoiceFeatures,
        },
      });
      expect(input).toHaveProperty('voice_features');
      expect(input.voice_features).toEqual(mockVoiceFeatures);
    });

    it('omits voice_features from escalation input when not present', async () => {
      const { buildEscalationInput } = await import('../src/services/escalation.js');
      const input = buildEscalationInput('user-2', 'victim-token-2', {
        distressScore: 40,
        signals: {},
      });
      expect(input).not.toHaveProperty('voice_features');
    });
  });

  describe('Longitudinal Distress & Recovery Trends (Priority 0)', () => {
    it('returns insufficient evidence when fewer than 2 check-ins exist', async () => {
      const token = await connect();
      const res = await request(app).get('/api/v1/monitoring/trends').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.baselineComparison).toBe('insufficient evidence');
      expect(res.body.data.distressTrend).toHaveLength(0);
      expect(res.body.data.change).toBe(0);
    });

    it('accurately computes worsening trajectory when distress increases from 40 to 52 to 68', async () => {
      const token = await connect();
      const user = [...store.users.values()].find((u) => u.victimToken);
      const userId = user?.id || 'docket-NHAA-RJ-2026-004821';

      const now = Date.now();
      const obs1 = {
        id: 'obs-1',
        createdAt: new Date(now - 86400000 * 2).toISOString(),
        ml: { distressScore: 40, recoveryScore: 60, confidence: 0.85, contributingFactors: [] },
      };
      const obs2 = {
        id: 'obs-2',
        createdAt: new Date(now - 86400000 * 1).toISOString(),
        ml: { distressScore: 52, recoveryScore: 48, confidence: 0.88, contributingFactors: [] },
      };
      const obs3 = {
        id: 'obs-3',
        createdAt: new Date(now).toISOString(),
        ml: { distressScore: 68, recoveryScore: 32, confidence: 0.90, contributingFactors: [] },
      };

      store.records.set(`checkins:${userId}`, [obs1, obs2, obs3]);

      const res = await request(app).get('/api/v1/monitoring/trends').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.distressTrend).toHaveLength(3);
      expect(res.body.data.distressTrend[0].score).toBe(40);
      expect(res.body.data.distressTrend[1].score).toBe(52);
      expect(res.body.data.distressTrend[2].score).toBe(68);
      expect(res.body.data.baselineComparison).toBe('worsening');
      expect(res.body.data.change).toBe(28);
      expect(res.body.data.confidence).toBeGreaterThanOrEqual(0.8);
      expect(res.body.data.records).toHaveLength(3);
    });

    it('accurately computes improving trajectory when distress decreases by 15 points', async () => {
      const token = await connect();
      const user = [...store.users.values()].find((u) => u.victimToken);
      const userId = user?.id || 'docket-NHAA-RJ-2026-004821';
      const now = Date.now();

      store.records.set(`checkins:${userId}`, [
        { id: 'obs-1', createdAt: new Date(now - 86400000).toISOString(), ml: { distressScore: 70, recoveryScore: 30, confidence: 0.8 } },
        { id: 'obs-2', createdAt: new Date(now).toISOString(), ml: { distressScore: 55, recoveryScore: 45, confidence: 0.85 } },
      ]);

      const res = await request(app).get('/api/v1/monitoring/trends').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.baselineComparison).toBe('improving');
      expect(res.body.data.change).toBe(-15);
    });
  });

  describe('Automated Monitoring Process-Due Scheduler (Priority 0)', () => {
    it('identifies due/overdue cases and delivers appropriate reminder notifications with deduplication', async () => {
      const adminLogin = await request(app).post('/api/v1/auth/staff-token').send({ role: 'NATIONAL_ADMIN', staffId: 'ADM-SCHED-01' });
      const adminToken = adminLogin.body.data.accessToken;

      const res = await request(app)
        .post('/api/v1/monitoring/process-due')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('processedCount');
      expect(res.body.data).toHaveProperty('dueCasesCount');
      expect(res.body.data).toHaveProperty('overdueCasesCount');
      expect(res.body.data).toHaveProperty('remindersSent');
      expect(Array.isArray(res.body.data.remindersSent)).toBe(true);

      // Verify deduplication on subsequent immediate call within 24h
      const res2 = await request(app)
        .post('/api/v1/monitoring/process-due')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res2.status).toBe(200);
      expect(res2.body.data.remindersSentCount).toBe(0);
    });
  });

  describe('Relocation & Protection Workflow (Priority 0)', () => {
    it('allows requesting protection and transitioning through official status lifecycle', async () => {
      const token = await connect();
      const counsellorLogin = await request(app).post('/api/v1/auth/counsellor-login').send({
        email: 'anjali@saath.com',
        password: 'saath123',
      });
      const counsellorToken = counsellorLogin.body.data.accessToken;

      const reqRes = await request(app)
        .post(`/api/v1/cases/${docket}/protection-request`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          reason: 'Received persistent intimidation signals near home premises.',
          priority: 'HIGH',
          threatDetails: 'Suspicious persons following survivor from court.',
        });

      expect(reqRes.status).toBe(201);
      expect(reqRes.body.data.status).toBe('REQUESTED');
      expect(reqRes.body.data.type).toBe('PROTECTION');

      const reviewRes = await request(app)
        .post(`/api/v1/cases/${docket}/protection-status`)
        .set('Authorization', `Bearer ${counsellorToken}`)
        .send({
          status: 'UNDER_REVIEW',
          notes: 'Case escalated to district witness protection committee.',
        });

      expect(reviewRes.status).toBe(200);
      expect(reviewRes.body.data.protectionStatus).toBe('UNDER_REVIEW');

      const adminLogin = await request(app).post('/api/v1/auth/staff-token').send({ role: 'NATIONAL_ADMIN', staffId: 'ADM-PROT-01' });
      const adminToken = adminLogin.body.data.accessToken;
      const assignRes = await request(app)
        .post(`/api/v1/cases/${docket}/protection-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'ASSIGNED',
          assignedOfficial: 'Inspector R. S. Meena (District Protection Unit)',
          officialContact: '+91-9829012345',
          notes: 'Dedicated protection officer assigned for court transit.',
        });

      expect(assignRes.status).toBe(200);
      expect(assignRes.body.data.protectionStatus).toBe('ASSIGNED');
      expect(assignRes.body.data.protectionOfficerAssigned).toContain('Inspector R. S. Meena');

      const timeRes = await request(app)
        .get(`/api/v1/cases/${docket}/timeline`)
        .set('Authorization', `Bearer ${token}`);

      expect(timeRes.status).toBe(200);
      const timelineLabels = timeRes.body.data.map((e: any) => e.label);
      expect(timelineLabels.some((l: string) => l.includes('Witness protection requested'))).toBe(true);
      expect(timelineLabels.some((l: string) => l.includes('Protection status: ASSIGNED'))).toBe(true);
    });

    it('allows requesting safe relocation and updating status to APPROVED and IN_PROGRESS', async () => {
      const token = await connect();
      const adminLogin = await request(app).post('/api/v1/auth/staff-token').send({ role: 'NATIONAL_ADMIN', staffId: 'ADM-RELO-01' });
      const adminToken = adminLogin.body.data.accessToken;

      const reqRes = await request(app)
        .post(`/api/v1/cases/${docket}/relocation-request`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          reason: 'Severe intimidation in current village; need temporary shelter.',
          priority: 'URGENT',
          targetDistrict: 'Jaipur',
          targetState: 'Rajasthan',
        });

      expect(reqRes.status).toBe(201);
      expect(reqRes.body.data.status).toBe('REQUESTED');

      const approveRes = await request(app)
        .post(`/api/v1/cases/${docket}/relocation-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'APPROVED',
          notes: 'Safe shelter accommodation sanctioned under Victim Compensation & Protection Scheme.',
          targetSafeLocation: 'Safe House Unit A, Jaipur',
        });

      expect(approveRes.status).toBe(200);
      expect(approveRes.body.data.relocationStatus).toBe('APPROVED');
    });
  });

  describe('Hindi / Hinglish Safety and Indicator Detection (Priority 1)', () => {
    it('detects Hindi crisis phrases and flags immediate danger', () => {
      expect(ml.detectCrisisLevel('मुझे जीने का मन नहीं कर रहा')).toBe('immediate_danger');
      expect(ml.detectCrisisLevel('sab khatam karna chahta hoon')).toBe('immediate_danger');
      expect(ml.detectCrisisLevel('khudkushi karna chahti hoon')).toBe('immediate_danger');
      expect(ml.detectCrisisLevel('apne aap ko chot pahuchana chahti hoon')).toBe('self_harm');
    });

    it('extracts Hindi and Hinglish emotional indicator tags', async () => {
      const { extractIndicatorTags } = await import('../src/services/indicator-tags.js');
      const fearTags = extractIndicatorTags('mujhe bahut dar lag raha hai aur safe nahi feel ho raha');
      expect(fearTags).toContain('fear');

      const intimidationTags = extractIndicatorTags('usne mujhe dhamki di hai court na jaane ke liye');
      expect(intimidationTags).toContain('intimidation_signal');

      const isolationTags = extractIndicatorTags('main bilkul akela mehsoos kar raha hoon koi nahi hai');
      expect(isolationTags).toContain('social_isolation');

      const depressionTags = extractIndicatorTags('bahut pareshan hoon aur neend nahi aa rahi');
      expect(depressionTags).toContain('depression');
    });
  });
});



