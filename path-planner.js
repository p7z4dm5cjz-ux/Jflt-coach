import {randomId} from "./ids.js";
// Pianificazione del percorso adattivo (fase 3): cicli di 15 domande in 3 blocchi da 5.
// Funzioni pure: ricevono lo stato e restituiscono il piano, senza scrivere nulla.
import {LESSONS} from "./catalog.js";
import {placementProfile} from "./placement.js";
import {recommendation} from "./engine.js";
import {lessonMeta,PATH_GROUPS,learningReason,prerequisiteReady} from "./learning-path.js";
import {practiceWindow,lessonEvidence} from "./grammar-checks.js";
import {lessonRules,LEVELS} from "./item-tags.js";
import {levelState,diagnosticStats,minLevelFor,MAX_LEVEL,cycleDecision,applyDecision,secondaryCheck,transferDue,closeTransfer} from "./path-levels.js";
export const isResting=(state,id)=>!!state.lesson_levels?.[id]?.parked;

export const PATH_LENGTHS={30:2,45:3,60:4},DEFAULT_LENGTH=45,BLOCK_SIZE=5,PASSAGE_GAPS=3;
// Composizione decisa: la lezione principale pesa sempre meno blocco dopo blocco, le intrecciate crescono.
export const BLOCK_LAYOUT=[{main:4,intertwined:0,review:1},{main:3,intertwined:1,review:1},{main:2,intertwined:2,review:1}];
export const FOCUSED_LAYOUT=Array.from({length:3},()=>({main:5,intertwined:0,review:0}));
const TRANSFER_LAYOUT=Array.from({length:3},()=>({main:3,intertwined:1,review:1}));
export const ROLE_LABELS={main:"Lezione del ciclo",recovery:"Recupero",intertwined:"Intrecciata",review:"Ripasso"};

const byId=new Map(LESSONS.map(l=>[l.id,l]));
const hasRules=id=>lessonRules(id).length>0;
// Una lezione resta nel ruolo principale finché non supera il livello 4 (poi attende il trasferimento)
// o finché non è già autonoma.
export function isOpen(state,id){
  if(!byId.has(id)||!hasRules(id))return false;
  const ls=levelState(state,id);
  return !ls.autonomous&&!ls.pending_transfer;
}
// Lezioni che si possono già mescolare con la principale: serve una prova vera (livello 2 raggiunto
// nel percorso, pretest «da confermare» o «già sicura», pratica riuscita), non il livello di partenza.
export function mixable(state,id){
  if(!byId.has(id)||!hasRules(id))return false;
  const saved=state.lesson_levels?.[id];
  if(saved)return saved.autonomous||saved.pending_transfer||saved.level>=2;
  const status=placementProfile(state.placement)?.lessonStatus?.[id];
  const w=practiceWindow(state,id);
  return status==="confirm"||status==="skip"||w.independent||w.goodSession;
}

export function chooseMain(state,{exclude=[],continueWith=null,timestamp=Date.now()}={}){
  const due=LESSONS.find(l=>!exclude.includes(l.id)&&!isResting(state,l.id)&&transferDue(state,l.id,timestamp));
  if(due)return due.id;
  const ready=id=>lessonMeta(byId.get(id)).prerequisites.every(pre=>prerequisiteReady(state,pre));
  const ok=id=>!exclude.includes(id)&&isOpen(state,id)&&!isResting(state,id)&&ready(id);
  if(continueWith&&!exclude.includes(continueWith)&&isOpen(state,continueWith)&&!isResting(state,continueWith))return continueWith;
  const ranked=recommendation(state).map(l=>l.id),all=LESSONS.map(l=>l.id);
  return ranked.find(ok)||all.find(ok)||null;
}

