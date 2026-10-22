import test from "node:test";
import assert from "node:assert/strict";
import {validateInput,validateReply,SHAPES} from "../contract.js";
import {applyPathVerification,pathVerificationRequest} from "../verification.js";
import {handle} from "../worker/index.js";

const token="path-block-token-longer-than-24-chars";
const env={APP_TOKEN:token,GROQ_API_KEY:"private-test-provider-key",ALLOWED_ORIGIN:"https://example.test",MODEL:"openai/gpt-oss-120b",BUDGET:{idFromName:()=>1,get:()=>({fetch:async()=>Response.json({ok:true})})}};
const slot=(n,lesson_id,key,level,role="main",group=null)=>({n,lesson_id,rule:lesson_id+"."+key,level,role,group});
const L4={path_id:"path-1",cycle:1,page:0,main_lesson:"present-simple",main_level:4,slots:[slot(1,"present-simple","use",4,"main","p1"),slot(2,"present-simple","use",4,"main","p1"),slot(3,"present-simple","use",4,"main","p1"),slot(4,"future-going-to","evidence",1,"review"),slot(5,"present-simple","neg",2)]};
const L3={path_id:"path-1",cycle:2,page:1,main_lesson:"present-simple",main_level:3,slots:[slot(1,"present-simple","use",3),slot(2,"present-simple","contrast",3),slot(3,"present-simple","neg",3),slot(4,"present-continuous","use",2,"intertwined"),slot(5,"past-simple","use",3,"review")]};
const L3reply={passages:[],items:[
  {n:1,kind:"completion",stem:"Scrivi solo la parola mancante: The office ___ at eight every morning. (open)",options:[],answer:"opens",accept:["opens"],why:"Abitudine: present simple.",group:""},
  {n:2,kind:"choice",stem:"Scegli la forma corretta: Quiet, please — the captain ___ to the press right now.",options:["is speaking","speaks","spoke"],answer:"is speaking",accept:["is speaking"],why:"Azione in corso ora.",group:""},
  {n:3,kind:"completion",stem:"Scrivi solo le parole mancanti: He ___ on Sundays, so the desk is empty. (not work, usa il present simple)",options:[],answer:"doesn't work",accept:["doesn't work","does not work"],why:"Negativa con does.",group:""},
  {n:4,kind:"completion",stem:"Scrivi solo le parole mancanti: Look, they ___ the gate now. (close)",options:[],answer:"are closing",accept:["are closing"],why:"Azione in corso.",group:""},
  {n:5,kind:"completion",stem:"Scrivi solo la parola mancante: The patrol ___ the area two hours ago. (leave)",options:[],answer:"left",accept:["left"],why:"Tempo passato concluso.",group:""}
]};
const request=(data,verify=true)=>new Request("https://worker.test/tutor",{method:"POST",headers:{Authorization:"Bearer "+token,Origin:env.ALLOWED_ORIGIN,"Content-Type":"application/json"},body:JSON.stringify({api_version:1,request_id:"req-path",task:"path_block",data,verify})});
const provider=result=>Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify(result)}}]});

test("richiesta del blocco: 5 slot con regola della propria lezione, 3 spazi solo al livello 4", () => {
  assert.equal(validateInput("path_block",L4),L4);
  assert.equal(validateInput("path_block",L3),L3);
  const broken=change=>{const d=structuredClone(L4);change(d);return ()=>validateInput("path_block",d);};
  assert.throws(broken(d=>d.slots.pop()),/5 esercizi/);
  assert.throws(broken(d=>d.slots[0].rule="past-simple.use"),/5 esercizi/);
  assert.throws(broken(d=>d.slots[4].level=5),/5 esercizi/);
  assert.throws(broken(d=>d.slots[2].group=null),/spazi del testo/);
  assert.throws(broken(d=>d.slots[0].level=3),/spazi del testo/);
  assert.throws(broken(d=>d.avoid=["x".repeat(300)]),/già viste/);
});

test("risposta del blocco: livello, spazi e testo rispettano gli slot", () => {
  assert.ok(validateReply("path_block",SHAPES.path_block,L4));
  assert.ok(validateReply("path_block",L3reply,L3));
  const broken=(data,change)=>{const p=structuredClone(data===L4?SHAPES.path_block:L3reply);change(p);return ()=>validateReply("path_block",p,data);};
  assert.throws(broken(L4,p=>{p.items[3]={...p.items[4],n:4};}),/livello 1 richiede una scelta/);
  assert.throws(broken(L4,p=>{p.passages[0].text=p.passages[0].text.replace("(2) ___","___");}),/manca lo spazio \(2\) ___/);
  assert.throws(broken(L4,p=>{p.items[1].stem="Scrivi la forma corretta (ring).";}),/Spazio \(2\)/);
  assert.throws(broken(L4,p=>{p.passages=[];}),/serve un testo/);
  assert.throws(broken(L3,p=>{p.passages=[{group:"p1",text:"A text."}];}),/gruppo del testo|solo con gli spazi/);
  assert.throws(broken(L3,p=>{p.items[0].stem="Scrivi solo la parola mancante: "+"word ".repeat(50)+"___";}),/troppo lunga/);
  assert.throws(broken(L3,p=>{p.items[2].n=4;}),/fuori ordine/);
  assert.throws(broken(L3,p=>{p.items[0].group="p1";}),/gruppo diverso/);
});

