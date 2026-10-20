import {normal} from './answer-normal.js';
export const PRACTICE_SKILLS=['form','meaning','tense_choice','word_order','use'];
export const practiceSkill=item=>PRACTICE_SKILLS.includes(item?.skill)?item.skill:item?.skill==='choose'?'tense_choice':item?.skill==='recognise'?'meaning':/riordin|parole in ordine/i.test(item?.stem||'')?'word_order':'form';
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
  const stem=item?.stem||a.stem,key=a.lesson_id+'|'+normal(stem);
  if(!stem||seen.has(key))continue;seen.add(key);
  const page=set?.training?Math.floor(index/6):0;
  const completed=!!set&&(set.training?set.training.checked.includes(page):!!set.completed_at);
  rows.push({...a,stem,skill:practiceSkill(item||a),assisted:!!a.assisted||!!set?.assisted||!!set?.hinted_items?.includes(a.item_id),block_id:a.session_id+':'+page,block_complete:completed,expected:item?.answer||''});
 }
 return rows;
}
export function progression(rows){
 const groups=new Map();for(const r of rows){if(!groups.has(r.block_id))groups.set(r.block_id,[]);groups.get(r.block_id).push(r);}
 const blocks=[...groups.values()].filter(rs=>rs.length===6&&rs.every(r=>r.block_complete));
 const latest=blocks.at(-1)||[],window=blocks.slice(-2).flat();
 const correct=rs=>rs.filter(r=>r.correct&&!r.assisted).length;
 const can_advance=latest.length===6&&latest.every(r=>!r.assisted)&&correct(latest)>=5;
 const skills=new Set(window.filter(r=>r.correct&&!r.assisted).map(r=>r.skill));
 const contexts=new Set(window.map(r=>r.context_id||r.stem)).size;
 const ready=contexts>=8&&window.length===12&&window.every(r=>!r.assisted)&&correct(window)>=10&&skills.has('form')&&(skills.has('meaning')||skills.has('tense_choice'))&&(skills.has('use')||skills.has('word_order'));
 return {can_advance,ready,latest,window,blocks:blocks.length};
}
