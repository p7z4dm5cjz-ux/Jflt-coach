import {normal} from './answer-normal.js';
import {progressDecision} from './contract.js';
export const PRACTICE_SKILLS=['form','meaning','tense_choice','word_order','use'];
// Un riordino resta un riordino anche se la banca lo ha etichettato come «form».
const WORD_ORDER=/riordin|parole in ordine/i;
export const practiceSkill=item=>WORD_ORDER.test(item?.stem||'')&&(!item?.skill||item.skill==='form')?'word_order':PRACTICE_SKILLS.includes(item?.skill)?item.skill:item?.skill==='choose'?'tense_choice':item?.skill==='recognise'?'meaning':'form';
export function reliableItem(item,source){
 return !item?.doubt&&!['unchecked','doubt'].includes(item?.check)&&(item?.kind==='retrieval'||(item?.origin||source)!=='groq'||['confirmed','extended'].includes(item?.check));
}
// One first exposure per context. Replays remain practice, not independent evidence.
export function practiceEvidence(state,lessonId){
 const sessions=new Map((state.sessions||[]).map(s=>[s.id,s])),seen=new Set(),rows=[];
 for(const a of state.attempts||[]){
  if(lessonId&&a.lesson_id!==lessonId||a.disputed||a.source==='legacy')continue;
  const set=sessions.get(a.session_id),index=set?.items.findIndex(i=>i.id===a.item_id)??-1,item=index>=0?set.items[index]:null;
  if(!reliableItem(item,a.source)||item?.personal_review)continue;
  const stem=item?.stem||a.stem,key=a.lesson_id+'|'+normal(item?.context_id||a.context_id||stem);
  if(!stem||seen.has(key))continue;seen.add(key);
  const page=set?.training?Math.floor(index/6):0;
  const completed=!!set&&(set.training?set.training.checked.includes(page):!!set.completed_at);
  rows.push({...a,stem,skill:practiceSkill(item||a),assisted:!!a.assisted||!!item?.fallback_guided||!!set?.assisted||!!set?.hinted_items?.includes(a.item_id),block_id:a.session_id+':'+page,block_complete:completed,expected:item?.answer||''});
 }
 return rows;
}
// La decisione vera sta in contract.js (condivisa con il Worker): qui solo l'adattatore.
export function progression(rows){return progressDecision(rows);}
