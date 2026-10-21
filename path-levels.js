// Livelli delle lezioni nel percorso adattivo (fase 3).
// Livelli: 1 riconoscere, 2 produrre con aiuto, 3 distinguere dal contesto, 4 intrecciare.
// Il livello 5 (trasferimento) è una prova a parte che chiude il livello 4.
// Soglie decise con Carlo: ≥ 80% senza aiuti sale, 60–80% resta, < 60% scende.
import {placementProfile} from "./placement.js";
import {practiceWindow} from "./grammar-checks.js";
import {startingLevel} from "./starting-level.js";
import {normal} from "./answer-normal.js";
import {reliableItem} from "./evidence-policy.js";

export const MAX_LEVEL=4,WINDOW=30,MIN_ANSWERS=9,UP=0.8,DOWN=0.6,STUCK_CYCLES=3;
const MORPHOLOGY=new Set(["form","neg","q"]);
// Le regole di sola forma (forma, negativa, domanda) non hanno un livello di riconoscimento.
export const minLevelFor=ruleId=>MORPHOLOGY.has(String(ruleId).split(".")[1])?2:1;

export function initialLevel(state,lessonId){
  const w=practiceWindow(state,lessonId);
  if(w.independent)return {level:MAX_LEVEL,autonomous:true,source:"independent"};
  const status=placementProfile(state.placement)?.lessonStatus?.[lessonId];
  const start=startingLevel(state)?.id;
  const base=status==="review"?1:status==="skip"?3:status==="confirm"?2:["A1","A2"].includes(start)?1:2;
  // Le prove più recenti prevalgono sul pretest: 5 corrette sulle ultime 6 verificate, senza aiuti,
  // dimostrano già la produzione con aiuto (livello 2).
  if(w.can_advance&&base<2)return {level:2,autonomous:false,source:"practice"};
  return {level:base,autonomous:false,source:status?"pretest":"default"};
}
export function levelState(state,lessonId){
  const saved=state.lesson_levels?.[lessonId];
  if(!saved)return {...initialLevel(state,lessonId),changed_at:null,pending_transfer:false,history:[]};
  // Un livello salvato ma mai deciso da un ciclo (solo fissato all'avvio) sale se gli esercizi già fatti lo dimostrano.
  if(!saved.history?.length&&!saved.autonomous&&!saved.pending_transfer){const start=initialLevel(state,lessonId);if(start.source==="practice"&&start.level>saved.level)return {...saved,level:start.level};}
  return {...saved};
}

// Risposte del percorso valide per i livelli: esercizi con regola e livello, verificati
// (blocco controllato), senza aiuti, non contestati, prima esposizione di ogni frase.
export function pathAnswers(state,lessonId){
  const sessions=new Map((state.sessions||[]).map(s=>[s.id,s])),seen=new Set(),rows=[];
  for(const a of state.attempts||[]){
    const key=normal(a.context_id||a.stem||"");if(seen.has(key))continue;seen.add(key);
    if(a.lesson_id!==lessonId||a.disputed||a.assisted||a.source==="legacy")continue;
    const set=sessions.get(a.session_id),item=set?.items.find(i=>i.id===a.item_id);
    if(!set?.path_id||set.assisted||set.hinted_items?.includes(a.item_id)||!set.completed_at||!item||item.doubt||!Number.isInteger(item.level)||!Array.isArray(item.rules)||!reliableItem(item,a.source))continue;
    rows.push({stem:a.stem,correct:!!a.correct,level:item.level,rules:item.rules,date:a.date,session_id:a.session_id,role:item.path_role||null});
  }
  return rows;
}

export function ruleStats(state,lessonId,{last=40}={}){
  const out={};
  for(const r of pathAnswers(state,lessonId).slice(-last))for(const id of r.rules){out[id]??={n:0,correct:0};out[id].n++;if(r.correct)out[id].correct++;}
  return out;
}

// Decisione a fine ciclo sulla lezione principale.
export function cycleDecision(state,lessonId,level=null){
  const ls=levelState(state,lessonId);
  if(Number.isInteger(level))ls.level=level;
  const rows=pathAnswers(state,lessonId).filter(r=>r.level===ls.level&&(!ls.changed_at||r.date>=ls.changed_at)).slice(-WINDOW);
  const n=rows.length,correct=rows.filter(r=>r.correct).length,accuracy=n?correct/n:0;
  let decision="insufficient";
  if(n>=MIN_ANSWERS)decision=accuracy>=UP?"up":accuracy>=DOWN?"stay":"down";
  return {lesson_id:lessonId,level:ls.level,n,correct,accuracy,decision,transfer:decision==="up"&&ls.level>=MAX_LEVEL};
}

