import {negativeItems} from './negative-bank.js';
import {grammarItems} from './practice-bank.js';
import {normal} from './answer-normal.js';
// Practical thresholds, not a calibrated assessment of language proficiency.
export function blockAdaptation(state,set){
 const page=set.training?.page||0,items=set.training?set.items.slice(page*6,page*6+6):set.items;
 const ids=new Set(items.filter(i=>i.kind!=='retrieval'&&!i.doubt).map(i=>i.id));
 const rows=state.attempts.filter(a=>a.session_id===set.id&&ids.has(a.item_id)&&!a.disputed);
 const independent=rows.filter(a=>a.correct&&!a.assisted).length;
 if(rows.length<3)return {mode:'hold',message:'Risposte valutabili insufficienti: manteniamo il livello, senza dedurre una difficoltà personale.'};
 const ratio=independent/rows.length;
 return ratio>=0.8?{mode:'advance',message:'Buona riuscita senza aiuti: passa al livello successivo con meno sostegni.'}:ratio<0.5?{mode:'consolidate',message:'Prima consolida: riprova le regole del blocco con frasi diverse e un obiettivo alla volta.'}:{mode:'hold',message:'Mantieni il livello: alterna nuove prove sui punti incerti e confronto fra significati.'};
}
export function localRetry(state,set,focus,count=6){
 const seen=new Set([...state.sessions.flatMap(s=>s.items),...set.items].map(i=>normal(i.stem)));
 const ids=[...new Set(focus.map(i=>i.focus_lesson||set.lesson_id))],out=[];
 for(let variation=0;variation<8&&out.length<count;variation++)for(const id of ids){
  let pool;
  if(id==="negatives"){try{pool=negativeItems(variation,{count:6,rules:[...new Set(focus.map(i=>i.rule).filter(Boolean))],exclude:[...seen]});}catch{pool=[];}}else pool=grammarItems(id,variation);
  const candidates=pool.filter(i=>focus.some(f=>(f.focus_lesson||set.lesson_id)===id&&f.kind===i.kind&&(!f.rule||f.rule===i.rule)));
  for(const item of candidates){if(out.length>=count)break;const key=normal(item.stem);if(seen.has(key)||item.doubt)continue;seen.add(key);out.push({...item,focus_lesson:item.focus_lesson||id});}
 }
 return out;
}
export function replaceDoubts(items,lessonId,previous=[]){
 const seen=new Set([...previous,...items].map(i=>normal(i.stem))),pool=[];
 for(let v=0;v<4;v++)pool.push(...grammarItems(lessonId,v));
 return items.map(item=>{
  if(!item.doubt)return item;
  const candidate=pool.find(x=>!x.doubt&&!seen.has(normal(x.stem))&&(!x.focus_lesson||x.focus_lesson===lessonId));
  if(!candidate)return item;
  seen.add(normal(candidate.stem));
  return {...candidate,replacement_note:'Esercizio AI non confermato: sostituito con una prova della banca locale, senza una nuova chiamata.',replaced_item:{stem:item.stem,answer:item.answer,reason:item.check_note||'Soluzione non confermata'}};
 });
}
