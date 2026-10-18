import {LESSONS} from "./catalog.js";
import {recommendation,learningPath,now} from "./engine.js";
import {PATH_GROUPS,lessonMeta,lessonProgress,learningReason,checkPriorities,reviewNotice} from "./learning-path.js";
import {CHECK_ITEMS,CHECK_LESSONS,newCheck,checkItems,checkResults} from "./grammar-checks.js";
import {newCourse} from "./writing-course.js";
import {answerHint} from "./answer-normal.js";
export function learningUI(api){
 const {h,p,title,card,link,button,change,autosave,goto,refresh,getState}=api;
 async function begin(lessonId=null){
  let check;
  await change(s=>{s.grammar_checks??=[];check=s.grammar_checks.find(c=>!c.completed_at);if(!check){check=newCheck(s,checkPriorities(s,recommendation(s)),lessonId);s.grammar_checks.push(check);}});
  await goto("checkpoint/"+check.id);
 }
 function notice(){
  const s=getState(),review=reviewNotice(s),active=s.grammar_checks?.find(c=>!c.completed_at);
  return card(h("h2",{},review.recalibrate?"Ricalibra le priorità":review.due.length?"Ripasso grammaticale in scadenza":"Una verifica breve per orientarti"),
   p(review.recalibrate?"Sono passate almeno quattro settimane: dieci domande aggiornano le priorità senza ripetere tutto il pretest.":review.due.length?review.due.length+" strutture da riprendere dopo un intervallo. La verifica usa prima i contesti che non hai già visto.":"Dieci domande su cinque aree, separate dagli esercizi di allenamento. Gli approfondimenti non verificati restano da esplorare."),
   active?link("Riprendi la verifica","checkpoint/"+active.id):button("Inizia la verifica breve · 10 domande",()=>begin()),
   p("Banca locale di "+CHECK_ITEMS.length+" domande su "+CHECK_LESSONS.length+" strutture. Non è un test di livello completo. Quando una domanda è già stata usata, viene indicato.","small muted"));
 }
 // Il percorso deciso dall'app: tappe numerate, il motivo di ognuna e un solo pulsante per partire.
 function pathCard(heading="Il tuo percorso"){
  const s=getState(),steps=learningPath(s,5),next=steps[0];
  return h("section",{class:"card learning-path-card"},h("h2",{},heading),
   p(s.placement?.submitted_at?"L'ordine lo decide l'app in base al pretest e ai tuoi esercizi. Parti dalla tappa 1: quando la consolidi, il percorso si aggiorna da solo.":"Senza pretest l'ordine segue le basi del JFLT. Il pretest lo adatta a te.","small muted"),
   h("ol",{class:"path-steps"},steps.map((l,i)=>h("li",{class:i===0?"current":""},h("a",{href:"#/lesson/"+l.id},h("span",{class:"step-title"},(i===0?"Adesso · ":"")+l.title),h("span",{class:"step-reason small muted"},learningReason(s,l)))))),
   link("Inizia: "+next.title,"lesson/"+next.id),
   !s.placement?.submitted_at&&link("Prima fai il pretest di 45 domande","placement","text-link"),
   p("Ogni lezione: spiegazione, poi 30 esercizi con il tutor. La proposta si aggiorna con le tue risposte; il catalogo resta aperto se vuoi scegliere tu.","small muted"));
 }
 function overview(){
  const s=getState();
  return [pathCard(),notice(),
   h("details",{class:"card",open:true},h("summary",{},"La mappa del percorso"),p("Le fasce A1–C1 orientano la difficoltà dei gruppi: non assegnano un livello. I prerequisiti sono consigli, senza blocchi d'accesso.","small muted"),
    PATH_GROUPS.map(group=>{
     const lessons=LESSONS.filter(l=>lessonMeta(l).group===group.id).sort((a,b)=>{const ia=group.ids.indexOf(a.id),ib=group.ids.indexOf(b.id);return (ia<0?1000:ia)-(ib<0?1000:ib);});
     const practised=lessons.filter(l=>lessonProgress(s,l.id).practised).length;
     return h("details",{class:"path-group"},h("summary",{},group.title+" · "+group.level+" · "+practised+"/"+lessons.length+" praticate"),h("progress",{max:lessons.length,value:practised,"aria-label":group.title+": lezioni praticate"}),h("ol",{},lessons.map(l=>{const progress=lessonProgress(s,l.id);return h("li",{},link(l.title,"lesson/"+l.id,"text-link"),p(progress.delayed?"Verifiche distanziate riuscite":progress.independent?"Pratica senza aiuti riuscita":progress.practised?"In allenamento":progress.read?"Consultata":"Da esplorare","small muted"));})));
    }))];
 }
 function lessonPanel(id,returnCourse){
  const s=getState(),l=LESSONS.find(l=>l.id===id),meta=lessonMeta(l),progress=lessonProgress(s,id);
  const course=s.writing_courses?.find(c=>c.id===returnCourse);
  const startWriting=async()=>{
   const unitId=["argument","comparison","comparative-patterns","advanced-comparatives","hedging","linkers","cohesion"].includes(id)?"target-evaluation":["present-simple","conditionals-real","obligation"].includes(id)?"mission-essay":"mission-report";
   let c;await change(state=>{state.writing_courses??=[];c=state.writing_courses.find(c=>c.unit_id===unitId&&c.grammar_lesson_id===id&&!c.completed_at);if(!c){c=newCourse(unitId);c.grammar_lesson_id=id;state.writing_courses.push(c);}});await goto("course/"+c.id);
  };
  return card(h("h2",{},"Perché questa lezione"),p(learningReason(s,l)),
   h("div",{class:"path-milestones"},[["Consultata",progress.read],["Praticata",progress.practised],["Senza aiuti",progress.independent],["Verifiche distanziate",progress.delayed]].map(([name,ok])=>h("span",{class:"pill "+(ok?"maintain":"confirm")},(ok?"✓ ":"○ ")+name))),
   meta.prerequisites.length>0&&p("Prima è utile conoscere:","small"),h("div",{class:"actions"},meta.prerequisites.map(id=>link(LESSONS.find(l=>l.id===id).title,"lesson/"+id,"text-link"))),
   !progress.read&&button("Ho studiato la spiegazione",async()=>{await change(state=>{state.lesson_reads??=[];state.lesson_reads.push({lesson_id:id,date:now()});});await refresh();},"quiet"),
   CHECK_LESSONS.includes(id)&&button("Verifica breve · 4 domande",()=>begin(id),"secondary"),button("Usala nel percorso di scrittura",startWriting,"secondary"),
   course&&link("Torna alla tua bozza salvata","course/"+course.id),
   p("Aver letto non significa aver acquisito la regola. Le verifiche distanziate riguardano solo i punti campionati, non tutta la lezione.","small muted"));
 }
 function page(id){
  const c=getState().grammar_checks?.find(c=>c.id===id);
  if(!c)return [title("VERIFICA","Verifica non trovata"),link("Torna a Studio","studio")];
  const done=!!c.completed_at,items=checkItems(c),results=done?checkResults(c):[];
  const form=h("div",{},items.map((item,index)=>{
   const result=results.find(r=>r.id===item.id),l=LESSONS.find(l=>l.id===item.lesson_id);
   return h("fieldset",{class:"exercise"},h("legend",{},(index+1)+". "+l.title),p(item.stem,"stem"),c.reused_ids.includes(item.id)&&p("Domanda già vista: ripasso, non nuovo contesto.","small muted"),h("label",{for:item.id},"La tua risposta"),answerHint(item)&&h("p",{class:"small muted answer-hint",id:item.id+"-hint"},answerHint(item)),h("input",{id:item.id,"aria-describedby":answerHint(item)?item.id+"-hint":null,value:c.answers[item.id]||"",maxlength:600,disabled:done,autocomplete:"off",lang:"en",autocapitalize:"none",autocorrect:"off",spellcheck:"false",oninput:e=>{const value=e.target.value;autosave(s=>s.grammar_checks.find(c=>c.id===id).answers[item.id]=value);}}),!done&&button("Non lo so",async()=>{await change(s=>s.grammar_checks.find(c=>c.id===id).answers[item.id]="Non lo so");await refresh();},"quiet"),result&&h("div",{},p(result.correct?"Corretto":"Da ripassare",result.correct?"good":"warning"),p("Risposta: "+item.answer,"formula"),p(l.forms),link("Rivedi forma e significato","lesson/"+l.id,"text-link")));
  }));
  return [link("← Studio","studio","back"),title("VERIFICA SENZA AIUTI",c.lesson_id?"Conferma breve della struttura":"Dieci domande per aggiornare le priorità",done?results.filter(r=>r.correct).length+"/"+items.length+" risposte corrette":"Risposte salvate mentre scrivi. Leggi le soluzioni dopo la consegna."),form,
   !done&&button("Consegna la verifica",async()=>{await change(s=>{const current=s.grammar_checks.find(c=>c.id===id);if(current.completed_at)return;if(current.item_ids.some(id=>!current.answers[id]?.trim()))throw new Error("Rispondi a tutte le domande oppure scegli Non lo so.");current.completed_at=now();});await refresh();}),
   done&&card(h("h2",{},"Priorità aggiornate"),p("Gli errori riportano in evidenza le strutture da ripassare. Una verifica riuscita programma un nuovo controllo dopo 1, 3, 7, 14 o 30 giorni; ripetere la stessa domanda non conta come nuovo contesto."),link("Vedi il prossimo passo","studio"))];
 }
 return {overview,notice,lessonPanel,page,pathCard};
}
