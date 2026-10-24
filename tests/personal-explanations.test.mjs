import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,newPlacement} from '../engine.js';
import {QUESTIONS} from '../placement.js';
import {explanationRequest} from '../learner-profile.js';
import {SHAPES} from '../contract.js';
import {handle} from '../worker/index.js';
import {inspectRequest} from '../tools/ispeziona-richiesta.mjs';

test('spiegazione: profilo corrente, prove reali e nessuna lacuna inventata senza dati',()=>{
 const s=freshState();s.settings.starting_level='B1';
 const empty=explanationRequest(s,'past-simple','  Un dubbio  ');
 assert.equal(empty.question,'Un dubbio');assert.equal(empty.learner.starting_level,'B1');assert.deepEqual(empty.learner.evidence,[]);
 s.placement=newPlacement();s.placement.answers=QUESTIONS.map(q=>({id:q.id,value:q.lessons.includes('past-simple')?'':q.answer,confidence:'sure'}));s.placement.submitted_at=new Date().toISOString();
 const updated=explanationRequest(s,'past-simple');
 assert.ok(updated.learner.evidence.some(e=>!e.correct&&e.given===''));
 assert.ok(updated.learner.evidence.every(e=>e.id.startsWith('pretest:')));
 assert.deepEqual(empty.learner.evidence,[]);
});

test('Worker: profilo inoltrato in una sola richiesta; profilo invalido rifiutato prima della quota',async()=>{
 let budget=0,calls=0;
 const token='local-test-only-personal-explanation',env={APP_TOKEN:token,GROQ_API_KEY:'mock-key',ALLOWED_ORIGIN:'https://example.test',BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>{budget++;return Response.json({ok:true});}})}};
 const make=data=>new Request('https://worker.test/tutor',{method:'POST',headers:{Origin:env.ALLOWED_ORIGIN,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({api_version:1,request_id:'req-explanation-test',task:'grammar_explain',data})});
 const data=explanationRequest(freshState(),'past-simple','Perché questa forma?');
 const res=await handle(make(data),env,async(url,options)=>{
  calls++;const body=JSON.parse(options.body);assert.deepEqual(JSON.parse(body.messages[1].content),data);
  assert.match(body.messages[0].content,/Non chiamare ricorrente un errore osservato una sola volta/);
  assert.equal(body.response_format.json_schema.name,'jflt_grammar_explain');
  return Response.json({choices:[{finish_reason:'stop',message:{content:JSON.stringify(SHAPES.grammar_explain)}}]});
 });
 assert.equal(res.status,200);assert.equal(calls,1);assert.equal(budget,1);
 const bad=structuredClone(data);bad.learner.lesson_id='passive';
 const rejected=await handle(make(bad),env,()=>{throw Error('No provider call');});
 assert.equal(rejected.status,400);assert.equal(budget,1);
 const old=await handle(make({lesson_id:'past-simple'}),env,async()=>Response.json({choices:[{finish_reason:'stop',message:{content:JSON.stringify(SHAPES.grammar_explain)}}]}));
 assert.equal(old.status,200);
});

test('prompt esercizi precedente: segmenti brevi e istruzioni di forma distinte dalla scelta contestuale',async()=>{
 const inspected=await inspectRequest('exercises','past-simple');
 const instructions=inspected.groq_request.body.messages[0].content.split('Esempio SOLO DI FORMATO')[0];
 assert.match(instructions,/mai tutta la frase/);
 assert.match(instructions,/Solo negli esercizi di costruzione guidata/);
 assert.doesNotMatch(instructions,/Se answer è la frase intera|Metti le parole in ordine e scrivi la frase/);
});
