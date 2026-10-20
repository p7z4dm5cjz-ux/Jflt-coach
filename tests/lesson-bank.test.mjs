import test from "node:test";
import assert from "node:assert/strict";
import {LESSON_BANK,bankTrainItems,bankCheckItems} from "../lesson-bank.js";
import {LESSONS} from "../catalog.js";
import {grammarItems,lessonItems} from "../practice-bank.js";
import {CHECK_ITEMS} from "../grammar-checks.js";
import {correct,normal} from "../answer-normal.js";
import {practiceSkill,PRACTICE_SKILLS} from "../evidence-policy.js";

const lessons=Object.keys(LESSON_BANK);
const all=lessons.flatMap(id=>[...bankTrainItems(id),...bankCheckItems(id)].map(i=>({...i,lesson:id})));
const words=s=>normal(s).replace(/[.,!?;:"«»]/g," ").split(/\s+/).filter(Boolean).sort().join(" ");

test("1.13.0: la banca riguarda solo lezioni esistenti e ogni esercizio è completo",()=>{
  for(const id of lessons)assert.ok(LESSONS.some(l=>l.id===id),id);
  for(const i of all){
    assert.ok(PRACTICE_SKILLS.includes(i.skill),i.id+" competenza");
    assert.ok(i.stem.trim().length>10&&i.why&&i.why.trim().length>5,i.id+" consegna e spiegazione");
    assert.equal(practiceSkill(i),i.skill,i.id+" classificazione");
  }
});

test("1.13.0: scelte multiple con 3-4 opzioni diverse e una soluzione presente",()=>{
  for(const i of all.filter(i=>i.kind==="choice")){
    assert.ok(i.options.length>=3&&i.options.length<=4,i.id);
    assert.equal(new Set(i.options.map(normal)).size,i.options.length,i.id+" opzioni ripetute");
    assert.ok(i.options.includes(i.answer),i.id+" soluzione tra le opzioni");
    assert.match(i.stem,/Scegli/,i.id+" consegna");
  }
});

test("1.13.0: risposte aperte accettate dal correttore e coerenti con la consegna",()=>{
  for(const i of all.filter(i=>i.kind!=="choice")){
    for(const a of i.accept)assert.ok(correct(i,a),i.id+" accetta "+a);
    const n=i.answer.trim().split(/\s+/).length;
    if(/scrivi solo la parola mancante/i.test(i.stem))assert.equal(n,1,i.id+" una parola");
    if(/scrivi solo le parole mancanti/i.test(i.stem))assert.ok(n>=2,i.id+" più parole");
    if(i.skill==="word_order"){
      assert.match(i.stem,/^Metti le parole in ordine/,i.id);
      const chunks=i.stem.slice(i.stem.lastIndexOf(":")+1);
      assert.equal(words(chunks.replace(/\//g," ")),words(i.answer),i.id+" stesse parole");
    }else assert.match(i.stem,/^(Scrivi|Correggi|Riscrivi|Rendi|Trasforma)/,i.id+" istruzione iniziale");
    assert.doesNotMatch(i.stem,/lacuna|gruppo verbale|sintagma/i,i.id+" gergo");
  }
});

test("1.13.0: nessuna domanda ripetuta; le domande di verifica non compaiono nell'allenamento",()=>{
  const existing=new Set();
  for(const l of LESSONS)for(let v=0;v<4;v++){try{for(const i of grammarItems(l.id,v))existing.add(normal(i.stem));}catch{}}
  for(const i of CHECK_ITEMS.filter(i=>!i.id.startsWith("check-bank")))existing.add(normal(i.stem));
  const seen=new Set();
  // Le prove si contano per consegna: due esercizi con la stessa consegna varrebbero come uno solo.
  for(const i of all){const k=normal(i.stem);assert.ok(!seen.has(k),i.id+" ripetuta nella banca");assert.ok(!existing.has(k),i.id+" già presente altrove");seen.add(k);}
});

test("1.13.0: ogni lezione della banca permette di diventare autonoma offline",()=>{
  for(const id of lessons){
    const items=[...new Map(Array.from({length:4},(_,v)=>lessonItems(id,v)).flat().map(i=>[normal(i.stem),i])).values()];
    const skills=items.map(practiceSkill),count=s=>skills.filter(x=>x===s).length;
    assert.ok(items.length>=12,id+": almeno 12 esercizi distinti ("+items.length+")");
    assert.ok(count("form")>=2,id+" forma");
    assert.ok(count("meaning")+count("tense_choice")>=3,id+" significato o scelta");
    assert.ok(count("use")+count("word_order")>=3,id+" uso o ordine");
  }
});

test("1.13.0: tutte le 117 lezioni hanno la banca e una verifica con domande riservate",()=>{
  assert.equal(lessons.length,LESSONS.length);
  for(const l of LESSONS){
    const train=new Set([0,1,2,3].flatMap(v=>lessonItems(l.id,v)).map(i=>normal(i.stem)));
    const checks=CHECK_ITEMS.filter(i=>i.lesson_id===l.id);
    assert.ok(checks.length>=4,l.id+" almeno 4 domande di verifica");
    assert.ok(checks.every(i=>!i.practice_bank),l.id+" nessuna verifica presa dall'allenamento");
    assert.ok(checks.every(i=>!train.has(normal(i.stem))),l.id+" verifica separata dall'allenamento");
  }
});

test("1.13.0: una sola sessione offline completa e corretta basta per diventare autonoma, in ogni lezione e variante",async()=>{
  const {freshState}=await import("../engine.js"),{practiceWindow}=await import("../grammar-checks.js"),{learnerProfile}=await import("../learner-profile.js");
  for(const v of [0,1,2,3])for(const l of LESSONS){
    const s=freshState(),items=lessonItems(l.id,v),id="s-"+l.id,pages=Math.ceil(items.length/6);
    s.sessions.push({id,lesson_id:l.id,source:"local",items,answers:{},assisted:false,created_at:new Date().toISOString(),completed_at:new Date().toISOString(),training:{grammar_target:items.length,target:items.length,page:pages-1,checked:Array.from({length:pages},(_,i)=>i),recovery:[],parent_id:null}});
    s.attempts.push(...items.map(it=>({id:"a-"+it.id,item_id:it.id,session_id:id,lesson_id:l.id,stem:it.stem,answer:it.answer,correct:true,assisted:false,source:"local",date:new Date().toISOString()})));
    const p=learnerProfile(s,l.id);
    assert.equal(p.progression.ready,true,l.id+" variante "+v+" pronta");
    assert.equal(practiceWindow(s,l.id).independent,true,l.id+" variante "+v+" autonoma");
  }
});
