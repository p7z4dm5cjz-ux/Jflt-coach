import test from 'node:test';
import assert from 'node:assert/strict';
import {coreItems,CORE_LESSONS} from '../core-practice.js';
import {assistedItem,hintSteps,answerFeedback} from '../practice-support.js';
test('Contrasts vary the target and explain plausible alternatives across all core topics',()=>{
 for(const id of CORE_LESSONS){const items=coreItems(id);for(const page of [0,4]){const block=items.slice(page*6,page*6+6);assert.equal(new Set(block.map(i=>i.focus_lesson)).size,3);for(const item of block){assert.doesNotMatch(item.stem,/Scegli la forma corretta del verbo/);assert.equal(item.options.length,3);assert.ok(item.options.includes(item.answer));assert.match(item.why,/altre alternative/);}}}
 const future=coreItems('future-going-to');assert.ok(future.slice(0,6).some(i=>i.focus_lesson==='future-will'));assert.ok(future.slice(0,6).some(i=>i.focus_lesson==='future-arrangements'));
});
test('Hints affect only requested answers; old globally guided sessions stay guided',()=>{
 const set={assisted:false,hinted_items:['a']};assert.equal(assistedItem(set,{id:'a'}),true);assert.equal(assistedItem(set,{id:'b'}),false);assert.equal(assistedItem({assisted:true},{id:'b'}),true);
 const steps=hintSteps({stem:'She ___ going to phone.',answer:'is'},{examples:['They are going to leave.']});assert.equal(steps.length,3);assert.match(steps[2].text,/They are going/);
});
test('Feedback addresses observable errors and admits unrecognised variants',()=>{
 assert.match(answerFeedback({answer:'did not receive'},'did not received'),/forma base/);
 assert.match(answerFeedback({answer:'must leave'},'must to leave'),/aggiunto to/);
 assert.match(answerFeedback({answer:'has been waiting'},'has waiting'),/been/);
 assert.match(answerFeedback({answer:'unknown'},'other'),/varianti previste/);
});
