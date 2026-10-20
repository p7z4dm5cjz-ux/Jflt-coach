import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,recommendation} from '../engine.js';
import {practiceWindow,CHECK_LESSONS,newCheck,checkItems,checkResults} from '../grammar-checks.js';
import {practiceEvidence,progression} from '../evidence-policy.js';
import {learnerProfile} from '../learner-profile.js';
import {validateAssessment,validateInput,SHAPES,sanitizeCoach} from '../contract.js';
import {LESSONS} from '../catalog.js';
import {levelSequence,STARTING_LEVELS} from '../starting-level.js';
import {splitParagraphs,termContext} from '../reading-text.js';
import {applyVerification} from '../verification.js';
import {validateState} from '../storage.js';
function addBlock(s,lesson='past-simple',{correct=6,assisted=false,check='confirmed',skills=['form','meaning','use'],complete=true,sid='s'+s.sessions.length}={}){
 const items=Array.from({length:6},(_,i)=>({id:sid+'-'+i,stem:sid+' context '+i,kind:'completion',answer:'was',accept:['was'],options:[],why:'Past form.',skill:skills[i%skills.length],origin:'groq',check}));
 s.sessions.push({id:sid,lesson_id:lesson,source:'groq',items,answers:{},assisted:false,created_at:new Date().toISOString(),completed_at:null,training:{grammar_target:30,target:30,page:0,checked:complete?[0]:[],recovery:[],parent_id:null}});
 s.attempts.push(...items.map((item,i)=>({id:'a'+item.id,item_id:item.id,session_id:sid,lesson_id:lesson,stem:item.stem,answer:'was',correct:i<correct,assisted,source:'groq',date:new Date().toISOString()})));
 return items;
}
const assess=p=>({mode:'advance',focus:'meaning',reason:'Nuova prova di confronto.',goal:'Distingui i significati.',evidence_ids:p.evidence.filter(e=>e.source==='practice').slice(-6).map(e=>e.id),item_skills:['form','meaning','use','form','meaning','use']});
test('5/6 permits a harder block, 10/12 across skills permits progress; partial session never called complete',()=>{
 const s=freshState();addBlock(s,'past-simple',{correct:5});let p=learnerProfile(s,'past-simple');validateAssessment(assess(p),p);
 assert.equal(practiceWindow(s,'past-simple').goodSession,false);assert.equal(practiceWindow(s,'past-simple').independent,false);
 addBlock(s,'past-simple',{correct:5});p=learnerProfile(s,'past-simple');assert.equal(p.evidence.length,12);assert.equal(p.progression.ready,true);validateInput('exercises',{lesson_id:'past-simple',learner:p});
});
test('2 correct, 4/6, hinted, incomplete, unverified and form-only cannot certify progress',()=>{
 for(const opts of [{correct:2},{correct:4},{assisted:true},{complete:false},{check:'unchecked'}]){
  const s=freshState();addBlock(s,'past-simple',opts);const p=learnerProfile(s,'past-simple');assert.equal(p.progression.can_advance,false);assert.throws(()=>validateAssessment(assess(p),p));assert.equal(practiceWindow(s,'past-simple').independent,false);
 }
 const s=freshState();addBlock(s,'past-simple',{skills:['form']});addBlock(s,'past-simple',{skills:['form']});assert.equal(practiceWindow(s,'past-simple').independent,false);
});
test('Repeated contexts across sessions cannot certify transfer',()=>{
 const s=freshState();addBlock(s);addBlock(s);s.sessions[1].items.forEach((i,n)=>i.stem=s.sessions[0].items[n].stem);
 assert.equal(practiceEvidence(s,'past-simple').length,6);assert.equal(progression(practiceEvidence(s,'past-simple')).ready,false);
});
test('A1–C1 paths cover all lessons and B2 never falls back to A1 without evidence',()=>{
 const s=freshState();s.settings.starting_level='A1';assert.equal(new Set(levelSequence(s)).size,LESSONS.length);
 s.settings.starting_level='B2';for(const id of STARTING_LEVELS.find(l=>l.id==='B2').lessons){addBlock(s,id);addBlock(s,id);}
 assert.ok(!['sentence','nouns','articles'].includes(recommendation(s)[0].id));
 addBlock(s,'articles',{correct:0});assert.ok(recommendation(s).some(l=>l.id==='articles'&&l.status==='review'));
});
test('Related prerequisites carry observed results, never presumed mastery',()=>{
 const s=freshState();addBlock(s,'past-simple',{correct:3});const p=learnerProfile(s,'past-perfect-simple');
 assert.equal(p.related.find(r=>r.lesson_id==='past-simple').errors,3);assert.equal(p.evidence.length,0);validateInput('exercises',{lesson_id:'past-perfect-simple',learner:p});
});
test('Every lesson has a short check; reused practice is disclosed and backups retain it',()=>{
 assert.equal(CHECK_LESSONS.length,117);
 for(const l of LESSONS){const s=freshState(),c=newCheck(s,[l.id],l.id);assert.ok(c.item_ids.length>=2&&c.item_ids.length<=4,l.id);s.grammar_checks=[c];validateState(s);}
 const s=freshState(),c=newCheck(s,['inversion'],'inversion');assert.ok(checkItems(c).every(i=>i.practice_bank));
 const item=checkItems(c)[0];s.sessions=[{items:[item]}];const repeat=newCheck(s,['inversion'],'inversion');assert.ok(repeat.practice_reused_ids.includes(item.id));assert.ok(checkResults(repeat).find(i=>i.id===item.id).repeated);
});
test('Ambiguous open questions excluded; ordinary variants still accepted',()=>{
 const item={stem:'He ___ here.',answer:'works',accept:['works'],options:[]};
 assert.equal(applyVerification([item],{answers:[{n:1,best:'works',all_valid:['worked'],ambiguous:true}]}).items[0].doubt,true);
 assert.equal(applyVerification([item],{answers:[{n:1,best:'works',all_valid:[],ambiguous:false}]}).items[0].check,'confirmed');
});
test('Long sentences and paragraphs retain all content; context centres on the requested term',()=>{
 for(const text of ['a'.repeat(8000),('A long sentence without punctuation ').repeat(200),'First paragraph.\n\n'+('word ').repeat(1700)]){
  const parts=splitParagraphs(text);assert.ok(parts.every(p=>p.length<=3000));assert.equal(parts.join('').replace(/\s/g,''),text.replace(/\s/g,''));
 }
 const text='Opening '.repeat(500)+'The team will look into the complaint. End.';const ctx=termContext(text,'look into');assert.ok(ctx.includes('look into the complaint'));assert.ok(ctx.length<=1200);assert.throws(()=>termContext(text,'missing'));
});
test('Writing cannot be ready when any criterion is unmet or unassessed',()=>{
 const reply=structuredClone(SHAPES.writing_coach);reply.ready=true;assert.equal(sanitizeCoach(reply,'','review').ready,true);
 for(const key of ['content','organisation','grammar','register']){const r=structuredClone(reply);r.criteria[key].status='developing';assert.equal(sanitizeCoach(r,'','review').ready,false);}
 assert.equal(sanitizeCoach(reply,'','hint').ready,false);
});
