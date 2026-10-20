import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {JSDOM} from "jsdom";
import {IDBFactory} from "fake-indexeddb";
import {openRepository,parseBackup} from "../storage.js";
import {PHRASALS} from "../catalog.js";
import {QUESTIONS,orderedQuestions,adaptiveNext,newAdaptivePlacement} from "../placement.js";
import {VERSION,newPlacement,recommendation,localDay} from "../engine.js";
import {LESSONS} from "../catalog.js";
const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
const dom=new JSDOM(html,{url:"https://p7z4dm5cjz-ux.github.io/Jflt-coach/",pretendToBeVisual:true});
for(const [key,value] of Object.entries({window:dom.window,document:dom.window.document,location:dom.window.location,Node:dom.window.Node,navigator:dom.window.navigator,sessionStorage:dom.window.sessionStorage,localStorage:dom.window.localStorage}))Object.defineProperty(globalThis,key,{value,configurable:true});
dom.window.scrollTo=()=>{};
const {mountApp}=await import("../app.js"),repo=await openRepository(new IDBFactory());let calls=[],aiSerial=0,nextExerciseFailure=null,nextCoachFailure=null,coachGate=null;
const {SHAPES}=await import("../contract.js");
const tutor=async(settings,path,task,data)=>{
  calls.push({path,task,data});
  if(path==="/health")return {version:VERSION,groq_configured:true,capabilities:[]};
  if(path==="/check")return {provider_checked:true};
  if(task==="grammar_explain")return structuredClone(SHAPES.grammar_explain);
  if(task==="writing_coach"){if(nextCoachFailure){const error=nextCoachFailure;nextCoachFailure=null;throw error;}if(coachGate){const gate=coachGate;coachGate=null;await gate;}return {...structuredClone(SHAPES.writing_coach),ready:data.mode==="review"};}
  if(task==="writing_review")return {summary:"La cronologia è chiara.",priorities:["Controlla il passato.","<img src=x onerror=alert(1)>"],rubric:{grammar:"Un punto da correggere.",content:"Fatti completi.",cohesion:"Chiara.",register:"Adatto."},issues:[{quote:"Yesterday",correction:"Yesterday",explanation:"Controlla il tempo.",kind:"style",category:"past-simple"},{quote:"Not in source",correction:"Invented",explanation:"Da omettere",kind:"error",category:"tenses"}]};
  if(task==="writing_compare")return {summary:"Riscrittura più chiara.",resolved:["Cronologia chiarita."],remaining:[],transfer:Array.from({length:3},(_,i)=>({stem:"Completa la negativa: She ___ go yesterday. "+i,answer:"did not",accept:["didn't"],why:"Did richiede la forma base."}))};
  if(task==="exercises"){if(nextExerciseFailure){const error=nextExerciseFailure;nextExerciseFailure=null;throw error;}const serial=++aiSerial;return {items:Array.from({length:6},(_,i)=>({check:"confirmed",kind:["completion","transformation","error_correction"][i%3],stem:"Contesto "+serial+". Completa la negativa "+i+": They ___ leave yesterday.",options:[],answer:"did not",accept:["didn't"],why:"Forma: did not + verbo base. Perché: yesterday colloca l'azione nel passato. Evita did not went."}))};}
  if(task==="reading_understand")return structuredClone(SHAPES.reading_understand);
  if(task==="translate")return {translations:data.paragraphs.map(p=>"IT: "+p.slice(0,40))};
  if(task==="reading_review")return {summary:"Significato ricostruito.",segments:[{quote:"The team carried out",translation:"Il gruppo ha svolto",explanation:"Carry out indica eseguire."},{quote:"Invented quote",translation:"inventata",explanation:"non valida"}],terms:[{expression:"carried out",meaning_it:"ha svolto",example:"The team carried out a routine check."}]};
  if(task==="clarify")return {expression:data.term,meaning_it:"Significato nel passaggio",explanation:"Spiegazione contestuale.",example:"A new example."};
  if(task==="diagnosis")return structuredClone(SHAPES.diagnosis);
  throw new Error("Unexpected task "+task);
};
const app=await mountApp(repo,document.getElementById("view"),tutor);
async function until(fn){for(let i=0;i<200;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw new Error("UI timeout: "+document.getElementById("view").textContent.slice(0,180));}
async function visit(path){location.hash="#/"+path;await app.render();await new Promise(r=>setTimeout(r,0));}
function input(selector,value){const el=document.querySelector(selector);assert.ok(el,selector);el.value=value;el.dispatchEvent(new window.Event("input",{bubbles:true}));}
async function answerBlock(set,{wrongFirst=false}={}){
  await until(()=>{const input=document.querySelector(".exercise input");return input&&set.items.some(it=>it.id===(input.type==="radio"?input.name:input.id));});
  const fieldsets=[...document.querySelectorAll(".exercise")];
  for(const [index,block] of fieldsets.entries()){
    const control=block.querySelector("input"),item=set.items.find(it=>it.id===(control.type==="radio"?control.name:control.id));
    const value=wrongFirst&&index===0?"wrong answer":item.answer;
    if(control.type==="radio"){const radio=[...block.querySelectorAll("input")].find(el=>el.value===value);assert.ok(radio);radio.checked=true;radio.dispatchEvent(new window.Event("change",{bubbles:true}));}else input("#"+item.id,value);
  }
  await app.flush();document.querySelector("#practice-form").dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));
  await until(()=>document.querySelectorAll(".exercise-feedback").length===fieldsets.length);
}
function click(text){const el=[...document.querySelectorAll("#view button")].find(b=>b.textContent===text);assert.ok(el,text);el.click();}
test("L'avvio propone il pretest; tutte le lezioni e la ricerca phrasal restano accessibili",async()=>{assert.ok(document.getElementById("view").textContent.includes("Prima capiamo da dove iniziare"));assert.ok(document.getElementById("view").textContent.includes("15 minuti"));assert.equal(document.getElementById("view").textContent.includes("Negazioni senza cambiare"),false);await visit("studio");assert.equal(document.querySelectorAll(".lesson-card").length,117);input("#lesson-search","perfect");assert.ok(document.querySelectorAll(".lesson-card").length>5);await visit("phrasals");input("#phrasal-search","carry out");assert.equal(document.querySelectorAll(".lesson-card").length,1);});
test("Sessione AI valida con lessico omesso aggiunge tre recuperi locali",async()=>{await repo.change(s=>{s.vocabulary=PHRASALS.slice(0,3).map(t=>({...t,streak:0,seen:0,due:new Date(0).toISOString()}));});await visit("lesson/negatives");click("Genera 6 esercizi con il tutor");await until(()=>document.querySelectorAll(".exercise").length===9);const set=repo.get().sessions.at(-1);assert.equal(set.items.filter(i=>i.kind==="retrieval").length,3);assert.equal(calls.at(-1).task,"exercises");for(const i of set.items)input("#"+i.id,i.answer);await app.flush();document.querySelector("#practice-form").dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));await until(()=>!!repo.get().sessions.at(-1).completed_at);assert.equal(repo.get().attempts.filter(a=>a.correct).length,9);assert.ok(repo.get().vocabulary.every(v=>v.streak===1));});
test("Autosave conserva la bozza attraversando una navigazione immediata",async()=>{await visit("writing");click("Apri l'editor");await until(()=>!!document.querySelector("#draft"));input("#draft","Yesterday the team inspected the site and recorded the damage. No one was injured. A witness described a noise but had not seen anyone near the building. The area was secured while further checks were arranged.");await visit("home");await visit("writing/"+repo.get().writings.at(-1).id);assert.ok(document.querySelector("#draft").value.startsWith("Yesterday"));});
test("Revisione ancorata, testo ostile inerte e riscrittura con verifica",async()=>{click("Chiedi la revisione");await until(()=>!!document.querySelector("#rewrite"));assert.equal(document.querySelector("#view img"),null);assert.equal(repo.get().writings.at(-1).feedback.omitted,1);input("#rewrite",repo.get().writings.at(-1).draft);click("Confronta bozza e riscrittura");await until(()=>document.getElementById("notice").textContent.includes("modificare"));assert.equal(calls.at(-1).task,"writing_review");input("#rewrite",repo.get().writings.at(-1).draft+" The supervisor was informed at 09:10.");click("Confronta bozza e riscrittura");await until(()=>document.getElementById("view").textContent.includes("3. Confronto"));click("Verifica in un nuovo contesto");await until(()=>document.querySelectorAll(".exercise").length===3);const set=repo.get().sessions.at(-1);assert.ok(set.writing_id);for(const i of set.items)input("#"+i.id,"didn't");await app.flush();document.querySelector("#practice-form").dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));await until(()=>!!repo.get().sessions.at(-1).completed_at);await visit("writing/"+set.writing_id);assert.ok(document.getElementById("view").textContent.includes("0/0 corrette senza aiuti"));});
test("Pretest adattivo: una domanda alla volta, nessuna soluzione prima della fine",async()=>{await visit("placement");click("Inizia il pretest adattivo");await until(()=>document.querySelector("#placement-form"));
  let item,count=0;
  while((item=adaptiveNext(repo.get().placement))&&count<50){
    const f=document.querySelector("#placement-form");
    assert.ok(document.querySelector("legend").textContent.startsWith("Domanda "+(count+1)+" "));
    if(item.options){const opt=[...f.querySelectorAll('input[type="radio"]')].find(v=>v.value===item.answer);opt.checked=true;}else input("#placement-answer",item.answer);
    f.dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));
    count++;await until(()=>repo.get().placement.answers.length===count);
    if(adaptiveNext(repo.get().placement))assert.equal(document.getElementById("view").textContent.includes("Risposta di riferimento:"),false);
  }
  await until(()=>document.getElementById("view").textContent.includes(count+" risposte corrette su "+count));
  assert.ok(repo.get().placement.submitted_at);assert.equal(repo.get().placement.version,2);
  assert.ok(count>=20&&count<=30,"con tutte le risposte giuste e sicure bastano poche domande: "+count);
});
test("Un piano già iniziato resta distinto dalla priorità aggiornata dopo il pretest",async()=>{
  await repo.change(s=>s.daily_plans=[{id:"older-plan",day:localDay(),minutes:20,lesson_id:"negatives",term_ids:[],practice_id:null,writing_id:null,created_at:new Date().toISOString()}]);
  const next=recommendation(repo.get())[0];assert.notEqual(next.id,"negatives");await visit("home");assert.ok(document.querySelector(".current-priority").textContent.includes(next.title));assert.ok(document.querySelector(".hero").textContent.includes("Negazioni"));assert.ok(document.querySelector(".hero").textContent.includes("GIÀ INIZIATO"));
});
test("Lettura conserva traduzione e filtra citazioni inventate",async()=>{await visit("reading");click("Nuova lettura");await until(()=>!!document.querySelector("#reading-text"));input("#reading-text","The team carried out a routine inspection of the equipment before the next shift.");input("#translation","Il gruppo ha effettuato un controllo ordinario dell'attrezzatura prima del turno successivo.");click("Confronta la traduzione con Groq");await until(()=>document.getElementById("view").textContent.includes("Confronto ragionato"));assert.equal(repo.get().readings.at(-1).feedback.segments.length,1);});
test("Verifica Groq sempre presente, versioni separate",async()=>{await visit("settings");assert.ok([...document.querySelectorAll("button")].some(b=>b.textContent==="Verifica Groq"));click("Verifica collegamento Worker");await until(()=>document.getElementById("view").textContent.includes("risposta non ancora verificata"));click("Verifica Groq");await until(()=>document.getElementById("view").textContent.includes("Risposta verificata"));});
test("Tema scuro e tempo quotidiano sono persistiti senza cancellare bozze",async()=>{await visit("settings");const saved=repo.get().writings[0].draft;const theme=document.querySelector("#theme-preference");theme.value="dark";theme.dispatchEvent(new window.Event("change",{bubbles:true}));await until(()=>repo.get().settings.theme==="dark");assert.equal(document.documentElement.dataset.theme,"dark");await visit("home");assert.equal(document.documentElement.dataset.theme,"dark");assert.equal(repo.get().writings[0].draft,saved);await visit("settings");const minutes=document.querySelector("#daily-minutes");minutes.value="10";minutes.dispatchEvent(new window.Event("change",{bubbles:true}));await until(()=>repo.get().settings.daily_minutes===10);});
test("Piano quotidiano riprendibile e progresso live senza richieste AI",async()=>{
  await repo.change(s=>{s.placement=newPlacement();s.placement.answers=QUESTIONS.map(q=>({id:q.id,value:q.lessons.includes("negatives")?"":q.answer,confidence:"sure"}));s.placement.submitted_at=new Date().toISOString();s.daily_plans=[];s.attempts=[];s.vocabulary.forEach(v=>v.due=new Date(0).toISOString());});
  await visit("home");const before=calls.length;click("Inizia il piano di oggi");await until(()=>!!document.querySelector("#practice-form"));const set=repo.get().sessions.at(-1),plan=repo.get().daily_plans[0];assert.equal(set.items.filter(i=>i.kind==="retrieval").length,2);assert.ok(document.querySelector(".session-progress").textContent.includes("0 di "+set.items.length));
  input("#"+set.items[0].id,set.items[0].answer);assert.ok(document.querySelector(".session-progress").textContent.includes("1 di "+set.items.length));input("#"+set.items[0].id,"");assert.ok(document.querySelector(".session-progress").textContent.includes("0 di "+set.items.length));
  await visit("home");click("Riprendi il piano di oggi");await until(()=>!!document.querySelector("#practice-form"));assert.equal(repo.get().daily_plans.length,1);assert.equal(repo.get().daily_plans[0].practice_id,set.id);
  assert.equal(set.items.filter(it=>it.kind!=="retrieval").length,6);await answerBlock(repo.get().sessions.find(s=>s.id===set.id));await until(()=>!!repo.get().sessions.find(s=>s.id===set.id).completed_at);click("Passa alla breve scrittura");await until(()=>!!document.querySelector("#draft"));const writingId=repo.get().daily_plans[0].writing_id;assert.equal(repo.get().writings.find(w=>w.id===writingId).grammar_lesson_id,set.lesson_id);assert.ok(document.getElementById("view").textContent.includes("35 parole"));input("#draft","word ".repeat(35));await visit("home");assert.ok(document.querySelector(".daily-card").textContent.includes("2 di 2 attività svolte"));click("Rivedi la breve scrittura");await until(()=>!!document.querySelector("#draft"));assert.equal(repo.get().daily_plans[0].writing_id,writingId);assert.equal(repo.get().daily_plans[0].id,plan.id);assert.equal(calls.length,before);
});
test("Piano e preferenze sopravvivono al backup e al ripristino",async()=>{const backup=parseBackup(await repo.backup());assert.equal(backup.settings.theme,"dark");assert.equal(backup.daily_plans.length,1);await repo.replace(backup);await visit("home");assert.ok(document.querySelector(".daily-card").textContent.includes("2 di 2"));assert.equal(document.documentElement.dataset.theme,"dark");});
test("Sessione AI completa: trenta esercizi in cinque richieste esplicite, correzioni e ripresa",async()=>{
  await repo.change(s=>s.vocabulary.forEach(v=>v.due=new Date(Date.now()+86400000).toISOString()));await visit("lesson/past-simple");const before=calls.filter(c=>c.task==="exercises").length;
  click("Inizia 30 esercizi con il tutor");await until(()=>document.querySelector(".practice-step")?.textContent.startsWith("Blocco 1 di 5"));const id=repo.get().sessions.at(-1).id;
  assert.equal(document.querySelectorAll(".exercise").length,6);assert.equal(document.querySelectorAll(".exercise-feedback").length,0);assert.equal(repo.get().sessions.at(-1).items.length,6);
  for(let page=0;page<5;page++){
    const current=repo.get().sessions.find(s=>s.id===id);await answerBlock(current,{wrongFirst:page===0});assert.ok(document.getElementById("view").textContent.includes("Forma: did not"));
    if(page===0){await visit("home");assert.ok(document.getElementById("view").textContent.includes("Riprendi gli esercizi"));await visit("practice/"+id);assert.equal(repo.get().sessions.find(s=>s.id===id).training.checked.length,1);}
    if(page<4){click("Genera il blocco "+(page+2));await until(()=>repo.get().sessions.find(s=>s.id===id).training.page===page+1);await until(()=>document.querySelectorAll(".exercise-feedback").length===0);}
  }
  const saved=repo.get().sessions.find(s=>s.id===id);assert.equal(saved.items.length,30);assert.ok(saved.completed_at);assert.equal(repo.get().attempts.filter(a=>a.session_id===id).length,30);assert.equal(calls.filter(c=>c.task==="exercises").length-before,5);
  const second=calls.filter(c=>c.task==="exercises").slice(-4)[0];assert.equal(second.data.practice.block,2);assert.ok(second.data.recent_errors.some(e=>e.answer==="wrong answer"));assert.ok(second.data.already_seen.length>=6);
  await visit("practice/"+id);document.querySelector("#practice-form").dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));await app.flush();assert.equal(repo.get().attempts.filter(a=>a.session_id===id).length,30);
});
test("Quota sul blocco successivo conserva risposte e feedback: nessun retry automatico",async()=>{
  await visit("lesson/present-perfect-simple");click("Inizia 30 esercizi con il tutor");await until(()=>document.querySelector(".practice-step")?.textContent.startsWith("Blocco 1 di 5"));const id=repo.get().sessions.at(-1).id;await answerBlock(repo.get().sessions.at(-1));
  const count=calls.length,error=new Error("Quota simulata: riprova più tardi.");error.status=429;nextExerciseFailure=error;click("Genera il blocco 2");await until(()=>document.getElementById("notice").textContent.includes("Quota simulata"));
  let saved=repo.get().sessions.find(s=>s.id===id);assert.equal(calls.length,count+1);assert.equal(saved.items.length,6);assert.equal(saved.training.page,0);assert.deepEqual(saved.training.checked,[0]);assert.equal(Object.keys(saved.answers).length,6);assert.equal(document.querySelectorAll(".exercise-feedback").length,6);
  await visit("home");await visit("practice/"+id);click("Genera il blocco 2");await until(()=>repo.get().sessions.find(s=>s.id===id).training.page===1);saved=repo.get().sessions.find(s=>s.id===id);assert.equal(saved.items.length,12);assert.equal(saved.completed_at,null);
});
test("Riprova offline dopo un errore cambia la frase, conserva il punteggio e può essere ripetuta",async()=>{
  await visit("lesson/negatives");const before=calls.length;click("Esercizi offline");await until(()=>document.querySelector(".practice-step")?.textContent.startsWith("Blocco 1 di 5"));const parent=repo.get().sessions.at(-1);await answerBlock(parent,{wrongFirst:true});const originalAttempts=repo.get().attempts.filter(a=>a.session_id===parent.id).length;
  click("Rifai gli errori con frasi diverse");await until(()=>repo.get().sessions.at(-1).training.parent_id===parent.id);await until(()=>document.querySelector(".practice-step")?.textContent.startsWith("Blocco 1 di 1"));const retry=repo.get().sessions.at(-1);
  assert.ok(retry.assisted);assert.equal(retry.items.length,6);assert.ok(retry.items.every(it=>!parent.items.some(old=>old.stem===it.stem)));assert.ok(retry.items.every(it=>it.rule===parent.items[0].rule));await answerBlock(retry,{wrongFirst:true});assert.ok(repo.get().attempts.filter(a=>a.session_id===retry.id).every(a=>a.assisted));assert.equal(repo.get().attempts.filter(a=>a.session_id===parent.id).length,originalAttempts);assert.equal(calls.length,before);
  click("Rifai gli errori con frasi diverse");await until(()=>repo.get().sessions.at(-1).training.parent_id===retry.id);assert.ok(repo.get().sessions.at(-1).items.every(it=>!retry.items.some(old=>old.stem===it.stem)));
});
test("Riprova Groq riceve l'errore e mantiene la distinzione dalla verifica autonoma",async()=>{
  await visit("lesson/future-will");click("Genera 6 esercizi con il tutor");await until(()=>document.querySelector(".practice-step")?.textContent.startsWith("Blocco 1 di 1"));const parent=repo.get().sessions.at(-1);await answerBlock(parent,{wrongFirst:true});click("Rifai gli errori con Groq");await until(()=>repo.get().sessions.at(-1).training.parent_id===parent.id);const retry=repo.get().sessions.at(-1),data=calls.at(-1).data;
  assert.equal(retry.items.length,6);assert.ok(retry.assisted);assert.equal(data.practice.total,6);assert.equal(data.recent_errors.length,1);assert.equal(data.recent_errors[0].answer,"wrong answer");assert.ok(data.already_seen.includes(parent.items[0].stem));await answerBlock(retry);assert.ok(repo.get().attempts.filter(a=>a.session_id===retry.id).every(a=>a.assisted));
});
test("Studia con Groq: la lezione e il dubbio vengono inviati e la spiegazione resta dopo la navigazione",async()=>{
  await visit("lesson/present-perfect-simple");const before=calls.length;input("#grammar-question","Perché qui non uso il past simple?");click("Spiegami questa lezione");await until(()=>document.getElementById("view").textContent.includes("La spiegazione salvata"));assert.equal(calls.length,before+1);assert.equal(calls.at(-1).task,"grammar_explain");assert.equal(calls.at(-1).data.lesson_id,"present-perfect-simple");assert.ok(document.getElementById("view").textContent.includes("Come costruirla"));await visit("home");await visit("lesson/present-perfect-simple");assert.equal(calls.length,before+1);assert.ok(document.querySelector("#grammar-question").value.includes("past simple"));assert.equal(repo.get().lesson_studies.length,1);
});
test("Scrittura MISSION dal modello al nuovo saggio autonomo: sei tappe, aiuti distinti e conferma differita",async()=>{
  await visit("writing");click("Inizia · MISSION · costruire un saggio");await until(()=>!!document.querySelector(".prep-question"));const id=repo.get().writing_courses.at(-1).id,before=calls.length;
  assert.equal(document.querySelectorAll(".model-part").length,5);assert.equal(document.querySelector("#course-draft"),null);
  for(const [qid,value] of [["thesis",0],["form",2],["clause",2],["order",1],["register",0],["ending",2]]){const el=document.querySelector('input[name="prep-'+qid+'"][value="'+value+'"]');el.checked=true;el.dispatchEvent(new window.Event("change",{bubbles:true}));}
  await app.flush();click("Verifica il modello");await until(()=>!document.querySelector("#course-advance").disabled);assert.equal(calls.length,before);click("Passa al prossimo passo");await until(()=>document.querySelector(".course-map .current span")?.textContent==="2");
  const sentenceText="Practical training should complement classroom instruction.\nAn exercise can help trainees apply a procedure.\nHowever, practical sessions require preparation.",paragraph="Practical training should complement classroom instruction. An exercise can help trainees apply a procedure. For example, a short simulation allows them to practise explaining their choices. However, practical sessions require preparation and feedback.";
  input("#course-draft",sentenceText);click("Chiedi la revisione del passo");await until(()=>!!document.querySelector("#course-feedback"));assert.ok(calls.at(-1).data.text.includes("\n"));assert.equal(calls.at(-1).data.stage,1);input("#course-draft",sentenceText+" ");assert.ok(document.querySelector("#course-advance").disabled);assert.equal(document.querySelector("#course-feedback").dataset.stale,"true");click("Chiedi la revisione del passo");await until(()=>!document.querySelector("#course-advance").disabled);
  click("Passa al prossimo passo");await until(()=>document.querySelector(".course-map .current span")?.textContent==="3");
  for(const stage of [2,3]){input("#course-draft",paragraph);click("Chiedi la revisione del passo");await until(()=>!document.querySelector("#course-advance").disabled);click("Passa al prossimo passo");await until(()=>document.querySelector(".course-map .current span")?.textContent===String(stage+2));}
  assert.equal(document.querySelectorAll(".model-part").length,0);assert.ok(!document.getElementById("view").textContent.includes("Forme utili da studiare"));input("#course-draft",paragraph);input("#coach-question","Come formulo la richiesta?");click("Chiedi un piccolo aiuto");await until(()=>!!document.querySelector(".coach-hint"));click("Chiedi la revisione del passo");await until(()=>document.getElementById("view").textContent.includes("Serve una nuova consegna senza aiuti"));assert.ok(document.querySelector("#course-advance").disabled);
  const previous=calls.at(-1).data.topic;click("Prova una nuova consegna senza aiuti");await until(()=>repo.get().writing_courses.at(-1).rounds[4]===1);await until(()=>document.querySelector("#course-draft")?.value==="");input("#course-draft",paragraph);click("Chiedi la revisione del passo");await until(()=>!document.querySelector("#course-advance").disabled);assert.notEqual(calls.at(-1).data.topic,previous);click("Passa al prossimo passo");await until(()=>document.getElementById("view").textContent.includes("Ora lascia passare una giornata"));assert.equal(document.querySelector("#course-draft"),null);
  await repo.change(s=>s.writing_courses.find(c=>c.id===id).checks[4].completed_at=new Date(Date.now()-86400000).toISOString());await visit("home");assert.ok(document.getElementById("view").textContent.includes("Riprendi la scrittura passo passo"));await visit("course/"+id);input("#course-draft",paragraph);click("Chiedi la revisione del passo");await until(()=>!document.querySelector("#course-advance").disabled);assert.equal(calls.at(-1).data.stage,5);click("Concludi il percorso");await until(()=>!!repo.get().writing_courses.at(-1).completed_at);await until(()=>document.getElementById("view").textContent.includes("Percorso svolto"));const course=repo.get().writing_courses.at(-1);assert.equal(course.checks.length,6);assert.ok(course.reviews.some(r=>r.assisted));assert.equal(course.reviews.at(-1).assisted,false);assert.ok(course.archives.length);parseBackup(await repo.backup());
});
test("Errore Groq nel passo di scrittura conserva la bozza e non avanza né riprova automaticamente",async()=>{
  await visit("writing");click("Inizia · MISSION · redigere un rapporto");await until(()=>!!document.querySelector(".prep-question"));const id=repo.get().writing_courses.at(-1).id;input("#coach-question","Spiega il passato");nextCoachFailure=new Error("Quota del tutor simulata");const before=calls.length;click("Chiedi un piccolo aiuto");await until(()=>document.getElementById("notice").textContent.includes("Quota del tutor simulata"));assert.equal(calls.length,before+1);assert.equal(repo.get().writing_courses.at(-1).reviews.length,0);assert.equal(repo.get().writing_courses.at(-1).stage,0);await visit("home");await visit("course/"+id);assert.ok(document.querySelector(".prep-question"));
});
test("Una modifica durante la risposta AI resta salvata e la revisione si riferisce soltanto al testo inviato",async()=>{
  const id=repo.get().writing_courses.at(-1).id;await repo.change(s=>{const c=s.writing_courses.find(x=>x.id===id);c.preparation.answers={source:0,negative:2,past:1,order:0,register:2,tense:2};c.preparation.checked=true;c.checks=[{stage:0,round:0,text:"",review_id:null,completed_at:new Date().toISOString()}];c.stage=1;});await visit("course/"+id);
  const sent="I am writing about the document.\nIt arrived yesterday but it does not open.\nCould you send a PDF copy?";input("#course-draft",sent);let release;coachGate=new Promise(resolve=>release=resolve);const before=calls.length;click("Chiedi la revisione del passo");await until(()=>calls.length===before+1);input("#course-draft",sent+" Changed while waiting.");release();await until(()=>!document.getElementById("view").hasAttribute("aria-busy"));assert.equal(repo.get().writing_courses.at(-1).drafts[1],sent+" Changed while waiting.");assert.equal(repo.get().writing_courses.at(-1).reviews.at(-1).text,sent);assert.equal(document.querySelector("#course-feedback"),null);assert.ok(document.querySelector("#course-advance").disabled);parseBackup(await repo.backup());
});
test.after(()=>repo.close());
test("Nuove lezioni filtrabili, spiegazioni offline e sei esercizi locali senza richieste AI",async()=>{
  await visit("studio");const filter=document.querySelector("#stage-filter");filter.value="3";filter.dispatchEvent(new window.Event("change",{bubbles:true}));assert.equal(document.querySelectorAll(".lesson-card").length,LESSONS.filter(l=>l.stage===3).length);
  input("#lesson-search","accordo avanzato");assert.equal(document.querySelectorAll(".lesson-card").length,1);
  await repo.change(s=>s.vocabulary.forEach(t=>t.due=new Date(Date.now()+86400000).toISOString()));await visit("lesson/preferences");
  assert.ok(document.getElementById("view").textContent.includes("Approfondisci e usa la regola"));assert.ok(document.getElementById("view").textContent.includes("Altro soggetto" )||document.getElementById("view").textContent.includes("altro soggetto"));
  const before=calls.length;click("Esercizi offline");await until(()=>repo.get().sessions.at(-1)?.lesson_id==="preferences"&&document.querySelectorAll(".exercise").length===repo.get().sessions.at(-1).items.length);const set=repo.get().sessions.at(-1);assert.ok(set.items.length>=12,"esercizi storici più banca per competenza");assert.ok(set.items.some(i=>i.kind==="choice"));await answerBlock(set);await until(()=>!!repo.get().sessions.at(-1).completed_at);assert.equal(calls.length,before);assert.equal(repo.get().attempts.filter(a=>a.session_id===set.id&&a.correct).length,set.items.length);
});
test("Dalla grammatica al rapporto MISSION: focus salvato e ritorno alla bozza",async()=>{
  await visit("lesson/preferences");click("Usala nel percorso di scrittura");await until(()=>!!document.querySelector(".prep-question"));const c=repo.get().writing_courses.at(-1);
  assert.equal(c.unit_id,"mission-report");assert.equal(c.grammar_lesson_id,"preferences");
  await repo.change(s=>{const course=s.writing_courses.find(x=>x.id===c.id);course.drafts[0]="Bozza da conservare";});
  const returnLink=[...document.querySelectorAll('#view a')].find(a=>a.getAttribute('href')==="#/lesson/past-simple/"+c.id);assert.ok(returnLink);
  await visit("lesson/past-simple/"+c.id);assert.ok([...document.querySelectorAll('#view a')].some(a=>a.textContent==="Torna alla tua bozza salvata"));await visit("course/"+c.id);assert.equal(repo.get().writing_courses.at(-1).drafts[0],"Bozza da conservare");
  const restored=parseBackup(await repo.backup());assert.equal(restored.writing_courses.find(w=>w.id===c.id).grammar_lesson_id,"preferences");
});

