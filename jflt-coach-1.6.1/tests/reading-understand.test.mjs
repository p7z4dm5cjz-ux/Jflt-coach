import test from 'node:test';
import assert from 'node:assert/strict';
import {validateInput,validateReply,anchorReading,SHAPES} from '../contract.js';
import {handle} from '../worker/index.js';
import {freshState,addTerm,correct} from '../engine.js';
import {validateState,parseBackup} from '../storage.js';
import {grammarItems} from '../practice-bank.js';
const text='The officers have checked the gate.';
const sample=()=>structuredClone(SHAPES.reading_understand);
const token='reading-test-token-more-than-24';
const env={APP_TOKEN:token,GROQ_API_KEY:'mock-key',ALLOWED_ORIGIN:'https://example.test',MODEL:'openai/gpt-oss-120b',BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
const req=data=>new Request('https://worker.test/tutor',{method:'POST',headers:{Authorization:'Bearer '+token,Origin:env.ALLOWED_ORIGIN,'Content-Type':'application/json'},body:JSON.stringify({api_version:1,request_id:'req-reading-test',task:'reading_understand',data})});
test('Comprensione senza traduzione: selezione oltre i primi 1200 caratteri, una richiesta, stesso modello',async()=>{
 const long='Background context. '.repeat(100)+text;let calls=0;
 const res=await handle(req({text:long,selection:'checked'}),env,async(url,opts)=>{calls++;const body=JSON.parse(opts.body);assert.equal(body.model,env.MODEL);assert.deepEqual(JSON.parse(body.messages[1].content),{text:long,selection:'checked'});assert.equal(body.response_format.json_schema.name,'jflt_reading_understand');assert.match(body.messages[0].content,/Non inventare intenzioni/);return Response.json({choices:[{finish_reason:'stop',message:{content:JSON.stringify(sample())}}]});});
 assert.equal(res.status,200);assert.equal(calls,1);assert.equal((await res.json()).result.terms[0].expression,'checked');
});
test('Input e selezione invalidi sono bloccati prima della quota',async()=>{
 for(const data of [{text:'',selection:''},{text,selection:'absent'},{text:'x'.repeat(8001),selection:''}]){assert.throws(()=>validateInput('reading_understand',data));assert.equal((await handle(req(data),{...env,BUDGET:null})).status,400);}
});
test('Citazioni inventate sono escluse e omissioni persistono fra Worker e client',()=>{
 const s=sample();s.terms.push({...s.terms[0],quote:'Invented quotation'});s.questions.push({...s.questions[0],quote:'Invented fact'});
 const clean=anchorReading(s,text);assert.equal(clean.omitted,2);assert.equal(clean.terms.length,1);assert.equal(clean.questions.length,1);assert.equal(anchorReading(clean,text).omitted,2);
 const missing=sample();delete missing.terms[0].why;assert.throws(()=>validateReply('reading_understand',missing));
});
test('Dizionario salva senso e origine; sensi distinti, duplicati senza azzerare ripasso; backup conserva analisi',()=>{
 const state=freshState(),t=sample().terms[0];const first=addTerm(state,{...t,source_text:t.quote,source_url:'https://example.test/article',explanation:t.why});first.seen=3;
 addTerm(state,{...t,source_text:t.quote,source_url:'https://example.test/new',explanation:t.why});assert.equal(state.vocabulary.length,1);assert.equal(first.seen,3);assert.equal(first.source_url,'https://example.test/new');
 addTerm(state,{...t,meaning_it:'selezionato con un segno'});assert.equal(state.vocabulary.length,2);
 state.readings.push({id:'read-test',title:'Titolo',source:'',text,translation:'',created_at:new Date().toISOString(),understanding:anchorReading(sample(),text),understanding_source:{text,source:'',selection:''},understanding_answers:{0:'Il cancello'}});
 assert.doesNotThrow(()=>validateState(state));const restored=parseBackup(JSON.stringify({format:"jflt-coach-backup/v2",state}));assert.equal(restored.readings[0].understanding_answers[0],'Il cancello');
 state.readings[0].understanding_source.text='Not the source';assert.throws(()=>validateState(state));
});
test('Ortografia verifica le maiuscole solo nelle consegne pertinenti; varianti britanniche/americane accettate',()=>{
 const items=grammarItems('spelling-control');const i=items.find(x=>x.answer==='Yesterday I called the office.');assert.equal(correct(i,'Yesterday i called the office.'),false);assert.equal(correct(i,'yesterday I called the office'),false);assert.equal(correct(i,'Yesterday I called the office'),true);assert.equal(correct(i,'Yesterday I called the office. '),true);
 const travel=items.find(x=>x.answer==='travelled');assert.equal(correct(travel,'traveled'),true);
 assert.equal(correct({answer:'Monday'},'monday'),true);
 for(const id of ['word-building','spelling-control','review-foundation','dependent-prepositions']){const rows=grammarItems(id);assert.equal(rows.length,30);assert.equal(new Set(rows.map(x=>x.stem)).size,30);}
});
