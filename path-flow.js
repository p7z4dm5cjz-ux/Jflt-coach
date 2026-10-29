// Percorso adattivo: stato della sessione, richiesta del blocco a Groq e blocco di riserva locale.
import {reliableItem} from "./evidence-policy.js";
import {normal} from "./answer-normal.js";
import {lessonItems} from "./practice-bank.js";
import {diagnosticStats,cycleDecision} from "./path-levels.js";
import {pathCycles,BLOCK_LAYOUT} from "./path-planner.js";
import {PATH_STEM_MAX} from "./contract.js";
import {stemKey} from "./item-tags.js";
import {pathFoundationItems} from "./core-practice.js";
import {advancedPathItems} from "./advanced-path-bank.js";

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

export function pathBlockRequest(state,path,cycle,page){
  const slots=cycle.blocks[page].map((s,i)=>({n:i+1,lesson_id:s.lesson_id,rule:s.rule,level:s.level,role:s.role,group:s.group||null}));
  const lessons=new Set(slots.map(s=>s.lesson_id));
  const avoid=[...new Set(state.sessions.filter(s=>lessons.has(s.lesson_id)||s.items.some(i=>lessons.has(i.focus_lesson))).flatMap(s=>s.items).filter(i=>!i.group).map(i=>i.stem).filter(stem=>stem&&stem.length<=PATH_STEM_MAX))].slice(-30);
  const stats=diagnosticStats(state,cycle.main);
  const weak=Object.entries(stats).filter(([,s])=>s.n>=2&&s.correct/s.n<0.7).sort((a,b)=>a[1].correct/a[1].n-b[1].correct/b[1].n).slice(0,8).map(([rule,s])=>({rule,n:s.n,correct:s.correct}));
  const avoid_passages=state.sessions.flatMap(s=>s.passages||[]).map(p=>p.text).slice(-6);
  const recent_errors=state.attempts.filter(a=>lessons.has(a.lesson_id)&&!a.disputed&&(!a.correct||a.assisted)).slice(-5).flatMap(a=>{const set=state.sessions.find(s=>s.id===a.session_id),item=set?.items.find(i=>i.id===a.item_id);if(!set?.completed_at||!item?.rules?.length||!reliableItem(item,a.source))return [];return [{lesson_id:a.lesson_id,rule:item.rules[0],stem:(a.stem||"").slice(0,PATH_STEM_MAX),given:(a.answer||"").slice(0,600),expected:item.answer.slice(0,600),assisted:!!a.assisted||!!set.assisted||!!set.hinted_items?.includes(item.id)}];});
  const decision=cycleDecision(state,cycle.main,cycle.level);
  const progress={n:decision.n,correct:decision.correct,needed:Math.max(0,9-decision.n),decision:decision.decision};
  const coverage=Object.entries(stats).slice(0,16).map(([rule,s])=>({rule,n:s.n,correct:s.correct}));
  return {progress,coverage,path_id:path.id,cycle:cycle.n,page,main_lesson:cycle.main,main_level:cycle.level,phase:cycle.phase||"mixed",slots,...(avoid.length?{avoid}:{}),...(avoid_passages.length?{avoid_passages}:{}),...(weak.length?{weak_rules:weak}:{}),...(recent_errors.length?{recent_errors}:{})};
}

// Competenza per il profilo esistente: riconoscere = significato, contesto = scelta del tempo.
export const pathSkill=(kind,level)=>level>=3?"tense_choice":kind==="choice"?"meaning":"form";
// Esercizi di Groq pronti per la sessione: etichette dallo slot quando il controllo non le ha aggiunte.
// Gli spazi hanno consegne simili («Spazio (1)…»): il contesto vero è il testo, quindi la prima
// esposizione si conta su testo + spazio, non sulla consegna.
export function pathItemsFromReply(result,slots){
  return result.items.map((item,i)=>{
    const slot=slots[i],{n,group,...rest}=item,text=group?result.passages.find(p=>p.group===group)?.text:null;
    const gap=group?result.items.slice(0,i+1).filter(x=>x.group===group).length:null;
    return {...rest,...(text?{passage:text,context_id:"path:"+stemKey(text)+":"+gap}:{}),rules:item.rules||[slot.rule],level:item.level||slot.level,focus_lesson:slot.lesson_id,path_role:slot.role,origin:"groq",skill:pathSkill(item.kind,slot.level),...(group?{group}:{})};
  });
}


// Rifiuta una generazione che ricicla frasi o testi già proposti. Non riprova
// automaticamente: un errore lascia disponibile la riserva locale senza altra quota.
export function ensureFreshPathReply(state,result,slots){
  const items=pathItemsFromReply(result,slots),seen=new Set(state.sessions.flatMap(s=>s.items).map(i=>normal(i.context_id||i.stem)));
  for(const i of items){const k=normal(i.context_id||i.stem);if(seen.has(k))throw new Error('Il tutor ha ripetuto un contesto già proposto: quel blocco non è una nuova verifica.');seen.add(k);}
  return items;
}

