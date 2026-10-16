import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {correct,normal,phrasalItems,recoveryItems,freshState} from "../engine.js";
import {grammarItems} from "../practice-bank.js";
import {negativeItems} from "../negative-bank.js";
import {PHRASALS,LESSONS} from "../catalog.js";
import {EXTRA_PHRASALS,PARTICLE_ALTERNATIVES} from "../phrasal-extension.js";
import {parseBackup} from "../storage.js";
const item=(lesson,needle)=>{const i=grammarItems(lesson).find(i=>i.stem.includes(needle));assert.ok(i,lesson+": "+needle);return i;};

test("Can not richiede parole complete: notice, notify e note non si fondono con can",()=>{
  for(const [sentence,merged] of [["I can notice the difference","I cannotice the difference"],["She can notify us","She cannotify us"],["We can note the time","We cannote the time"]]){
    assert.equal(normal(sentence),sentence.toLowerCase());assert.ok(correct({answer:sentence},sentence));assert.equal(correct({answer:sentence},merged),false);
  }
  for(const text of ["I can not wait","I can  not wait","I can\tnot wait"])assert.ok(correct({answer:"I cannot wait"},text),text);
  assert.notEqual(normal("I can not only wait"),normal("I cannot only wait"));
});
test("Punteggiatura seguita da spazi o a capo non rende errata una risposta valida",()=>{
  const i=item("nouns","an advice");
  for(const a of ["She gave me advice. "," She gave me advice.\n","She gave me advice!\t"])assert.ok(correct(i,a),a);
  assert.equal(correct(i,"She gave me an advice. "),false);
});
test("Put off e hold off non propongono più una traduzione sinonima come distrattore",()=>{
  for(const id of ["pv-110","pv-158"]){const term=PHRASALS.find(t=>t.id===id);
    for(let v=0;v<PHRASALS.length;v++){
      const i=phrasalItems(term,v)[0];assert.equal(i.options.length,3);assert.equal(new Set(i.options).size,3);
      assert.equal(i.options.filter(option=>option===term.meaning_it).length,1);
      assert.equal(i.options.includes(id==="pv-110"?"rinviare un'azione":"rimandare"),false,id);
    }
  }
});

