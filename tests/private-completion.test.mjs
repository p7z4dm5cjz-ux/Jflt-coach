import test from 'node:test';
import assert from 'node:assert/strict';
import {tutorGateway} from '../private-gateway.js';
import {GLOSSARY,decorateGlossary,glossaryPage} from '../glossary.js';
import {LESSONS} from '../catalog.js';
import {freshState,endpoint,VERSION,API_VERSION} from '../engine.js';
import {planCycle} from '../path-planner.js';
import {pathBlockRequest,fallbackBlock} from '../path-flow.js';
import {assistedItem} from '../practice-support.js';
import {validateInput} from '../contract.js';
import {JSDOM} from 'jsdom';

const origin='https://coach.example.test';
const request=(path,token='',data=null,extra={})=>new Request(origin+'/api'+path,{method:data?'POST':'GET',headers:{...(token?{Authorization:'Bearer '+token}:{}),...(data?{'Content-Type':'application/json'}:{}),...extra},...(data?{body:JSON.stringify(data)}:{})});

test('gateway privato: nessuna rete senza credenziali, né da un’origine diversa',async()=>{
  let calls=0;const f=async()=>{calls++;throw Error('unexpected');};
  assert.equal((await tutorGateway(request('/health'),f)).status,401);
  assert.equal((await tutorGateway(request('/health','gsk_'+'x'.repeat(30),null,{Origin:'https://evil.test'}),f)).status,403);
  assert.equal((await tutorGateway(request('/unknown','gsk_'+'x'.repeat(30)),f)).status,404);
  assert.equal(calls,0);
});

test('codice esistente: inoltro al solo Worker noto, nessuna credenziale nella risposta',async()=>{
  const token='personal-tutor-code-more-than-24';let call;
  const response=await tutorGateway(request('/health',token),async(url,options)=>{call={url,options};return Response.json({version:VERSION,api_version:API_VERSION,groq_configured:true});});
  assert.equal(response.status,200);assert.equal(call.url,'https://jflt-coach.crl-r90.workers.dev/health');
  assert.equal(call.options.headers.Authorization,'Bearer '+token);assert.equal(call.options.redirect,'error');
  assert.ok(!(await response.text()).includes(token));assert.equal(response.headers.get('Cache-Control'),'no-store');
});

test('Groq diretto: contratto, prompt corrente, controllo alla cieca e dati sugli errori',async()=>{
  const s=freshState(),cycle={...planCycle(s,{force:'past-simple'}),n:1,block_ids:[]};
  s.sessions.push({id:'old',source:'groq',completed_at:new Date().toISOString(),lesson_id:'past-simple',items:[{id:'error',origin:'groq',check:'confirmed',rules:['past-simple.neg'],answer:'did not go'}]});
  s.attempts.push({session_id:'old',item_id:'error',lesson_id:'past-simple',stem:'Yesterday she ___ (not go).',answer:'did not went',correct:false,assisted:false,source:'groq'});
  const data=pathBlockRequest(s,{id:'private-test'},cycle,0);assert.equal(data.recent_errors[0].given,'did not went');validateInput('path_block',data);
  const sent=[],key='gsk_'+'t'.repeat(30);
  const reply={passages:[],items:data.slots.map((slot,i)=>({n:i+1,kind:'completion',stem:'Scrivi solo le parole mancanti: She ___ yesterday. (leave)',answer:'left',accept:['left'],options:[],why:'Il fatto è concluso nel passato.',group:''}))};
  const response=await tutorGateway(request('/tutor',key,{api_version:API_VERSION,request_id:'private-test',task:'path_block',data,verify:true}),async(url,options)=>{
    assert.equal(url,'https://api.groq.com/openai/v1/chat/completions');assert.equal(options.headers.Authorization,'Bearer '+key);
    const payload=JSON.parse(options.body);sent.push(payload);
    const result=sent.length===1?reply:{answers:data.slots.map((slot,i)=>({n:i+1,best:'left',all_valid:[],ambiguous:false,rule:slot.rule,names_form:false}))};
    return Response.json({choices:[{finish_reason:'stop',message:{content:JSON.stringify(result)}}]});
  });
  assert.equal(response.status,200);const body=await response.json();assert.equal(body.prompt_revision,'groq-path-feedback-v20');assert.equal(sent.length,2);
  assert.match(sent[0].messages[0].content,/livello e la progressione sono decisi dall’app/);
  assert.equal(JSON.parse(sent[0].messages[1].content).recent_errors[0].expected,'did not go');
  assert.ok(!JSON.stringify(JSON.parse(sent[1].messages[1].content)).includes('"answer"'));
  assert.ok(body.result.items.every(i=>i.check==='confirmed'));assert.ok(!JSON.stringify(body).includes(key));
  const invalid=structuredClone(data);invalid.recent_errors[0].given='x'.repeat(601);assert.throws(()=>validateInput('path_block',invalid),/Errori recenti/);
});

