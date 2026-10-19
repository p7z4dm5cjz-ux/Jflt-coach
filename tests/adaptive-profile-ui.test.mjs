import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {openRepository,parseBackup} from '../storage.js';
import {SHAPES} from '../contract.js';
const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://example.test/#/lesson/future-going-to',pretendToBeVisual:true});
for(const k of ['window','document','location','Node','navigator','sessionStorage','localStorage'])Object.defineProperty(globalThis,k,{value:k==='window'?dom.window:dom.window[k],configurable:true});
window.scrollTo=()=>{};
const {mountApp}=await import('../app.js'),repo=await openRepository(new IDBFactory());
let calls=[];
const tutor=async(settings,path,task,data)=>{calls.push(data);return {items:SHAPES.exercises.items.map((i,n)=>({...structuredClone(i),stem:i.stem+' Contesto '+calls.length+'-'+n,check:'confirmed'})),assessment:{mode:calls.length===1?'diagnose':'consolidate',focus:'meaning',reason:'Il significato richiede una prova mirata.',goal:'Distingui intenzione e previsione.',evidence_ids:data.learner.evidence.map(e=>e.id).slice(0,6),item_skills:['meaning','form','tense_choice','word_order','use','form']}};};
const app=await mountApp(repo,document.getElementById('view'),tutor);
async function until(f){for(let i=0;i<300;i++){if(f())return;await new Promise(r=>setTimeout(r,5));}throw Error('timeout '+document.getElementById('notice').textContent);}
const click=t=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent===t);assert.ok(b,t);b.click();};
test('Adaptive UI persists assessment, feeds mixed answers to next block and offers personal offline bank',async()=>{
 click('Inizia 30 esercizi con il tutor');await until(()=>repo.get().sessions.length===1);await until(()=>document.querySelectorAll('.exercise').length===6);
 let wrongUsed=false;const set=repo.get().sessions[0];assert.equal(set.adaptive_plans[0].assessment.mode,'diagnose');assert.match(document.getElementById('view').textContent,/Perché questo blocco/);
 for(const [n,item] of set.items.entries()){
  if(item.kind==='choice'){const radios=[...document.querySelectorAll('input[type=radio]')].filter(x=>x.name===item.id),r=radios.find(x=>x.value===item.answer);r.checked=true;r.dispatchEvent(new window.Event('change',{bubbles:true}));}
  else{const input=document.getElementById(item.id);input.value=!wrongUsed?'wrong':item.answer;wrongUsed=true;input.dispatchEvent(new window.Event('input',{bubbles:true}));}
 }
 await app.flush();document.getElementById('practice-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));await until(()=>repo.get().sessions[0].training.checked.length===1);
 click('Genera il blocco 2');await until(()=>repo.get().sessions[0].training.page===1);
 assert.equal(repo.get().sessions.length,1,'No forced local remediation before AI assessment');assert.equal(calls.length,2);assert.ok(calls[1].learner.evidence.some(e=>e.correct));assert.ok(calls[1].learner.evidence.some(e=>!e.correct));
 assert.equal(repo.get().sessions[0].items[6].skill,'meaning');const backup=parseBackup(await repo.backup());assert.equal(backup.sessions[0].adaptive_plans.length,2);
 location.hash='#/lesson/future-going-to';await app.render();click('Ripassa le domande salvate');await until(()=>repo.get().sessions.length===2);assert.equal(calls.length,2);assert.equal(repo.get().sessions[1].assisted,true);assert.ok(repo.get().sessions[1].items.every(i=>i.personal_review));parseBackup(await repo.backup());
});
