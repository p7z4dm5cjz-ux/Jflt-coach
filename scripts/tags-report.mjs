// Regole e livelli degli esercizi offline: esercizi senza tag, tag orfani e, con --coverage, i vuoti.
import {LESSONS} from "../catalog.js";
import {grammarItems} from "../practice-bank.js";
import {bankTrainItems,bankCheckItems} from "../lesson-bank.js";
import {CHECK_ITEMS} from "../grammar-checks.js";
import {advancedPathItems} from "../advanced-path-bank.js";
import {lessonRules,tagFor,taggedKeys,stemKey,LEVELS} from "../item-tags.js";
export function lessonPool(id){
  const map=new Map(),add=i=>map.set(stemKey(i.stem),i);
  for(let v=0;v<24;v++)for(const i of grammarItems(id,v))add(i);
  for(const i of [...bankTrainItems(id),...bankCheckItems(id)])add(i);
  for(const i of CHECK_ITEMS.filter(i=>i.lesson_id===id))add(i);
  for(const i of advancedPathItems(id))add(i);
  return [...map.values()];
}
export function audit(){
  const missing=[],orphans=[];
  for(const l of LESSONS){
    const pool=lessonPool(l.id),keys=new Set(pool.map(i=>stemKey(i.stem)));
    for(const i of pool)if(!tagFor(l.id,i))missing.push(l.id+" | "+i.stem);
    for(const k of taggedKeys(l.id))if(!keys.has(k))orphans.push(l.id+" | "+k);
  }
  return {missing,orphans};
}
if(process.argv[1]?.endsWith("tags-report.mjs")){
  const {missing,orphans}=audit();
  console.log("Esercizi senza tag: "+missing.length+(missing.length?"\n  "+missing.join("\n  "):""));
  console.log("Tag orfani: "+orphans.length+(orphans.length?"\n  "+orphans.join("\n  "):""));
  if(process.argv.includes("--coverage")){
    const totals=[0,0,0,0,0,0];let empty=0,rulesTotal=0;
    for(const l of LESSONS){
      const pool=lessonPool(l.id).map(i=>tagFor(l.id,i)).filter(Boolean),rules=lessonRules(l.id);
      const per=rules.map(r=>({r,n:pool.filter(t=>t.rules.includes(r.id)).length})),levels=[1,2,3,4,5].map(n=>pool.filter(t=>t.level===n).length);
      levels.forEach((n,i)=>totals[i+1]+=n);rulesTotal+=rules.length;
      const gaps=per.filter(x=>x.n===0).map(x=>x.r.key);empty+=gaps.length;
      console.log(l.id.padEnd(30)+" livelli 1-5: "+levels.join("/")+"  regole: "+per.map(x=>x.r.key+"="+x.n).join(" ")+(gaps.length?"  VUOTE: "+gaps.join(","):""));
    }
    console.log("\nTotale per livello: "+[1,2,3,4,5].map(n=>LEVELS[n]+" "+totals[n]).join(", "));
    console.log("Regole: "+rulesTotal+", senza esercizi: "+empty);
  }
  if(missing.length||orphans.length)process.exitCode=1;
}
