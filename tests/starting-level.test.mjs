import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,learningPath} from '../engine.js';
import {STARTING_LEVELS} from '../starting-level.js';
import {learnerProfile} from '../learner-profile.js';
import {validateLearner} from '../contract.js';
import {validateState} from '../storage.js';
import {LESSONS} from '../catalog.js';
test('Each starting level selects its entry lesson and reaches the tutor without inventing evidence',()=>{
 for(const level of STARTING_LEVELS){
  const state=freshState();state.settings.starting_level=level.id;
  assert.ok(level.lessons.every(id=>LESSONS.some(l=>l.id===id)));
  assert.equal(learningPath(state)[0].id,level.lessons[0]);
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