// Blocco di riserva senza Groq: prima frasi mai viste della banca locale con la stessa regola e lo
// stesso livello, poi le domande del tutor già confermate e non viste da 14 giorni, poi le
// ripetizioni più lontane. Il testo del livello 4 richiede il tutor: lo spazio diventa un
// esercizio di contesto (livello 3) e non conta per il livello 4.
export function fallbackItems(state,slots,timestamp=Date.now()){return fallbackBlock(state,slots,timestamp).items;}
export function fallbackBlock(state,slots,timestamp=Date.now()){
  const seen=new Set(),lastSeen=new Map(),index=new Map(state.sessions.flatMap(s=>s.items.map(i=>[s.id+'|'+i.id,i])));
  const key=i=>normal(i.context_id||i.stem||'');
  for(const a of state.attempts){const i=index.get(a.session_id+'|'+a.item_id),k=key({context_id:a.context_id||i?.context_id,stem:a.stem});seen.add(k);lastSeen.set(k,Math.max(lastSeen.get(k)||0,Date.parse(a.date)||0));}
  const used=new Set(),usedContexts=new Set(),out=[];let exact=0;
  const offline=lesson=>{const all=[...pathFoundationItems(lesson),...advancedPathItems(lesson)];const keys=new Set(all.map(i=>normal(i.stem)));for(let v=0;v<4;v++)for(const item of lessonItems(lesson,v)){const k=normal(item.stem);if(!keys.has(k)){keys.add(k);all.push(item);}}return all;};
  const cache=new Map(),pool=lesson=>{if(!cache.has(lesson))cache.set(lesson,offline(lesson));return cache.get(lesson);};
  const personal=state.sessions.flatMap(s=>s.items).filter(i=>i.origin==='groq'&&['confirmed','extended'].includes(i.check)&&!i.doubt&&!i.group&&Array.isArray(i.rules));
  for(const slot of slots){
    const level=slot.group?3:slot.level;
    const local=pool(slot.lesson_id).filter(i=>i.level<=Math.max(2,level)&&(!i.focus_lesson||i.focus_lesson===slot.lesson_id)&&i.rules?.some(r=>r.startsWith(slot.lesson_id+'.')));
    const saved=personal.filter(i=>i.level===level&&i.rules.includes(slot.rule)&&timestamp-(lastSeen.get(key(i))||0)>=14*86400000);
    const score=i=>[Number(seen.has(key(i))||usedContexts.has(key(i))),Number(i.level!==level),Number(!i.rules.includes(slot.rule)),Number(usedContexts.has(key(i))),lastSeen.get(key(i))||0];
    const candidates=[...local,...saved].filter(i=>!used.has(normal(i.stem)));
    const pick=candidates.map((item,n)=>({item,n,rank:score(item)})).sort((a,b)=>{for(let i=0;i<a.rank.length;i++){const d=a.rank[i]-b.rank[i];if(d)return d;}return a.n-b.n;})[0]?.item;
    if(!pick)continue;
    const fresh=!seen.has(key(pick))&&!usedContexts.has(key(pick));
    used.add(normal(pick.stem));usedContexts.add(key(pick));
    if(pick.level===slot.level&&fresh)exact++;
    const {id,check,check_note,accept_added,rule_retagged,...item}=pick;
    out.push({...item,accept:[...new Set(item.accept||[item.answer])],focus_lesson:slot.lesson_id,path_role:slot.role,origin:pick.origin==='groq'?'groq':'local',...(pick.level>slot.level?{fallback_guided:true}:{}),...(pick.origin==='groq'?{check:'confirmed'}:{})});
  }
  return {items:out,exact};
}

// Riepilogo del ciclo per la schermata del risultato.
export function cycleSummary(state,cycle){
  const sessions=cycle.block_ids.map(id=>state.sessions.find(s=>s.id===id)).filter(Boolean);
  const rows=state.attempts.filter(a=>cycle.block_ids.includes(a.session_id)&&!a.disputed);
  const byLesson={};
  for(const a of rows){const r=byLesson[a.lesson_id]??={n:0,correct:0,assisted:0};r.n++;if(a.correct)r.correct++;if(a.assisted)r.assisted++;}
  const ids=new Set(cycle.block_ids),index=new Map(state.sessions.flatMap(s=>s.items.map(i=>[s.id+'|'+i.id,{s,i}]))),seen=new Set();
  const evidence={valid:0,assisted:0,repeated:0,unverified:0,other_level:0,covered_rules:[],missing_rules:[]},covered=new Set();
  for(const a of state.attempts){
    const row=index.get(a.session_id+'|'+a.item_id),i=row?.i,set=row?.s,k=normal(a.context_id||i?.context_id||a.stem||''),repeated=seen.has(k);seen.add(k);
    if(!ids.has(a.session_id)||a.lesson_id!==cycle.main)continue;
    if(i&&reliableItem(i,a.source)&&!a.disputed)for(const rule of i.rules||[])covered.add(rule);
    if(!i||a.disputed||!reliableItem(i,a.source)||!set.completed_at)evidence.unverified++;
    else if(a.assisted||set.assisted||i.fallback_guided||set.hinted_items?.includes(i.id))evidence.assisted++;
    else if(repeated)evidence.repeated++;
    else if(i.level!==cycle.level)evidence.other_level++;
    else evidence.valid++;
  }
  evidence.covered_rules=[...covered];
  evidence.missing_rules=[...new Set(cycle.blocks.flat().filter(s=>s.lesson_id===cycle.main).map(s=>s.rule))].filter(r=>!covered.has(r));
  return {answers:rows.length,correct:rows.filter(a=>a.correct).length,byLesson,evidence,fallback:sessions.some(s=>s.source==="local")};
}
