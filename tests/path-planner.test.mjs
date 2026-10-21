import test from "node:test";
import assert from "node:assert/strict";
import {freshState} from "../engine.js";
import {LESSONS} from "../catalog.js";
import {planCycle,closeCycle,partners,mixable,BLOCK_LAYOUT,cycleReason,newPath,pathCycles} from "../path-planner.js";
import {levelState,cycleDecision,pathAnswers,validateLessonLevels,initialLevel,minLevelFor,MIN_ANSWERS} from "../path-levels.js";

const day=Date.parse("2026-10-01T08:00:00Z");
let clock=0;
const stamp=()=>new Date(day+(++clock)*60000).toISOString();
const saved=(level,extra={})=>({level,autonomous:false,pending_transfer:false,changed_at:null,history:[],...extra});

// Simula le risposte di uno studente a un ciclo: tre sessioni da 5, concluse, senza aiuti.
function answerCycle(state,cycle,answer,{prefix="c"+clock,assisted=false,stems=null}={}){
  const block_ids=[];
  cycle.blocks.forEach((slots,b)=>{
    const id="s-"+prefix+"-"+b;block_ids.push(id);
    const items=slots.map((slot,i)=>({id:id+"-"+i,stem:stems?stems[b*5+i]:"Path item "+prefix+" "+b+" "+i,answer:"x",rules:[slot.rule],level:slot.level,focus_lesson:slot.lesson_id,path_role:slot.role,origin:"offline",...(slot.group?{group:slot.group}:{})}));
    for(const [i,item] of items.entries())state.attempts.push({id:"a-"+item.id,session_id:id,item_id:item.id,lesson_id:item.focus_lesson,stem:item.stem,correct:answer(slots[i],b,i),date:stamp(),source:"offline",...(assisted?{assisted:true}:{})});
    state.sessions.push({id,path_id:"path-test",path_block:{cycle:0,page:b},lesson_id:cycle.main,items,completed_at:stamp()});
  });
  return {...cycle,block_ids};
}
const always=value=>()=>value;

test("stato nuovo: un ciclo da 15 in 3 blocchi da 5, livello 2 senza prove", () => {
  const state=freshState(),cycle=planCycle(state);
  assert.equal(cycle.blocks.length,3);
  assert.deepEqual(cycle.blocks.map(b=>b.length),[5,5,5]);
  assert.equal(cycle.level,2);
  assert.equal(levelState(state,cycle.main).level,2);
  // Senza prove su altre lezioni non si intrecciano né si ripassano lezioni mai viste.
  assert.ok(cycle.blocks.flat().every(s=>s.lesson_id===cycle.main));
  assert.match(cycleReason(cycle),/livello 2/);
});

test("partenza: pretest e livello di partenza decidono il livello iniziale", () => {
  const state=freshState();
  state.settings.starting_level="A1";
  assert.equal(initialLevel(state,"present-simple").level,1);
  state.settings.starting_level="B2";
  assert.equal(initialLevel(state,"present-simple").level,2);
  assert.equal(minLevelFor("present-simple.neg"),2);
  assert.equal(minLevelFor("present-simple.use"),1);
});

test("al livello 1 nessuna regola di sola forma", () => {
  const state=freshState();state.lesson_levels={"present-simple":saved(1)};
  const cycle=planCycle(state,{previous:{main:"present-simple"}});
  assert.equal(cycle.main,"present-simple");
  assert.ok(cycle.blocks.flat().filter(s=>s.lesson_id==="present-simple").every(s=>s.level===1&&!/\.(form|neg|q)$/.test(s.rule)));
});

test("composizione: principale 4/3/2, intrecciate 0/1/2, un ripasso per blocco", () => {
  const state=freshState();
  state.lesson_levels={"present-simple":saved(3),"present-continuous":saved(2),"past-simple":saved(2),"questions":saved(4,{autonomous:true})};
  const cycle=planCycle(state,{previous:{main:"present-continuous"}});
  assert.equal(cycle.main,"present-continuous");
  assert.ok(cycle.roles.intertwined.length>=1);
  cycle.blocks.forEach((slots,b)=>{
    const count=role=>slots.filter(s=>s.role===role).length;
    assert.equal(count("main"),BLOCK_LAYOUT[b].main);
    assert.equal(count("intertwined"),BLOCK_LAYOUT[b].intertwined);
    assert.equal(count("review"),1);
  });
  // Le secondarie non superano il livello di contesto.
  assert.ok(cycle.blocks.flat().filter(s=>s.role!=="main").every(s=>s.level<=3));
  assert.ok(partners(state,"present-continuous").includes("present-simple"));
  assert.equal(mixable(freshState(),"present-simple"),false);
});

test("livello 4: in ogni blocco un testo con 3 spazi", () => {
  const state=freshState();state.lesson_levels={"present-simple":saved(4)};
  const cycle=planCycle(state,{previous:{main:"present-simple"}});
  cycle.blocks.forEach((slots,b)=>{
    const gaps=slots.filter(s=>s.group);
    assert.equal(gaps.length,3);
    assert.ok(gaps.every(s=>s.group==="p"+(b+1)&&s.level===4));
  });
});

