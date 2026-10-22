import {lessonMeta} from "./learning-path.js";
import {checkResults} from "./grammar-checks.js";
import {practiceEvidence,progression} from "./evidence-policy.js";
import {LESSONS} from "./catalog.js";
import {STARTING_LEVELS,startingLevel} from "./starting-level.js";
import {placementProfile} from './placement.js';
import {normal} from './answer-normal.js';
export const SKILLS=['form','meaning','tense_choice','word_order','use'];
const skillOf=i=>SKILLS.includes(i?.skill)?i.skill:i?.skill==='choose'?'tense_choice':'form';
// Rebuild from facts; AI assessments never overwrite the evidence.
export function learnerProfile(state,lessonId){
 const p=placementProfile(state.placement),sessions=state.sessions||[];
 const index=new Map(sessions.flatMap(s=>s.items.map(i=>[s.id+'|'+i.id,i])));
 const facts=practiceEvidence(state,lessonId),progress=progression(facts);
 const decisionRows=new Set(progress.decision_rows);
 const rows=facts.filter(a=>decisionRows.has(a)).map(a=>({id:a.id||a.session_id+'|'+a.item_id,source:'practice',skill:a.skill,stem:a.stem.slice(0,240),given:String(a.answer||'').slice(0,160),expected:a.expected.slice(0,160),correct:!!a.correct,assisted:!!a.assisted,date:a.date||null,block_id:a.block_id,block_complete:a.block_complete}));
 const reviews=(state.attempts||[]).filter(a=>a.lesson_id===lessonId&&!a.disputed&&index.get(a.session_id+'|'+a.item_id)?.personal_review).slice(-2).map(a=>({id:a.id,source:'review',skill:skillOf(index.get(a.session_id+'|'+a.item_id)),stem:String(a.stem||'').slice(0,240),given:String(a.answer||'').slice(0,160),expected:'',correct:!!a.correct,assisted:true,date:a.date||null}));
 const pre=(p?.rows||[]).filter(r=>r.item.lessons.includes(lessonId)).map(r=>({id:'pretest:'+r.item.id,source:'pretest',skill:skillOf(r.item),stem:r.item.stem.slice(0,240),given:String(r.answer.value||'').slice(0,160),expected:r.item.answer.slice(0,160),correct:r.correct,assisted:!r.secure,date:state.placement.submitted_at}));
 const checks=(state.grammar_checks||[]).filter(c=>c.completed_at).flatMap(c=>checkResults(c).filter(i=>i.lesson_id===lessonId).map(i=>({id:c.id+':'+i.id,source:'check',skill:skillOf(i),stem:i.stem.slice(0,240),given:i.value.slice(0,160),expected:i.answer.slice(0,160),correct:i.correct,assisted:!!i.repeated||!!i.practice_bank,date:c.completed_at})));
 // Massimo 16 prove: prima quelle su cui si decide l'avanzamento, poi pretest, verifiche e ripassi.
 const others=[...pre,...checks,...reviews],evidence=[...(rows.length<16?others.slice(-Math.min(4,16-rows.length)):[]),...rows];
 const allRows=facts.map(a=>({skill:a.skill,correct:!!a.correct,assisted:!!a.assisted}));
 const skills=SKILLS.map(skill=>{const all=[...pre,...allRows].filter(r=>r.skill===skill);return {skill,observations:all.length,independent_correct:all.filter(r=>r.correct&&!r.assisted).length,errors:all.filter(r=>!r.correct).length,assisted:all.filter(r=>r.assisted).length};});
 const prior=sessions.filter(s=>s.lesson_id===lessonId).flatMap(s=>s.adaptive_plans||[]).at(-1)?.assessment;
 const lesson=LESSONS.find(l=>l.id===lessonId);
 const relatedIds=[...new Set([...(lesson?lessonMeta(lesson).prerequisites:[]),...({"future-going-to":["future-will","future-arrangements"]}[lessonId]||[])])].slice(0,4);
 const globalRows=practiceEvidence(state).slice(-60);
 const global_skills=SKILLS.map(skill=>{const rs=globalRows.filter(r=>r.skill===skill);return {skill,observations:rs.length,independent_correct:rs.filter(r=>r.correct&&!r.assisted).length,errors:rs.filter(r=>!r.correct).length,assisted:rs.filter(r=>r.assisted).length};});
 const related=relatedIds.map(id=>{const rs=practiceEvidence(state,id).slice(-12);return {lesson_id:id,observations:rs.length,independent_correct:rs.filter(r=>r.correct&&!r.assisted).length,errors:rs.filter(r=>!r.correct).length,pretest_status:p?.lessonStatus[id]||'unassessed'};});
 return {version:1,progression:{can_advance:progress.can_advance,ready:progress.ready},related,global_skills,starting_level:startingLevel(state)?.id||null,lesson_id:lessonId,pretest_status:p?.lessonStatus[lessonId]||'unassessed',skills,evidence,previous_assessment:prior?{mode:prior.mode,focus:prior.focus,reason:prior.reason}:null};
}
// The persistent sessions are the source of the personal bank. Only automatically
// cross-checked AI items qualify; this is not a human certification.
export function personalPractice(state,lessonId,count=6){
 const bank=new Map();
 for(const s of state.sessions||[])for(const i of s.items){
  if((i.focus_lesson||s.lesson_id)!==lessonId||i.group&&!i.passage)continue;
  if(i.origin!=='groq'||i.doubt||!['confirmed','extended'].includes(i.check))continue;
  const key=normal(i.context_id||i.stem);if(!bank.has(key))bank.set(key,i);
 }
 const items=[...bank.values()].map(item=>{const attempts=(state.attempts||[]).filter(a=>!a.disputed&&normal(a.context_id||a.stem||'')===normal(item.context_id||item.stem));const last=attempts.at(-1);return {item,last,priority:!last?1:!last.correct||last.assisted?2:0};});
 return items.sort((a,b)=>b.priority-a.priority||String(a.last?.date||'').localeCompare(String(b.last?.date||''))).slice(0,count).map(({item})=>({...item,skill:skillOf(item),personal_review:true}));
}