test("Il laboratorio mostra scenari e consente di salvare due sensi di bring up",async()=>{
  await visit("phrasals");assert.ok(document.getElementById("view").textContent.includes("Mini-scenari"));input("#phrasal-search","bring up");assert.equal(document.querySelectorAll(".lesson-card").length,2);
  for(const id of ["pv-012","phrasal-sense-bring-up-child"]){await visit("word/"+id);click("Aggiungi al ripasso");await until(()=>repo.get().vocabulary.some(v=>v.id===id));}
  assert.equal(repo.get().vocabulary.filter(v=>v.expression==="bring up").length,2);
});
test("Verifica breve offline riprendibile: risposte salvate, correzione e backup",async()=>{
  const {checkItems}=await import("../grammar-checks.js");
  await visit("lesson/past-simple");const before=calls.length;click("Verifica breve · fino a 4 domande");await until(()=>location.hash.startsWith("#/checkpoint/")&&document.querySelectorAll("fieldset.exercise").length===4);
  const c=repo.get().grammar_checks.at(-1),items=checkItems(c);input("#"+items[0].id,items[0].answer);await visit("home");await visit("checkpoint/"+c.id);assert.equal(document.querySelector("#"+items[0].id).value,items[0].answer);
  for(const item of items)input("#"+item.id,item.answer);click("Consegna la verifica");await until(()=>document.getElementById("view").textContent.includes("4/4 risposte corrette"));assert.equal(calls.length,before);parseBackup(await repo.backup());
});
test("Mini-rivalutazione da dieci domande usa cinque aree e non avvia Groq",async()=>{
  await visit("studio");const before=calls.length;click("Inizia la verifica breve · 10 domande");await until(()=>document.querySelectorAll("fieldset.exercise").length===10);const c=repo.get().grammar_checks.at(-1);const {checkItems}=await import("../grammar-checks.js");const items=checkItems(c);assert.equal(new Set(items.map(i=>i.lesson_id)).size,5);
  for(const item of items)input("#"+item.id,item.answer);click("Consegna la verifica");await until(()=>document.getElementById("view").textContent.includes("10/10 risposte corrette"));assert.equal(calls.length,before);parseBackup(await repo.backup());
});
test("Una risposta AI contestata resta in attesa e viene esclusa dal punteggio valutabile",async()=>{
  await repo.change(s=>s.vocabulary.forEach(t=>t.due=new Date(Date.now()+86400000).toISOString()));
  await visit("lesson/past-simple");click("Genera 6 esercizi con il tutor");await until(()=>document.querySelectorAll(".exercise").length===6);const set=repo.get().sessions.at(-1);await answerBlock(set,{wrongFirst:true});click("La mia risposta potrebbe essere valida");await until(()=>document.getElementById("view").textContent.includes("5/5 corrette nelle risposte valutabili"));const disputed=repo.get().attempts.find(a=>a.session_id===set.id&&a.disputed);assert.ok(disputed);assert.equal(disputed.correct,false);parseBackup(await repo.backup());
});