test("studente sicuro: sale 2→3→4, poi attende il trasferimento e cambia lezione", () => {
  const state=freshState();let cycle=planCycle(state);const first=cycle.main,levels=[];
  for(let n=0;n<3;n++){
    const done=answerCycle(state,cycle,always(true),{prefix:"up"+n});
    const result=closeCycle(state,done,stamp());levels.push(result.to);
    cycle=planCycle(state,{previous:{...done,result}});
  }
  assert.deepEqual(levels,[3,4,4]);
  assert.equal(levelState(state,first).pending_transfer,true);
  assert.notEqual(cycle.main,first);
});

test("studente in difficoltà: scende a 1, poi recupero sul prerequisito e ritorno", () => {
  const state=freshState();
  state.lesson_levels={"present-continuous":saved(2),"present-simple":saved(2)};
  let cycle=planCycle(state,{previous:{main:"present-continuous"}});
  assert.equal(cycle.main,"present-continuous");
  let done=answerCycle(state,cycle,always(false),{prefix:"down1"}),result=closeCycle(state,done,stamp());
  assert.equal(result.decision,"down");assert.equal(result.to,1);
  cycle=planCycle(state,{previous:{...done,result}});
  done=answerCycle(state,cycle,always(false),{prefix:"down2"});result=closeCycle(state,done,stamp());
  assert.equal(result.level,1);assert.equal(result.decision,"down");
  const recovery=planCycle(state,{previous:{...done,result}});
  assert.equal(recovery.main,"present-simple");
  assert.equal(recovery.recovery_for,"present-continuous");
  assert.ok(recovery.blocks.flat().some(s=>s.role==="recovery"));
  assert.match(cycleReason(recovery),/Recupero/);
  const back=planCycle(state,{previous:{...recovery,result:{decision:"stay",level:2}}});
  assert.equal(back.main,"present-continuous");
});

test("tra 60% e 80% resta; meno di 9 risposte non decide", () => {
  const state=freshState();state.lesson_levels={"present-simple":saved(2)};
  const cycle=planCycle(state,{previous:{main:"present-simple"}});
  let k=0;const done=answerCycle(state,cycle,()=>(k++%3)!==2,{prefix:"mid"});
  const result=closeCycle(state,done,stamp());
  assert.equal(result.decision,"stay");assert.equal(result.to,2);
  const few=freshState();few.lesson_levels={"present-simple":saved(2)};
  const short=planCycle(few,{previous:{main:"present-simple"}});
  short.blocks=[short.blocks[0]];
  answerCycle(few,short,always(true),{prefix:"few"});
  const r=cycleDecision(few,"present-simple");
  assert.ok(r.n<MIN_ANSWERS);assert.equal(r.decision,"insufficient");
});

test("frasi già viste e risposte con aiuto non contano", () => {
  const state=freshState();state.lesson_levels={"present-simple":saved(2)};
  const cycle=planCycle(state,{previous:{main:"present-simple"}}),stems=Array.from({length:15},(_,i)=>"Same stem "+i);
  answerCycle(state,cycle,always(true),{prefix:"seen1",stems});
  const before=pathAnswers(state,"present-simple").length;
  answerCycle(state,cycle,always(true),{prefix:"seen2",stems});
  assert.equal(pathAnswers(state,"present-simple").length,before);
  answerCycle(state,cycle,always(true),{prefix:"help",assisted:true});
  assert.equal(pathAnswers(state,"present-simple").length,before);
});

test("intrecciata o ripasso: 2 errori su 3 fanno scendere e tolgono l'autonomia", () => {
  const state=freshState();
  state.lesson_levels={"present-continuous":saved(2),"present-simple":saved(4,{autonomous:true})};
  const cycle=planCycle(state,{previous:{main:"present-continuous"}});
  assert.ok(cycle.roles.intertwined.includes("present-simple"));
  const done=answerCycle(state,cycle,slot=>slot.lesson_id!=="present-simple",{prefix:"sec"});
  const result=closeCycle(state,done,stamp());
  assert.deepEqual(result.secondary.find(s=>s.lesson_id==="present-simple"),{lesson_id:"present-simple",level:3});
  const ls=levelState(state,"present-simple");
  assert.equal(ls.autonomous,false);assert.equal(ls.history.at(-1).decision,"secondary-down");
});

