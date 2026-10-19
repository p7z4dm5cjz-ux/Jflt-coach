import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {openRepository,parseBackup} from '../storage.js';
import {exerciseHint} from '../exercise-hints.js';
const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://example.com/#/practice/hints',pretendToBeVisual:true});
for(const key of ['window','document','location','Node','navigator','sessionStorage','localStorage'])Object.defineProperty(globalThis,key,{value:key==='window'?dom.window:dom.window[key],configurable:true});
window.scrollTo=()=>{};
const {mountApp}=await import('../app.js');
const repo=await openRepository(new IDBFactory());
const items=[{id:'going',kind:'completion',stem:'She ___ going to call tomorrow. (be; presente)',answer:'is',accept:[],options:[],why:'SOLUTION_ONLY'},{id:'neg',kind:'completion',stem:'Completa la negativa: We ___ leave yesterday.',answer:'did not',accept:[],options:[],why:'SOLUTION_ONLY'}];
await repo.change(s=>s.sessions.push({id:'hints',lesson_id:'be-going-to',source:'groq',items,answers:{},assisted:false,created_at:new Date().toISOString(),completed_at:null}));
let calls=0;const app=await mountApp(repo,document.getElementById('view'),async()=>{calls++;throw new Error('Unexpected AI call');});
async function settle(){for(let i=0;i<100;i++){await new Promise(r=>setTimeout(r,5));if(!document.getElementById('view').hasAttribute('aria-busy'))return;}throw new Error('timeout');}
test('Hints are local to the question, visible inline, persistent and preserve typed answers',async()=>{
 const input=document.getElementById('going');input.value='my draft';input.dispatchEvent(new window.Event('input',{bubbles:true}));
 const blocks=document.querySelectorAll('.exercise');const button=blocks[0].querySelector('button');button.click();await settle();
 assert.equal(document.getElementById('going'),input);assert.equal(input.value,'my draft');
 assert.equal(blocks[0].querySelector('.exercise-hint').hidden,false);assert.equal(blocks[1].querySelector('.exercise-hint').hidden,true);
 assert.match(blocks[0].querySelector('.exercise-hint').textContent,/Individua il soggetto/);assert.doesNotMatch(blocks[0].querySelector('.exercise-hint').textContent,/SOLUTION_ONLY/);
 assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal(repo.get().sessions[0].assisted,false);assert.deepEqual(repo.get().sessions[0].hinted_items,['going']);assert.equal(calls,0);
 button.click();await settle();assert.match(blocks[0].querySelector('.exercise-hint').textContent,/Non ripetere going to/);assert.equal(repo.get().sessions[0].assisted,false);
 await app.render();assert.equal(document.querySelector('.exercise-hint').hidden,false);assert.equal(document.getElementById('going').value,'my draft');
 const backup=parseBackup(await repo.backup());assert.deepEqual(backup.sessions[0].hinted_items,['going']);backup.sessions[0].hint_levels.going=99;assert.throws(()=>parseBackup(JSON.stringify({format:"jflt-coach-backup/v2",state:backup})),/suggerimenti/);
});
test('Using a hint marks submitted attempts as assisted, without changing correction',async()=>{
 for(const item of items){const input=document.getElementById(item.id);input.value=item.answer;input.dispatchEvent(new window.Event('input',{bubbles:true}));}await app.flush();
 document.getElementById('practice-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));await settle();
 assert.equal(repo.get().attempts.length,2);assert.ok(repo.get().attempts.every(a=>a.correct));assert.deepEqual(repo.get().attempts.map(a=>a.assisted),[true,false]);assert.equal(document.querySelector('button[aria-controls$="-reasoning-hint"]'),null);
});
test('Guidance responds to stem and topic, never reads solution or final explanation',()=>{
 const forbidden=()=>{throw new Error('Solution accessed');};
 const item={stem:'Usa il present perfect continuous: We ___ for two hours.',kind:'completion',get answer(){return forbidden();},get why(){return forbidden();},get accept(){return forbidden();}};
 assert.match(exerciseHint(item,{id:'present-perfect-continuous'}),/durata/);
 assert.match(exerciseHint({stem:'Correggi la negativa: We did not left.',kind:'error_correction'},{id:'past-simple'}),/forma base/);
 assert.match(exerciseHint({stem:'If we had not left, we ___ here now.',kind:'completion'},{id:'mixed-conditionals'}),/due momenti/);
 assert.notEqual(exerciseHint(items[0]),exerciseHint(items[1]));
});
