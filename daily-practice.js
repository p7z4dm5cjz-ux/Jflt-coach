import {LESSONS} from './catalog.js';
import {lessonItems} from './practice-bank.js';
import {lessonEvidence,practiceWindow} from './grammar-checks.js';

// Practical workload defaults, not scientifically established optimal doses.
export function dailyPractice(state,plan,timestamp=Date.now()) {
  const limit=plan.minutes===10?6:plan.minutes===30?18:12;
  const due=LESSONS.filter(l=>l.id!==plan.lesson_id&&(lessonEvidence(state,l.id,timestamp).due_now||practiceWindow(state,l.id,timestamp).due))
    .sort((a,b)=>Math.max(0,...state.attempts.filter(x=>x.lesson_id===a.id).map(x=>Date.parse(x.date)||0))-Math.max(0,...state.attempts.filter(x=>x.lesson_id===b.id).map(x=>Date.parse(x.date)||0))).slice(0,2);
  const ids=[plan.lesson_id,...due.map(l=>l.id)],seen=new Set(state.attempts.map(a=>a.stem));
  const pools=ids.map(id=>lessonItems(id,state.sessions.length).map(it=>({...it,focus_lesson:it.focus_lesson||id})).sort((a,b)=>Number(seen.has(a.stem))-Number(seen.has(b.stem))));
  // Sample across blocks, not just the first six recognition questions.
  const spread=pool=>{const out=[];for(let offset=0;offset<6;offset++)for(let i=offset;i<pool.length;i+=6)out.push(pool[i]);return out;};
  const queues=pools.map(spread),items=[],used=new Set();
  while(items.length<limit&&queues.some(q=>q.length)) {
    for(const q of queues){const it=q.shift();if(!it||used.has(it.stem))continue;used.add(it.stem);items.push(it);if(items.length===limit)break;}
  }
  return {items,review_ids:due.map(l=>l.id),repeated:items.filter(it=>seen.has(it.stem)).length};
}
