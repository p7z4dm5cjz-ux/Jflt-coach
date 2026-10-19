import test from 'node:test';
import assert from 'node:assert/strict';
import {blockAdaptation,localRetry,replaceDoubts} from '../adaptive-practice.js';
import {grammarItems} from '../practice-bank.js';
import {freshState} from '../engine.js';
import {exerciseRequest} from '../practice-flow.js';
const set={id:'s',lesson_id:'future-going-to',items:grammarItems('future-going-to'),training:{page:0,grammar_target:30,recovery:[]},answers:{}};
test('Difficulty uses independent correct answers, excludes disputed items and holds with little evidence',()=>{
 const s=freshState();assert.equal(blockAdaptation(s,set).mode,'hold');
 s.attempts=set.items.slice(0,6).map(i=>({session_id:'s',item_id:i.id,lesson_id:set.lesson_id,correct:true,assisted:false}));
 assert.equal(blockAdaptation(s,set).mode,'advance');s.attempts.forEach(a=>a.assisted=true);assert.equal(blockAdaptation(s,set).mode,'consolidate');
 assert.match(exerciseRequest(s,set.lesson_id,{set}).practice.purpose,/consolidate/);
 s.attempts.forEach(a=>a.disputed=true);assert.equal(blockAdaptation(s,set).mode,'hold');
});
test('Local remediation keeps target and operation, never repeats seen stems or mutates answers',()=>{
 const s=freshState();const parent={...set,lesson_id:'past-simple',items:grammarItems('past-simple')};s.sessions=[parent];
 const before=JSON.stringify(s),focus=[parent.items[12]],retry=localRetry(s,parent,focus);
 assert.ok(retry.length>0);assert.ok(retry.every(i=>i.kind===focus[0].kind&&i.focus_lesson==='past-simple'));assert.ok(retry.every(i=>!parent.items.some(x=>x.stem===i.stem)));assert.equal(JSON.stringify(s),before);
});
test('Doubtful AI output is replaced locally with audit context, finite exhausted banks stay excluded',()=>{
 const doubtful={...set.items[0],stem:'unconfirmed AI sentence',doubt:true,check_note:'ambiguous'};
 const r=replaceDoubts([doubtful,set.items[1]],set.lesson_id);
 assert.ok(r[0].replacement_note);assert.equal(r[0].doubt,undefined);assert.equal(r[0].replaced_item.stem,doubtful.stem);assert.equal(r[1],set.items[1]);assert.equal(doubtful.doubt,true);
 const all=Array.from({length:4},(_,v)=>grammarItems('sentence',v)).flat();assert.equal(replaceDoubts([doubtful],'sentence',all)[0],doubtful);
});