test("Worker: regole sconosciute rifiutate, contesto senza libri, ragionamento medio dal livello 3", async () => {
  const bad=structuredClone(L3);bad.slots[0].rule="present-simple.nope";
  let calls=0;
  const refused=await handle(request(bad),env,async()=>{calls++;return provider(L3reply);});
  assert.equal(refused.status,400);assert.equal(calls,0);
  const sent=[];
  const ok=await handle(request(L3,false),env,async(_u,options)=>{sent.push(JSON.parse(options.body));return provider(L3reply);});
  assert.equal(ok.status,200);
  const [body]=sent;
  assert.equal(body.reasoning_effort,"medium");assert.equal(body.temperature,0.5);assert.equal(body.max_completion_tokens,6000);
  assert.equal(body.response_format.json_schema.name,"jflt_path_block");
  const system=body.messages[0].content;
  assert.ok(system.includes("Livello 3, distinguere dal contesto"));
  const context=JSON.parse(system.slice(system.indexOf("Riferimenti didattici della richiesta: ")+39));
  assert.deepEqual(Object.keys(context).sort(),["lessons","rules"]);
  assert.deepEqual(Object.keys(context.lessons).sort(),["past-simple","present-continuous","present-simple"]);
  assert.ok(context.rules["present-simple.contrast"].name);
  assert.ok(!system.includes('"books"'));
  const low=structuredClone(L3);low.slots.forEach(s=>s.level=Math.min(s.level,2));
  const lowSent=[];await handle(request(low,false),env,async(_u,o)=>{lowSent.push(JSON.parse(o.body));return provider(L3reply);});
  assert.equal(lowSent[0].reasoning_effort,"low");
});

test("controllo del percorso: forma nominata dal livello 3, regola di un'altra lezione, regola riassegnata", async () => {
  const sent=[];
  const answers=[
    {n:1,best:"opens",all_valid:[],ambiguous:false,rule:"present-simple.use",names_form:false},
    {n:2,best:"is speaking",all_valid:[],ambiguous:false,rule:"present-continuous.use",names_form:false},
    {n:3,best:"doesn't work",all_valid:["does not work"],ambiguous:false,rule:"present-simple.neg",names_form:true},
    {n:4,best:"are closing",all_valid:[],ambiguous:false,rule:"present-continuous.use",names_form:false},
    {n:5,best:"left",all_valid:[],ambiguous:false,rule:"past-simple.form",names_form:false}
  ];
  const response=await handle(request(L3),env,async(_u,options)=>{const b=JSON.parse(options.body);sent.push(b);return provider(sent.length===1?L3reply:{answers});});
  assert.equal(response.status,200);
  assert.equal(sent.length,2);
  assert.equal(sent[1].response_format.json_schema.name,"jflt_verify_path");
  const verifyInput=JSON.parse(sent[1].messages[1].content);
  assert.ok(verifyInput.items[0].rule_options.some(r=>r.startsWith("present-simple.contrast: ")));
  assert.ok(!JSON.stringify(verifyInput).includes('"answer"'));
  const {result,verification}=await response.json();
  const [a,b,c,d,e]=result.items;
  assert.equal(a.check,"confirmed");assert.deepEqual(a.rules,["present-simple.use"]);assert.equal(a.level,3);assert.equal(a.focus_lesson,"present-simple");assert.equal(a.path_role,"main");
  assert.equal(b.check,"doubt");assert.match(b.check_note,/lezione prevista/);
  assert.equal(c.check,"doubt");assert.match(c.check_note,/nomina la forma/);
  assert.equal(d.check,"confirmed");assert.equal(d.level,2);assert.equal(d.path_role,"intertwined");
  assert.deepEqual(e.rules,["past-simple.form"]);assert.equal(e.rule_retagged,"past-simple.use");
  assert.equal(verification.doubts,2);assert.equal(verification.retagged,1);assert.equal(verification.named,1);
});

test("controllo del percorso: senza risposta del controllo gli esercizi restano non verificati ma etichettati", () => {
  const {items,summary}=applyPathVerification(L3reply.items,null,L3.slots);
  assert.equal(summary.status,"unavailable");
  assert.ok(items.every((i,n)=>i.check==="unchecked"&&i.rules[0]===L3.slots[n].rule&&i.level===L3.slots[n].level));
  const req=pathVerificationRequest(SHAPES.path_block.items,SHAPES.path_block.passages,L4.slots,{});
  assert.ok(req.items[0].passage.includes("(1) ___"));assert.equal(req.items[3].passage,null);
});

test("revisione: livello 2 senza scelte, lezioni e regole inesistenti rifiutate senza errori del Worker", async () => {
  const p=structuredClone(L3reply);p.items[3]={...p.items[1],n:4};
  assert.throws(()=>validateReply("path_block",p,L3),/livello 2 richiede di produrre/);
  for(const change of [d=>{d.main_lesson="constructor";},d=>{d.slots[0].lesson_id="__proto__";d.slots[0].rule="__proto__.use";},d=>{d.weak_rules=[{rule:"present-simple.nope",n:2,correct:0}];}]){
    const bad=structuredClone(L3);change(bad);let calls=0;
    const response=await handle(request(bad),env,async()=>{calls++;return provider(L3reply);});
    assert.equal(response.status,400);assert.equal(calls,0);
  }
});
