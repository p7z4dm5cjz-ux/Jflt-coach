import {placementProfile} from './placement.js';
import {normal} from './answer-normal.js';
export const SKILLS=['form','meaning','tense_choice','word_order','use'];
const skillOf=i=>SKILLS.includes(i?.skill)?i.skill:i?.skill==='choose'?'tense_choice':'form';
// Rebuild from facts; AI assessments never overwrite the evidence.
export function learnerProfile(state,lessonId){
 const p=placementProfile(state.placement),sessions=state.sessions||[];
 const index=new Map(sessions.flatMap(s=>s.items.map(i=>[s.id+'|'+i.id,i])));
 const seen=new Set(),rows=[],reviews=[];
 for(const a of state.attempts||[]){
  const i=index.get(a.session_id+'|'+a.item_id),key=normal(i?.stem||a.stem||'');
  if(a.lesson_id!==lessonId||a.disputed||i?.doubt||i?.origin==='groq'&&!['confirmed','extended'].includes(i.check)||a.source==='legacy'||!key)continue;
  if(i?.personal_review){reviews.push({id:a.id,source:"review",skill:skillOf(i),stem:key.slice(0,240),given:String(a.answer||"").slice(0,160),expected:String(i.answer||"").slice(0,160),correct:!!a.correct,assisted:true,date:a.date||null});continue;}
  if(seen.has(key))continue;
  seen.add(key);rows.push({id:a.id||a.session_id+'|'+a.item_id,source:'practice',skill:skillOf(i||a),stem:key.slice(0,240),given:String(a.answer||'').slice(0,160),expected:String(i?.answer||'').slice(0,160),correct:!!a.correct,assisted:!!a.assisted,date:a.date||null});
 }
 const pre=(p?.rows||[]).filter(r=>r.item.lessons.includes(lessonId)).map(r=>({id:'pretest:'+r.item.id,source:'pretest',skill:skillOf(r.item),stem:r.item.stem.slice(0,240),given:String(r.answer.value||'').slice(0,160),expected:r.item.answer.slice(0,160),correct:r.correct,assisted:!r.secure,date:state.placement.submitted_at}));
 const evidence=[...pre.slice(-4),...rows.slice(-8),...reviews.slice(-4)];
 const skills=SKILLS.map(skill=>{const all=[...pre,...rows].filter(r=>r.skill===skill);return {skill,observations:all.length,independent_correct:all.filter(r=>r.correct&&!r.assisted).length,errors:all.filter(r=>!r.correct).length,assisted:all.filter(r=>r.assisted).length};});
 const prior=sessions.filter(s=>s.lesson_id===lessonId).flatMap(s=>s.adaptive_plans||[]).at(-1)?.assessment;
 return {version:1,lesson_id:lessonId,pretest_status:p?.lessonStatus[lessonId]||'unassessed',skills,evidence,previous_assessment:prior?{mode:prior.mode,focus:prior.focus,reason:prior.reason}:null};
}
// The persistent sessions are the source of the personal bank. Only automatically
// cross-checked AI items qualify; this is not a human certification.
export function personalPractice(state,lessonId,count=6){
 const bank=new Map();
 for(const s of state.sessions||[])if(s.lesson_id===lessonId)for(const i of s.items){
  if(i.origin!=='groq'||i.doubt||!['confirmed','extended'].includes(i.check))continue;
  const key=normal(i.stem);if(!bank.has(key))bank.set(key,i);
 }
 const items=[...bank.values()].map(item=>{const attempts=(state.attempts||[]).filter(a=>!a.disputed&&normal(a.stem||'')===normal(item.stem));const last=attempts.at(-1);return {item,last,priority:!last?1:!last.correct||last.assisted?2:0};});
 return items.sort((a,b)=>b.priority-a.priority||String(a.last?.date||'').localeCompare(String(b.last?.date||''))).slice(0,count).map(({item})=>({...item,skill:skillOf(item),personal_review:true}));
}
