import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {openRepository} from '../storage.js';
import {VERSION} from '../engine.js';
import {getToken,saveToken,isTokenRemembered} from '../tutor.js';
const dom=new JSDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'),{url:'https://example.com/#/settings',pretendToBeVisual:true});
for(const key of ['window','document','location','Node','navigator','sessionStorage','localStorage'])Object.defineProperty(globalThis,key,{value:key==='window'?dom.window:dom.window[key],configurable:true});
window.scrollTo=()=>{};
const {mountApp}=await import('../app.js');
const repo=await openRepository(new IDBFactory());
let calls=[];
const app=await mountApp(repo,document.getElementById('view'),async(settings,path)=>{
 calls.push({path,token:getToken()});
 if(!getToken())throw new Error('Inserisci il codice personale del tutor nelle Impostazioni.');
 if(getToken()==='invalid-test-token')throw new Error('Codice non valido.');
 return path==='/check'?{provider_checked:true}:{version:VERSION,groq_configured:true,capabilities:[]};
});
async function click(label){const button=[...document.querySelectorAll('button')].find(b=>b.textContent===label);assert.ok(button,label);button.click();for(let i=0;i<200;i++){await new Promise(r=>setTimeout(r,5));if(!document.querySelector('#view').hasAttribute('aria-busy'))return;}throw new Error('UI timeout');}
test('Save replaces stale missing-token error, preserves token and remembers selection',async()=>{
 await click('Verifica collegamento Worker');
 assert.match(document.querySelector('#notice').textContent,/Inserisci il codice/);
 document.querySelector('#token').value='dummy-test-token';document.querySelector('#remember').checked=true;
 await click('Salva collegamento');
 assert.match(document.querySelector('#notice').textContent,/Collegamento verificato/);
 assert.equal(document.querySelector('#notice').classList.contains('error'),false);
 assert.equal(getToken(),'dummy-test-token');assert.equal(isTokenRemembered(),true);
 assert.equal(document.querySelector('#remember').checked,true);
 assert.match(document.querySelector('#token').placeholder,/già presente/);
 await click('Salva collegamento');assert.equal(getToken(),'dummy-test-token');
 assert.equal((await repo.backup()).includes('dummy-test-token'),false);
});
test('Verify buttons save newly entered token without a separate Save',async()=>{
 document.querySelector('#token').value='worker-test-token';await click('Verifica collegamento Worker');assert.equal(calls.at(-1).token,'worker-test-token');
 document.querySelector('#token').value='groq-test-token';await click('Verifica Groq');assert.ok(calls.some(c=>c.path==='/check'&&c.token==='groq-test-token'));
 assert.match(document.querySelector('#notice').textContent,/Groq ha risposto/);
});
test('Persistence can change without retyping and genuine errors remain visible',async()=>{
 document.querySelector('#remember').checked=false;await click('Salva collegamento');assert.equal(isTokenRemembered(),false);assert.equal(getToken(),'groq-test-token');
 document.querySelector('#token').value='invalid-test-token';await click('Verifica collegamento Worker');assert.match(document.querySelector('#notice').textContent,/Codice non valido/);assert.equal(document.querySelector('#notice').classList.contains('error'),true);
 await click('Rimuovi il codice dal dispositivo');assert.equal(getToken(),'');assert.equal(isTokenRemembered(),false);
});
test('Persistent storage remains readable if session storage is blocked',()=>{
 saveToken('storage-test-token',true);const descriptor=Object.getOwnPropertyDescriptor(globalThis,'sessionStorage');
 Object.defineProperty(globalThis,'sessionStorage',{get(){throw new Error('blocked');},configurable:true});
 try{assert.equal(getToken(),'storage-test-token');saveToken('updated-test-token',true);assert.equal(localStorage.getItem('jflt-coach-app-token'),'updated-test-token');}finally{Object.defineProperty(globalThis,'sessionStorage',descriptor);saveToken('');}
});