// Recupero: un prerequisito non ancora autonomo, dal livello più basso.
export function recoveryFor(state,mainId){
  const lesson=byId.get(mainId);if(!lesson)return null;
  return lessonMeta(lesson).prerequisites.filter(id=>isOpen(state,id)).sort((a,b)=>levelState(state,a).level-levelState(state,b).level)[0]||null;
}

// Intrecciate: prima i prerequisiti, poi le lezioni dello stesso gruppo più vicine nel percorso,
// poi chi dipende dalla principale; solo lezioni già al livello 2 o autonome.
export function partners(state,mainId,n=2){
  const lesson=byId.get(mainId);if(!lesson)return [];
  const meta=lessonMeta(lesson),group=PATH_GROUPS.find(g=>g.id===meta.group)?.ids||[],at=group.indexOf(mainId);
  const near=group.filter(id=>id!==mainId).sort((a,b)=>Math.abs(group.indexOf(a)-at)-Math.abs(group.indexOf(b)-at));
  const dependents=LESSONS.filter(l=>lessonMeta(l).prerequisites.includes(mainId)).map(l=>l.id);
  const order=[...new Set([...meta.prerequisites,...near,...dependents])].filter(id=>id!==mainId&&mixable(state,id));
  return order.slice(0,n);
}

// Ripassi: prima le lezioni in scadenza, poi quelle autonome o in attesa di trasferimento,
// poi le altre già mescolabili; una per blocco, senza ripetere principale e intrecciate.
export function reviewLessons(state,exclude=[],n=3,timestamp=Date.now()){
  const pool=LESSONS.map(l=>l.id).filter(id=>!exclude.includes(id)&&mixable(state,id));
  const score=id=>{const w=practiceWindow(state,id,timestamp),ev=lessonEvidence(state,id,timestamp),ls=levelState(state,id);
    return (ev.due_now?100:0)+(w.due?60:0)+(ls.autonomous||ls.pending_transfer?20:0)+ls.level;};
  return pool.map((id,index)=>({id,index,score:score(id)})).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,n).map(x=>x.id);
}

// Regola per uno slot: la meno riuscita fra quelle adatte al livello, senza ripetere troppo la stessa.
export function chooseRule(state,lessonId,level,used=new Map()){
  const stats=diagnosticStats(state,lessonId),rules=lessonRules(lessonId);
  const fit=rules.filter(r=>minLevelFor(r.id)<=level);
  const pool=fit.length?fit:rules;
  const acc=r=>{const s=stats[r.id];return s&&s.n?s.correct/s.n:0.5;};
  const pick=pool.map((r,index)=>({r,index})).sort((a,b)=>(used.get(a.r.id)||0)-(used.get(b.r.id)||0)||acc(a.r)-acc(b.r)||a.index-b.index)[0]?.r;
  if(!pick)return null;
  used.set(pick.id,(used.get(pick.id)||0)+1);
  return {rule:pick.id,level:Math.max(level,minLevelFor(pick.id))};
}

// Perché questa lezione è la principale: pretest e prove recenti, in parole semplici.
export function mainReason(state,lessonId,{forced=false,continued=false}={}){
  const lesson=byId.get(lessonId);if(!lesson)return "";
  if(forced)return "L'hai scelta tu dalla pagina della lezione.";
  const parts=[];
  if(continued)parts.push("Continua dal ciclo precedente.");
  const profile=placementProfile(state.placement),reason=learningReason(state,lesson);
  if(profile?.lessonStatus?.[lessonId]==="review"&&!reason.startsWith("Nel pretest")){
    const rows=profile.rows.filter(r=>profile.adaptive?r.item.lessons[0]===lessonId:r.item.lessons.includes(lessonId)),wrong=rows.filter(r=>!r.correct).length,rank=profile.priorityIds.indexOf(lessonId);
    if(wrong)parts.push("Nel pretest: "+wrong+" su "+rows.length+" sbagliate"+(rank>=0?", priorità n. "+(rank+1):"")+".");
  }
  parts.push(reason);
  const course=recommendation(state),at=course.findIndex(l=>l.id===lessonId),entry=course[at];
  if(entry?.course_reason)parts.push(entry.course_reason);
  const next=course.slice(at+1).find(l=>isOpen(state,l.id)&&!isResting(state,l.id));
  if(next)parts.push("Prossima tappa prevista: «"+next.title+"». Recuperi e ripassi possono precederla.");
  return parts.join(" ");
}