test("Comprensione senza traduzione, parola selezionata e dizionario personale persistente",async()=>{
 await visit("reading");click("Nuova lettura");await until(()=>!!document.querySelector("#reading-text"));
 input("#reading-text","The officers have checked the gate.");input("#understand-selection","checked");await app.flush();click("Spiega il testo con Groq");
 await until(()=>document.getElementById("view").textContent.includes("Le parole nel loro contesto"));
 assert.equal(calls.at(-1).task,"reading_understand");assert.equal(calls.at(-1).data.selection,"checked");assert.equal(repo.get().readings.at(-1).translation,"");
 click("Salva nel dizionario personale");await until(()=>repo.get().vocabulary.some(v=>v.expression==="checked"));
 const word=repo.get().vocabulary.find(v=>v.expression==="checked");assert.equal(word.source_text,"The officers have checked the gate.");assert.ok(word.explanation);
 input("#reading-answer-0","Il cancello");await app.flush();const id=repo.get().readings.at(-1).id;
 await visit("home");await visit("reading/"+id);assert.equal(document.querySelector("#reading-answer-0").value,"Il cancello");
 input("#reading-text","A different text.");await app.flush();await visit("home");await visit("reading/"+id);assert.ok(document.getElementById("view").textContent.includes("passaggio precedente"));
 await visit("word/"+word.id);assert.ok(document.getElementById("view").textContent.includes("Dal testo originale"));assert.ok(document.querySelector("#word-meaning"));
});