test('errori non verificati non diventano un profilo e non guidano il tutor',()=>{
  const s=freshState(),cycle={...planCycle(s,{force:'past-simple'}),n:1,block_ids:[]};
  s.sessions.push({id:'bad',source:'groq',completed_at:new Date().toISOString(),items:[{id:'x',origin:'groq',rules:['past-simple.neg'],answer:'left'}]});
  s.attempts.push({session_id:'bad',item_id:'x',lesson_id:'past-simple',stem:'A question',answer:'wrong',correct:false,source:'groq'});
  assert.equal(pathBlockRequest(s,{id:'test'},cycle,0).recent_errors,undefined);
});

test('ogni argomento previsto: tre blocchi e quindici slot prima degli intrecci',()=>{
  for(const lesson of LESSONS){const s=freshState();s.lesson_levels={[lesson.id]:{level:2,autonomous:false,pending_transfer:false,history:[]}};const cycle=planCycle(s,{force:lesson.id});assert.ok(cycle,lesson.id);assert.deepEqual(cycle.blocks.map(b=>b.length),[5,5,5]);assert.equal(cycle.blocks.flat().filter(x=>x.lesson_id===lesson.id).length,15,lesson.id);}
});

test('riserva locale: cinque esercizi per tutti i livelli, senza salti né attribuzioni ad altre lezioni',()=>{
  for(const lesson of LESSONS)for(const level of [1,2,3,4]){
    const s=freshState();s.lesson_levels={[lesson.id]:{level,autonomous:false,pending_transfer:false,history:[]}};
    const cycle=planCycle(s,{force:lesson.id});
    for(const slots of cycle.blocks){const {items}=fallbackBlock(s,slots);assert.equal(items.length,5,lesson.id+' '+level);
      for(const [n,item] of items.entries()){
        assert.ok(item.rules.some(r=>r.startsWith(slots[n].lesson_id+'.')),lesson.id);
        assert.ok(item.level<=Math.max(2,slots[n].level),lesson.id);
        if(item.level>slots[n].level)assert.equal(assistedItem({assisted:false},item),true);
      }
    }
  }
});

test('glossario: riferimenti validi, apertura cliccabile e ricerca senza risultati',async()=>{
  for(const term of GLOSSARY)assert.ok(LESSONS.some(l=>l.id===term.lesson),term.lesson);
  const dom=new JSDOM('<main><p>Usa un ausiliare con il participio passato.</p><fieldset><p>ausiliare</p></fieldset></main>');
  Object.defineProperty(globalThis,'document',{value:dom.window.document,configurable:true});Object.defineProperty(globalThis,'Node',{value:dom.window.Node,configurable:true});
  const {h}=await import('../app.js');const root=document.querySelector('main');decorateGlossary(root,h);
  assert.equal(root.querySelectorAll('.glossary-term').length,2);const b=root.querySelector('button');b.click();assert.equal(b.getAttribute('aria-expanded'),'true');assert.equal(b.nextElementSibling.hidden,false);b.click();assert.equal(b.nextElementSibling.hidden,true);
  const nodes=glossaryPage({h,p:t=>h('p',{},t),card:(...c)=>h('section',{},c),link:(t,path)=>h('a',{href:'#/'+path},t),title:(a,b)=>h('h1',{},b)});root.replaceChildren(...nodes);const q=root.querySelector('#glossary-search');q.value='nessuna-voce-123';q.dispatchEvent(new dom.window.Event('input'));assert.match(root.textContent,/Nessuna voce trovata/);
});

test('endpoint del sito privato: accetta solo la propria API e conserva i Worker HTTPS',()=>{
  globalThis.JFLT_PRIVATE_SITE=true;Object.defineProperty(globalThis,'location',{value:new URL(origin+'/coach/index.html'),configurable:true});
  assert.equal(endpoint(origin+'/api'),origin+'/api');assert.equal(freshState().settings.endpoint,origin+'/api');
  assert.throws(()=>endpoint('https://another.test/api'));assert.throws(()=>endpoint(origin+'/api?key=bad'));assert.throws(()=>endpoint(origin+'/api#bad'));
  assert.equal(endpoint('https://jflt-coach.crl-r90.workers.dev'),'https://jflt-coach.crl-r90.workers.dev');
  globalThis.JFLT_PRIVATE_SITE=false;
});
