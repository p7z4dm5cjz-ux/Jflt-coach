// Regole delle lezioni e regola + livello degli esercizi (dati in item-tags-data.js).
import {normal} from "./answer-normal.js";
import {LESSON_RULES,ITEM_TAGS} from "./item-tags-data.js";
export {LESSON_RULES};
export const LEVELS=[null,"Riconoscere","Produrre con aiuto","Distinguere dal contesto","Intrecciare più regole","Trasferire in un testo"];
// Impronta breve e stabile di una consegna (FNV-1a sul testo normalizzato).
export function stemKey(stem){
  let h=0x811c9dc5;const s=normal(stem);
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}
  return h.toString(36);
}
export const ruleId=(lessonId,key)=>key.includes(".")?key:lessonId+"."+key;
export function lessonRules(lessonId){return (LESSON_RULES[lessonId]||[]).map(([key,name,test,pitfall])=>({id:lessonId+"."+key,key,name,test,pitfall}));}
export function ruleInfo(id){const [lesson,key]=id.split(".");return lessonRules(lesson).find(r=>r.key===key)||null;}
const tables={};
function table(lessonId){
  if(!tables[lessonId]){tables[lessonId]={};for(const entry of (ITEM_TAGS[lessonId]||"").split(" ").filter(Boolean)){const i=entry.indexOf(":");tables[lessonId][entry.slice(0,i)]=entry.slice(i+1);}}
  return tables[lessonId];
}
export function parseTag(lessonId,tag){const [keys,level]=tag.split(":");return {rules:keys.split("+").map(k=>ruleId(lessonId,k)),level:Number(level)};}
// Gli esercizi generati da un modello portano già regole e livello; gli altri si cercano per consegna.
export function tagFor(lessonId,item){
  if(Array.isArray(item?.rules)&&item.rules.length&&Number.isInteger(item.level))return {rules:item.rules,level:item.level};
  const tag=table(lessonId)[stemKey(item?.stem||"")];
  return tag?parseTag(lessonId,tag):null;
}
export function withTags(lessonId,item){const t=tagFor(lessonId,item);return t?{...item,rules:t.rules,level:t.level}:item;}
export function taggedKeys(lessonId){return Object.keys(table(lessonId));}
