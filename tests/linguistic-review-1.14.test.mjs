import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LESSON_BANK,bankTrainItems,bankCheckItems} from '../lesson-bank.js';
import {correct,normal} from '../answer-normal.js';
import {grammarItems} from '../practice-bank.js';
import {LESSONS,PHRASALS} from '../catalog.js';
import {CHECK_ITEMS} from '../grammar-checks.js';
import {QUESTIONS} from '../placement.js';
import {phrasalItems} from '../engine.js';
const item=id=>{const [,l,p,n]=id.match(/^(.*)-(train|check)-(\d+)$/);return (p==='train'?bankTrainItems(l):bankCheckItems(l))[+n];};
const bag=s=>normal(s).replace(/[.,!?;:/]/g,' ').split(/\s+/).filter(Boolean).sort().join(' ');
test('Regressioni linguistiche: completamenti, passivo e varianti di significato',()=>{
 for(const [id,valid,invalid] of [
  ['used-to-train-1',['getting up'],['getting','get up','to get up']],
  ['complex-verb-patterns-check-1',['being criticised','being criticized','to be criticised','to be criticized'],['criticising','be criticised']],
  ['perfect-adverbs-check-0',['yet','already'],['still']],
  ['space-movement-check-0',['over','above'],['under']],
  ['nominalisation-check-0',['building'],['construction','build']],
 ]){for(const v of valid)assert.ok(correct(item(id),v),id+': '+v);for(const v of invalid)assert.equal(correct(item(id),v),false,id+': '+v);}
 // Would prefer, diversamente da prefer, richiede qui l'infinito: non allarghiamo le varianti indiscriminatamente.
 assert.ok(correct(item('preferences-check-1'),'to eat'));
 assert.equal(correct(item('preferences-check-1'),'eating'),false);
});
test('Riordino: virgole di confine e varianti approvate, ma nessuna permutazione arbitraria',()=>{
 for(const [id,answer]of [
  ['past-continuous-train-4','When we left, it was raining.'],
  ['perfect-continuous-check-5','Since January, she has been working here.'],
  ['clauses-train-9','Because the road was closed, we were late.'],
  ['advanced-word-order-check-5','A small café stood on the corner.'],
 ])assert.ok(correct(item(id),answer),id);
 assert.equal(correct(item('past-continuous-train-4'),'When we raining, it was left.'),false);
 assert.equal(correct(item('pronouns-train-8'),'She gave me the keys'),false);
 assert.ok(correct(item('pronouns-train-8'),'She gave the keys to me'));
 // La tolleranza non si applica alle virgole nelle altre attività (relative incluse).
 assert.equal(correct({answer:'My sister, who lives in Turin, is a nurse',accept:[],stem:'Riscrivi la frase'},'My sister who lives in Turin is a nurse'),false);
});
test('Tutte le soluzioni del riordino conservano le parole date',()=>{
 for(const l of Object.keys(LESSON_BANK))for(const x of [...bankTrainItems(l),...bankCheckItems(l)]){
  if(x.skill!=='word_order'||x.options.length)continue;
  const prompt=x.stem.split(': ').slice(1).join(': ');
  for(const answer of x.accept)assert.equal(bag(answer),bag(prompt),x.id+' / '+answer);
 }
});
test('Nessuna consegna di una parola ha soluzioni previste di più parole nella banca per competenze',()=>{
 for(const l of Object.keys(LESSON_BANK))for(const x of [...bankTrainItems(l),...bankCheckItems(l)]){
  if(x.options.length||!x.stem.includes('Scrivi solo la parola mancante'))continue;
  for(const answer of x.accept)assert.equal(answer.trim().split(/\s+/).length,1,x.id);
 }
});
test('Inventario completo: soluzioni, varianti, distrattori e spiegazioni verificabili dal correttore',()=>{
 const all=[...CHECK_ITEMS,...QUESTIONS,...LESSONS.flatMap(l=>[...Array.from({length:8},(_,v)=>grammarItems(l.id,v)).flat(),...bankTrainItems(l.id),...bankCheckItems(l.id)]),...PHRASALS.flatMap(t=>phrasalItems(t))];
 for(const x of all){
  assert.ok(correct(x,x.answer),x.id+' soluzione');
  for(const a of x.accept||[])assert.ok(correct(x,a),x.id+' variante '+a);
  for(const o of x.options||[])if(o!==x.answer)assert.equal(correct(x,o),false,x.id+' distrattore '+o);
 }
});
test('Registro della revisione corrisponde ai dati pubblicati; le chiavi delle verifiche restano stabili',()=>{
 const entries=JSON.parse(readFileSync(new URL('../audit/linguistic-review-1.14.0.json',import.meta.url)));
 const latest=new Map(entries.map(e=>[e.id,e]));
 for(const {id,before,after} of latest.values()){
  const [,l,p,n]=id.match(/^(.*)-(train|check)-(\d+)$/);
  assert.deepEqual(LESSON_BANK[l][p][+n],after,id);
  if(p==='check')assert.equal(after.answer,before.answer,id+' chiave storica');
 }
});