test("1.9.0: testo e traduzione affiancati, divisi in richieste brevi, e lettura eliminabile",async()=>{
  await visit("reading");click("Nuova lettura");await until(()=>!!document.querySelector("#reading-text"));
  const id=location.hash.split("/")[2];
  const long=Array.from({length:40},(_,i)=>"Sentence number "+i+" describes the patrol and the gate in some detail.").join(" ");
  const text="The officers checked the gate.\n\nThe report was filed at noon.\n\n"+long+"\n\n"+long;
  input("#reading-text",text);await app.flush();
  const before=calls.filter(c=>c.task==="translate").length;
  click("Traduci con Groq");await until(()=>document.querySelector("#auto-translation")?.textContent.includes("IT: The officers"));
  const sent=calls.filter(c=>c.task==="translate").slice(before);
  assert.ok(sent.length>=2,"il testo lungo va diviso in più richieste");
  assert.ok(sent.every(c=>c.data.paragraphs.join("").length<=3200&&c.data.paragraphs.length<=40));
  const saved=repo.get().readings.find(r=>r.id===id).auto_translation;
  assert.equal(saved.paragraphs.length,saved.translations.length);assert.equal(saved.source_text,text);
  assert.ok(document.querySelector(".translate-panes .pane textarea#reading-text"));
  input("#reading-text",text+" Changed.");await app.flush();await visit("reading/"+id);
  assert.ok(document.getElementById("view").textContent.includes("la traduzione si riferisce alla versione precedente"));
  const original=window.confirm;window.confirm=()=>false;click("Elimina questa lettura");await new Promise(r=>setTimeout(r,20));
  assert.ok(repo.get().readings.some(r=>r.id===id));
  window.confirm=()=>true;click("Elimina questa lettura");await until(()=>!repo.get().readings.some(r=>r.id===id));
  window.confirm=original;
});
test("1.9.0: un testo scritto si elimina e i piani non puntano più a esso",async()=>{
  await visit("writing");click("Apri l'editor");await until(()=>!!document.querySelector("#draft"));
  const id=location.hash.split("/")[2];
  await repo.change(s=>{(s.daily_plans??=[]);});
  const original=window.confirm;window.confirm=()=>true;click("Elimina questo testo");await until(()=>!repo.get().writings.some(w=>w.id===id));window.confirm=original;
  assert.ok(!repo.get().daily_plans.some(p=>p.writing_id===id));
});

