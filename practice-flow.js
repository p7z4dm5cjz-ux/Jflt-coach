import {learnerProfile} from "./learner-profile.js";
import {blockAdaptation} from "./adaptive-practice.js";
import {normal} from "./engine.js";
import {validateReply} from "./contract.js";

export const PRACTICE_SIZE=30;
export const BLOCK_SIZE=6;
export function trainingRecord(grammarTarget,recovery=[],parentId=null) {
  return {grammar_target:grammarTarget,target:grammarTarget+recovery.length,page:0,checked:[],recovery,parent_id:parentId};
}
export function practiceBlock(set) {
  if(!set.training)return {page:0,pages:1,start:0,target:set.items.length,items:set.items,checked:!!set.completed_at};
  const t=set.training,pages=Math.ceil(t.grammar_target/BLOCK_SIZE),start=t.page*BLOCK_SIZE;
  return {page:t.page,pages,start,target:t.target,items:set.items.slice(start,t.page===pages-1?set.items.length:start+BLOCK_SIZE),checked:t.checked.includes(t.page)};
}
export function freshAiItems(previous,reply) {
  validateReply("exercises",reply);
  const seen=new Set(previous.map(it=>normal(it.stem)));
  for(const item of reply.items) {
    const stem=normal(item.stem);
    if(seen.has(stem))throw new Error("Groq ha ripetuto una frase già proposta. Il blocco precedente è salvato: prova a generare di nuovo quello successivo.");
    seen.add(stem);
  }
  return reply.items;
}
export function exerciseRequest(state,lessonId,{set=null,parent=null,focus=[]}={}) {
  const lookup=attempt=>{
    const item=state.sessions.find(s=>s.id===attempt.session_id)?.items.find(it=>it.id===attempt.item_id);
    return {stem:String(attempt.stem||item?.stem||"Esercizio precedente").slice(0,350),answer:String(attempt.answer||"").slice(0,300),reference:item?.answer.slice(0,300)||"",rule:item?.why.slice(0,450)||""};
  };
  const errors=focus.length?focus.map(item=>({stem:item.stem.slice(0,350),answer:(parent?.answers[item.id]||"").slice(0,300),reference:item.answer.slice(0,300),rule:item.why.slice(0,450)})):state.attempts.filter(a=>a.lesson_id===lessonId&&!a.correct&&!a.disputed).slice(-6).map(lookup);
  const recent=state.sessions.filter(s=>s.lesson_id===lessonId).flatMap(s=>s.items).filter(it=>it.kind!=="retrieval");
  const previous=[...recent,...(parent?.items||[]),...(set?.items||[])].filter(it=>it.kind!=="retrieval");
  const seen=[...new Set(previous.map(it=>it.stem.slice(0,350)))].slice(-16);
  const terms=(set?.training?.recovery||[]).map(it=>state.vocabulary.find(v=>v.id===it.term_id)).filter(Boolean).slice(0,3);
  const adaptation=set?.id?blockAdaptation(state,set):null;
  return {learner:learnerProfile(state,lessonId),lesson_id:lessonId,terms:terms.map(v=>({expression:v.expression,meaning_it:v.meaning_it})),recent_errors:errors,
    already_seen:seen,practice:{block:Math.floor((set?.items.filter(it=>it.kind!=="retrieval").length||0)/BLOCK_SIZE)+1,total:set?.training?.grammar_target||30,purpose:parent?"Riprova guidata: stessa regola debole, frasi e contesti diversi. Non mostrare soluzioni nella consegna.":(adaptation?"Adattamento: "+adaptation.mode+". "+adaptation.message+" ":"")+"Valuta learner: scegli il prossimo obiettivo in base alle prove, non al numero del blocco."}};
}
export function negativeRule(item) {
  if(item.rule)return item.rule;
  const answer=normal(item.answer);
  if(/\bdid not\b/.test(answer))return "past-did";
  if(/\b(?:does|do) not\b/.test(answer))return "present-do";
  if(/\b(?:am|is|are|was|were) not\b/.test(answer))return "be";
  return null;
}
