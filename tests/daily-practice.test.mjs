import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyPractice} from '../daily-practice.js';
import {freshState,dailyWritingTopic} from '../engine.js';
import {correct} from '../answer-normal.js';
const timestamp=Date.parse('2026-10-19T10:00:00Z');
const plan={lesson_id:'future-going-to',minutes:20,day:'2026-10-19',minimum_words:60,lesson:{title:'Going to'},terms:[]};
test('daily workload is bounded, spans production and interpretation, accepts references',()=>{
  for(const [minutes,n] of [[10,6],[20,12],[30,18]]){
    const {items}=dailyPractice(freshState(),{...plan,minutes},timestamp);
    assert.equal(items.length,n);assert.ok(items.some(i=>i.kind!=='choice'));assert.ok(items.some(i=>i.kind==='choice'));
    assert.equal(new Set(items.map(i=>i.id)).size,n);
    for(const item of items)assert.ok(correct(item,item.answer));
  }
});
test('only due studied topics are mixed, with their own attribution',()=>{
  const s=freshState();s.attempts=Array.from({length:6},(_,i)=>({lesson_id:'past-simple',session_id:'old',stem:'past '+i,correct:true,assisted:false,source:'local',date:'2026-10-10T10:00:00Z'}));
  s.sessions=[{id:'old',items:s.attempts.map(a=>({id:a.stem,stem:a.stem})),completed_at:'2026-10-10T10:00:00Z'}];const result=dailyPractice(s,plan,timestamp);assert.deepEqual(result.review_ids,['past-simple']);
  assert.ok(result.items.some(i=>i.focus_lesson==='past-simple'));
  assert.equal(result.items.length,12);
  s.attempts.forEach(a=>a.date='2026-10-19T09:00:00Z');assert.deepEqual(dailyPractice(s,plan,timestamp).review_ids,[]);
});
test('a finite short bank is not padded with duplicates and repeats are disclosed',()=>{
  const s=freshState(),p={...plan,lesson_id:'sentence'};const first=dailyPractice(s,p,timestamp);
  s.attempts=first.items.map(i=>({stem:i.stem,lesson_id:'sentence',assisted:true}));
  const second=dailyPractice(s,p,timestamp);assert.equal(second.repeated,second.items.length);
  assert.equal(new Set(second.items.map(i=>i.stem)).size,second.items.length);
});
test('writing provides communicative facts, changes scenario and avoids mandated tense everywhere',()=>{
  const a=dailyWritingTopic(plan),b=dailyWritingTopic({...plan,day:'2026-10-20'});
  assert.notEqual(a,b);assert.match(a,/Distingui/);assert.match(a,/non forzare/);assert.match(a,/fittizi/);
});
