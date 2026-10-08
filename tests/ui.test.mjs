import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {JSDOM} from "jsdom";
import {IDBFactory} from "fake-indexeddb";
import {openRepository} from "../storage.js";
import {PHRASALS} from "../catalog.js";
import {QUESTIONS,orderedQuestions} from "../placement.js";
const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
const dom=new JSDOM(html,{url:"https://p7z4dm5cjz-ux.github.io/Jflt-coach/",pretendToBeVisual:true});
for(const [key,value] of Object.entries({window:dom.window,document:dom.window.document,location:dom.window.location,Node:dom.window.Node,navigator:dom.window.navigator,sessionStorage:dom.window.sessionStorage,localStorage:dom.window.localStorage}))Object.defineProperty(globalThis,key,{value,configurable:true});
dom.window.scrollTo=()=>{};
const {mountApp}=await import("../app.js"),repo=await openRepository(new IDBFactory());let calls=[];
const tutor=async(settings,path,task,data)=>{
  calls.push({path,task,data});
  if(path==="/health")return {version:"1.0.0",groq_configured:true,capabilities:[]};
  if(path==="/check")return {provider_checked:true};
  if(task==="writing_review")return {summary:"La cronologia è chiara.",priorities:["Controlla il passato.","<img src=x onerror=alert(1)>"],rubric:{grammar:"Un punto da correggere.",content:"Fatti completi.",cohesion:"Chiara.",register:"Adatto."},issues:[{quote:"Yesterday",correction:"Yesterday",explanation:"Controlla il tempo.",kind:"style",category:"past-simple"},{quote:"Not in source",correction:"Invented",explanation:"Da omettere",kind:"error",category:"tenses"}]};
  if(task==="writing_compare")return {summary:"Riscrittura più chiara.",resolved:["Cronologia chiarita."],remaining:[],transfer:Array.from({length:3},(_,i)=>({stem:"Completa la negativa: She ___ go yesterday. "+i,answer:"did not",accept:["didn't"],why:"Did richiede la forma base."}))};
  if(task==="exercises")return {items:Array.from({length:6},(_,i)=>({kind:["completion","transformation","error_correction"][i%3],stem:"Completa la negativa "+i+": They ___ leave yesterday.",options:[],answer:"did not",accept:["didn't"],why:"Did + not + forma base."}))};
  if(task==="reading_review")return {summary:"Significato ricostruito.",segments:[{quote:"The team carried out",translation:"Il gruppo ha svolto",explanation:"Carry out indica eseguire."},{quote:"Invented quote",translation:"inventata",explanation:"non valida"}],terms:[{expression:"carried out",meaning_it:"ha svolto",example:"The team carried out a routine check."}]};
  throw new Error("Unexpected task "+task);
};
const app=await mountApp(repo,document.getElementById("view"),tutor);
async function until(fn){for(let i=0;i<200;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw new Error("UI timeout: "+document.getElementById("view").textContent.slice(0,180));}
async function visit(path){location.hash="#/"+path;await app.render();await new Promise(r=>setTimeout(r,0));}
function input(selector,value){const el=document.querySelector(selector);assert.ok(el,selector);el.value=value;el.dispatchEvent(new window.Event("input",{bubbles:true}));}
function click(text){const el=[...document.querySelectorAll("#view button")].find(b=>b.textContent===text);assert.ok(el,text);el.click();}
test("Percorso, negazioni e ricerca phrasal visibili",async()=>{assert.ok(document.getElementById("view").textContent.includes("Negazioni senza cambiare"));await visit("studio");assert.ok(document.querySelectorAll(".lesson-card").length>=59);input("#lesson-search","perfect");assert.ok(document.querySelectorAll(".lesson-card").length>5);await visit("phrasals");input("#phrasal-search","carry out");assert.equal(document.querySelectorAll(".lesson-card").length,1);});
test("Sessione AI valida con lessico omesso aggiunge tre recuperi locali",async()=>{await repo.change(s=>{s.vocabulary=PHRASALS.slice(0,3).map(t=>({...t,streak:0,seen:0,due:new Date(0).toISOString()}));});await visit("lesson/negatives");click("Genera 6 esercizi con Groq");await until(()=>document.querySelectorAll(".exercise").length===9);const set=repo.get().sessions.at(-1);assert.equal(set.items.filter(i=>i.kind==="retrieval").length,3);assert.equal(calls.at(-1).task,"exercises");for(const i of set.items)input("#"+i.id,i.answer);await app.flush();document.querySelector("#practice-form").dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));await until(()=>!!repo.get().sessions.at(-1).completed_at);assert.equal(repo.get().attempts.filter(a=>a.correct).length,9);assert.ok(repo.get().vocabulary.every(v=>v.streak===1));});
test("Autosave conserva la bozza attraversando una navigazione immediata",async()=>{await visit("writing");click("Apri l'editor");await until(()=>!!document.querySelector("#draft"));input("#draft","Yesterday the team inspected the site and recorded the damage. No one was injured. A witness described a noise but had not seen anyone near the building. The area was secured while further checks were arranged.");await visit("home");await visit("writing/"+repo.get().writings.at(-1).id);assert.ok(document.querySelector("#draft").value.startsWith("Yesterday"));});
test("Revisione ancorata, testo ostile inerte e riscrittura con verifica",async()=>{click("Chiedi la revisione");await until(()=>!!document.querySelector("#rewrite"));assert.equal(document.querySelector("#view img"),null);assert.equal(repo.get().writings.at(-1).feedback.omitted,1);input("#rewrite",repo.get().writings.at(-1).draft);click("Confronta bozza e riscrittura");await until(()=>document.getElementById("notice").textContent.includes("modificare"));assert.equal(calls.at(-1).task,"writing_review");input("#rewrite",repo.get().writings.at(-1).draft+" The supervisor was informed at 09:10.");click("Confronta bozza e riscrittura");await until(()=>document.getElementById("view").textContent.includes("3. Confronto"));click("Verifica in un nuovo contesto");await until(()=>document.querySelectorAll(".exercise").length===3);const set=repo.get().sessions.at(-1);assert.ok(set.writing_id);for(const i of set.items)input("#"+i.id,"didn't");await app.flush();document.querySelector("#practice-form").dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));await until(()=>!!repo.get().sessions.at(-1).completed_at);await visit("writing/"+set.writing_id);assert.ok(document.getElementById("view").textContent.includes("3/3 corrette senza aiuti"));});
test("Pretest 45 risposte salvate, nessuna soluzione prima della consegna",async()=>{await visit("placement");click("Inizia il pretest");await until(()=>document.querySelector("#placement-form"));const seed=repo.get().placement.seed;
  for(const [index,item] of orderedQuestions(seed).entries()){
    const f=document.querySelector("#placement-form");
    if(item.options){const opt=[...f.querySelectorAll('input[type="radio"]')].find(v=>v.value===item.answer);opt.checked=true;}else input("#placement-answer",item.answer);
    f.dispatchEvent(new window.Event("submit",{bubbles:true,cancelable:true}));
    await until(()=>repo.get().placement.answers.length===index+1);
    await until(()=>index===44?document.getElementById("view").textContent.includes("Pronto per la consegna"):document.querySelector("legend")?.textContent.startsWith("Domanda "+(index+2)+" "));
    assert.equal(document.getElementById("view").textContent.includes("Risposta di riferimento:"),false);
  }
  click("Consegna il pretest");await until(()=>document.getElementById("view").textContent.includes("45/45 corrette"));assert.equal(repo.get().placement.answers.length,QUESTIONS.length);
});
test("Lettura conserva traduzione e filtra citazioni inventate",async()=>{await visit("reading");click("Nuova lettura");await until(()=>!!document.querySelector("#reading-text"));input("#reading-text","The team carried out a routine inspection of the equipment before the next shift.");input("#translation","Il gruppo ha effettuato un controllo ordinario dell'attrezzatura prima del turno successivo.");click("Confronta la traduzione con Groq");await until(()=>document.getElementById("view").textContent.includes("Confronto ragionato"));assert.equal(repo.get().readings.at(-1).feedback.segments.length,1);});
test("Verifica Groq sempre presente, versioni separate",async()=>{await visit("settings");assert.ok([...document.querySelectorAll("button")].some(b=>b.textContent==="Verifica Groq"));click("Verifica collegamento Worker");await until(()=>document.getElementById("view").textContent.includes("risposta non ancora verificata"));click("Verifica Groq");await until(()=>document.getElementById("view").textContent.includes("Risposta verificata"));});
test.after(()=>repo.close());
