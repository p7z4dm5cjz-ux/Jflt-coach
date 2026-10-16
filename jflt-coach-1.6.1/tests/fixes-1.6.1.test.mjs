import test from "node:test";
import assert from "node:assert/strict";
import {correct,phrasalItems} from "../engine.js";
import {EXTENSION_DRILLS,extensionItems} from "../grammar-drills.js";
import {negativeItems} from "../negative-bank.js";
import {grammarItems} from "../practice-bank.js";
import {coreItems,CORE_LESSONS} from "../core-practice.js";
import {CHECK_ITEMS} from "../grammar-checks.js";
import {PHRASALS} from "../catalog.js";
import {MEANING_GROUPS} from "../phrasal-extension.js";
import {BOOK_WRITING_UNITS} from "../book-writing.js";
import {QUESTIONS} from "../placement.js";

const drills=Object.keys(EXTENSION_DRILLS).flatMap(k=>extensionItems(k,0));
const negatives=[0,1,2,3,4,5,6,7].flatMap(v=>negativeItems(v,{count:30}));
const find=(pool,fragment)=>{const items=pool.filter(i=>i.stem.includes(fragment));assert.ok(items.length,"esercizio non trovato: "+fragment);return items;};

test("1.6.1: risposte corrette prima rifiutate ora accettate",()=>{
  const cases=[
    [drills,"We went ___ a walk","on"],
    [drills,"One is open; ___ is locked","the other one"],
    [drills,"corso di quattro giorni","4-day"],
    [drills,"but he should ___","have done"],
    [drills,"We called ___ ask","in order to"],
    [drills,"We called ___ ask","so as to"],
    [drills,"explain me the procedure","Please explain to me the procedure"],
    [negatives,"don't have no spare keys","We haven't got any spare keys"],
    [negatives,"don't have no spare keys","We've got no spare keys"],
    [grammarItems("clauses"),"when I ___. (arrive)","have arrived"]
  ];
  for(const [pool,fragment,answer] of cases)for(const item of find(pool,fragment))assert.ok(correct(item,answer),fragment+" → "+answer);
  const need=CHECK_ITEMS.find(i=>i.stem.includes("bring your own chair"));assert.ok(correct(need,"need"));
});

test("1.6.1: consegne che fissano la forma richiesta",()=>{
  assert.ok(find(drills,"two officers")[0].stem.includes("past simple"));
  assert.ok(find(drills,"I ___ the tickets, so I didn't")[0].stem.includes("need + buy"));
  assert.ok(find(negatives,"before delivery").every(i=>i.stem.includes("past simple")));
  assert.ok(find(grammarItems("some-any"),"coffee")[0].stem.includes("some o any"));
  assert.ok(!drills.some(i=>i.stem.includes("usando that")));
  for(const item of negatives.filter(i=>i.stem.includes("non tutti")))assert.doesNotMatch(item.stem,/non tutti i [aeiou]/i);
});

test("1.6.1: core-practice non ripete la frase-soluzione e usa opzioni ben formate",()=>{
  for(const id of CORE_LESSONS)for(let v=0;v<4;v++){
    const items=coreItems(id,v);
    for(const item of items){
      const page=Number(item.id.slice(-1));
      const answer=item.answer.replace(/[.?]$/,"").toLowerCase();
      if(answer.split(" ").length>3)for(const earlier of items.filter(i=>i.context_id===item.context_id&&Number(i.id.slice(-1))<page))assert.ok(!earlier.stem.toLowerCase().includes(answer),item.id);
      if(page===0){assert.equal(new Set(item.options).size,item.options.length);assert.ok(item.options.every(o=>!/^(to |has \w+ing$)/.test(o)||o===item.answer),item.id);}
    }
    const fix=items.find(i=>i.id.endsWith("task4"));
    const full=fix.answer.replace(/\.$/,"");const body=fix.accept.find(x=>x!==fix.answer&&full.startsWith(x)&&x.length<full.length);
    assert.ok(body&&correct(fix,body),fix.id);assert.ok(fix.accept.length>=4,fix.id);
  }
});

