import {LESSONS} from "./catalog.js";
import {placementProfile} from "./placement.js";
import {lessonEvidence,CHECK_LESSONS,reassessmentDue} from "./grammar-checks.js";
export const PATH_GROUPS=[
 {id:"foundations",title:"Basi da verificare",level:"A1–A2",ids:["sentence","present-simple","present-continuous","questions","negatives","past-simple","past-continuous","nouns","articles","pronouns","some-any","quantifiers","adjectives","comparison","prepositions"]},
 {id:"time",title:"Tempo e punto di vista",level:"A2–B2",ids:["present","past","present-perfect-simple","perfect-simple","present-perfect-continuous","perfect-continuous","past-perfect-simple","past-perfect-continuous","past-perfect","future-will","future-going-to","future-arrangements","future","future-continuous","future-perfect-simple","future-perfect-continuous","future-perfect","used-to","future-in-past"]},
 {id:"control",title:"Modalità e costruzione",level:"A2–B2",ids:["ability","may-might","obligation","deduction","verb-patterns","phrasal-basics","conditionals-real","conditionals-unreal","wish"]},
 {id:"text",title:"Frasi e paragrafi",level:"B1–B2",ids:["passive","reported","indirect-questions","relatives","clauses","linkers","reporting-passive","participles","cohesion","argument"]},
 {id:"advanced",title:"Precisione e registro",level:"B2–C1",ids:["inversion","clefts","nominalisation","hedging","subjunctive","advanced-comparatives","mixed"]}
];
const requires={
 "present-continuous":["present-simple"],"past-continuous":["past-simple"],"present":["present-simple","present-continuous"],"past":["past-simple","past-continuous"],
 "negatives":["present-simple","past-simple"],"present-perfect-simple":["past-simple"],"perfect-simple":["past-simple","present-perfect-simple"],
 "present-perfect-continuous":["present-perfect-simple","present-continuous"],"perfect-continuous":["present-perfect-simple","present-perfect-continuous"],
 "past-perfect-simple":["past-simple","present-perfect-simple"],"past-perfect-continuous":["past-perfect-simple","past-continuous"],"past-perfect":["past-perfect-simple","past-perfect-continuous"],
 "future":["future-will","future-going-to","future-arrangements"],"future-continuous":["future-will","present-continuous"],"future-perfect-simple":["future-will","present-perfect-simple"],"future-perfect-continuous":["future-perfect-simple","present-perfect-continuous"],
 "passive":["past-simple","present-perfect-simple"],"reported":["past-simple","past-perfect-simple"],"conditionals-unreal":["conditionals-real","past-perfect-simple"],"advanced-comparatives":["comparison","comparative-patterns"]
};
export function lessonMeta(lesson){
 const group=PATH_GROUPS.find(g=>g.ids.includes(lesson.id))||PATH_GROUPS[[0,2,3,4][lesson.stage]];
 const candidates=requires[lesson.id]||lesson.prerequisites||[];
 return {group:group.id,level:group.level,prerequisites:candidates.filter(id=>id!==lesson.id&&LESSONS.some(l=>l.id===id))};
}
export function lessonProgress(state,id,timestamp=Date.now()){
 const attempts=state.attempts.filter(a=>a.lesson_id===id&&!a.assisted&&!a.disputed&&a.source!=="legacy");
 const contexts=new Set(attempts.filter(a=>a.correct).map(a=>a.context_id||a.stem));
 const independent=contexts.size>=8&&new Set(attempts.map(a=>a.session_id)).size>=2&&attempts.slice(-12).filter(a=>a.correct).length/Math.min(12,attempts.length)>=.85;
 const ev=lessonEvidence(state,id,timestamp);
 return {read:!!state.lesson_reads?.some(r=>r.lesson_id===id)||!!state.lesson_studies?.some(r=>r.lesson_id===id),practised:state.attempts.some(a=>a.lesson_id===id),independent,delayed:ev.delayed,due:ev.due_now,evidence:ev};
}
export function learningReason(state,lesson,timestamp=Date.now()){
 const ev=lessonEvidence(state,lesson.id,timestamp),profile=placementProfile(state.placement),progress=lessonProgress(state,lesson.id,timestamp);
 if(ev.errors)return "Nell'ultima verifica breve sono emersi errori su questa struttura.";
 if(ev.due_now)return "È il momento di controllare se ricordi la struttura a distanza di giorni.";
 if(state.attempts.some(a=>a.lesson_id===lesson.id&&!a.correct&&!a.assisted&&!a.disputed))return "Negli esercizi senza aiuti hai incontrato difficoltà su questa struttura.";
 if(profile?.lessonStatus[lesson.id]==="review")return "Il pretest indica che questa base richiede ripasso.";
 if(profile?.lessonStatus[lesson.id]==="skip")return "Il pretest consente di alleggerire questa base. Puoi verificarla brevemente prima di saltarla.";
 if(progress.independent)return "Hai risposto bene in più sessioni senza aiuti; il ripasso a distanza controlla la tenuta.";
 return "Segue la progressione del percorso. Puoi aprire liberamente anche le altre lezioni.";
}
export function checkPriorities(state,ranked,timestamp=Date.now()){
 return ranked.filter(l=>CHECK_LESSONS.includes(l.id)).map((l,index)=>({id:l.id,index,ev:lessonEvidence(state,l.id,timestamp)}))
 .sort((a,b)=>Number(b.ev.due_now)-Number(a.ev.due_now)||Number(!!a.ev.last)-Number(!!b.ev.last)||a.index-b.index).map(l=>l.id);
}
export function reviewNotice(state,timestamp=Date.now()){
 const due=CHECK_LESSONS.filter(id=>lessonEvidence(state,id,timestamp).due_now);
 return {due,recalibrate:reassessmentDue(state,timestamp)};
}
