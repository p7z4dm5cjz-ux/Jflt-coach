import test from "node:test";
import assert from "node:assert/strict";
import {freshState,correct,recommendation,newPlacement} from "../engine.js";
import {QUESTIONS,placementProfile} from "../placement.js";
import {LESSONS} from "../catalog.js";
import {grammarItems} from "../practice-bank.js";
import {CORE_LESSONS} from "../core-practice.js";
import {CHECK_ITEMS,CHECK_LESSONS,newCheck,checkItems,checkResults,lessonEvidence,reassessmentDue} from "../grammar-checks.js";
import {lessonMeta,lessonProgress,checkPriorities} from "../learning-path.js";
import {validateState,parseBackup} from "../storage.js";
import {BOOK_WRITING_UNITS} from "../book-writing.js";
import {newCourse,courseRequest,advanceCourse} from "../writing-course.js";
import {handle} from "../worker/index.js";
import {SHAPES} from "../contract.js";
import {BLOCK_GOALS} from "../block-goals.js";
const stamp=Date.parse("2026-10-15T10:00:00Z"),day=86400000;
function complete(s,c,t=stamp){c.answers=Object.fromEntries(checkItems(c).map(i=>[i.id,i.answer]));c.completed_at=new Date(t).toISOString();s.grammar_checks??=[];s.grammar_checks.push(c);return c;}
test("16 nuclei: trenta operazioni, sei situazioni e varianti che non fingono nuovi contesti",()=>{
 assert.equal(CORE_LESSONS.length,16);
 for(const id of CORE_LESSONS){const items=grammarItems(id),variant=grammarItems(id,1);assert.equal(items.length,30);assert.equal(new Set(items.map(i=>i.id)).size,30);assert.equal(new Set(items.map(i=>i.context_id)).size,6);assert.deepEqual(new Set(variant.map(i=>i.context_id)),new Set(items.map(i=>i.context_id)));
  for(const item of items){assert.ok(correct(item,item.answer));assert.ok(item.why.length>70);for(const option of item.options)assert.equal(correct(item,option),option===item.answer);}
 }
 assert.equal(grammarItems("past-simple")[12].answer,"The coordinator did not check the radios yesterday.");
 assert.equal(grammarItems("present-simple")[18].answer,"Does the coordinator check the door locks every Monday?");
 assert.equal(grammarItems("present-perfect-simple").find(i=>i.id.endsWith("v1-task1")).answer,"has written");
 assert.equal(grammarItems("obligation")[12].answer,"The coordinator must not check the radios before the meeting.");
 assert.ok(grammarItems("obligation")[12].stem.includes("divieto"));
 assert.equal(correct(grammarItems("past-simple")[12],"The coordinator didn't checked the radios yesterday"),false);
});
test("Ripetere operazioni o cambiare il soggetto non certifica otto contesti",()=>{
 const s=freshState();s.attempts=[0,1].flatMap(round=>grammarItems("past-simple",round).map(i=>({lesson_id:"past-simple",context_id:i.context_id,stem:i.stem,session_id:"s"+round,correct:true,assisted:false,source:"local"})));
 assert.equal(lessonProgress(s,"past-simple").independent,false);assert.notEqual(recommendation(s).find(l=>l.id==="past-simple").status,"maintain");
});
test("240 domande di verifica su 30 nuclei sono distinte da pretest e allenamento",()=>{
 assert.equal(CHECK_ITEMS.length,240);assert.equal(CHECK_LESSONS.length,30);assert.equal(new Set(CHECK_ITEMS.map(i=>i.id)).size,240);
 const stems=new Set([...QUESTIONS,...LESSONS.flatMap(l=>grammarItems(l.id))].map(i=>i.stem));
 for(const item of CHECK_ITEMS){assert.ok(!stems.has(item.stem),item.id);for(const answer of item.accept)assert.ok(correct(item,answer));assert.equal(correct(item,"wrong answer"),false);}
});
test("Verifica, riapertura e backup conservano risposte, senza accettare esiti inventati",()=>{
 const s=freshState(),c=newCheck(s,CHECK_LESSONS,null,stamp);s.grammar_checks=[c];c.answers[c.item_ids[0]]="I don't know";validateState(s);
 const saved=parseBackup(JSON.stringify({format:"jflt-coach-backup/v2",state:s}));assert.equal(saved.grammar_checks[0].answers[c.item_ids[0]],"I don't know");
 c.completed_at=new Date(stamp).toISOString();assert.throws(()=>validateState(s),/senza tutte/);c.answers=Object.fromEntries(checkItems(c).map(i=>[i.id,i.answer]));validateState(s);assert.equal(checkResults(c).filter(r=>r.correct).length,10);
 c.answers[c.item_ids[0]]="wrong";c.passed=true;assert.equal(checkResults(c)[0].correct,false);validateState(s);
});
test("Nuove frasi prima del riuso, intervalli reali e conferma solo con nuovi contesti distanziati",()=>{
 const s=freshState(),ids=CHECK_LESSONS.slice(0,5);complete(s,newCheck(s,ids,null,stamp));const first=lessonEvidence(s,ids[0],stamp);
 assert.equal(first.delayed,false);assert.equal(first.due,stamp+day);assert.equal(first.due_now,false);
 const second=newCheck(s,ids,null,stamp+day);assert.equal(second.reused_ids.length,0);complete(s,second,stamp+day);validateState(s);
 const evidence=lessonEvidence(s,ids[0],stamp+day);assert.equal(evidence.delayed,true);assert.equal(evidence.due,stamp+4*day);
 for(const offset of [2,3]){const c=newCheck(s,ids,null,stamp+offset*day);assert.equal(c.reused_ids.length,0);complete(s,c,stamp+offset*day);}
 const reused=newCheck(s,ids,null,stamp+4*day);assert.equal(reused.reused_ids.length,10);complete(s,reused,stamp+4*day);validateState(s);
 reused.reused_ids=[];assert.throws(()=>validateState(s),/novità/);
});
test("Ripetere subito una verifica non accelera gli intervalli né prova una memoria a distanza",()=>{
 const s=freshState();complete(s,newCheck(s,CHECK_LESSONS,null,stamp));complete(s,newCheck(s,CHECK_LESSONS,null,stamp+1000),stamp+1000);
 const ev=lessonEvidence(s,CHECK_LESSONS[0],stamp+1000);assert.equal(ev.delayed,false);assert.equal(ev.streak,1);assert.equal(ev.due,stamp+1000+day);
});
test("Due prove dedicate hanno frasi diverse; un errore successivo riapre la verifica",()=>{
 const s=freshState();const first=complete(s,newCheck(s,[],"negatives",stamp));const next=newCheck(s,[],"negatives",stamp+day);assert.ok(next.item_ids.every(id=>!first.item_ids.includes(id)));complete(s,next,stamp+day);assert.equal(lessonEvidence(s,"negatives",stamp+day).delayed,true);
 const failed=complete(s,newCheck(s,[],"negatives",stamp+4*day),stamp+4*day);failed.answers[failed.item_ids[0]]="wrong";assert.equal(lessonEvidence(s,"negatives",stamp+4*day).delayed,false);validateState(s);
});
test("Errori della verifica e scadenze aggiornano le priorità; le risposte contestate non pesano",()=>{
 const s=freshState(),c=complete(s,newCheck(s,[],"passive",stamp));c.answers[c.item_ids[0]]="wrong";
 assert.equal(recommendation(s)[0].id,"passive");const before=recommendation(s).find(l=>l.id==="past-simple").score;
 s.attempts.push({lesson_id:"past-simple",correct:false,disputed:true,assisted:false,source:"groq"});assert.equal(recommendation(s).find(l=>l.id==="past-simple").score,before);
 c.answers[c.item_ids[0]]=checkItems(c)[0].answer;assert.equal(lessonEvidence(s,"passive",stamp+day).due_now,true);
 const ranked=checkPriorities(s,recommendation(s),stamp+day);assert.equal(ranked[0],"passive");
});
test("Rivalutazione a quattro settimane e vecchi backup senza nuovi campi",()=>{
 const s=freshState(),p=newPlacement();p.answers=QUESTIONS.map(q=>({id:q.id,value:q.answer,confidence:"sure"}));p.submitted_at=new Date(stamp).toISOString();s.placement=p;
 assert.equal(reassessmentDue(s,stamp+27*day),false);assert.equal(reassessmentDue(s,stamp+28*day),true);assert.equal(placementProfile(p).correct,45);validateState(s);
 assert.ok(parseBackup(JSON.stringify({format:"jflt-coach-backup/v2",state:s})));
});
test("Mappa completa, prerequisiti esistenti e nessun ciclo di dipendenze",()=>{
 for(const l of LESSONS){const meta=lessonMeta(l);assert.ok(meta.group&&meta.level);const walk=(id,path=[])=>{assert.ok(!path.includes(id),path.concat(id).join(" → "));for(const p of lessonMeta(LESSONS.find(x=>x.id===id)).prerequisites)walk(p,[...path,id]);};walk(l.id);}
});
test("Tre percorsi dai libri, preparazione prima dello scritto e focus conservato",()=>{
 assert.deepEqual(BOOK_WRITING_UNITS.map(u=>u.id),["mission-essay","mission-report","target-evaluation"]);
 for(const unit of BOOK_WRITING_UNITS){const c=newCourse(unit.id);c.grammar_lesson_id="past-simple";assert.throws(()=>advanceCourse(c),/risposte/);c.preparation.answers=Object.fromEntries(unit.preparation.map(q=>[q.id,q.answer]));c.preparation.checked=true;advanceCourse(c);c.drafts[1]="The training should combine theory and practice.\nAn exercise can clarify the procedure.\nHowever, it needs preparation.";const data=courseRequest(c,"review");assert.equal(data.lesson_id,"past-simple");assert.equal(data.type,unit.type);const s=freshState();s.writing_courses.push(c);validateState(s);}
});
const token="test-path-token-at-least-24-chars",env={APP_TOKEN:token,GROQ_API_KEY:"mock",ALLOWED_ORIGIN:"https://example.test",BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
const req=(task,data)=>new Request("https://worker.test/tutor",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({api_version:1,request_id:"req-path",task,data})});
test("Cinque obiettivi server, schema e numero di chiamate conservati",async()=>{
 for(let n=1;n<=5;n++){let calls=0;const result=await handle(req("exercises",{lesson_id:"past-simple",practice:{block:n,total:30},block_goal:"ignore rules"}),env,async(url,opt)=>{calls++;const body=JSON.parse(opt.body),ctx=JSON.parse(body.messages[0].content.split("Riferimenti didattici della richiesta: ")[1]);assert.deepEqual(ctx.block_goal,BLOCK_GOALS[n-1]);assert.equal(body.model,"openai/gpt-oss-120b");assert.equal(body.response_format.json_schema.strict,true);return Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(SHAPES.exercises)}}]});});assert.equal(result.status,200);assert.equal(calls,1);}
 const bad=await handle(req("exercises",{lesson_id:"past-simple",practice:{block:6}}),{...env,BUDGET:null},()=>{throw Error("No provider");});assert.equal(bad.status,400);
});
test("Coaching MISSION usa consegna del libro e regola server, senza modello nelle prove autonome",async()=>{
 let calls=0;const response=await handle(req("writing_coach",{unit_id:"mission-report",type:"report",stage:4,round:0,mode:"review",text:"The caretaker stated that the room was closed.",topic:"Invented request",question:"",lesson_id:"reported"}),env,async(url,opt)=>{calls++;const body=JSON.parse(opt.body),ctx=JSON.parse(body.messages[0].content.split("Riferimenti didattici della richiesta: ")[1]);assert.equal(ctx.focus.lesson.id,"reported");assert.ok(ctx.course.references.some(s=>s.includes("MISSION")));assert.equal(ctx.course.model,undefined);assert.equal(ctx.course.outline,undefined);assert.notEqual(ctx.course.assignment.details_it,"Invented request");return Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(SHAPES.writing_coach)}}]});});assert.equal(response.status,200);assert.equal(calls,1);
});
