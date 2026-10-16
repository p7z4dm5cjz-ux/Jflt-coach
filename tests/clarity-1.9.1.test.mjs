import test from "node:test";
import assert from "node:assert/strict";
import {answerHint,correct} from "../answer-normal.js";
import {EXTENSION_DRILLS,extensionItems} from "../grammar-drills.js";
import {negativeItems} from "../negative-bank.js";
import {grammarItems,COVERED_LESSONS} from "../practice-bank.js";
import {CORE_LESSONS,coreItems} from "../core-practice.js";
import {CHECK_ITEMS} from "../grammar-checks.js";
import {QUESTIONS} from "../placement.js";

const pool=[];
for(const id of Object.keys(EXTENSION_DRILLS))for(let v=0;v<3;v++)pool.push(...extensionItems(id,v));
for(let v=0;v<8;v++)pool.push(...negativeItems(v,{count:30}));
for(const id of COVERED_LESSONS)for(let v=0;v<2;v++){try{pool.push(...grammarItems(id,v));}catch{}}
for(const id of CORE_LESSONS)for(let v=0;v<4;v++)pool.push(...coreItems(id,v));
pool.push(...CHECK_ITEMS,...QUESTIONS);
const open=pool.filter(it=>!it.options?.length);
const stem=it=>String(it.stem||it.question||"");

test("1.9.1: ogni risposta aperta locale dice in italiano che cosa scrivere",()=>{
  assert.ok(open.length>1500);
  const missing=open.filter(it=>!/scrivi/i.test(stem(it))).map(it=>it.id+": "+stem(it));
  assert.deepEqual(missing.slice(0,10),[]);
});

test("1.9.1: niente gergo nelle consegne e «parola/parole» coerente con la soluzione",()=>{
  const jargon=/lacuna|gruppo verbale|gruppo mancante|tutto il gruppo|sintagma|proposizione participiale|nucleo del soggetto|fronting/i;
  assert.deepEqual(pool.filter(it=>jargon.test(stem(it))).map(it=>it.id),[]);
  const one=open.filter(it=>/scrivi solo la parola mancante/i.test(stem(it))&&String(it.answer).trim().split(/\s+/).length!==1);
  const many=open.filter(it=>/scrivi solo le parole mancanti/i.test(stem(it))&&String(it.answer).trim().split(/\s+/).length<2);
  assert.deepEqual([...one,...many].map(it=>it.id+" → "+it.answer),[]);
});

test("1.9.1: le soluzioni restano accettate dopo la riscrittura delle consegne",()=>{
  assert.deepEqual(open.filter(it=>!correct(it,it.answer)).map(it=>it.id),[]);
});

test("1.9.1: indicazione automatica solo quando la consegna non dice già che cosa scrivere",()=>{
  assert.equal(answerHint({kind:"completion",stem:"Scrivi solo la parola mancante: She ___ here. (work)",answer:"works"}),null);
  assert.match(answerHint({kind:"completion",stem:"She ___ here. (work)",answer:"works"}),/al posto di ___/);
  assert.match(answerHint({kind:"error_correction",stem:"Fix: She work here.",answer:"She works here."}),/tutta la frase/);
  assert.equal(answerHint({kind:"choice",stem:"x ___",answer:"a",options:["a","b"]}),null);
});

test("1.9.1: un Worker della stessa release con patch diversa non blocca il tutor",async()=>{
  const {callTutor,saveToken}=await import("../tutor.js");const {VERSION}=await import("../engine.js");
  saveToken("test-token-abcdefghijklmnopqrstuvwxyz");
  const [major,minor]=VERSION.split(".");
  const health=v=>async()=>Response.json({version:v,api_version:1,groq_configured:true,capabilities:["exercises"]});
  const ok=await callTutor({endpoint:"https://patch.workers.dev"},"/health",null,null,health(major+"."+minor+".0"));
  assert.equal(ok.version,major+"."+minor+".0");
  await assert.rejects(callTutor({endpoint:"https://minor.workers.dev"},"/health",null,null,health(major+"."+(Number(minor)-1)+".9")),/Versioni diverse/);
});
