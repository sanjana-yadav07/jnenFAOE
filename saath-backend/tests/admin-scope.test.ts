import { describe, expect, it, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { store } from '../src/db/store.js';

describe('Admin Role Hierarchy & Server-Side Geographic Scoping', () => {
  beforeEach(() => {
    store.users.clear();
    store.records.clear();
    store.blocklist.clear();
  });

  const getStaffToken = async (role: string, staffId: string, state?: string, district?: string) => {
    const res = await request(app)
      .post('/api/v1/auth/staff-token')
      .send({ role, staffId, state, district });
    expect(res.status).toBe(200);
    return res.body.data.accessToken as string;
  };

  it('enforces strict District Admin scope (South Delhi, Delhi): only sees South Delhi data', async () => {
    const token = await getStaffToken('DISTRICT_ADMIN', 'admin_south_delhi', 'Delhi', 'South Delhi');

    // 1. Profile / Me
    const meRes = await request(app).get('/api/v1/admin/me').set('Authorization', `Bearer ${token}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.data).toMatchObject({
      role: 'DISTRICT_ADMIN',
      scopeLevel: 'district',
      state: 'Delhi',
      district: 'South Delhi',
      scopeTitle: 'South Delhi District (Delhi)',
    });

    // 2. Counsellor roster: only counsellors with cases in South Delhi (C001, C007)
    const counsellorsRes = await request(app).get('/api/v1/admin/counsellors').set('Authorization', `Bearer ${token}`);
    expect(counsellorsRes.status).toBe(200);
    const counsellors = counsellorsRes.body.data;
    expect(counsellors.length).toBeGreaterThan(0);
    expect(counsellors.every((c: any) => c.id === 'C001' || c.id === 'C007')).toBe(true);
    // Must NOT contain counsellors from Rajasthan, Maharashtra, etc.
    expect(counsellors.some((c: any) => c.name === 'Ravi Kumar')).toBe(false);
    expect(counsellors.some((c: any) => c.name === 'Priya Deshmukh')).toBe(false);

    // 3. Report: contains ONLY South Delhi cases
    const reportRes = await request(app).get('/api/v1/admin/reports').set('Authorization', `Bearer ${token}`);
    expect(reportRes.status).toBe(200);
    const report = reportRes.body;
    expect(report.scope).toBe('district:South Delhi');
    expect(report.caseStats.caseCount).toBe(3); // 3 South Delhi cases in dataset
    expect(report.caseStats.districtStats?.every((d: any) => d.district === 'South Delhi')).toBe(true);

    // 4. Operational metrics & distress stats obey district filter
    const statsRes = await request(app).get('/api/v1/admin/distress-stats').set('Authorization', `Bearer ${token}`);
    expect(statsRes.status).toBe(200);
    expect(statsRes.body.data.caseCount).toBe(3);
  });

  it('enforces State Admin scope (Delhi): sees all Delhi districts (South Delhi + North Delhi) but no other states', async () => {
    const token = await getStaffToken('STATE_ADMIN', 'admin_delhi_state', 'Delhi');

    // 1. Profile / Me
    const meRes = await request(app).get('/api/v1/admin/me').set('Authorization', `Bearer ${token}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.data).toMatchObject({
      role: 'STATE_ADMIN',
      scopeLevel: 'state',
      state: 'Delhi',
      scopeTitle: 'Delhi State',
    });

    // 2. Report: includes South Delhi and North Delhi cases (total 5 Delhi cases)
    const reportRes = await request(app).get('/api/v1/admin/reports').set('Authorization', `Bearer ${token}`);
    expect(reportRes.status).toBe(200);
    const report = reportRes.body;
    expect(report.scope).toBe('state:Delhi');
    expect(report.caseStats.caseCount).toBe(5);
    const districts = report.caseStats.districtStats?.map((d: any) => d.district);
    expect(districts).toContain('South Delhi');
    expect(districts).toContain('North Delhi');
    expect(districts).not.toContain('Jaipur');
    expect(districts).not.toContain('Pune');
    expect(districts).not.toContain('Kolkata');
  });

  it('authorizes National Admin across complete national dataset', async () => {
    const token = await getStaffToken('NATIONAL_ADMIN', 'admin_national');

    // 1. Report: all 20 cases across all states
    const reportRes = await request(app).get('/api/v1/admin/reports').set('Authorization', `Bearer ${token}`);
    expect(reportRes.status).toBe(200);
    const report = reportRes.body;
    expect(report.scope).toBe('national');
    expect(report.caseStats.caseCount).toBe(21);

    // 2. Counsellors: all counsellors in roster
    const counsellorsRes = await request(app).get('/api/v1/admin/counsellors').set('Authorization', `Bearer ${token}`);
    expect(counsellorsRes.status).toBe(200);
    expect(counsellorsRes.body.data.length).toBe(8);
  });

  it('prevents URL manipulation: District Admin cannot bypass scope via query params', async () => {
    const token = await getStaffToken('DISTRICT_ADMIN', 'admin_south_delhi', 'Delhi', 'South Delhi');

    // Attempt tampering via ?district=Jaipur or ?state=Rajasthan
    const reportRes = await request(app)
      .get('/api/v1/admin/reports?scope=district:Jaipur&district=Jaipur&state=Rajasthan')
      .set('Authorization', `Bearer ${token}`);
    expect(reportRes.status).toBe(200);
    const report = reportRes.body;

    // Server-side enforcement MUST override client tampering
    expect(report.scope).toBe('district:South Delhi');
    expect(report.caseStats.caseCount).toBe(3);
    expect(report.caseStats.districtStats?.every((d: any) => d.district === 'South Delhi')).toBe(true);

    // Dedicated endpoint test
    const districtEndpointRes = await request(app)
      .get('/api/v1/admin/district?district=Jaipur')
      .set('Authorization', `Bearer ${token}`);
    expect(districtEndpointRes.status).toBe(200);
    expect(districtEndpointRes.body.data.scope).toBe('district:South Delhi');
    expect(districtEndpointRes.body.data.caseCount).toBe(3);
  });
});