test("1.9.2: dopo il pretest l'app propone un percorso numerato con un solo punto di partenza",async()=>{
  await repo.change(s=>{s.placement=newPlacement();s.placement.answers=QUESTIONS.map(q=>({id:q.id,value:q.area==="negatives"||q.area==="patterns"?"":q.answer,confidence:"sure"}));s.placement.submitted_at=new Date().toISOString();s.daily_plans=[];s.attempts=[];s.grammar_checks=[];});
  const first=recommendation(repo.get())[0];
  await visit("placement");
  const card=document.querySelector(".learning-path-card");
  assert.ok(card,"manca il percorso nella pagina dei risultati");
  assert.equal(card.querySelectorAll(".path-steps li").length,5);
  assert.ok(card.querySelector(".path-steps li.current").textContent.includes(first.title));
  assert.match(card.textContent,/Nel pretest: \d+ rispost[ae] sbagliat[ae] su \d+ domand[ae]/);
  assert.ok([...card.querySelectorAll("a")].some(a=>a.textContent==="Inizia: "+first.title&&a.getAttribute("href")==="#/lesson/"+first.id));
  await visit("home");
  assert.ok(document.querySelector(".daily-card h2").textContent.includes(first.title),"il piano di oggi deve partire dalla stessa tappa");
  assert.ok(document.querySelector(".learning-path-card .path-steps li.current").textContent.includes(first.title));
  await visit("studio");
  assert.ok(document.querySelector(".learning-path-card .path-steps li.current").textContent.includes(first.title));
});