test("1.6.1: verifiche senza etichette che rivelano la soluzione e distinte dal pretest",()=>{
  for(const label of ["suono vocalico","con superlativo","suono /j/","h muta","davanti a ordinale","(must, negativo)","(can, negativo)","(could, negativo)","(mai)","forma were","Tell + destinatario","Reporting con tell"])
    assert.ok(!CHECK_ITEMS.some(i=>i.stem.includes(label)),label);
  const sentence=text=>{const part=String(text).split(/(?<=[.:])\s+/).find(x=>x.includes("___"))||"";return part.replace(/\s*\([^)]*\)\s*$/,"").trim().toLowerCase();};
  const pretest=new Set(QUESTIONS.map(q=>sentence(q.prompt??q.stem??q.text)).filter(Boolean));
  assert.ok(pretest.size>10);
  for(const item of CHECK_ITEMS){const own=sentence(item.stem);if(own)assert.ok(!pretest.has(own),item.id+": "+own);}
});

test("1.6.1: domande preparatorie dei percorsi con risposta in posizioni diverse",()=>{
  for(const unit of BOOK_WRITING_UNITS){const positions=unit.preparation.map(q=>q.answer);assert.ok(new Set(positions).size>=2,unit.id);for(const q of unit.preparation)assert.ok(q.answer>=0&&q.answer<q.options.length);}
  const report=BOOK_WRITING_UNITS.find(u=>u.model.some(m=>m.en.includes("were blocking")));
  assert.match(report.model.find(m=>m.en.includes("were blocking")).why,/past continuous/);
});

test("1.6.1: sensi equivalenti dei phrasal non compaiono come opzione sbagliata",()=>{
  for(const group of MEANING_GROUPS)for(const a of group){
    const term=PHRASALS.find(p=>p.id===a);assert.ok(term,a);
    for(let v=0;v<250;v++){const options=phrasalItems(term,v)[0].options.slice(1);for(const b of group.filter(x=>x!==a)){const other=PHRASALS.find(p=>p.id===b);if(other.meaning_it!==term.meaning_it)assert.ok(!options.includes(other.meaning_it),a+" ← "+b+" (sessione "+v+")");}}
  }
});

test("1.6.1: contenuti aggiunti nella 1.6.0 corretti",()=>{
  const prep=grammarItems("dependent-prepositions");
  const accepted=[["experience ___ handling","of"],["concern ___ the lack","over"],["agreed ___ the proposed date","to"],["protects staff ___ injury","against"],["solution ___ the access","for"]];
  for(const [fragment,answer] of accepted)assert.ok(correct(prep.find(i=>i.stem.includes(fragment)),answer),fragment);
  assert.equal(new Set(prep.map(i=>i.answer==="in"&&i.stem.includes("increase ___")?"x":i.stem)).size,prep.length);
  assert.ok(!prep.some(i=>i.stem.includes("access ___ the archive")));
  const words=grammarItems("word-building");
  assert.ok(correct(words.find(i=>i.stem.includes("describe the ___")),"differences"));
  assert.ok(correct(words.find(i=>i.stem.includes("cooperate")),"co-operation"));
  assert.ok(correct(grammarItems("question-meaning").find(i=>i.stem.includes("You spoke to ___")),"whom"));
  const review=grammarItems("review-foundation");
  for(const [fragment,answer] of [["(answer; will)","'ll answer"],["(replace; going to)","'re going to replace"],["(rain; going to)","'s going to rain"]])assert.ok(correct(review.find(i=>i.stem.includes(fragment)),answer),fragment);
  assert.ok(!review.some(i=>i.stem.includes("enter this room")));
  const spelling=grammarItems("spelling-control").filter(i=>i.case_sensitive);
  assert.equal(spelling.length,4);for(const item of spelling){assert.ok(!item.stem.includes(item.answer.replace(/\.$/,"")),item.stem);assert.ok(correct(item,item.answer.replace(/\.$/,"")));assert.equal(correct(item,item.answer.toLowerCase()),false);}
  const checks=CHECK_ITEMS.filter(i=>i.lesson_id==="phrasal-basics");
  assert.ok(checks.every(i=>i.stem.startsWith("Sostituisci")));
  assert.ok(correct(checks.find(i=>i.stem.includes("Turn off the radio")),"Turn it off."));
  assert.equal(correct(checks.find(i=>i.stem.includes("Turn off the radio")),"Turn off it"),false);
  assert.ok(correct(CHECK_ITEMS.find(i=>i.stem.includes("engineer ___ repaired")),"that"));
  for(const label of ["(so that/despite)","(However/Because)","You cancelled it ___","take ___ of the main points"])assert.ok(!CHECK_ITEMS.some(i=>i.stem.includes(label)),label);
});