// Un ciclo: lezione principale (o recupero), intrecciate, ripassi e i 15 slot nei 3 blocchi.
export function planCycle(state,{previous=null,exclude=[],force=null,timestamp=Date.now()}={}){
  let main=null,recovery_for=null;
  const prevResult=previous?.result;
  if(previous?.recovery_for&&isOpen(state,previous.recovery_for)){
    if(prerequisiteReady(state,previous.main))main=previous.recovery_for;
    else {main=previous.main;recovery_for=previous.recovery_for;}
  }
  else if(prevResult&&prevResult.decision==="down"&&prevResult.level===1&&!previous.recovery_for){
    const r=recoveryFor(state,previous.main);
    if(r){main=r;recovery_for=previous.main;}
  }
  // «Esercita questa lezione»: la lezione scelta dallo studente, anche se già autonoma (il recupero ha la precedenza).
  if(!main&&force&&byId.has(force)&&hasRules(force))main=force;
  const forcedMain=!!main&&main===force&&!recovery_for;
  main??=chooseMain(state,{exclude,continueWith:previous?.main,timestamp});
  if(!main)return null;
  const why=recovery_for?"":mainReason(state,main,{forced:forcedMain,continued:!forcedMain&&main===previous?.main});
  const ls=levelState(state,main),mainLevel=Math.min(ls.level,MAX_LEVEL);
  const phase=transferDue(state,main,timestamp)?"transfer":mainLevel>=4?"mixed":"focused";
  const mixed=phase==="focused"?[]:partners(state,main,2),review=phase==="focused"?[]:reviewLessons(state,[main,...mixed,recovery_for].filter(Boolean),3,timestamp);
  const layoutForCycle=phase==="focused"?FOCUSED_LAYOUT:phase==="transfer"?TRANSFER_LAYOUT:BLOCK_LAYOUT;
  const used=new Map(),blocks=[];
  layoutForCycle.forEach((layout,b)=>{
    const slots=[];
    const mainSlots=Array.from({length:layout.main},()=>({role:recovery_for?"recovery":"main",lesson_id:main}));
    // Le intrecciate si alternano; senza intrecciate disponibili lo slot torna alla principale.
    const mixSlots=Array.from({length:layout.intertwined},(_,i)=>mixed.length?{role:"intertwined",lesson_id:mixed[(b+i)%mixed.length]}:{role:recovery_for?"recovery":"main",lesson_id:main});
    const reviewSlots=Array.from({length:layout.review},()=>review.length?{role:"review",lesson_id:review[b%review.length]}:{role:recovery_for?"recovery":"main",lesson_id:main});
    const ordered=[...mainSlots,...mixSlots,...reviewSlots];
    // Livello 4: in ogni blocco un breve testo con 3 spazi, prima dagli slot principali poi dalle intrecciate.
    const passage=phase==="transfer"?ordered:mainLevel>=4?ordered.filter(s=>s.role!=="review").slice(0,PASSAGE_GAPS):[];
    for(const slot of ordered){
      let level;
      if(slot.lesson_id===main)level=passage.includes(slot)?4:Math.min(mainLevel,3);
      else level=passage.includes(slot)?4:Math.min(levelState(state,slot.lesson_id).level,3);
      const choice=chooseRule(state,slot.lesson_id,Math.max(1,level),used);
      if(!choice)continue;
      slots.push({...slot,rule:choice.rule,level:passage.includes(slot)?4:choice.level,...(passage.includes(slot)?{group:"p"+(b+1)}:{})});
    }
    blocks.push(slots);
  });
  return {main,level:mainLevel,phase,recovery_for,why,roles:{intertwined:mixed,review},blocks};
}