// Applica la decisione allo stato (dentro repo.change). Restituisce il nuovo livello.
export function applyDecision(state,result,timestamp=new Date().toISOString()){
  const ls=levelState(state,result.lesson_id),from=Number.isInteger(result.level)?result.level:ls.level;
  let to=from;
  if(result.decision==="up"&&from<MAX_LEVEL)to=from+1;
  if(result.decision==="down")to=Math.max(1,from-1);
  if(result.decision==="down")ls.autonomous=false;
  ls.pending_transfer=result.transfer?true:result.decision==="down"?false:!!ls.pending_transfer;
  // Anche al livello 1 una discesa riapre la finestra: le risposte sbagliate restano alle spalle.
  if(to!==from||result.decision==="down"){ls.level=to;ls.changed_at=timestamp;}
  ls.history=[...(ls.history||[]),{at:timestamp,from,to,decision:result.decision,n:result.n,correct:result.correct}].slice(-20);
  // Tre cicli di fila senza salire né scendere (anche per risposte insufficienti, per esempio senza
  // tutor ai livelli 3-4): la lezione va in pausa e il percorso passa alla successiva; torna
  // principale quando un'altra lezione va in pausa o completa il livello 4.
  const recent=ls.history.filter(h=>!ls.parked_at||h.at>ls.parked_at).slice(-STUCK_CYCLES);
  const stuck=recent.length===STUCK_CYCLES&&recent.every(h=>["stay","insufficient"].includes(h.decision)&&h.from===to&&h.to===to);
  state.lesson_levels??={};
  if(stuck||ls.pending_transfer)for(const other of Object.values(state.lesson_levels))delete other.parked;
  if(stuck){ls.parked=true;ls.parked_at=timestamp;}else delete ls.parked;
  const {source,...saved}=ls;
  state.lesson_levels[result.lesson_id]=saved;
  return to;
}

// Intrecciate e ripassi: 2 errori nelle ultime 3 risposte da lezione secondaria (dall'ultimo cambio
// di livello, almeno una in questo ciclo) fanno scendere la lezione di un livello e tolgono l'autonomia.
export function secondaryCheck(state,lessonId,sessionIds,timestamp=new Date().toISOString()){
  const ls=levelState(state,lessonId);
  const rows=pathAnswers(state,lessonId).filter(r=>["intertwined","review"].includes(r.role)&&(!ls.changed_at||r.date>=ls.changed_at)).slice(-3);
  if(rows.length<2||!rows.some(r=>sessionIds.includes(r.session_id)))return null;
  const wrong=rows.filter(r=>!r.correct).length;
  if(wrong<2)return null;
  const from=ls.level;
  ls.level=Math.max(1,from-1);ls.autonomous=false;ls.pending_transfer=false;ls.changed_at=timestamp;
  ls.history=[...(ls.history||[]),{at:timestamp,from,to:ls.level,decision:"secondary-down",n:rows.length,correct:rows.length-wrong}].slice(-20);
  const {source,...saved}=ls;
  state.lesson_levels??={};state.lesson_levels[lessonId]=saved;
  return ls.level;
}

// Fissa il livello di partenza all'inizio del ciclo: la decisione non cambia se nel frattempo
// cambiano impostazioni o pretest.
export function freezeLevel(state,lessonId){
  if(state.lesson_levels?.[lessonId])return;
  const {source,...saved}=levelState(state,lessonId);
  state.lesson_levels??={};state.lesson_levels[lessonId]=saved;
}

export function validateLessonLevels(levels,lessonIds){
  if(levels===undefined)return;
  if(!levels||typeof levels!=="object"||Array.isArray(levels))throw new Error("Livelli delle lezioni non validi.");
  for(const [id,l] of Object.entries(levels)){
    if(!lessonIds.includes(id)||!l||typeof l!=="object"||!Number.isInteger(l.level)||l.level<1||l.level>MAX_LEVEL||typeof l.autonomous!=="boolean"||typeof l.pending_transfer!=="boolean"||l.changed_at!==null&&typeof l.changed_at!=="string"||l.parked!==undefined&&l.parked!==true||l.parked_at!==undefined&&typeof l.parked_at!=="string"||!Array.isArray(l.history)||l.history.length>20)throw new Error("Livello della lezione "+id+" non valido.");
  }
}
