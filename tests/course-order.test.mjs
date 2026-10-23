import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,recommendation,newPlacement} from '../engine.js';
import {QUESTIONS} from '../placement.js';
import {LESSONS} from '../catalog.js';
import {lessonMeta,prerequisiteReady} from '../learning-path.js';
import {planCycle,chooseMain,mainReason} from '../path-planner.js';

test('B1 dichiarato: prima il prerequisito non verificato; la scelta manuale resta libera',()=>{
 const s=freshState();s.settings.starting_level='B1';
 assert.equal(chooseMain(s),'past-simple');
 assert.match(mainReason(s,'past-simple'),/Prima di.*Present perfect/i);
 assert.match(mainReason(s,'past-simple'),/Prossima tappa prevista/);
 assert.equal(planCycle(s,{force:'present-perfect-simple'}).main,'present-perfect-simple');
 s.lesson_levels={'past-simple':{level:3,autonomous:false,pending_transfer:false,history:[]}};
 assert.equal(chooseMain(s),'present-perfect-simple');
 assert.equal(s.lesson_levels['past-simple'].autonomous,false);
});
test('pretest sicuro permette di saltare il prerequisito; un semplice livello 2 dichiarato no',()=>{
 const s=freshState();s.settings.starting_level='B1';s.placement=newPlacement();
 s.placement.answers=QUESTIONS.map(q=>({id:q.id,value:q.answer,confidence:'sure'}));s.placement.submitted_at=new Date().toISOString();
 assert.equal(prerequisiteReady(s,'past-simple'),true);
 s.lesson_levels={'past-simple':{level:2,autonomous:false,pending_transfer:false,history:[]}};
 assert.equal(prerequisiteReady(s,'past-simple'),false);
});
test('tutte le 117 lezioni sono ordinate senza duplicati e senza cicli nei prerequisiti',()=>{
 const all=new Set(LESSONS.map(l=>l.id));
 function visit(id,trail=new Set()){
  assert.ok(!trail.has(id),'Ciclo in '+id);const next=new Set(trail).add(id);
  for(const pre of lessonMeta(LESSONS.find(l=>l.id===id)).prerequisites){assert.ok(all.has(pre));visit(pre,next);}
 }
 for(const l of LESSONS)visit(l.id);
 const s=freshState();s.settings.starting_level='A1';const ids=recommendation(s).map(l=>l.id);
 assert.equal(ids.length,LESSONS.length);assert.equal(new Set(ids).size,ids.length);
 for(const l of LESSONS)for(const pre of lessonMeta(l).prerequisites)assert.ok(ids.indexOf(pre)<ids.indexOf(l.id),pre+' prima di '+l.id);
 assert.deepEqual(recommendation(s).map(l=>l.id),ids);
});
test('un prerequisito in pausa non sblocca la lezione dipendente',()=>{
 const s=freshState();s.settings.starting_level='B1';s.lesson_levels={'past-simple':{level:1,parked:true,autonomous:false,pending_transfer:false,history:[]}};
 assert.notEqual(chooseMain(s),'present-perfect-simple');
});
