import { analyzeText, generateTaaraReply } from '../ml.js';
import { store } from '../../db/store.js';
import { searchLegalKnowledgeBase } from '../legal/index.js';

/** Provider-neutral TAARA boundary. Provider credentials remain server-side. */
export async function respondToTaara(input: { victimToken: string; message: string; language?: string; caseId?: string }) { 
  const analysis = await analyzeText({ victimToken: input.victimToken, text: input.message, language: input.language }); 
  const caseContext = input.caseId ? store.cases.find(c => c.id === input.caseId) : store.cases.find(c => c.victimToken === input.victimToken);
  
  // Check if user is asking legal / rights / legal-aid / compensation questions
  const lowerMsg = input.message.toLowerCase();
  const isLegalQuery = ['law', 'rights', 'legal', 'lawyer', 'aid', 'court', 'judge', 'compensation', 'protection', 'police', 'special court', 'poa', 'act'].some(k => lowerMsg.includes(k));
  
  let legalAddition = '';
  if (isLegalQuery) {
    const legalSearchResult = searchLegalKnowledgeBase(input.message, caseContext);
    if (legalSearchResult.matchedFaq) {
      legalAddition = ` Verified legal information: ${legalSearchResult.matchedFaq.answer} (Source: ${legalSearchResult.matchedFaq.official_source})`;
    } else if (legalSearchResult.matchedAct) {
      legalAddition = ` Relevant law: ${legalSearchResult.matchedAct.title}. ${legalSearchResult.matchedAct.plain_language_summary} (Source: ${legalSearchResult.matchedAct.official_source_name})`;
    }
  }

  const reply = await generateTaaraReply({ 
    message: input.message + (legalAddition ? ` [Context Note: ${legalAddition}]` : ''), 
    language: input.language, 
    analysis,
    caseContext
  }); 
  return { analysis, reply }; 
}