test("Advice non numerabile: la correzione minima e le varianti non sono errori",()=>{
  const i=item("nouns","an advice");
  for(const answer of ["She gave me advice.","She gave me some advice","She gave me a piece of advice","She gave me a bit of advice"])assert.ok(correct(i,answer),answer);
  for(const answer of ["She gave me an advice","She gave me advices","She gives me advice"])assert.equal(correct(i,answer),false,answer);
});
test("Condizionale misto: risultato presente semplice e in corso, senza accettare un passato diverso",()=>{
  const i=item("mixed-conditionals","had repaired");
  for(const a of ["would work","would be working"])assert.ok(correct(i,a),a);
  for(const a of ["would have worked","will work","would working"])assert.equal(correct(i,a),false,a);
});
test("Admit accetta gerundio semplice/perfetto, con o senza to preposizionale",()=>{
  const i=item("reporting-patterns","admitted");
  for(const a of ["using","having used","to using","to having used"])assert.ok(correct(i,a),a);
  for(const a of ["to use","used","having use"])assert.equal(correct(i,a),false,a);
});
test("Contrazioni modali di have, anche con apostrofo tipografico: la flessione resta controllata",()=>{
  for(const modal of ["should","might","would","could","must"]){
    const i={answer:modal+" have called"};assert.ok(correct(i,modal+"'ve called"));assert.ok(correct(i,modal+"’ve called."));
    assert.equal(correct(i,modal+"'ve call"),false);assert.equal(correct(i,modal+" of called"),false);
  }
  assert.ok(correct({answer:"shall not leave"},"shan't leave"));
  assert.ok(correct({answer:"cannot be"},"can not be"));
  assert.notEqual(normal("can not only wait"),normal("cannot only wait"));
  assert.equal(correct({answer:"She did not go"},"She didn't went"),false);
});
test("Varianti valide e forme specificamente richieste sono verificate con risposte indipendenti",()=>{
  const cases=[
    ["adjective-patterns","is / she","Usually, she is early"],
    ["adjective-patterns","she / usually / arrives","She arrives early, usually"],
    ["other-another","Some visitors","the others"],
    ["preferences","I'd prefer","to stay"],
    ["verb-pattern-meaning","I remember","having saved"],
    ["advanced-present","Council","approves"],
    ["passive","They repaired","The camera got repaired"],
    ["participles","the report","After finishing"],
    ["mixed","She asked","She asked me where I worked"],
    ["so-such","so faint","—"]
  ];
  for(const [lesson,stem,a] of cases)assert.ok(correct(item(lesson,stem),a),lesson+": "+a);
  assert.equal(correct(item("preferences","I'd prefer"),"stay"),false);
  assert.equal(correct(item("preferences","I'd prefer"),"staying"),false,"La consegna specifica l'infinito con to");
  assert.equal(correct(item("mixed","She asked"),"She asked me where I work"),false,"La consegna conserva il past simple");
});
test("Sei consegne prima risolvibili per copia ora richiedono una trasformazione o forma da scegliere",()=>{
  const cases=[
    ["imperatives-requests","proposta con shall","Shall we start the briefing?","Shall"],
    ["mixed-conditionals","mantenendo should","Should you need help, call us","Should"],
    ["advanced-will-would-should","mantenendo should","Should you need assistance, contact reception","Should"],
    ["generic-reciprocal","sostituendo solo he","If someone needs help, they can call us","they"],
    ["advanced-word-order","iniziando con Here","Here they come","they"]
  ];
  for(const [lesson,stem,a,incomplete] of cases){const i=item(lesson,stem);assert.ok(correct(i,a));assert.equal(correct(i,incomplete),false);}
  const unreal=item("advanced-past","as if");assert.ok(correct(unreal,"were"));assert.equal(/were/i.test(unreal.stem),false);
});
test("L'ordine neutro è una trasformazione, non un'accusa di errore alla frase possibile",()=>{
  const i=item("adjective-patterns","carefully alla fine");assert.equal(i.kind,"transformation");assert.ok(correct(i,"She checked the label carefully"));
});
test("Ogni frase locale dichiarata da correggere contiene una differenza rispetto alle soluzioni",()=>{
  const items=[...LESSONS.flatMap(l=>grammarItems(l.id)),...Array.from({length:8},(_,v)=>negativeItems(v)).flat()];
  for(const i of items.filter(i=>i.kind==="error_correction")){
    const source=i.stem.slice(i.stem.indexOf(":")+1).trim();assert.equal(correct(i,source),false,i.id);
  }
});
test("Luci spente: go out valido nel completamento; go on non lo è",()=>{
  const term=PHRASALS.find(t=>t.id==="phrasal-sense-go-off-light"),i=phrasalItems(term)[1];
  assert.ok(correct(i,"off"));assert.ok(correct(i,"out"));assert.equal(correct(i,"on"),false);
  assert.ok(i.why.includes("go out"));assert.equal(term.meaning_it,"spegnersi una luce");
  // Il richiamo della scheda ha una consegna distinta e domanda proprio la voce studiata.
  assert.ok(recoveryItems([term])[0].stem.includes("della scheda studiata"));
});
test("Completamenti phrasal: coppie note di sinonimi, senza accettare un senso diverso",()=>{
  const cases=[["pv-044","out"],["pv-045","in"],["pv-050","on with"],["pv-121","out"],["pv-117","off"],["phrasal-sense-get-along","on"],["phrasal-sense-knock-down-person","over"]];
  for(const [id,a] of cases)assert.ok(correct(phrasalItems(PHRASALS.find(t=>t.id===id))[1],a),id);
  for(const id of Object.keys(PARTICLE_ALTERNATIVES))assert.ok(PHRASALS.some(t=>t.id===id),id);
  assert.equal(correct(phrasalItems(PHRASALS.find(t=>t.id==="pv-113"))[1],"out"),false,"put together non è put out");
});
test("50 nuove schede: alternative curate e stabili in tutti i giri di variazione",()=>{
  assert.equal(EXTRA_PHRASALS.length,50);
  for(const term of EXTRA_PHRASALS){
    assert.equal(term.meaning_distractors.length,2,term.id);const expected=new Set([term.meaning_it,...term.meaning_distractors]);assert.equal(expected.size,3,term.id);
    for(let v=0;v<PHRASALS.length;v++)assert.deepEqual(new Set(phrasalItems(term,v)[0].options),expected,term.id);
  }
  const pair=PHRASALS.find(t=>t.id==="phrasal-sense-break-up-relationship");assert.equal(phrasalItems(pair)[0].options.includes("separarsi in una relazione"),false);
  const matching=PHRASALS.find(t=>t.id==="phrasal-sense-go-with-match");assert.equal(phrasalItems(matching)[0].options.includes("stare bene insieme"),false);
});
test("Il dato personale viene omesso sia nei materiali sia nel Worker generato",async()=>{
  const data=await readFile(new URL("../data.js",import.meta.url),"utf8"),worker=await readFile(new URL("../worker/index.js",import.meta.url),"utf8");
  const row=data.split("\n").find(l=>l.includes('E(27, "MISSION", "39-40"'));
  assert.equal((row.match(/\[nome omesso\]/g)||[]).length,2);
  assert.equal(/Tpr\.\s+[A-Z][a-z]+/.test(row),false);assert.equal(/Tpr\.\s+[A-Z][a-z]+/.test(worker),false);
});
test("Le nuove risposte e il lessico con alternative si salvano senza cambiare il formato di backup",()=>{
  const s=freshState();const term=EXTRA_PHRASALS.find(t=>t.id==="phrasal-sense-go-off-light");
  s.vocabulary=[{...term,added_at:new Date().toISOString(),due:new Date().toISOString(),seen:0,streak:0,last_correct:null}];
  const i=phrasalItems(term)[1];s.sessions=[{id:"new-variants",lesson_id:"vocabulary",items:[i],answers:{[i.id]:"out"},assisted:false,source:"local",completed_at:null,created_at:new Date().toISOString()}];
  const restored=parseBackup(JSON.stringify({format:"jflt-coach-backup/v2",state:s}));assert.ok(correct(restored.sessions[0].items[0],"out"));assert.equal(restored.vocabulary[0].meaning_distractors.length,2);
});
