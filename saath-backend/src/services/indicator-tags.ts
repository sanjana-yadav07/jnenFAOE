/**
 * Trauma & Emotional Indicator Tagging Layer
 *
 * Deterministic extraction of PS-named indicator tags:
 * - trauma
 * - fear
 * - depression
 * - intimidation_signal
 * - social_isolation
 *
 * Non-diagnostic signals designed for safety escalation and triage.
 */

export type IndicatorTag =
  | 'trauma'
  | 'fear'
  | 'depression'
  | 'intimidation_signal'
  | 'social_isolation';

export const CANONICAL_INDICATOR_ORDER: readonly IndicatorTag[] = [
  'trauma',
  'fear',
  'depression',
  'intimidation_signal',
  'social_isolation',
] as const;

interface IndicatorRule {
  tag: IndicatorTag;
  patterns: RegExp[];
}

// Negation patterns checking preceding words (e.g. "not scared", "no fear", "never threatened", "helped someone who was depressed")
const NEGATION_PREFIX = /(?:not|n't|never|no|without|hardly|scarcely|barely|stopped(?:\s+feeling)?|free\s+from|overcame|helped\s+someone\s+who\s+was)\s+(?:\w+\s+){0,3}$/i;

const INDICATOR_RULES: IndicatorRule[] = [
  {
    tag: 'trauma',
    patterns: [
      /\b(?:trauma|traumatic|traumatized|traumatised)\b/i,
      /\bflashback(?:s)?\b/i,
      /\bnightmare(?:s)?\b/i,
      /\breliving(?:\s+it|\s+what\s+happened|\s+the\s+incident|\s+the\s+event)?\b/i,
      /\bintrusive\s+memories\b/i,
      /\bunwanted\s+memories\b/i,
      /\bshaken\s+since\s+(?:the\s+incident|what\s+happened|that\s+day)\b/i,
      /\bhaunted\s+by\s+(?:the\s+incident|what\s+happened|memories)\b/i,
      /\btrigger(?:ed)?\s+by\s+memories\b/i,
    ],
  },
  {
    tag: 'fear',
    patterns: [
      /\b(?:scared|afraid|frightened|terrified|fearful|petrified|panicked|panicking)\b/i,
      /\bconstant\s+fear\b/i,
      /\bfear\s+for\s+my\s+(?:life|safety)\b/i,
      /\bfeeling\s+unsafe\b/i,
      /\bscared\s+to\s+(?:go|speak|talk|leave|step|tell)\b/i,
      /\bafraid\s+of\s+(?:him|them|her|retaliation|what\s+will\s+happen)\b/i,
      /\bscared\s+of\s+(?:him|them|her|retaliation|what\s+will\s+happen)\b/i,
      /\btoo\s+afraid\b/i,
      /\btoo\s+scared\b/i,
    ],
  },
  {
    tag: 'depression',
    patterns: [
      /\b(?:hopeless|hopelessness|worthless|worthlessness|despair|despairing)\b/i,
      /\bfeeling\s+(?:empty|numb|down|low|depressed)\b/i,
      /\bdepressed\b/i,
      /\blost\s+interest\s+(?:in\s+everything|in\s+life|in\s+anything)?\b/i,
      /\bno\s+interest\s+in\s+(?:anything|life|doing\s+anything)\b/i,
      /\bnothing\s+feels\s+(?:worthwhile|good|meaningful|happy)\b/i,
      /\bpersistent\s+sadness\b/i,
      /\bdeep\s+sadness\b/i,
      /\bcan't\s+stop\s+crying\b/i,
      /\bcannot\s+stop\s+crying\b/i,
      /\bhave\s+no\s+energy\s+or\s+will\b/i,
      /\bfeeling\s+worthless\b/i,
    ],
  },
  {
    tag: 'intimidation_signal',
    patterns: [
      /\b(?:threaten(?:ed|ing|s)?|blackmail(?:ed|ing|s)?|stalk(?:ed|ing|s)?)\b/i,
      /\bbeing\s+threatened\b/i,
      /\bforced\s+to\b/i,
      /\bpressured\s+to\b/i,
      /\bwarned\s+me\s+not\s+to\b/i,
      /\bintimidat(?:ed|ing|ion)\b/i,
      /\bscared\s+to\s+(?:speak|tell|report)\b/i,
      /\bafraid\s+to\s+(?:speak|tell|report)\b/i,
      /\bthreatens\s+(?:me|my\s+family|to\s+hurt)\b/i,
      /\bcontrolling\s+me\b/i,
      /\bcoerced\b/i,
    ],
  },
  {
    tag: 'social_isolation',
    patterns: [
      /\bcompletely\s+alone\b/i,
      /\bfeel(?:ing)?\s+(?:isolated|alone|abandoned|alienated)\b/i,
      /\balone\b/i,
      /\bstopped\s+talking\s+to\s+(?:everyone|anyone|friends|family)\b/i,
      /\bnobody\s+talks\s+to\s+me\b/i,
      /\bno\s+one\s+(?:talks\s+to\s+me|with\s+me|to\s+talk\s+to|understands|helps)\b/i,
      /\bcut\s+off\s+from\s+(?:everyone|friends|family|the\s+world|society)\b/i,
      /\bseparated\s+from\s+everyone\b/i,
      /\bavoiding\s+(?:people|everyone|friends|family)\b/i,
      /\bno\s+support\s+system\b/i,
      /\bhave\s+no\s+one\b/i,
      /\ball\s+by\s+myself\b/i,
      /\bwithdrawing\s+from\s+(?:everyone|others|society)\b/i,
    ],
  },
];

/**
 * Checks if a match index in text is preceded by a negation within the current clause/sentence.
 */
function isNegated(text: string, matchIndex: number): boolean {
  // Look back up to 60 characters or to previous sentence boundary
  const searchStart = Math.max(0, matchIndex - 60);
  const preceding = text.slice(searchStart, matchIndex);
  
  // Split by sentence/clause boundaries like period, exclamation, semicolon, but
  const clauseParts = preceding.split(/[\.\!\;\?\n]|,\s*(?:but|however|yet)\s*/i);
  const currentClausePreceding = clauseParts[clauseParts.length - 1];

  return NEGATION_PREFIX.test(currentClausePreceding);
}

/**
 * Extracts explicit indicator tags from text deterministically.
 * Returns unique tags sorted in CANONICAL_INDICATOR_ORDER.
 */
export function extractIndicatorTags(text?: string | null): IndicatorTag[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return [];
  }

  const detected = new Set<IndicatorTag>();

  for (const rule of INDICATOR_RULES) {
    for (const pattern of rule.patterns) {
      // Find all matches with index
      const globalRegex = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
      let match: RegExpExecArray | null;
      while ((match = globalRegex.exec(trimmed)) !== null) {
        if (!isNegated(trimmed, match.index)) {
          detected.add(rule.tag);
          break; // Found an unnegated match for this rule, no need to check more patterns for this rule
        }
      }
      if (detected.has(rule.tag)) {
        break;
      }
    }
  }

  return CANONICAL_INDICATOR_ORDER.filter((tag) => detected.has(tag));
}
