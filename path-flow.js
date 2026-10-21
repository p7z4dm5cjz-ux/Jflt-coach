// Percorso adattivo: stato della sessione, richiesta del blocco a Groq e blocco di riserva locale.
import {normal} from "./answer-normal.js";
import {lessonItems} from "./practice-bank.js";
import {ruleStats} from "./path-levels.js";
import {pathCycles,BLOCK_LAYOUT} from "./path-planner.js";
import {PATH_STEM_MAX} from "./contract.js";
import {stemKey} from "./item-tags.js";

export const PATH_BLOCKS=BLOCK_LAYOUT.length;
export const activePath=state=>(state.paths||[]).findLast(p=>!p.completed_at)||null;

// Il prossimo passo di un percorso: riprendere un blocco, crearne uno, chiudere il ciclo,
// pianificare il ciclo successivo o concludere.
export function pathStep(state,path){
  const cycle=path.cycles.at(-1);
  if(!cycle)return {kind:"plan",n:1};
  const last=state.sessions.find(s=>s.id===cycle.block_ids.at(-1));
  if(last&&!last.completed_at)return {kind:"resume",cycle,session:last,page:cycle.block_ids.length-1};
  if(cycle.block_ids.length<PATH_BLOCKS)return {kind:"block",cycle,page:cycle.block_ids.length};
  if(!cycle.result)return {kind:"close",cycle};
  if(path.cycles.length<pathCycles(path))return {kind:"plan",n:path.cycles.length+1,previous:cycle};
  return {kind:"done"};
}

const seenStems=state=>new Set(state.attempts.map(a=>normal(a.stem||"")));
export function pathBlockRequest(state,path,cycle,page){
  const slots=cycle.blocks[page].map((s,i)=>({n:i+1,lesson_id:s.lesson_id,rule:s.rule,level:s.level,role:s.role,group:s.group||null}));
  const lessons=new Set(slots.map(s=>s.lesson_id));
  const avoid=[...new Set(state.sessions.filter(s=>lessons.has(s.lesson_id)||s.items.some(i=>lessons.has(i.focus_lesson))).flatMap(s=>s.items).filter(i=>!i.group).map(i=>i.stem).filter(stem=>stem&&stem.length<=PATH_STEM_MAX))].slice(-30);
  const stats=ruleStats(state,cycle.main);
  const weak=Object.entries(stats).filter(([,s])=>s.n>=2&&s.correct/s.n<0.7).sort((a,b)=>a[1].correct/a[1].n-b[1].correct/b[1].n).slice(0,8).map(([rule,s])=>({rule,n:s.n,correct:s.correct}));
  return {path_id:path.id,cycle:cycle.n,page,main_lesson:cycle.main,main_level:cycle.level,slots,...(avoid.length?{avoid}:{}),...(weak.length?{weak_rules:weak}:{})};
}

// Competenza per il profilo esistente: riconoscere = significato, contesto = scelta del tempo.
export const pathSkill=(kind,level)=>level>=3?"tense_choice":kind==="choice"?"meaning":"form";
// Esercizi di Groq pronti per la sessione: etichette dallo slot quando il controllo non le ha aggiunte.
// Gli spazi hanno consegne simili («Spazio (1)…»): il contesto vero è il testo, quindi la prima
// esposizione si conta su testo + spazio, non sulla consegna.
export function pathItemsFromReply(result,slots){
  return result.items.map((item,i)=>{
    const slot=slots[i],{n,group,...rest}=item,text=group?result.passages.find(p=>p.group===group)?.text:null;
    return {...rest,...(text?{context_id:"path:"+stemKey(text)+":"+stemKey(item.stem)}:{}),rules:item.rules||[slot.rule],level:item.level||slot.level,focus_lesson:slot.lesson_id,path_role:slot.role,origin:"groq",skill:pathSkill(item.kind,slot.level),...(group?{group}:{})};
  });
}

// Blocco di riserva senza Groq: prima frasi mai viste della banca locale con la stessa regola e lo
// stesso livello, poi le domande del tutor già confermate e non viste da 14 giorni, poi le
// ripetizioni più lontane. Il testo del livello 4 richiede il tutor: lo spazio diventa un
// esercizio di contesto (livello 3) e non conta per il livello 4.
export function fallbackItems(state,slots,timestamp=Date.now()){return fallbackBlock(state,slots,timestamp).items;}
export function fallbackBlock(state,slots,timestamp=Date.now()){
  const seen=seenStems(state),used=new Set(),out=[];let exact=0;
  const lastSeen=new Map();for(const a of state.attempts){const k=normal(a.stem||"");lastSeen.set(k,Math.max(lastSeen.get(k)||0,Date.parse(a.date)||0));}
  const offline=lesson=>{const all=[];const keys=new Set();for(let v=0;v<4;v++)for(const item of lessonItems(lesson,v)){const k=normal(item.stem);if(!keys.has(k)){keys.add(k);all.push(item);}}return all;};
  const cache=new Map(),pool=lesson=>{if(!cache.has(lesson))cache.set(lesson,offline(lesson));return cache.get(lesson);};
  const personal=state.sessions.flatMap(s=>s.items).filter(i=>i.origin==="groq"&&["confirmed","extended"].includes(i.check)&&!i.doubt&&!i.group&&Array.isArray(i.rules));
  const fresh=item=>!used.has(normal(item.stem));
  for(const slot of slots){
    const level=slot.group?3:slot.level,has=item=>Array.isArray(item.rules)&&item.rules.includes(slot.rule);
    const local=pool(slot.lesson_id).filter(fresh);
    const pick=local.find(i=>has(i)&&i.level===level&&!seen.has(normal(i.stem)))
      ||personal.filter(fresh).find(i=>has(i)&&i.level===level&&timestamp-(lastSeen.get(normal(i.stem))||0)>=14*86400000)
      ||local.find(i=>has(i)&&!seen.has(normal(i.stem)))
      ||local.find(i=>i.level===level&&!seen.has(normal(i.stem)))
      ||local.filter(i=>has(i)).sort((a,b)=>(lastSeen.get(normal(a.stem))||0)-(lastSeen.get(normal(b.stem))||0))[0]
      ||local.sort((a,b)=>(lastSeen.get(normal(a.stem))||0)-(lastSeen.get(normal(b.stem))||0))[0];
    if(!pick)continue;
    used.add(normal(pick.stem));
    if(pick.level===slot.level&&!seen.has(normal(pick.stem)))exact++;
    const {id,check,check_note,accept_added,rule_retagged,...item}=pick;
    out.push({...item,accept:[...new Set(item.accept||[item.answer])],focus_lesson:slot.lesson_id,path_role:slot.role,origin:pick.origin==="groq"?"groq":"local",...(pick.origin==="groq"?{check:"confirmed"}:{})});
  }
  return {items:out,exact};
}

// Riepilogo del ciclo per la schermata del risultato.
export function cycleSummary(state,cycle){
  const sessions=cycle.block_ids.map(id=>state.sessions.find(s=>s.id===id)).filter(Boolean);
  const rows=state.attempts.filter(a=>cycle.block_ids.includes(a.session_id)&&!a.disputed);
  const byLesson={};
  for(const a of rows){const r=byLesson[a.lesson_id]??={n:0,correct:0,assisted:0};r.n++;if(a.correct)r.correct++;if(a.assisted)r.assisted++;}
  return {answers:rows.length,correct:rows.filter(a=>a.correct).length,byLesson,fallback:sessions.some(s=>s.source==="local")};
}