test("1.9.5: un pretest messo da parte con «Ripetere il pretest» si può ripristinare",async()=>{
  await repo.change(s=>{s.legacy=s.legacy||{};s.legacy.placement_history=[];s.placement=newPlacement();s.placement.answers=QUESTIONS.map(q=>({id:q.id,value:q.answer,confidence:"sure"}));s.placement.submitted_at=new Date().toISOString();});
  await visit("placement");
  const original=window.confirm;window.confirm=()=>false;click("Inizia un nuovo pretest adattivo");await new Promise(r=>setTimeout(r,50));
  assert.ok(repo.get().placement.submitted_at,"senza conferma la prova non si azzera");
  window.confirm=()=>true;click("Inizia un nuovo pretest adattivo");await until(()=>!repo.get().placement.submitted_at);window.confirm=original;
  await visit("placement");
  assert.match(document.getElementById("view").textContent,/Hai già un pretest completato.*45 risposte corrette su 45/s);
  await visit("home");assert.match(document.getElementById("view").textContent,/Hai già un pretest completato/);
  const button=[...document.querySelectorAll("button")].find(b=>b.textContent.startsWith("Ripristina il pretest del"));assert.ok(button);button.click();
  await until(()=>!!repo.get().placement.submitted_at);
  assert.equal(repo.get().legacy.placement_history.length,0,"la prova vuota appena avviata non va in archivio");
});

