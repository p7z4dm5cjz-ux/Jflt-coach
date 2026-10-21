import test from "node:test";
import assert from "node:assert/strict";
import {LESSONS} from "../catalog.js";
import {lessonItems} from "../practice-bank.js";
import {negativeItems} from "../negative-bank.js";
import {CHECK_ITEMS} from "../grammar-checks.js";
import {lessonRules,ruleInfo,tagFor,stemKey,LESSON_RULES} from "../item-tags.js";
import {audit,lessonPool} from "../scripts/tags-report.mjs";
import {validateState} from "../storage.js";
import {freshState} from "../engine.js";

const valid=(t,where)=>{
  assert.ok(t,where+": senza regola");
  assert.ok(Number.isInteger(t.level)&&t.level>=1&&t.level<=5,where+": livello "+t.level);
  assert.ok(t.rules.length>=1&&t.rules.length<=4,where+": regole");
  for(const r of t.rules)assert.ok(ruleInfo(r),where+": regola sconosciuta "+r);
};

test("1.15.0: ogni lezione ha da 2 a 12 regole complete e distinte",()=>{
  assert.deepEqual(Object.keys(LESSON_RULES).sort(),LESSONS.map(l=>l.id).sort());
  for(const l of LESSONS){
    const rules=lessonRules(l.id);
    assert.ok(rules.length>=2&&rules.length<=12,l.id+": "+rules.length+" regole");
    assert.equal(new Set(rules.map(r=>r.key)).size,rules.length,l.id+": chiavi ripetute");
    for(const r of rules)assert.ok(r.name.length>=3&&r.test.length>10&&r.pitfall.length>3,r.id+" incompleta");
  }
});

test("1.15.0: ogni esercizio offline e ogni verifica hanno regola e livello validi",()=>{
  let n=0;
  for(const l of LESSONS)for(let v=0;v<8;v++)for(const i of lessonItems(l.id,v)){valid(i.rules?{rules:i.rules,level:i.level}:null,l.id+" | "+i.stem);n++;}
  for(const i of CHECK_ITEMS){valid(i.rules?{rules:i.rules,level:i.level}:null,"verifica "+i.id);n++;}
  for(let v=0;v<8;v++)for(const i of negativeItems(v))assert.ok(i.rules[0].startsWith("negatives."),i.stem);
  assert.ok(n>10000);
});

test("1.15.0: registro senza esercizi mancanti, tag orfani o impronte in conflitto",()=>{
  const {missing,orphans}=audit();
  assert.deepEqual(missing,[],"esercizi senza tag");
  assert.deepEqual(orphans,[],"tag che non corrispondono più a un esercizio");
  for(const l of LESSONS){const keys=lessonPool(l.id).map(i=>stemKey(i.stem));assert.equal(new Set(keys).size,keys.length,l.id+": impronte in conflitto");}
});

test("1.15.0: i modelli etichettano forma, negativa, domanda e significato dell'alternativa",()=>{
  const items=lessonItems("past-simple",0),by=k=>items.filter(i=>i.rules.includes("past-simple."+k));
  assert.ok(by("form").length&&by("neg").length&&by("q").length);
  const meaning=items.filter(i=>i.kind==="choice"&&i.focus_lesson);
  assert.ok(meaning.length&&meaning.every(i=>i.rules[0]===i.focus_lesson+(i.level===2?".contrast":".use")));
  assert.ok(meaning.some(i=>i.level===1)&&meaning.some(i=>i.level===2));
});

test("1.15.0: regole e livello salvati nelle sessioni superano la validazione del backup",()=>{
  const s=freshState(),items=lessonItems("articles",0).slice(0,12);
  s.sessions.push({id:"s",lesson_id:"articles",source:"local",items:items.map((it,i)=>({...it,id:"i"+i,accept:it.accept||[it.answer],options:it.options||[]})),answers:{},assisted:false,created_at:new Date().toISOString(),completed_at:null});
  assert.doesNotThrow(()=>validateState(s));
  s.sessions[0].items[0].level=9;assert.throws(()=>validateState(s),/livello/);
});
