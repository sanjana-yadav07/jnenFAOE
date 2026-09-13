import { describe, it, expect } from 'vitest';
import { extractIndicatorTags } from '../src/services/indicator-tags.js';

describe('Trauma & Emotional Indicator Tagging Layer', () => {
  it('returns empty array for empty or whitespace-only text', () => {
    expect(extractIndicatorTags('')).toEqual([]);
    expect(extractIndicatorTags('   ')).toEqual([]);
    expect(extractIndicatorTags(null as any)).toEqual([]);
    expect(extractIndicatorTags(undefined as any)).toEqual([]);
  });

  it('detects fear accurately', () => {
    const res = extractIndicatorTags('I am scared and afraid.');
    expect(res).toEqual(['fear']);
  });

  it('detects social isolation accurately', () => {
    const res = extractIndicatorTags('I have stopped talking to everyone and feel completely alone.');
    expect(res).toEqual(['social_isolation']);
  });

  it('detects fear and intimidation signal together', () => {
    const res = extractIndicatorTags('He keeps threatening me and I am scared to speak.');
    expect(res).toEqual(['fear', 'intimidation_signal']);
  });

  it('detects depression accurately', () => {
    const res = extractIndicatorTags('I feel hopeless, empty and have lost interest in everything.');
    expect(res).toEqual(['depression']);
  });

  it('detects trauma accurately', () => {
    const res = extractIndicatorTags('I keep reliving what happened and having nightmares.');
    expect(res).toEqual(['trauma']);
  });

  it('detects multi-indicator combinations in canonical order', () => {
    const res = extractIndicatorTags('I am afraid of him, he threatens me, and I have no one to talk to.');
    expect(res).toEqual(['fear', 'intimidation_signal', 'social_isolation']);
  });

  it('handles negation correctly (does not tag negated phrases)', () => {
    expect(extractIndicatorTags('I am not scared anymore')).toEqual([]);
    expect(extractIndicatorTags('I do not feel alone')).toEqual([]);
    expect(extractIndicatorTags('I am never threatened by him')).toEqual([]);
    expect(extractIndicatorTags('I stopped feeling depressed')).toEqual([]);
  });

  it('handles third-person or non-relevant contexts appropriately', () => {
    expect(extractIndicatorTags('I helped someone who was depressed')).toEqual([]);
  });

  it('deduplicates tags when multiple matching phrases appear for the same indicator', () => {
    const res = extractIndicatorTags('I am scared, terrified, and afraid of everything.');
    expect(res).toEqual(['fear']);
  });

  it('detects all 5 indicators when present', () => {
    const text = 'I have recurring nightmares from the trauma. I am constantly terrified and hopeless about life. He keeps threatening me and I am completely alone.';
    const res = extractIndicatorTags(text);
    expect(res).toEqual(['trauma', 'fear', 'depression', 'intimidation_signal', 'social_isolation']);
  });
});