// Si ricalcolano soltanto le regole del blocco non ancora creato: gli errori del blocco appena
// concluso hanno priorità, conservando almeno due regole diverse e lo stesso livello di prova.
export function adaptBlock(state,cycle,page){
  if(page===0||cycle.phase==="transfer")return cycle.blocks[page];
  const stats=diagnosticStats(state,cycle.main),weak=Object.entries(stats).filter(([,r])=>r.n-r.correct>=2&&r.correct/r.n<0.7).sort((a,b)=>a[1].correct/a[1].n-b[1].correct/b[1].n);
  const used=new Map(),slots=cycle.blocks[page].map(s=>({...s}));
  let recovery=0;
  for(const slot of slots){
    if(slot.lesson_id!==cycle.main)continue;
    const target=weak.find(([id])=>minLevelFor(id)<=slot.level);
    if(target&&recovery<2){slot.rule=target[0];recovery++;used.set(slot.rule,(used.get(slot.rule)||0)+1);}
    else {const choice=chooseRule(state,slot.lesson_id,slot.level,used);if(choice)slot.rule=choice.rule;}
  }
  return slots;
}

export function newPath(length=DEFAULT_LENGTH,timestamp=new Date().toISOString(),id="path-"+randomId()){
  const n=PATH_LENGTHS[length]?length:DEFAULT_LENGTH;
  return {id,length:n,created_at:timestamp,completed_at:null,cycles:[]};
}
export const pathCycles=path=>PATH_LENGTHS[path.length]||PATH_LENGTHS[DEFAULT_LENGTH];

// Spiegazione breve per l'interfaccia: perché queste lezioni in questo ciclo.
export function cycleReason(cycle){
  const title=id=>byId.get(id)?.title||id;
  const parts=[];
  if(cycle.phase==="transfer")return "Verifica su tre testi nuovi: completa solo gli spazi usando il contesto. La conferma dell'autonomia richiede una seconda prova dopo almeno 24 ore.";
  if(cycle.recovery_for)parts.push("Recupero di «"+title(cycle.main)+"», prerequisito di «"+title(cycle.recovery_for)+"»: lì gli errori erano troppi.");
  else parts.push("«"+title(cycle.main)+"» al livello "+cycle.level+" ("+LEVELS[cycle.level].toLowerCase()+")."+(cycle.why?" "+cycle.why:""));
  if(cycle.roles.intertwined.length)parts.push("Intrecciata con "+cycle.roles.intertwined.map(id=>"«"+title(id)+"»").join(" e ")+".");
  if(cycle.roles.review.length)parts.push("Ripasso: "+cycle.roles.review.map(id=>"«"+title(id)+"»").join(", ")+".");
  if(cycle.phase==="focused")parts.push("15 domande su questa lezione; il blocco successivo riprende le regole più difficili per te.");
  return parts.join(" ");
}

// Chiusura del ciclo (dentro repo.change): decide sulla principale e controlla le secondarie.
// cycle.block_ids: le tre sessioni da 5 del ciclo, tutte concluse.
export function closeCycle(state,cycle,timestamp=new Date().toISOString()){
  if(cycle.phase==="transfer")return closeTransfer(state,cycle,timestamp);
  const result=cycleDecision(state,cycle.main,cycle.level);
  const to=applyDecision(state,result,timestamp);
  const parked=state.lesson_levels?.[cycle.main]?.parked_at===timestamp;
  const secondary=[];
  for(const id of new Set([...cycle.roles.intertwined,...cycle.roles.review])){
    const level=secondaryCheck(state,id,cycle.block_ids||[],timestamp);
    if(level!==null)secondary.push({lesson_id:id,level});
  }
  return {...result,to,secondary,closed_at:timestamp,...(parked?{parked:true}:{})};
}

