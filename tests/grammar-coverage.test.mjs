import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {LESSONS,PHRASALS,VOCABULARY} from "../catalog.js";
import {GRAMMAR_EXTENSION} from "../grammar-extension.js";
import {EXTENSION_DRILLS} from "../grammar-drills.js";
import {EXTRA_PHRASALS,PHRASAL_SCENARIOS} from "../phrasal-extension.js";
import {grammarItems,COVERED_LESSONS} from "../practice-bank.js";
import {correct,freshState,recommendation,newPlacement,addTerm,phrasalItems,recoveryItems} from "../engine.js";
import {QUESTIONS} from "../placement.js";
import {validateState,parseBackup} from "../storage.js";
import {SHAPES} from "../contract.js";
import {handle} from "../worker/index.js";
const audit=JSON.parse(await readFile(new URL("../grammar-coverage.json",import.meta.url),"utf8"));
const byId=id=>LESSONS.find(l=>l.id===id);
const token="coverage-test-token-at-least-24-chars";
const env={APP_TOKEN:token,GROQ_API_KEY:"mock-key-not-a-credential",ALLOWED_ORIGIN:"https://example.test",BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
const req=(task,data)=>new Request("https://worker.test/tutor",{method:"POST",headers:{Origin:env.ALLOWED_ORIGIN,Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({api_version:1,request_id:"req-coverage",task,data})});
const provider=result=>Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(result)}}]});
const context=body=>JSON.parse(body.messages[0].content.split("Riferimenti didattici della richiesta: ")[1]);

