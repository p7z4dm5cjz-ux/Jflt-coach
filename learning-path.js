import {LESSONS} from "./catalog.js";
import {placementProfile} from "./placement.js";
import {levelSequence} from "./starting-level.js";
import {lessonEvidence,CHECK_LESSONS,reassessmentDue,practiceWindow} from "./grammar-checks.js";
export const PATH_GROUPS=[
 {id:"foundations",title:"Basi da verificare",level:"A1–A2",ids:["sentence","present-simple","present-continuous","questions","negatives","past-simple","past-continuous","nouns","articles","pronouns","some-any","quantifiers","adjectives","comparison","prepositions"]},
 {id:"time",title:"Tempo e punto di vista",level:"A2–B2",ids:["present","past","present-perfect-simple","perfect-simple","present-perfect-continuous","perfect-continuous","past-perfect-simple","past-perfect-continuous","past-perfect","future-will","future-going-to","future-arrangements","future","future-continuous","future-perfect-simple","future-perfect-continuous","future-perfect","used-to","future-in-past"]},
 {id:"control",title:"Modalità e costruzione",level:"A2–B2",ids:["ability","may-might","obligation","deduction","verb-patterns","phrasal-basics","conditionals-real","conditionals-unreal","wish"]},
 {id:"text",title:"Frasi e paragrafi",level:"B1–B2",ids:["passive","reported","indirect-questions","relatives","clauses","linkers","reporting-passive","participles","cohesion","argument"]},
 {id:"advanced",title:"Precisione e registro",level:"B2–C1",ids:["inversion","clefts","nominalisation","hedging","subjunctive","advanced-comparatives","mixed"]}
];
const requires={
 "inversion":["questions","past-perfect-simple"],"hedging":["may-might","deduction"],"nominalisation":["sentence","verb-patterns"],"cohesion":["linkers","clauses"],
 "conditionals-real":["present-simple","future-will"],"mixed-conditionals":["conditionals-unreal"],"deduction":["may-might","obligation"],
 "reporting-passive":["passive","reported"],"clefts":["relatives"],"participles":["clauses","passive"],
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

// Una base pronta consente di studiare la lezione successiva; non certifica l'autonomia.
export function prerequisiteReady(state,id,profile=undefined){
 const w=practiceWindow(state,id),saved=state.lesson_levels?.[id];
 if(w.errors&&w.latestRate<0.6)return false;
 if(saved)return !!(saved.autonomous||saved.pending_transfer||saved.level>=3);
 return w.independent||w.can_advance||(profile===undefined?placementProfile(state.placement):profile)?.lessonStatus?.[id]==="skip";
}

// Ordine stabile dentro ciascuna priorità. Le dipendenze sconosciute vengono inserite
// prima dell'argomento: un livello dichiarato non inventa prove sui prerequisiti.
export function courseOrder(state,ranked){
 const sequence=levelSequence(state)||["present-simple","past-simple","present-perfect-simple",...PATH_GROUPS.flatMap(g=>g.ids)];
 const order=[...new Set([...sequence,...LESSONS.map(l=>l.id)])],position=id=>order.indexOf(id);
 const tier=l=>l.course_due?0:l.course_recovery?1:l.status==="maintain"||l.status==="skip"?3:l.status==="review"?1:2;
 const sorted=[...ranked].sort((a,b)=>tier(a)-tier(b)||position(a.id)-position(b.id));
 const byId=new Map(LESSONS.map(l=>[l.id,l])),rows=new Map(ranked.map(l=>[l.id,l])),out=[],seen=new Set(),readiness=new Map(),profile=placementProfile(state.placement);
 const ready=id=>{if(!readiness.has(id))readiness.set(id,prerequisiteReady(state,id,profile));return readiness.get(id);};
 function visit(id,target=null,trail=new Set()){
  if(seen.has(id)||trail.has(id)||!byId.has(id))return;
  const next=new Set(trail).add(id);
  for(const pre of lessonMeta(byId.get(id)).prerequisites)if(!ready(pre))visit(pre,target||id,next);
  seen.add(id);
  const row=rows.get(id)||{...byId.get(id),eligible:true,status:"new",score:0};
  out.push({...row,course_target:target,course_reason:target?"Prima di «"+byId.get(target).title+"», verifichiamo «"+row.title+"»: è una base necessaria e non è ancora confermata.":"Tappa del percorso: «"+row.title+"»."});
 }
 for(const row of sorted)visit(row.id);
 return out;
}
export function lessonProgress(state,id,timestamp=Date.now()){
 const independent=practiceWindow(state,id).independent;
 const ev=lessonEvidence(state,id,timestamp);
 return {read:!!state.lesson_reads?.some(r=>r.lesson_id===id)||!!state.lesson_studies?.some(r=>r.lesson_id===id),practised:state.attempts.some(a=>a.lesson_id===id),independent,delayed:ev.delayed,due:ev.due_now,evidence:ev};
}
export function learningReason(state,lesson,timestamp=Date.now()){
 if(lesson.course_target)return lesson.course_reason;
 const path=state.lesson_levels?.[lesson.id];
 if(path?.confirmed_at&&path.autonomous)return "Uso in testi nuovi confermato anche a distanza. Continua con il ripasso.";
 if(path?.pending_transfer)return path.transfer_due?"Prima prova su testo riuscita: la conferma a distanza sarà disponibile dal "+new Date(path.transfer_due).toLocaleString("it-IT")+".":"Sei pronto per la verifica in testi nuovi nel percorso con il tutor.";
 if(path)return "Percorso adattivo: livello "+path.level+". Il prossimo blocco riprende le regole più difficili; l'autonomia si conferma con testi nuovi e una prova a distanza.";
 const ev=lessonEvidence(state,lesson.id,timestamp),profile=placementProfile(state.placement),progress=lessonProgress(state,lesson.id,timestamp);
 if(ev.errors)return "Nell'ultima verifica breve sono emersi errori su questa struttura.";
 if(ev.due_now)return "È il momento di controllare se ricordi la struttura a distanza di giorni.";
 const w=practiceWindow(state,lesson.id,timestamp);
 if(w.due)return w.independent?"Sono passati almeno tre giorni dalle prove riuscite: controlla che la struttura tenga.":"Sono passati almeno tre giorni dalla sessione riuscita: una seconda sessione la conferma.";
 if(w.independent)return "Almeno 10 risposte corrette su 12 in due blocchi senza aiuti, con forma, significato e uso: puoi avanzare. Il ripasso a distanza deve ancora confermare la tenuta.";
 if(w.goodSession)return "Sessione completata ("+Math.round(w.latestRate*100)+"%): servono ancora prove diversificate di forma, significato e uso prima di avanzare.";
 if(w.errors)return "Nell'ultima sessione senza aiuti: "+w.errors+(w.errors===1?" errore":" errori")+" su "+w.latest.length+" risposte.";
 if(profile?.lessonStatus[lesson.id]==="review"){const rows=profile.rows.filter(r=>profile.adaptive?r.item.lessons[0]===lesson.id:r.item.lessons.includes(lesson.id)),wrong=rows.filter(r=>!r.correct).length;return wrong?"Nel pretest: "+wrong+(wrong===1?" risposta sbagliata":" risposte sbagliate")+" su "+rows.length+(rows.length===1?" domanda":" domande")+" che riguardano questa struttura.":"Nel pretest le risposte su questa struttura erano giuste ma date con dubbio: da confermare.";}
 if(profile?.lessonStatus[lesson.id]==="skip")return "Il pretest consente di alleggerire questa base. Puoi verificarla brevemente prima di saltarla.";
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
