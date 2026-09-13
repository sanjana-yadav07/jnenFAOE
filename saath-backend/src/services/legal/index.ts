import legalContent from '../../db/legal-content.json';
import { CaseRecord } from '../../types/domain.js';

export interface LegalFilterOptions {
  caseRecord?: CaseRecord | null;
  language?: string;
  category?: string;
}

export interface LegalContentResult {
  contextSummary: {
    activeDocket: string | null;
    caseCategory: string | null;
    currentStage: string | null;
    state: string | null;
    district: string | null;
    legalAidAssigned: boolean;
    protectionStatus: string | null;
    financialReliefStatus: string | null;
  };
  relevantActs: typeof legalContent.acts;
  applicableRights: typeof legalContent.rights;
  activeStageGuide: typeof legalContent.process_stages[0] | null;
  allProcessStages: typeof legalContent.process_stages;
  legalAidFramework: typeof legalContent.legal_aid;
  faqs: typeof legalContent.faqs;
  verifiedResources: typeof legalContent.official_resources;
  disclaimer: string;
}

const DISCLAIMER = "This information is provided for general awareness and educational support. Sourced from official portals (India Code, NALSA, DoSJE). It does not constitute formal legal representation or binding legal conclusions. For decisions specific to your case, please confirm with your assigned DLSA legal counsel.";

export function getCaseAwareLegalContent(options: LegalFilterOptions): LegalContentResult {
  const c = options.caseRecord ?? null;
  const caseType = c?.caseCategory || c?.incidentCategory || 'General';
  const stage = c?.currentStage || 'Investigation';
  const state = c?.state || 'National';
  const district = c?.district || '';

  // 1. Filter and prioritize Acts
  const scoredActs = legalContent.acts.map((act) => {
    let score = 0;
    if (act.applicable_case_types.includes('All')) score += 5;
    if (c?.caseCategory && act.applicable_case_types.some(t => t.toLowerCase() === c.caseCategory?.toLowerCase())) score += 20;
    if (c?.incidentCategory && act.applicable_incident_categories.some(t => t.toLowerCase() === c.incidentCategory?.toLowerCase())) score += 15;
    
    // Keyword match
    const lowerType = caseType.toLowerCase();
    if ((lowerType.includes('caste') || lowerType.includes('atrocity')) && act.id === 'poa-1989') score += 25;
    if ((lowerType.includes('discrimination') || lowerType.includes('untouchability')) && act.id === 'pcr-1955') score += 25;
    if ((lowerType.includes('sexual') || lowerType.includes('domestic') || lowerType.includes('assault')) && act.id === 'bns-victim-relief') score += 25;

    return { ...act, priorityScore: score };
  });

  const relevantActs = scoredActs
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map(({ priorityScore, ...act }) => act);

  // 2. Filter and prioritize Rights
  const scoredRights = legalContent.rights.map((right) => {
    let score = 0;
    if (right.applicable_cases.includes('All')) score += 5;
    if (c?.caseCategory && right.applicable_cases.some(t => t.toLowerCase() === c.caseCategory?.toLowerCase())) score += 15;
    if (c?.protectionRequested && right.id === 'right-protection') score += 20;
    if (c?.financialReliefEligible && right.id === 'right-compensation') score += 20;
    return { ...right, priorityScore: score };
  });

  const applicableRights = scoredRights
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map(({ priorityScore, ...right }) => right);

  // 3. Process Stages & Active Stage Guide
  const activeStageGuide = legalContent.process_stages.find(
    (s) => s.stage.toLowerCase() === stage.toLowerCase()
  ) || legalContent.process_stages[0];

  // 4. Resources ranking
  const scoredResources = legalContent.official_resources.map((res) => {
    let score = 0;
    if (res.applicable_cases.includes('All')) score += 5;
    if (c?.caseCategory && res.applicable_cases.some(t => t.toLowerCase() === c.caseCategory?.toLowerCase())) score += 15;
    if (res.id === 'res-nalsa-helpline') score += 10;
    if (c?.gender === 'Woman' && res.id === 'res-ncw-helpline') score += 25;
    if ((caseType.toLowerCase().includes('caste') || caseType.toLowerCase().includes('atrocity')) && res.id === 'res-nhaa-helpline') score += 25;
    return { ...res, priorityScore: score };
  });

  const verifiedResources = scoredResources
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map(({ priorityScore, ...res }) => res);

  return {
    contextSummary: {
      activeDocket: c?.docket ?? null,
      caseCategory: c?.caseCategory ?? null,
      currentStage: c?.currentStage ?? null,
      state: c?.state ?? null,
      district: c?.district ?? null,
      legalAidAssigned: c?.legalAidStatus === 'Assigned',
      protectionStatus: c?.protectionStatus ?? null,
      financialReliefStatus: c?.compensationStatus ?? null,
    },
    relevantActs,
    applicableRights,
    activeStageGuide,
    allProcessStages: legalContent.process_stages,
    legalAidFramework: legalContent.legal_aid,
    faqs: legalContent.faqs,
    verifiedResources,
    disclaimer: DISCLAIMER,
  };
}

export function searchLegalKnowledgeBase(query: string, caseRecord?: CaseRecord | null) {
  const content = getCaseAwareLegalContent({ caseRecord });
  const q = query.toLowerCase().trim();

  // 1. Search FAQs
  const matchedFaq = content.faqs.find(
    (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || q.includes('legal aid') && f.id === 'faq-1' || q.includes('protection') && f.id === 'faq-2' || q.includes('compensation') && f.id === 'faq-3'
  );

  // 2. Search Acts
  const matchedAct = content.relevantActs.find(
    (a) => a.title.toLowerCase().includes(q) || a.plain_language_summary.toLowerCase().includes(q) || a.short_description.toLowerCase().includes(q)
  );

  // 3. Search Rights
  const matchedRight = content.applicableRights.find(
    (r) => r.title.toLowerCase().includes(q) || r.details.toLowerCase().includes(q)
  );

  return {
    matchedFaq: matchedFaq ?? null,
    matchedAct: matchedAct ?? null,
    matchedRight: matchedRight ?? null,
    activeStage: content.activeStageGuide,
    resources: content.verifiedResources.slice(0, 3),
    legalAid: content.legalAidFramework,
    disclaimer: DISCLAIMER,
  };
}