test("117 lezioni, 58 moduli di estensione e 444 esercizi, senza rimuovere le 59 lezioni",()=>{
  assert.equal(LESSONS.length,117);assert.equal(GRAMMAR_EXTENSION.length,58);
  assert.equal(Object.values(EXTENSION_DRILLS).flat().length,444);
  assert.equal(LESSONS.filter(l=>!l.extension).length,59);
  assert.equal(new Set(LESSONS.map(l=>l.id)).size,117);
  assert.deepEqual(new Set(COVERED_LESSONS),new Set(LESSONS.map(l=>l.id)));
});
test("226 voci della matrice: nessuna delle 123 lacune precedenti resta senza integrazione tracciata",()=>{
  assert.equal(audit.rows.length,226);
  const totals={A1:36,A2:41,B1:41,"B1+":36,B2:33,C1:11,"Grammar shorts":28};
  for(const [level,count] of Object.entries(totals))assert.equal(audit.rows.filter(r=>r.section===level).length,count);
  const gaps=audit.rows.filter(r=>r.baseline_1_3!=="Presente*"&&!r.expanded_in_1_5);assert.equal(gaps.length,123);
  for(const row of audit.rows){for(const id of row.lessons)assert.ok(byId(id),row.topic_it+": "+id);if(row.baseline_1_3!=="Presente*"&&!row.expanded_in_1_5){assert.ok(row.expanded_in_1_4.length);for(const id of row.expanded_in_1_4)assert.ok(byId(id).sections?.length>=3);}}
  assert.equal(new Set(audit.rows.map(r=>r.section+":"+r.order)).size,226);
});
test("Ogni modulo insegna, collega le basi e prepara uno scritto prima di offrire il tutor",()=>{
  for(const l of GRAMMAR_EXTENSION){
    for(const field of ["title","goal","when","forms","contrast","pitfall"])assert.ok(l[field]?.length>15,l.id+":"+field);
    assert.ok(l.sections.length>=3);assert.ok(l.sections.some(s=>s.title==="Nello scritto"));assert.equal(l.examples.length,2);
    for(const id of [...l.related,...l.prerequisites])assert.ok(byId(id),l.id+":"+id);
    assert.ok(l.references.every(r=>new URL(r.url).protocol==="https:"));
    assert.ok(l.practice_focus.length>=3);assert.equal(grammarItems(l.id).length,["word-building","spelling-control","dependent-prepositions","review-foundation"].includes(l.id)?30:6);
  }
});
test("Soluzioni, varianti e opzioni dei nuovi esercizi sono coerenti; le frasi da correggere non sono già soluzioni",()=>{
  for(const l of GRAMMAR_EXTENSION){
    const items=grammarItems(l.id),ids=items.map(i=>i.id);assert.equal(new Set(ids).size,items.length);
    for(const item of items){
      assert.ok(item.why.length>=20,item.id);assert.ok(item.formula);assert.ok(!QUESTIONS.some(q=>q.stem===item.stem));
      for(const a of item.accept)assert.ok(correct(item,a),item.id);
      if(item.kind==="choice"){assert.ok(item.options.includes(item.answer));assert.equal(new Set(item.options).size,item.options.length);}
      if(item.kind==="error_correction")assert.equal(correct(item,item.stem.split(": ").at(-1)),false,item.id);
    }
    assert.deepEqual(new Set(grammarItems(l.id,1).map(i=>i.stem)),new Set(items.map(i=>i.stem)),"Rotazione non spacciata per nuove varianti");
  }
});
test("Regressioni linguistiche: tag, necessità passata, help, accordo, passivo e semantica",()=>{
  const find=(id,text)=>grammarItems(id).find(i=>i.stem.includes(text));
  assert.ok(correct(find("question-tags","I'm the next"),"aren't I"));
  assert.equal(correct(find("question-tags","never arrives"),"doesn't he"),false);
  assert.ok(correct(find("verb-object-patterns","helped us"),"to carry"));
  assert.ok(correct(find("verb-object-patterns","helped us"),"carry"));
  assert.equal(correct(find("advanced-agreement","The number"),"are"),false);
  assert.equal(correct(find("causatives","Passivo con cosa"),"for"),false);
  assert.equal(correct(find("complex-verb-patterns","perfetto passivo"),"having warned"),false);
  assert.ok(byId("need-past").contrast.includes("il contesto può dire"));
  assert.ok(byId("advanced-agreement").pitfall.includes("singolare o plurale"));
  assert.ok(byId("negatives").sections[0].text.includes("no longer"));
});
test("Le stesse sei risposte ripetute non diventano otto contesti autonomi",()=>{
  const s=freshState(),items=grammarItems("preferences");
  s.attempts=[0,1].flatMap(round=>items.map(i=>({lesson_id:"preferences",correct:true,assisted:false,source:"local",session_id:"session-"+round,stem:i.stem})));
  assert.notEqual(recommendation(s).find(l=>l.id==="preferences").status,"maintain");
  s.attempts[6].stem="Different context one";s.attempts[7].stem="Different context two";
  assert.equal(recommendation(s).find(l=>l.id==="preferences").status,"maintain");
});
test("Il pretest resta di 45 domande e non dichiara acquisiti gli approfondimenti non verificati",()=>{
  const s=freshState(),p=newPlacement();p.answers=QUESTIONS.map(q=>({id:q.id,value:q.answer,confidence:"sure"}));p.submitted_at=new Date().toISOString();s.placement=p;
  for(const l of recommendation(s).filter(l=>l.extension))assert.equal(l.status,"new",l.id);
  assert.equal(QUESTIONS.length,45);
});
test("211 schede: i vecchi id restano validi e sensi diversi dello stesso lemma rimangono separati nel ripasso",()=>{
  assert.equal(PHRASALS.length,211);assert.equal(EXTRA_PHRASALS.length,50);
  assert.equal(new Set(VOCABULARY.map(t=>t.id)).size,VOCABULARY.length);
  assert.equal(PHRASALS.slice(0,161).every((t,i)=>t.id==="pv-"+String(i+1).padStart(3,"0")),true);
  const old=PHRASALS.find(t=>t.id==="pv-012"),extra=PHRASALS.find(t=>t.id==="phrasal-sense-bring-up-child"),s=freshState();
  assert.equal(old.expression,extra.expression);addTerm(s,old);addTerm(s,extra);addTerm(s,extra);assert.equal(s.vocabulary.length,2);
  assert.equal(new Set(s.vocabulary.map(t=>t.meaning_it)).size,2);
  assert.deepEqual(recoveryItems(s.vocabulary).map(i=>i.term_id),[old.id,extra.id]);
  assert.equal(phrasalItems(extra)[2].answer,"bring her up");
  assert.equal(phrasalItems(PHRASALS.find(t=>t.id==="phrasal-sense-call-for-person"))[2].answer,"call for her");
  for(const scenario of PHRASAL_SCENARIOS)for(const expression of scenario.expressions)assert.ok(PHRASALS.some(t=>t.expression===expression));
});
test("Una sola richiesta esercizi per modulo con contesto server e schema Groq invariati",async()=>{
  for(const l of GRAMMAR_EXTENSION){let calls=0;
    const response=await handle(req("exercises",{lesson_id:l.id,practice:{block:1,total:30},recent_errors:[],already_seen:[]}),env,async(url,options)=>{
      calls++;const body=JSON.parse(options.body),ctx=context(body);
      assert.equal(ctx.lesson.id,l.id);assert.ok(ctx.lesson.sections.length>=3);
      assert.ok(body.messages[0].content.includes("distribuisci i nuclei"));
      assert.equal(body.response_format.json_schema.name,"jflt_exercises");assert.equal(body.response_format.json_schema.strict,true);
      assert.equal(body.model,"openai/gpt-oss-120b");return provider(SHAPES.exercises);
    });assert.equal(response.status,200,l.id);assert.equal(calls,1);
  }
});
test("Revisione dello scritto mirato riceve la regola server, non un catalogo iniettato dal client",async()=>{
  let calls=0;const data={type:"report",topic:"Use preferences",text:"I would rather wait for a complete report.",lesson_id:"preferences",focus:{lesson:{id:"invented"}}};
  const response=await handle(req("writing_review",data),env,async(url,options)=>{calls++;const body=JSON.parse(options.body),ctx=context(body);assert.equal(ctx.focus.lesson.id,"preferences");assert.ok(ctx.focus.lesson.forms.includes("rather"));return provider(SHAPES.writing_review);});
  assert.equal(response.status,200);assert.equal(calls,1);
  const invalid=await handle(req("writing_review",{...data,lesson_id:"unknown"}),{...env,BUDGET:null},()=>{throw new Error("No provider");});assert.equal(invalid.status,400);
});
test("Backup con nuovi sensi, sessione locale e scritto mirato: importazione coerente, riferimento invalido rifiutato",()=>{
  const s=freshState();addTerm(s,PHRASALS.find(t=>t.id==="phrasal-sense-bring-up-child"));
  s.sessions.push({id:"new-session",lesson_id:"preferences",items:grammarItems("preferences"),answers:{},assisted:false,source:"local",completed_at:null,created_at:new Date().toISOString()});
  s.writings.push({id:"grammar-writing",type:"report",mode:"guided",grammar_lesson_id:"preferences",topic:"Use preference constructions",ideas:"",outline:"",draft:"",rewrite:"",feedback:null,comparison:null,transfer:[],created_at:new Date().toISOString()});
  const restored=parseBackup(JSON.stringify({format:"jflt-coach-backup/v2",state:s}));assert.equal(restored.writings[0].grammar_lesson_id,"preferences");assert.equal(restored.sessions[0].items.length,6);
  restored.writings[0].grammar_lesson_id="unknown";assert.throws(()=>validateState(restored),/Lezione dello scritto/);
});