// Controllo dei percorsi salvati (backup e ripristino).
export function validatePaths(state){
  const paths=state.paths;
  if(paths===undefined)return;
  const date=v=>typeof v==="string"&&Number.isFinite(Date.parse(v)),lesson=id=>byId.has(id);
  if(!Array.isArray(paths)||paths.length>500||new Set(paths.map(p=>p?.id)).size!==paths.length)throw new Error("Percorsi adattivi non validi.");
  const sessions=new Map(state.sessions.map(s=>[s.id,s]));
  const okSlot=s=>s&&lesson(s.lesson_id)&&typeof s.rule==="string"&&s.rule.startsWith(s.lesson_id+".")&&Number.isInteger(s.level)&&s.level>=1&&s.level<=MAX_LEVEL&&Object.hasOwn(ROLE_LABELS,s.role)&&(s.group===undefined||/^p[1-4]$/.test(s.group));
  const decisions=["up","stay","down","insufficient"];
  for(const p of paths){
    if(!p||typeof p.id!=="string"||!PATH_LENGTHS[p.length]||!date(p.created_at)||p.completed_at!==null&&!date(p.completed_at)||p.forced_lesson!==undefined&&!lesson(p.forced_lesson)||!Array.isArray(p.cycles)||p.cycles.length>pathCycles(p))throw new Error("Percorso adattivo non valido.");
    for(const [i,c] of p.cycles.entries()){
      const bad=!c||c.n!==i+1||!lesson(c.main)||c.why!==undefined&&(typeof c.why!=="string"||c.why.length>800)||!Number.isInteger(c.level)||c.level<1||c.level>MAX_LEVEL||c.recovery_for!==null&&!lesson(c.recovery_for)
        ||c.phase!==undefined&&!["focused","mixed","transfer"].includes(c.phase)
        ||!c.roles||!Array.isArray(c.roles.intertwined)||c.roles.intertwined.length>2||!Array.isArray(c.roles.review)||c.roles.review.length>3||[...c.roles.intertwined,...c.roles.review].some(id=>!lesson(id))
        ||!Array.isArray(c.blocks)||c.blocks.length!==BLOCK_LAYOUT.length||c.blocks.some(b=>!Array.isArray(b)||b.length>BLOCK_SIZE||!b.every(okSlot))
        ||!Array.isArray(c.block_ids)||c.block_ids.length>BLOCK_LAYOUT.length||c.block_ids.some(id=>sessions.get(id)?.path_id!==p.id)
        ||c.result!==null&&(!c.result||!decisions.includes(c.result.decision)||!Number.isInteger(c.result.n)||!Number.isInteger(c.result.correct)||!Number.isInteger(c.result.to)||!date(c.result.closed_at)||c.block_ids.length!==BLOCK_LAYOUT.length);
      if(bad)throw new Error("Ciclo "+(i+1)+" del percorso non valido.");
    }
  }
  for(const s of state.sessions){
    if(s.path_id===undefined)continue;
    const p=paths.find(x=>x.id===s.path_id);
    if(!p||!s.path_block||!Number.isInteger(s.path_block.cycle)||s.path_block.cycle<1||!Number.isInteger(s.path_block.page)||s.path_block.page<0||s.path_block.page>=BLOCK_LAYOUT.length||s.training!==undefined||s.items.length>BLOCK_SIZE)throw new Error("Blocco del percorso non valido.");
    if(s.passages!==undefined&&(!Array.isArray(s.passages)||s.passages.length>1||s.passages.some(x=>!x||!/^p[1-4]$/.test(x.group)||typeof x.text!=="string"||x.text.length>900)))throw new Error("Testo del blocco non valido.");
    if(s.fallback_note!==undefined&&(typeof s.fallback_note!=="string"||s.fallback_note.length>400))throw new Error("Nota del blocco non valida.");
  }
}
