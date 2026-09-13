import type { AuthUser, CaseRecord, Counsellor } from '../types/domain.js';
import { store } from '../db/store.js';
import { AppError } from '../utils/http.js';

export interface AdminScopeInfo {
  role: 'DISTRICT_ADMIN' | 'STATE_ADMIN' | 'NATIONAL_ADMIN';
  scopeLevel: 'district' | 'state' | 'national';
  state?: string;
  district?: string;
  scopeName: string;
  scopeTitle: string;
}

export interface ScopedAdminDataset {
  scope: AdminScopeInfo;
  cases: CaseRecord[];
  alerts: any[];
  followUps: any[];
  counsellors: Counsellor[];
}

/**
 * Resolves the administrator's authorized geographic scope strictly from
 * their authenticated session (JWT / req.user).
 *
 * Client query parameter overrides (?district=... or ?state=...) are NEVER trusted
 * for District Admin or State Admin to prevent cross-jurisdiction data leaks.
 */
export function resolveAdminScope(user: AuthUser): AdminScopeInfo {
  const role = user.role;

  if (role === 'DISTRICT_ADMIN') {
    const district = user.district || 'South Delhi';
    const state = user.state || 'Delhi';
    return {
      role: 'DISTRICT_ADMIN',
      scopeLevel: 'district',
      state,
      district,
      scopeName: `district:${district}`,
      scopeTitle: `${district} District (${state})`,
    };
  }

  if (role === 'STATE_ADMIN') {
    const state = user.state || 'Delhi';
    return {
      role: 'STATE_ADMIN',
      scopeLevel: 'state',
      state,
      scopeName: `state:${state}`,
      scopeTitle: `${state} State`,
    };
  }

  if (role === 'NATIONAL_ADMIN') {
    return {
      role: 'NATIONAL_ADMIN',
      scopeLevel: 'national',
      scopeName: 'national',
      scopeTitle: 'National (All Jurisdictions)',
    };
  }

  throw new AppError(403, 'FORBIDDEN', 'User is not an authorized administrator.');
}

/**
 * Returns filtered datasets (cases, alerts, followUps, counsellors) strictly
 * bounded by the administrator's authorized geographic jurisdiction.
 */
export function getScopedAdminDataset(user: AuthUser): ScopedAdminDataset {
  const scope = resolveAdminScope(user);

  let scopedCases: CaseRecord[] = store.cases;

  if (scope.scopeLevel === 'district') {
    scopedCases = store.cases.filter(
      (c) => (c.district || '').toLowerCase() === (scope.district || '').toLowerCase()
    );
  } else if (scope.scopeLevel === 'state') {
    scopedCases = store.cases.filter(
      (c) => (c.state || '').toLowerCase() === (scope.state || '').toLowerCase()
    );
  }

  const allowedTokens = new Set(scopedCases.map((c) => c.victimToken));
  const allowedDockets = new Set(scopedCases.map((c) => c.docket));
  const allowedCaseIds = new Set(scopedCases.map((c) => c.id));
  const assignedCounsellorIds = new Set(
    scopedCases.map((c) => c.assignedCounsellorId).filter(Boolean)
  );

  // Scoped alerts: only alerts relating to cases inside the admin's scope
  const allAlerts = store.records.get('alerts:all') || [];
  const scopedAlerts =
    scope.scopeLevel === 'national'
      ? allAlerts
      : allAlerts.filter(
          (a: any) =>
            (a.victimToken && allowedTokens.has(a.victimToken)) ||
            (a.caseReference && (allowedTokens.has(a.caseReference) || allowedDockets.has(a.caseReference) || allowedCaseIds.has(a.caseReference)))
        );

  // Scoped follow-ups: only follow-ups for cases inside the admin's scope
  const allFollowUps = store.records.get('follow_ups') || [];
  const scopedFollowUps =
    scope.scopeLevel === 'national'
      ? allFollowUps
      : allFollowUps.filter(
          (f: any) =>
            (f.victimToken && allowedTokens.has(f.victimToken)) ||
            (f.caseId && allowedCaseIds.has(f.caseId)) ||
            (f.docket && allowedDockets.has(f.docket))
        );

  // Scoped counsellors:
  // - District Admin: only counsellors holding at least one assigned case in that district
  // - State Admin: counsellors whose state matches or who have cases in that state
  // - National Admin: all counsellors in roster
  let scopedCounsellors: Counsellor[] = [];
  if (scope.scopeLevel === 'district') {
    scopedCounsellors = store.counsellors
      .filter((c) => assignedCounsellorIds.has(c.id))
      .map((c) => {
        const districtCases = scopedCases.filter((sc) => sc.assignedCounsellorId === c.id);
        return {
          ...c,
          casesAssigned: districtCases.length,
        };
      });
  } else if (scope.scopeLevel === 'state') {
    scopedCounsellors = store.counsellors
      .filter(
        (c) =>
          (c.state || '').toLowerCase() === (scope.state || '').toLowerCase() ||
          assignedCounsellorIds.has(c.id)
      )
      .map((c) => {
        const stateCases = scopedCases.filter((sc) => sc.assignedCounsellorId === c.id);
        return {
          ...c,
          casesAssigned: stateCases.length,
        };
      });
  } else {
    scopedCounsellors = store.counsellors.map((c) => {
      const totalCases = store.cases.filter((sc) => sc.assignedCounsellorId === c.id);
      return {
        ...c,
        casesAssigned: totalCases.length,
      };
    });
  }

  return {
    scope,
    cases: scopedCases,
    alerts: scopedAlerts,
    followUps: scopedFollowUps,
    counsellors: scopedCounsellors,
  };
}
