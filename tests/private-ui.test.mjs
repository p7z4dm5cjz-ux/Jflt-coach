import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {openRepository,parseBackup} from '../storage.js';
import {randomId} from '../ids.js';
import {VOCABULARY} from '../catalog.js';
import {addTerm} from '../engine.js';

const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://private.example/coach/index.html#/review',pretendToBeVisual:true});
for(const key of ['window','document','location','Node','navigator','sessionStorage','localStorage'])Object.defineProperty(globalThis,key,{value:key==='window'?dom.window:dom.window[key],configurable:true});
window.scrollTo=()=>{};
const {mountApp}=await import('../app.js');const repo=await openRepository(new IDBFactory());let calls=[];
const app=await mountApp(repo,document.getElementById('view'),async(settings,path,task,data)=>{calls.push({path,task,data});return {expression:data.term,meaning_it:'eseguire un controllo',explanation:'Il verbo mantiene insieme azione e particella.',example:'They carried out a new check.'};});
const until=async fn=>{for(let i=0;i<200;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('timeout '+document.getElementById('notice').textContent);};
const fill=(id,value)=>{const el=document.getElementById(id);assert.ok(el,id);el.value=value;el.dispatchEvent(new window.Event('input',{bubbles:true}));};
const click=label=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent===label);assert.ok(b,label);b.click();};

test('lessico personale: aggiunta, recupero, scadenza, spiegazione salvata e backup',async()=>{
  fill('new-word','carry out');fill('new-meaning','eseguire');fill('new-example','They carried out a check.');click('Salva nel dizionario');
  await until(()=>repo.get().vocabulary.length===1);await app.render();const term=repo.get().vocabulary[0];
  click('Ripassa 1 termini');await until(()=>document.querySelector('.exercise'));
  const set=repo.get().sessions.at(-1);fill(set.items[0].id,'carry out');document.querySelector('#practice-form button[type="submit"]').click();
  await until(()=>!!repo.get().sessions.at(-1).completed_at);assert.equal(repo.get().vocabulary[0].streak,1);assert.ok(Date.parse(repo.get().vocabulary[0].due)>Date.now());
  await app.goto('word/'+term.id);await until(()=>document.getElementById('word-context'));fill('word-context','We carried out a check.');await app.flush();click("Spiega l'uso nel mio contesto");
  await until(()=>repo.get().vocabulary[0].explanation);await app.render();assert.match(document.getElementById('view').textContent,/Il verbo mantiene insieme/);
  assert.equal(calls.at(-1).task,'clarify');assert.equal(repo.get().vocabulary[0].meaning_it,'eseguire un controllo');parseBackup(await repo.backup());
});

test('la scheda personale prevale sul significato di base del catalogo',async()=>{
  const base=VOCABULARY[0];await repo.change(s=>{const t=addTerm(s,base);t.meaning_it='Significato personale aggiornato';});
  await app.goto('word/'+base.id);await until(()=>document.getElementById('view').textContent.includes('Significato personale aggiornato'));
});

test('anteprima HTTP: identificatori disponibili anche senza crypto.randomUUID',()=>{
  const saved=Object.getOwnPropertyDescriptor(globalThis,'crypto'),original=globalThis.crypto;
  try {Object.defineProperty(globalThis,'crypto',{value:{getRandomValues:original.getRandomValues.bind(original)},configurable:true});const ids=Array.from({length:100},randomId);assert.equal(new Set(ids).size,100);assert.ok(ids.every(id=>/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/.test(id)));}
  finally{Object.defineProperty(globalThis,'crypto',saved);}
});

test('trasferimento guidato: istruzioni, importazione e API privata conservano i progressi',async()=>{
  const attempts=repo.get().attempts.length,words=repo.get().vocabulary.length;globalThis.JFLT_PRIVATE_SITE=true;
  try {
    await app.goto('home');await until(()=>document.getElementById('view').textContent.includes('Trasferisci i progressi dal vecchio sito'));
    const link=[...document.querySelectorAll('a')].find(a=>a.textContent==='Apri l’importazione dei progressi');assert.ok(link);assert.equal(link.getAttribute('href'),'#/settings');
    await app.goto('settings');await until(()=>document.getElementById('backup-file'));
    assert.match(document.getElementById('view').textContent,/Esporta backup JSON/);assert.equal(document.getElementById('endpoint').value,'https://private.example/api');
    assert.equal(repo.get().attempts.length,attempts);assert.equal(repo.get().vocabulary.length,words);parseBackup(await repo.backup());
  }finally{globalThis.JFLT_PRIVATE_SITE=false;}
});
test.after(()=>repo.close());
