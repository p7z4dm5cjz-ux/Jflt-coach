import test from "node:test";
import assert from "node:assert/strict";
import {negativeItems} from "../negative-bank.js";
import {grammarItems} from "../practice-bank.js";
import {practiceBlock,trainingRecord,freshAiItems,exerciseRequest} from "../practice-flow.js";
import {freshState,correct,recoveryItems} from "../engine.js";
import {validateState,parseBackup} from "../storage.js";

const items=(label="one")=>Array.from({length:6},(_,i)=>({id:"id-"+label+"-"+i,kind:["completion","transformation","error_correction"][i%3],skill:"form",stem:label+" "+i+": Complete the negative.",answer:"did not",accept:["didn't"],options:[],why:"Did not + forma base."}));
const session=(all=negativeItems())=>({id:"set",lesson_id:"negatives",items:all,answers:{},assisted:false,completed_at:null,created_at:new Date().toISOString(),source:"local",training:trainingRecord(30)});
test("Negazioni: 30 consegne, quattro tipi e spiegazioni pertinenti, non la vecchia regola generica",()=>{
  const all=grammarItems("negatives");assert.equal(all.length,30);assert.equal(new Set(all.map(it=>it.stem)).size,30);assert.equal(new Set(all.map(it=>it.kind)).size,4);
  assert.ok(all.find(it=>it.rule==="be").why.includes("non serve do/does"));assert.ok(all.find(it=>it.rule==="past-did").why.includes("Il passato è già indicato da did"));assert.ok(all.find(it=>it.rule==="obligation").why.includes("non c'è obbligo"));
  for(const it of all){assert.ok(it.formula);assert.ok(correct(it,it.answer));if(it.options.length)assert.ok(it.options.includes(it.answer));}
});
test("Le otto varianti conservano le soluzioni e ogni frase da correggere contiene un errore",()=>{
  for(let variation=0;variation<8;variation++)for(const it of negativeItems(variation)) {
    for(const answer of it.accept)assert.ok(correct(it,answer));
    if(it.kind==="error_correction"){const source=it.stem.split(": ").at(-1);assert.equal(correct(it,source),false,it.stem);}
  }
  const previous=negativeItems(0),next=negativeItems(1);assert.equal(next.filter(it=>previous.some(old=>old.stem===it.stem)).length,0);
});
test("Riprova offline cambia frasi e mantiene soltanto le regole deboli richieste",()=>{
  const original=negativeItems(0),next=negativeItems(0,{count:6,rules:["be","past-did"],exclude:original.map(it=>it.stem)});
  assert.equal(next.length,6);assert.ok(next.every(it=>["be","past-did"].includes(it.rule)));assert.ok(next.every(it=>!original.some(old=>old.stem===it.stem)));
});
test("Negazioni: forme accettabili e contrasti di significato non vengono confusi",()=>{
  const all=negativeItems();assert.ok(correct(all[0],"isn't"));assert.equal(correct(all[0],"does not"),false);
  assert.ok(correct(all[4],"The technician didn't see the vehicle yesterday."));assert.equal(correct(all[4],"The technician didn't saw the vehicle yesterday."),false);
  assert.equal(correct(all[12],"must not wear a tie"),false);assert.ok(correct(all[18],"We have no spare keys"));assert.equal(correct(all[22],"None of the witnesses have signed"),false);
  assert.ok(correct(all[16],"The technician decided to not open the gate"));
});
test("I recuperi lessicali compaiono soltanto nel quinto blocco, senza cambiare il target grammaticale",()=>{
  const recovery=recoveryItems([{id:"word",expression:"carry out",meaning_it:"svolgere",example:"They carry out checks."}]);const set=session([...negativeItems(),...recovery]);set.training=trainingRecord(30,recovery);
  assert.equal(practiceBlock(set).items.length,6);set.training.page=4;const last=practiceBlock(set);assert.equal(last.items.length,7);assert.equal(last.target,31);assert.equal(last.items.at(-1).kind,"retrieval");
});
test("Un blocco AI ripetuto viene scartato prima di alterare la sessione",()=>{
  const first=items(),snapshot=JSON.stringify(first);assert.throws(()=>freshAiItems(first,{items:items()}),/ripetuto/);assert.equal(JSON.stringify(first),snapshot);
  assert.equal(freshAiItems(first,{items:items("new")}).length,6);const bad=items("new");bad[5].stem=bad[0].stem;assert.throws(()=>freshAiItems(first,{items:bad}),/ripetuto/);
});
test("La richiesta del blocco successivo include risposta, riferimento, regola e frasi già viste",()=>{
  const state=freshState(),set={...session(items()),source:"groq"};state.sessions=[set];set.answers[set.items[0].id]="didn't went";state.attempts=[{lesson_id:"negatives",session_id:set.id,item_id:set.items[0].id,stem:set.items[0].stem,answer:"didn't went",correct:false}];
  const data=exerciseRequest(state,"negatives",{set});assert.equal(data.practice.total,30);assert.equal(data.practice.block,2);assert.equal(data.already_seen.length,6);assert.equal(data.recent_errors[0].answer,"didn't went");assert.equal(data.recent_errors[0].reference,"did not");assert.ok(data.recent_errors[0].rule.includes("forma base"));
});
test("Un vecchio tentativo senza stem non blocca la nuova richiesta e il contesto rimane breve",()=>{
  const state=freshState();state.attempts=[{lesson_id:"negatives",correct:false,answer:"bad",session_id:"legacy"}];const data=exerciseRequest(state,"negatives");assert.ok(data.recent_errors[0].stem);
  const set=session(negativeItems());set.items.forEach(it=>it.stem="long ".repeat(300));state.sessions=[set];assert.ok(JSON.stringify(exerciseRequest(state,"negatives",{set})).length<26000);
});
test("Backup parziale AI e vecchie sessioni brevi restano ripristinabili",()=>{
  const state=freshState(),set={...session(items()),source:"groq"};state.sessions=[set];set.training.checked=[0];
  const restored=parseBackup(JSON.stringify({format:"jflt-coach-backup/v2",state}));assert.equal(restored.sessions[0].training.grammar_target,30);assert.equal(restored.sessions[0].items.length,6);
  const old={...session(negativeItems().slice(0,3)),id:"old"};delete old.training;state.sessions=[old];assert.equal(validateState(state).sessions[0].items.length,3);
});
test("Backup non può dichiarare finito un percorso ancora incompleto o una riprova autonoma",()=>{
  const state=freshState(),set={...session(items()),source:"groq"};state.sessions=[set];set.completed_at=new Date().toISOString();assert.throws(()=>validateState(state),/non corrispondono/);set.completed_at=null;set.training.checked=[0,0];assert.throws(()=>validateState(state),/blocchi/);
  const parent=session(),child={...session(items("retry")),id:"retry",source:"groq",training:trainingRecord(6,[],parent.id)};state.sessions=[parent,child];assert.throws(()=>validateState(state),/guidata/);child.assisted=true;validateState(state);
});
