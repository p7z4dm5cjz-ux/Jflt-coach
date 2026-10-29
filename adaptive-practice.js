import {practiceEvidence,progression} from "./evidence-policy.js";
import {negativeItems} from './negative-bank.js';
import {lessonItems} from './practice-bank.js';
import {normal} from './answer-normal.js';
// Practical thresholds, not a calibrated assessment of language proficiency.
export function blockAdaptation(state,set){
 // Stessa decisione di profilo e Worker: ultime risposte verificate della lezione, anche da
 // sessioni diverse; un errore più recente non ancora verificato blocca l'aumento.
 const progress=progression(practiceEvidence(state,set.lesson_id));
 if(progress.can_advance)return {mode:'advance',message:'Almeno 5 delle ultime 6 risposte verificate senza aiuti: puoi provare un confronto più impegnativo. Non significa aver concluso la lezione.'};
 const errors=progress.errors+progress.pending_errors;
 return errors>=3?{mode:'consolidate',message:'Riprendi i punti deboli con nuovi contesti e un obiettivo alla volta.'}:{mode:'hold',message:'Mantieni la difficoltà: hai '+progress.latest.length+' risposte nuove e verificabili nella finestra recente. Per aumentarla servono almeno cinque corrette sulle ultime sei senza aiuti. Le ripetizioni restano ripasso.'};
}
export function localRetry(state,set,focus,count=6){
 const seen=new Set([...state.sessions.flatMap(s=>s.items),...set.items].map(i=>normal(i.stem)));
 const ids=[...new Set(focus.map(i=>i.focus_lesson||set.lesson_id))],out=[];
 for(let variation=0;variation<8&&out.length<count;variation++)for(const id of ids){
  let pool;
  if(id==="negatives"){try{pool=negativeItems(variation,{count:6,rules:[...new Set(focus.map(i=>i.rule).filter(Boolean))],exclude:[...seen]});}catch{pool=[];}}else pool=lessonItems(id,variation);
  const candidates=pool.filter(i=>focus.some(f=>(f.focus_lesson||set.lesson_id)===id&&f.kind===i.kind&&(!f.rule||f.rule===i.rule)));
  for(const item of candidates){if(out.length>=count)break;const key=normal(item.stem);if(seen.has(key)||item.doubt)continue;seen.add(key);out.push({...item,focus_lesson:item.focus_lesson||id});}
 }
 return out;
}
export function replaceDoubts(items,lessonId,previous=[]){
 const seen=new Set([...previous,...items].map(i=>normal(i.stem))),pool=[];
 for(let v=0;v<4;v++)pool.push(...lessonItems(lessonId,v));
 return items.map(item=>{
  if(!item.doubt)return item;
  const candidate=pool.find(x=>!x.doubt&&!seen.has(normal(x.stem))&&(!x.focus_lesson||x.focus_lesson===lessonId));
  if(!candidate)return item;
  seen.add(normal(candidate.stem));
  return {...candidate,replacement_note:'Esercizio AI non confermato: sostituito con una prova della banca locale, senza una nuova chiamata.',replaced_item:{stem:item.stem,answer:item.answer,reason:item.check_note||'Soluzione non confermata'}};
 });
}
