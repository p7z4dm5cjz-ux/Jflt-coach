import test from 'node:test';
import assert from 'node:assert/strict';
import {coreItems,CORE_LESSONS} from '../core-practice.js';
import {assistedItem,hintSteps,answerFeedback} from '../practice-support.js';
test('Contrasts vary the target and explain plausible alternatives across all core topics',()=>{
 for(const id of CORE_LESSONS){const items=coreItems(id);for(const page of [1,4]){const block=items.slice(page*6,page*6+6);assert.equal(new Set(block.map(i=>i.focus_lesson)).size,3);for(const item of block){assert.doesNotMatch(item.stem,/Scegli la forma corretta del verbo/);assert.equal(item.options.length,3);assert.ok(item.options.includes(item.answer));assert.match(item.why,/altre alternative/);}}}
 const future=coreItems('future-going-to');assert.ok(future.slice(6,12).some(i=>i.focus_lesson==='future-will'));assert.ok(future.slice(6,12).some(i=>i.focus_lesson==='future-arrangements'));
});
test('Hints affect only requested answers; old globally guided sessions stay guided',()=>{
 const set={assisted:false,hinted_items:['a']};assert.equal(assistedItem(set,{id:'a'}),true);assert.equal(assistedItem(set,{id:'b'}),false);assert.equal(assistedItem({assisted:true},{id:'b'}),true);
 const steps=hintSteps({stem:'She ___ going to phone.',answer:'is'},{examples:['They are going to leave.']});assert.equal(steps.length,3);assert.match(steps[1].text,/They are going/);assert.match(steps[2].text,/^Risposta: is\./);
 const third={stem:'Scrivi solo le parole mancanti: If they had asked, we ___ them. (help)',answer:'would have helped',accept:['would have helped'],why:'Terzo tipo.'};
 const real=hintSteps(third,{id:'conditionals-unreal',examples:[]});
 assert.match(real[0].text,/Terzo condizionale: If \+ had \+ participio, would have \+ participio/);assert.doesNotMatch(real[0].text+real[1].text,/would have helped/);
 assert.match(real[1].text,/would have/);assert.match(real[2].text,/Risposta: would have helped/);
});
test('Feedback addresses observable errors and admits unrecognised variants',()=>{
 assert.match(answerFeedback({answer:'did not receive'},'did not received'),/forma base/);
 assert.match(answerFeedback({answer:'must leave'},'must to leave'),/aggiunto to/);
 assert.match(answerFeedback({answer:'has been waiting'},'has waiting'),/been/);
 assert.match(answerFeedback({answer:'unknown'},'other'),/varianti previste/);
});

test('First five are basic, later tasks increase demand and future contrasts respect ambiguity',()=>{for(const id of CORE_LESSONS){const items=coreItems(id);assert.ok(items.slice(0,5).every(i=>i.difficulty===1&&i.kind==='completion'));assert.ok(items.slice(5).every(i=>i.difficulty>1));assert.ok(items.slice(24).every(i=>i.difficulty===4));}const future=coreItems('future-going-to');assert.deepEqual(future.slice(0,5).map(i=>i.answer),['am','is','are','are','is']);assert.match(future[29].answer,/possono essere possibili/);assert.ok(future.slice(24).every(i=>!i.stem.includes('Scegli la forma corretta del verbo')));});
