import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,learningPath} from '../engine.js';
import {STARTING_LEVELS} from '../starting-level.js';
import {learnerProfile} from '../learner-profile.js';
import {validateLearner} from '../contract.js';
import {validateState} from '../storage.js';
import {LESSONS} from '../catalog.js';
import {lessonMeta} from '../learning-path.js';
test('Each starting level includes its entry after any unverified prerequisites without inventing evidence',()=>{
 for(const level of STARTING_LEVELS){
  const state=freshState();state.settings.starting_level=level.id;
  assert.ok(level.lessons.every(id=>LESSONS.some(l=>l.id===id)));
  const path=learningPath(state,117),entry=path.findIndex(l=>l.id===level.lessons[0]);assert.ok(entry>=0);
  for(const id of lessonMeta(LESSONS.find(l=>l.id===level.lessons[0])).prerequisites)assert.ok(path.findIndex(l=>l.id===id)<entry);
  const profile=learnerProfile(state,level.lessons[0]);
  assert.equal(profile.starting_level,level.id);assert.equal(profile.evidence.length,0);
  validateLearner(profile,level.lessons[0]);validateState(state);
 }
});
test('Old backups remain valid; invalid level cannot reach storage or Groq',()=>{
 const state=freshState();validateState(state);
 const p=learnerProfile(state,'present-simple');assert.equal(p.starting_level,null);
 state.settings.starting_level='bogus';assert.throws(()=>validateState(state));
 p.starting_level='bogus';assert.throws(()=>validateLearner(p,'present-simple'));
});