test("simulazione di 20 cicli: invarianti del piano e dei livelli", () => {
  const state=freshState();state.settings.starting_level="A2";
  // Abilità nascosta per lezione: la probabilità di risposta giusta cala col livello.
  let seed=7;const rand=()=>(seed=(seed*1103515245+12345)%2147483648)/2147483648;
  const ability=id=>0.55+((id.length*37)%40)/100;
  let previous=null;const mains=new Set();
  for(let n=0;n<20;n++){
    const cycle=planCycle(state,{previous});
    assert.ok(cycle,"ciclo "+n);
    mains.add(cycle.main);
    assert.equal(cycle.blocks.flat().length,15);
    assert.ok(!levelState(state,cycle.main).autonomous&&!levelState(state,cycle.main).pending_transfer);
    for(const slots of cycle.blocks){
      const groups=new Set(slots.filter(s=>s.group).map(s=>s.group));
      assert.ok(groups.size<=1);
      if(groups.size)assert.equal(slots.filter(s=>s.group).length,3);
      assert.ok(slots.every(s=>s.level>=1&&s.level<=4&&s.rule.startsWith(s.lesson_id+".")));
    }
    const done=answerCycle(state,cycle,slot=>rand()<ability(slot.lesson_id)+0.25-slot.level*0.08,{prefix:"sim"+n});
    const result=closeCycle(state,done,stamp());
    previous={...done,result};
  }
  for(const l of Object.values(state.lesson_levels)){assert.ok(l.level>=1&&l.level<=4);assert.ok(l.history.length<=20);}
  validateLessonLevels(state.lesson_levels,LESSONS.map(l=>l.id));
  assert.ok(mains.size>=2,"in 20 cicli il percorso deve avanzare oltre la prima lezione");
});

test("lunghezze della sessione: 30/45/60 minuti = 2/3/4 cicli", () => {
  assert.equal(pathCycles(newPath(30)),2);
  assert.equal(pathCycles(newPath(45)),3);
  assert.equal(pathCycles(newPath(60)),4);
  assert.equal(newPath(20).length,45);
  assert.throws(()=>validateLessonLevels({"present-simple":{level:6,autonomous:false,pending_transfer:false,changed_at:null,history:[]}},["present-simple"]));
  assert.throws(()=>validateLessonLevels({"nope":saved(2)},["present-simple"]));
});

test("tre cicli fermi allo stesso livello: pausa e lezione successiva, poi ritorno", () => {
  const state=freshState();state.lesson_levels={"present-simple":saved(2)};
  let previous={main:"present-simple"};
  for(let n=0;n<3;n++){
    const cycle=planCycle(state,{previous});assert.equal(cycle.main,"present-simple");
    let k=0;const done=answerCycle(state,cycle,()=>(k++%3)!==2,{prefix:"stuck"+n});
    previous={...done,result:closeCycle(state,done,stamp())};
    assert.equal(previous.result.decision,"stay");
  }
  assert.equal(state.lesson_levels["present-simple"].parked,true);
  const next=planCycle(state,{previous});
  assert.notEqual(next.main,"present-simple");
  // La lezione in pausa resta nel percorso come intrecciata o ripasso.
  assert.ok([...next.roles.intertwined,...next.roles.review].includes("present-simple"));
  let cycle=next;
  for(let n=0;n<6&&!levelState(state,next.main).pending_transfer;n++){
    const done=answerCycle(state,cycle,always(true),{prefix:"other"+n});
    cycle=planCycle(state,{previous:{...done,result:closeCycle(state,done,stamp())}});
  }
  assert.equal(levelState(state,next.main).pending_transfer,true);
  assert.equal(state.lesson_levels["present-simple"].parked,undefined);
});

test("revisione: insufficienti ripetuti vanno in pausa, discesa al livello 1 riapre la finestra, recupero prima della lezione scelta", () => {
  const state=freshState();state.lesson_levels={"present-simple":saved(3)};
  for(let n=0;n<3;n++)closeCycle(state,{main:"present-simple",level:3,roles:{intertwined:[],review:[]},block_ids:[]},stamp());
  assert.equal(state.lesson_levels["present-simple"].parked,true);
  assert.ok(state.lesson_levels["present-simple"].history.every(h=>h.decision==="insufficient"));
  const low=freshState();low.lesson_levels={"present-continuous":saved(1),"present-simple":saved(2)};
  const cycle=planCycle(low,{previous:{main:"present-continuous"}});
  const done=answerCycle(low,cycle,always(false),{prefix:"low1"}),at=stamp(),result=closeCycle(low,done,at);
  assert.equal(result.decision,"down");assert.equal(low.lesson_levels["present-continuous"].changed_at,at);
  assert.equal(cycleDecision(low,"present-continuous").n,0,"le risposte prima della discesa non contano più");
  const recovery=planCycle(low,{previous:{...done,result},force:"present-continuous"});
  assert.equal(recovery.main,"present-simple");assert.equal(recovery.recovery_for,"present-continuous");
});

test("revisione: la decisione usa il livello con cui il ciclo è stato giocato", () => {
  const state=freshState();state.lesson_levels={"present-simple":saved(2)};
  const cycle=planCycle(state,{previous:{main:"present-simple"}}),done=answerCycle(state,cycle,always(true),{prefix:"lvl"});
  state.lesson_levels["present-simple"].level=3;
  const result=closeCycle(state,done,stamp());
  assert.equal(result.level,2);assert.equal(result.decision,"up");assert.equal(result.to,3);
});