test("1.10.0: pretest adattivo con errori, diagnosi locale e diagnosi del tutor salvata",async()=>{
  await repo.change(s=>{s.placement=newAdaptivePlacement("diag");s.diagnoses=[];});
  let item,guard=0;
  while((item=adaptiveNext(repo.get().placement))&&guard++<50){const wrong=item.area==="negatives";await repo.change(s=>{s.placement.answers.push({id:item.id,value:wrong?"":item.answer,confidence:"sure"});});}
  await repo.change(s=>{s.placement.submitted_at=new Date().toISOString();});
  await visit("placement");
  const view=()=>document.getElementById("view").textContent;
  assert.match(view(),/Diagnosi/);assert.match(view(),/Negazioni e domande: /);assert.match(view(),/con «Non so»: sono lacune/);
  const before=calls.length;click("Chiedi la diagnosi al tutor");await until(()=>view().includes("L'analisi del tutor"));
  const call=calls.slice(before).find(c=>c.task==="diagnosis");assert.ok(call);assert.ok(call.data.errors.length>=3&&call.data.errors.every(e=>e.given===""));
  assert.equal(repo.get().diagnoses.length,1);assert.equal(repo.get().diagnoses[0].placement_started_at,repo.get().placement.started_at);
  const backup=parseBackup(await repo.backup());assert.equal(backup.diagnoses.length,1);
  assert.ok(document.querySelector(".learning-path-card .path-steps li.current"),"il percorso resta proposto");
});

