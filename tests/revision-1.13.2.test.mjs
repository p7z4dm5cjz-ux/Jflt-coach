import test from 'node:test';
import assert from 'node:assert/strict';
import {newCourse,courseTaskIndex,confirmCourseTask,courseRequest,advanceCourse,newCourseRound} from '../writing-course.js';
import {WRITING_UNITS} from '../writing-curriculum.js';
import {bankTrainItems} from '../lesson-bank.js';
import {correct} from '../answer-normal.js';
import {freshState} from '../engine.js';
import {validateState} from '../storage.js';
const text='I am writing to request information about the meeting room for our planned training event next week.';
test('Old writing drafts never silently change assignment, including high round numbers',()=>{
 for(const stage of [4,5])for(const round of [0,2,6,999]){
  const c=newCourse(WRITING_UNITS[0].id);delete c.assignment_version;c.stage=stage;c.rounds[stage]=round;c.drafts[stage]=text;
  assert.equal(courseTaskIndex(c),null);
  assert.throws(()=>courseRequest(c,'review'),/Conferma/);
  assert.throws(()=>advanceCourse(c),/Conferma/);
  assert.throws(()=>newCourseRound(c),/conservata/);
  assert.equal(c.drafts[stage],text);
  confirmCourseTask(c,3);assert.equal(courseTaskIndex(c),3);
  if(stage===5)c.checks.push({stage:4,completed_at:new Date(Date.now()-172800000).toISOString()});
  assert.equal(courseRequest(c,'review').topic,WRITING_UNITS[0].tasks[3].details_it);
  assert.equal(c.drafts[stage],text);
  assert.throws(()=>advanceCourse(c),/allenamento/);
 }
});
test('Assignment metadata survives backup validation and invalid indices are rejected',()=>{
 const s=freshState(),c=newCourse(WRITING_UNITS[0].id);s.writing_courses.push(c);
 validateState(structuredClone(s));c.task_indices={4:999};assert.throws(()=>validateState(s),/Consegne/);
});
test('Valid fronted time and place phrases are accepted in the revised word-order exercises',()=>{
 const cases=[['future',"I'll call you tomorrow","Tomorrow I'll call you"],['future-arrangements',"We're flying to Paris on Monday","On Monday we're flying to Paris"],['future-perfect','I will be waiting at the entrance','At the entrance I will be waiting'],['future-continuous','I will be working late tonight','Late tonight I will be working']];
 for(const [lesson,answer,variant] of cases){const item=bankTrainItems(lesson).find(i=>i.answer===answer);assert.ok(item,answer);assert.ok(correct(item,variant),variant);assert.equal(correct(item,'Yesterday I called you'),false);}
});
