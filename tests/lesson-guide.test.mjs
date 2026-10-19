import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {LESSONS} from '../catalog.js';
import {guideTasks,validateGuides,freshGuide} from '../lesson-guide.js';
import {correct} from '../answer-normal.js';
import {openRepository,parseBackup} from '../storage.js';
const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://example.com/#/lesson/future-going-to',pretendToBeVisual:true});
for(const key of ['window','document','location','Node','navigator','sessionStorage','localStorage'])Object.defineProperty(globalThis,key,{value:key==='window'?dom.window:dom.window[key],configurable:true});
window.scrollTo=()=>{};
const {mountApp}=await import('../app.js');
const repo=await openRepository(new IDBFactory());let calls=0;
const app=await mountApp(repo,document.getElementById('view'),async()=>{calls++;throw new Error('Unexpected AI call');});
const lesson=LESSONS.find(l=>l.id==='future-going-to');
async function click(text){const b=[...document.querySelectorAll('button')].find(b=>b.textContent===text);assert.ok(b,text);b.click();for(let i=0;i<200;i++){await new Promise(r=>setTimeout(r,5));if(!document.getElementById('view').hasAttribute('aria-busy'))return;}throw new Error('timeout');}
async function input(id,value){const el=document.getElementById(id);assert.ok(el,id);el.value=value;el.dispatchEvent(new window.Event('input',{bubbles:true}));await app.flush();}
test('Every lesson has an answerable construction task and meaningful source content',()=>{
 for(const l of LESSONS){const t=guideTasks(l);assert.ok(t.example,l.id);assert.ok(l.when&&l.contrast,l.id);assert.ok(t.form,l.id);assert.ok(correct(t.form,t.form.answer),l.id);if(t.choice)assert.ok(t.choice.options.includes(t.choice.answer),l.id);}
});
test('Lesson flow connects explanation, exercises, sentences and writing with saved progress',async()=>{
 assert.match(document.getElementById('view').textContent,/Passo 1 di 5/);
 await click('Capisci il significato');await input('guide-meaning','Un piano già deciso');await click('Confronta con la spiegazione');
 assert.match(document.getElementById('guide-feedback').textContent,/non viene corretta automaticamente/);
 await click('Passa alla costruzione');await input('guide-form',guideTasks(lesson).form.answer);await click('Controlla la forma');
 assert.match(document.getElementById('guide-feedback').textContent,/Forma corretta/);
 await input('guide-form','wrong');assert.equal(document.getElementById('guide-feedback').hidden,true);await click('Controlla la forma');assert.doesNotMatch(document.getElementById('guide-feedback').textContent,/Forma corretta/);
 await click('Confronta le alternative');assert.match(document.getElementById('view').textContent,/Tomorrow da solo/);
 const choice=guideTasks(lesson).choice,radio=[...document.querySelectorAll('input[name="guide-contrast"]')].find(el=>el.value===choice.answer);radio.checked=true;radio.dispatchEvent(new window.Event('change',{bubbles:true}));await app.flush();await click('Mostra il perché');await click('Continua agli esercizi');
 const session=repo.get().sessions.at(-1);assert.equal(session.guide_lesson_id,lesson.id);
 for(let page=0;page<5;page++){
   const current=repo.get().sessions.find(s=>s.id===session.id);
   for(const item of current.items.slice(page*6,page*6+6)){
     const radio=[...document.querySelectorAll('input[type=radio]')].find(el=>el.name===item.id&&el.value===item.answer);
     if(radio){radio.checked=true;radio.dispatchEvent(new window.Event('change',{bubbles:true}));}
     else await input(item.id,item.answer);
   }
   await app.flush();document.getElementById('practice-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
   for(let i=0;i<200;i++){await new Promise(r=>setTimeout(r,5));if(!document.getElementById('view').hasAttribute('aria-busy'))break;}
   if(page<4)await click('Apri il blocco '+(page+2));
 }
 assert.ok(repo.get().sessions.find(s=>s.id===session.id).completed_at);
 await click('Continua: scrivi frasi tue');

 await input('guide-draft','We are going to inspect a new site. È un piano.');await app.render();assert.equal(document.getElementById('guide-draft').value,'We are going to inspect a new site. È un piano.');
 const backup=parseBackup(await repo.backup());assert.equal(backup.lesson_guides[0].step,4);assert.equal(backup.attempts.length,30);assert.ok(backup.attempts.some(a=>a.assisted));
 await click('Continua: prepara il breve testo');assert.equal(repo.get().writings.length,1);assert.equal(repo.get().writings[0].mode,'guided');assert.equal(repo.get().writings[0].grammar_lesson_id,lesson.id);assert.match(repo.get().writings[0].ideas,/È un piano/);assert.equal(repo.get().writings[0].draft,'');assert.equal(calls,0);
 location.hash='#/lesson/future-going-to';await app.render();assert.ok(repo.get().lesson_guides[0].completed_at);assert.equal(repo.get().attempts.length,30);
 await click('Riapri la spiegazione passo passo');await click('Conosco già la regola: salta');assert.equal(repo.get().lesson_guides[0].skipped,true);assert.equal(repo.get().sessions.length,1);
});
test('Bad guide backup is rejected; old backups need no guide field',()=>{
 assert.throws(()=>validateGuides([{...freshGuide(lesson.id),step:9}],LESSONS));assert.throws(()=>validateGuides([{...freshGuide(lesson.id),draft:null}],LESSONS));
 const s=repo.get();delete s.lesson_guides;assert.doesNotThrow(()=>parseBackup(JSON.stringify({format:'jflt-coach-backup/v2',state:s})));
});
