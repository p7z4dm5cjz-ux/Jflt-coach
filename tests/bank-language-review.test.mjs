import test from 'node:test';
import assert from 'node:assert/strict';
import {grammarItems} from '../practice-bank.js';
import {CORE_LESSONS,coreItems} from '../core-practice.js';
import {negativeItems} from '../negative-bank.js';
import {PHRASALS,LESSONS} from '../catalog.js';
import {CHECK_ITEMS} from '../grammar-checks.js';
import {QUESTIONS} from '../placement.js';
import {correct,phrasalItems} from '../engine.js';
import {BASE_MEANING_DISTRACTORS} from '../phrasal-extension.js';
const find=(lesson,text)=>{const item=grammarItems(lesson).find(i=>i.stem.includes(text));assert.ok(item,lesson+' / '+text);return item;};
test('Revisione: correzioni minime valide senza accettare doppia flessione',()=>{
 for(const [lesson,needle,valid,invalid] of [
  ['advanced-word-order','Only Anna',['Only Anna called yesterday','Only Anna did call yesterday'],['Only Anna did called yesterday']],
  ['do-make','made a progress',['The team has made some progress','The team has made progress'],['The team has made a progress','The team has made progresses']],
  ['comparative-patterns','more faster',['The response was faster','The response was much faster'],['The response was more faster']],
  ['participles','the report',['Having finished','After finishing','On finishing'],['Having finish']],
 ]){const item=find(lesson,needle);for(const a of valid)assert.ok(correct(item,a),a);for(const a of invalid)assert.equal(correct(item,a),false,a);}
});
test('Revisione: il contesto distingue letture possibili, non etichetta la grammatica alternativa come sempre errata',()=>{
 for(const [lesson,needle,cue] of [
 ['ed-ing-adjectives','The listeners','provavano noia'],['ed-ing-adjectives','The instructions','provocavano confusione'],
 ['ever-relatives','___ you work','in qualunque luogo'],['advanced-ability-possibility','We might','Tanto vale'],
 ['advanced-will-would-should','I ___ say','attenuare'],['perfect-adverbs','Have you ___','senza esprimere sorpresa'],
 ['reported','She said','backshift'],['advanced-word-order','Never ___','present perfect']
 ])assert.ok(find(lesson,needle).stem.includes(cue),lesson);
 const link=CHECK_ITEMS.find(i=>i.stem.includes('his tiredness'));assert.ok(correct(link,'Despite'));assert.equal(correct(link,'Although'),false);
});
test('Revisione: negative senza doppio errore e accordo valido in tutte le otto varianti',()=>{
 const bases=['report','identify','describe','record','confirm','mention','notice','find'];
 for(let v=0;v<8;v++){
  const items=negativeItems(v),i=items.find(i=>i.stem.includes("Nobody didn't"));
  assert.ok(i.stem.includes("Nobody didn't "+bases[v]+' '));
  assert.ok(correct(i,i.answer));assert.equal(correct(i,i.answer.replace('Nobody','Everybody')),false);
 }
});
test('Revisione: posizione iniziale del complemento nelle negative core, senza cambiare il tempo',()=>{
 const item=coreItems('present-simple').find(i=>i.id.endsWith('v0-task2'));
 assert.ok(correct(item,'Every Monday, the coordinator does not check the radios.'));
 assert.equal(correct(item,'Every Monday, the coordinator did not check the radios.'),false);
 for(const lesson of CORE_LESSONS)for(let v=0;v<4;v++)for(const item of coreItems(lesson,v).filter(i=>i.id.endsWith('task2')))assert.equal(item.accept.length,2);
});
test('Revisione: tutte le 211 schede hanno distrattori curati, stabili e diversi dalla soluzione',()=>{
 assert.equal(Object.keys(BASE_MEANING_DISTRACTORS).length,161);
 for(const t of PHRASALS){
  assert.equal((t.meaning_distractors||BASE_MEANING_DISTRACTORS[t.id]).length,2);
  const first=phrasalItems(t,0)[0];assert.equal(new Set(first.options).size,3,t.id);
  for(const variation of [1,17,210,999])assert.deepEqual(phrasalItems(t,variation)[0].options,first.options,t.id);
 }
 const take=PHRASALS.find(t=>t.id==='pv-134');assert.equal(phrasalItems(take)[2].answer,'take after them');
 const call=PHRASALS.find(t=>t.id==='pv-016');assert.equal(phrasalItems(call)[2].answer,'call on them');
 const dishes=PHRASALS.find(t=>t.id==='phrasal-sense-wash-up-dishes');assert.equal(phrasalItems(dishes)[2].answer,'wash them up');
 assert.match(dishes.example,/plates/);
 const body=PHRASALS.find(t=>t.id==='phrasal-sense-wash-up-body');assert.match(body.example,/hands and face/);
});
test('Inventario finito: ogni variante locale, verifica e pretest conserva una soluzione correggibile',()=>{
 const all=[...CHECK_ITEMS,...QUESTIONS,...LESSONS.flatMap(l=>Array.from({length:l.id==='negatives'?8:CORE_LESSONS.includes(l.id)?4:1},(_,v)=>grammarItems(l.id,v)).flat()),...PHRASALS.flatMap(t=>phrasalItems(t))];
 for(const item of all){assert.ok(correct(item,item.answer),item.id);if(item.options?.length){assert.equal(new Set(item.options).size,item.options.length,item.id);assert.equal(item.options.filter(o=>o===item.answer).length,1,item.id);}}
});