test("1.10.1: si sceglie tra pretest adattivo e classico da 45 domande",async()=>{
  await repo.change(s=>{s.placement=null;});await visit("placement");
  const view=()=>document.getElementById("view").textContent;
  assert.match(view(),/Pretest adattivo · consigliato/);assert.match(view(),/Pretest classico/);
  click("Inizia il pretest classico");await until(()=>!!repo.get().placement);
  assert.equal(repo.get().placement.version,1);await until(()=>document.querySelector("legend")?.textContent.includes("di 45"));
  await repo.change(s=>{s.placement=null;});await visit("placement");click("Inizia il pretest adattivo");await until(()=>repo.get().placement?.version===2);
});

test("1.10.1: il pretest si interrompe salvando o uscendo senza salvare",async()=>{
  const view=()=>document.getElementById("view").textContent;
  const answerOne=async()=>{const item=adaptiveNext(repo.get().placement),f=document.querySelector("#placement-form"),n=repo.get().placement.answers.length;
    if(item.options)[...f.querySelectorAll('input[type="radio"]')].find(v=>v.value===item.answer).checked=true;else input("#placement-answer",item.answer);
    f.dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));await until(()=>repo.get().placement.answers.length===n+1);};
  // salva e riprendi
  await repo.change(s=>{s.placement=null;s.legacy=s.legacy||{};s.legacy.placement_history=[];});await visit("placement");click("Inizia il pretest adattivo");await until(()=>document.querySelector("#placement-form"));
  await answerOne();await answerOne();
  click("Interrompi il pretest");assert.equal(document.getElementById("pretest-exit").hidden,false);
  click("Salva e riprendi più tardi");await until(()=>view().includes("Riprendi il tuo pretest"));
  assert.equal(repo.get().placement.answers.length,2);assert.equal(repo.get().placement.submitted_at,null);
  // esci senza salvare: torna il pretest completato messo da parte
  await repo.change(s=>{s.placement=newAdaptivePlacement("done");let it;while(it=adaptiveNext(s.placement))s.placement.answers.push({id:it.id,value:it.answer,confidence:"sure"});s.placement.submitted_at=new Date().toISOString();});
  const doneStarted=repo.get().placement.started_at;
  await visit("placement");const original=window.confirm;window.confirm=()=>true;
  click("Inizia un nuovo pretest adattivo");await until(()=>!repo.get().placement.submitted_at);await until(()=>document.querySelector("#placement-form"));await answerOne();
  click("Interrompi il pretest");click("Esci senza salvare e termina");await until(()=>!!repo.get().placement?.submitted_at);window.confirm=original;
  assert.equal(repo.get().placement.started_at,doneStarted);assert.equal(repo.get().legacy.placement_history.length,0);
  // senza pretest precedente non resta nulla
  await visit("placement");await repo.change(s=>{s.placement=newAdaptivePlacement("x");});await visit("placement");window.confirm=()=>true;
  click("Interrompi il pretest");click("Esci senza salvare e termina");await until(()=>repo.get().placement===null);window.confirm=original;
});

test("1.12: spiegazione di un termine noto usa il contesto finale dell'articolo",async()=>{
 const id='reading-context-check',term=PHRASALS[0].expression,text='Opening text. '.repeat(150)+'The relevant sentence contains '+term+' in this context.';
 await repo.change(s=>s.readings.push({id,title:'Context',source:'',text,translation:'',feedback:null,created_at:new Date().toISOString()}));
 await visit('reading/'+id);input('#reading-term',term);const before=calls.length;click('Spiega nel contesto');await until(()=>calls.length>before&&document.getElementById('reading-meaning').value==='Significato nel passaggio');
 assert.equal(calls.at(-1).task,'clarify');assert.ok(calls.at(-1).data.context.includes('The relevant sentence'));assert.ok(calls.at(-1).data.context.includes(term));
});
