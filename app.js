import {splitParagraphs,termContext} from "./reading-text.js";
import {reliableItem} from "./evidence-policy.js";
import {STARTING_LEVELS,startingLevel} from "./starting-level.js";
import {personalPractice} from "./learner-profile.js";
import {blockAdaptation,localRetry,replaceDoubts} from "./adaptive-practice.js";
import {lessonGuideUI,guideTasks} from "./lesson-guide.js";
import {anchorReading,anchorTest} from "./contract.js";
import {LESSONS,PHRASALS,VOCABULARY,PATTERNS,STAGES} from "./catalog.js";
import {PHRASAL_SCENARIOS} from "./phrasal-extension.js";
import {bookContext} from "./bookshelf.js";
import {QUESTIONS,orderedQuestions,orderedOptions,AREAS,PHRASAL_TARGETS,newAdaptivePlacement,adaptiveNext,adaptiveProgress} from "./placement.js";
import {VERSION,now,uid,resetProgress,countWords,normal,correct,endpoint,newPlacement,placementProfile,recommendation,learningPath,addTerm,recordReview,recoveryItems,phrasalItems,writingReady,sanitizeFeedback,GENRES,dailyPlan,dailyWritingTopic,localDay} from "./engine.js";
import {dailyPractice} from "./daily-practice.js";
import {grammarItems,lessonItems} from "./practice-bank.js";
import {answerHint} from "./answer-normal.js";
import {hintSteps,assistedItem,answerFeedback} from "./practice-support.js";
import {negativeItems} from "./negative-bank.js";
import {PRACTICE_SIZE,BLOCK_SIZE,trainingRecord,practiceBlock,freshAiItems,exerciseRequest,negativeRule} from "./practice-flow.js";
import {openRepository,parseBackup} from "./storage.js";
import {callTutor,getToken,isTokenRemembered,saveToken,invalidateHealth} from "./tutor.js";
import {learningUI} from "./learning-ui.js";
import {blockGoal} from "./block-goals.js";
import {CORE_LESSONS} from "./core-practice.js";
import {writingCourseUI} from "./writing-course-ui.js";
import {pathUI} from "./path-ui.js";
import {DEFAULT_LENGTH} from "./path-planner.js";

export function h(tag,attrs={},...children) {
  const el=document.createElement(tag);
  for(const [key,value] of Object.entries(attrs)) {
    if(value===undefined||value===null||value===false)continue;
    if(key.startsWith("on"))el.addEventListener(key.slice(2).toLowerCase(),value);
    else if(key==="class")el.className=value;
    else if(["value","checked","disabled","selected"].includes(key))el[key]=value;
    else el.setAttribute(key,value===true?"":value);
  }
  for(const child of children.flat(Infinity))if(child!==null&&child!==undefined&&child!==false)el.append(child instanceof Node?child:document.createTextNode(String(child)));
  return el;
}
const p=(text,cls="",id)=>h("p",{class:cls,id},text);
const link=(text,path,cls="button")=>h("a",{href:"#/"+path,class:cls},text);
const card=(...children)=>h("section",{class:"card"},children);
const list=items=>h("ul",{},items.map(i=>h("li",{},i)));
const title=(eyebrow,text,description)=>h("header",{class:"page-heading"},p(eyebrow,"eyebrow"),h("h1",{tabindex:"-1"},text),description&&p(description,"intro"));
const date=s=>new Date(s).toLocaleDateString("it-IT",{day:"numeric",month:"short"});
const statusLabels={new:"Da esplorare",review:"Priorità",confirm:"Da confermare",skip:"Basi già controllate",maintain:"Mantenimento"};
function shuffled(items) {
  return items.map(value=>({value,order:crypto.getRandomValues(new Uint32Array(1))[0]})).sort((a,b)=>a.order-b.order).map(x=>x.value);
}
export async function mountApp(repo,root=document.getElementById("view"),tutor=callTutor) {
  let state=repo.get(),busy=false,health=null,healthError="",groq=null,renderId=0;
  const notices=document.getElementById("notice"),saveStatus=document.getElementById("saved");
  const notify=(message,error=false)=>{notices.replaceChildren(p(message));notices.className="notice "+(error?"error":"success");notices.hidden=false;};
  async function change(fn) {state=await repo.change(fn);return state;}
  async function run(fn,button) {
    if(busy)return;notices.hidden=true;notices.replaceChildren();busy=true;root.setAttribute("aria-busy","true");
    if(button)button.disabled=true;
    saveStatus.textContent="Operazione in corso…";
    try{await repo.flush();state=repo.get();await fn();}
    catch(e){notify(e.message+(e.requestId?" Riferimento: "+e.requestId:""),true);}
    finally{busy=false;root.removeAttribute("aria-busy");if(button?.isConnected)button.disabled=false;saveStatus.textContent="Salvato sul dispositivo";}
  }
  const button=(text,fn,cls="")=>h("button",{type:"button",class:cls,onclick:e=>run(fn,e.currentTarget)},text);
  const themeNames={auto:"Automatico",light:"Chiaro",dark:"Scuro"};
  function applyTheme() {
    const theme=Object.hasOwn(themeNames,state.settings.theme)?state.settings.theme:"auto";
    document.documentElement.dataset.theme=theme;
    try{localStorage.setItem("jflt-coach-theme",theme);}catch{}
    const toggle=document.getElementById("theme-toggle");
    if(toggle){toggle.textContent="Tema: "+themeNames[theme];toggle.setAttribute("aria-label","Tema "+themeNames[theme]+". Cambia tema");}
    const dark=theme==="dark"||theme==="auto"&&window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content",dark?"#0e1726":"#f2f5f9");
  }
  document.getElementById("theme-toggle")?.addEventListener("click",e=>run(async()=>{const themes=["auto","light","dark"],current=themes.includes(state.settings.theme)?state.settings.theme:"auto";await change(s=>s.settings.theme=themes[(themes.indexOf(current)+1)%themes.length]);applyTheme();if(location.hash==="#/settings")await refresh();},e.currentTarget));
  window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change",()=>applyTheme());
  function autosave(fn) {
    saveStatus.textContent="Salvataggio…";
    return change(fn).then(()=>{saveStatus.textContent="Salvato sul dispositivo";}).catch(e=>{saveStatus.textContent="Salvataggio non riuscito";notify("Non ho potuto salvare: "+e.message+". Esporta il lavoro appena possibile.",true);});
  }
  function field(label,id,value,oninput,{area=false,placeholder="",max=12000,type="text"}={}) {
    const input=h(area?"textarea":"input",{id,value,type:area?undefined:type,maxlength:max,placeholder,oninput:e=>oninput(e.target.value)});
    return h("div",{class:"field"},h("label",{for:id},label),input);
  }
  async function goto(path) {
    if(location.hash==="#/"+path)await render();
    else location.hash="#/"+path;
  }
  async function refresh(){await render();}
  const courses=writingCourseUI({h,p,title,card,list,link,field,button,change,autosave,goto,refresh,repo,tutor,notify,getState:()=>state});
  const learning=learningUI({h,p,title,card,link,button,change,autosave,goto,refresh,getState:()=>state});
  const pathView=pathUI({h,p,card,link,button,change,goto,refresh,getState:()=>state,tutor,sessionRecord});
  const lessonGuide=lessonGuideUI({h,p,card,button,link,change,autosave,refresh,goto,startPractice:startGuidedPractice,getState:()=>state});
  async function startGuidedPractice(lessonId){
    const guide=state.lesson_guides?.find(g=>g.lesson_id===lessonId);
    const previous=state.sessions.find(s=>s.id===guide?.practice_id);
    if(previous){await goto("practice/"+previous.id);return;}
    if(getToken()&&navigator.onLine!==false){
      const sessionId=await startAiPractice(lessonId);
      await change(s=>{const g=s.lesson_guides.find(g=>g.lesson_id===lessonId);g.practice_id=sessionId;g.step=4;s.sessions.find(x=>x.id===sessionId).guide_lesson_id=lessonId;});
      return;
    }
    const lesson=LESSONS.find(l=>l.id===lessonId),tasks=guideTasks(lesson);
    const items=lessonItems(lessonId,state.sessions.length);
    const exposed=guide?.skipped?[]:[...(guide?.revealed.includes(2)?[tasks.form.stem]:[]),...(guide?.revealed.includes(3)&&tasks.choice?[tasks.choice.stem]:[])];
    const set=sessionRecord(lessonId,items,"local",{guide_lesson_id:lessonId,hinted_items:items.filter(i=>exposed.includes(i.stem)).map(i=>i.id)});
    await change(s=>{s.sessions.push(set);const g=s.lesson_guides.find(g=>g.lesson_id===lessonId);g.practice_id=set.id;g.step=4;});
    await goto("practice/"+set.id);
  }
  function sessionRecord(lessonId,items,source="local",extra={}) {
    const id=uid("session");
    const grammarCount=items.filter(it=>it.kind!=="retrieval").length;
    const training=grammarCount===PRACTICE_SIZE?trainingRecord(grammarCount,items.filter(it=>it.kind==="retrieval")):undefined;
    return {id,lesson_id:lessonId,items:items.map((it,i)=>({...it,...(!reliableItem(it,source)?{unscored:true,check_note:it.check_note||"Controllo automatico non disponibile: questa domanda non conta nei progressi."}:{}),id:it.id||id+"-"+i,accept:[it.answer,...(it.accept||[])],options:shuffled(it.options||[])})),answers:{},assisted:false,completed_at:null,source,created_at:now(),...(training?{training}:{}),...extra};
  }
  async function makeSession(lessonId,items,source="local",extra={}) {
    const set=sessionRecord(lessonId,items,source,extra);
    await change(s=>s.sessions.push(set));
    await goto("practice/"+set.id);return set.id;
  }
  async function startAiPractice(lessonId,total=PRACTICE_SIZE,parent=null,focus=[]) {
    const terms=parent?[]:dueTerms().slice(0,3),recovery=recoveryItems(terms);
    const context={training:trainingRecord(total,recovery,parent?.id||null),items:[]};
    const data=exerciseRequest(state,lessonId,{set:context,parent,focus});
    const result=await tutor(state.settings,"/tutor","exercises",data);
    const items=replaceDoubts(freshAiItems(parent?.items||[],result),lessonId,state.sessions.flatMap(s=>s.items)).map((it,i)=>({...it,id:uid("ai"),origin:it.replacement_note?"local":"groq",skill:it.replacement_note?(it.skill||"form"):(result.assessment?.item_skills[i]||"form")}));
    if(total===BLOCK_SIZE)items.push(...recovery);
    return await makeSession(lessonId,items,"groq",{assisted:!!parent,training:context.training,adaptive_plans:result.assessment?[{page:0,assessment:result.assessment,created_at:now()}]:[]});
  }
  async function nextPracticeBlock(id) {
    const set=repo.get().sessions.find(s=>s.id===id),block=practiceBlock(set);
    if(!block.checked)throw new Error("Verifica questo blocco prima di proseguire.");
    if(block.page>=block.pages-1)return;
    const decision=blockAdaptation(state,set),prior=set.remediation_blocks?.[block.page];
    if(!set.adaptive_plans?.length&&decision.mode!=="advance"&&!prior){
      const mistakes=block.items.filter(i=>!i.doubt&&state.attempts.some(a=>a.session_id===set.id&&a.item_id===i.id&&!a.correct&&!a.disputed));
      const fresh=localRetry(state,set,mistakes);
      if(fresh.length){const drill=sessionRecord(set.lesson_id,fresh,"local",{assisted:true,remediation_parent:set.id,remediation_focus:remediationFocus(set,mistakes),...(fresh.length===BLOCK_SIZE?{training:trainingRecord(BLOCK_SIZE,[],set.id)}:{})});await change(s=>{s.sessions.push(drill);const original=s.sessions.find(x=>x.id===id);original.remediation_blocks??={};original.remediation_blocks[block.page]=drill.id;});await goto("practice/"+drill.id);return;}
    }
    if(prior&&!state.sessions.find(s=>s.id===prior)?.completed_at){await goto("practice/"+prior);return;}

    const next=block.page+1,required=Math.min(set.training.grammar_target,(next+1)*BLOCK_SIZE);
    if(set.source==="groq"&&set.items.filter(it=>it.kind!=="retrieval").length<required) {
      const parent=state.sessions.find(s=>s.id===set.training.parent_id);
      const result=await tutor(state.settings,"/tutor","exercises",exerciseRequest(state,set.lesson_id,{set,parent}));
      const items=replaceDoubts(freshAiItems([...set.items,...(parent?.items||[])],result),set.lesson_id,state.sessions.flatMap(s=>s.items)).map((it,i)=>({...it,id:uid("ai"),origin:it.replacement_note?"local":"groq",skill:it.replacement_note?(it.skill||"form"):(result.assessment?.item_skills[i]||"form"),accept:[it.answer,...it.accept],options:shuffled(it.options)}));
      await change(s=>{const current=s.sessions.find(x=>x.id===id);current.items.push(...items);if(result.assessment){current.adaptive_plans??=[];current.adaptive_plans.push({page:next,assessment:result.assessment,created_at:now()});}if(current.items.filter(it=>it.kind!=="retrieval").length===current.training.grammar_target)current.items.push(...current.training.recovery);current.training.page=next;});
    }else await change(s=>s.sessions.find(x=>x.id===id).training.page=next);
    await refresh();
  }
  function remediationFocus(set,items){return items.slice(0,3).map(i=>({stem:i.stem,answer:set.answers[i.id]||"",reference:i.answer,why:i.why,diagnosis:answerFeedback(i,set.answers[i.id]||"")}));}
  async function retryMistakes(set,items) {
    const fresh=localRetry(state,set,items);
    if(fresh.length)await makeSession(set.lesson_id,fresh,"local",{assisted:true,remediation_parent:set.id,remediation_focus:remediationFocus(set,items),...(fresh.length===BLOCK_SIZE?{training:trainingRecord(BLOCK_SIZE,[],set.id)}:{})});
    else await startAiPractice(set.lesson_id,BLOCK_SIZE,set,items);
  }
  async function startDaily() {
    let planId,sessionId;
    await change(s=>{
      const plan=dailyPlan(s);s.daily_plans??=[];
      let saved=s.daily_plans.find(x=>x.day===plan.day);
      if(!saved){saved={id:uid("daily"),day:plan.day,minutes:plan.minutes,lesson_id:plan.lesson_id,term_ids:plan.term_ids,practice_id:null,writing_id:null,created_at:now()};s.daily_plans.push(saved);}
      if(!saved.practice_id){const set=sessionRecord(plan.lesson_id,[...dailyPractice(s,plan).items,...recoveryItems(plan.terms)],"local",{daily_plan_id:saved.id});s.sessions.push(set);saved.practice_id=set.id;}
      planId=saved.id;sessionId=saved.practice_id;
    });
    if(state.sessions.find(x=>x.id===sessionId)?.completed_at)await startDailyWriting(planId);
    else await goto("practice/"+sessionId);
  }
  async function startDailyWriting(planId) {
    let writingId;
    await change(s=>{
      const saved=s.daily_plans?.find(x=>x.id===planId);
      if(!saved)throw new Error("Piano non trovato. Torna alla pagina Oggi.");
      if(!saved.writing_id){const plan=dailyPlan(s,new Date(saved.day+"T12:00:00").getTime()),w={id:uid("writing"),type:"report",topic:dailyWritingTopic(plan),mode:"guided",grammar_lesson_id:plan.lesson_id,ideas:"",outline:"",draft:"",rewrite:"",feedback:null,comparison:null,transfer:[],created_at:now(),daily_plan_id:saved.id};s.writings.push(w);saved.writing_id=w.id;}
      writingId=saved.writing_id;
    });
    await goto("writing/"+writingId);
  }
  function dueTerms() {return state.vocabulary.filter(v=>Date.parse(v.due)<=Date.now()).sort((a,b)=>a.due.localeCompare(b.due));}
  function sourceNotes(id,mode,type) {
    const ctx=bookContext(id,mode,type);
    return h("details",{class:"sources"},h("summary",{},"Riferimenti didattici"),ctx.notes.map(n=>h("div",{},h("strong",{},n.book+" · "+(n.units?"unità "+n.units+" · ":"")+"p. "+n.pages),p(n.note_it),n.relation_it&&p(n.relation_it,"small muted"))),ctx.further.map(n=>p(n.book+" · "+n.pages+" · "+n.purpose_it)),(LESSONS.find(l=>l.id===id)?.references||[]).map(r=>h("a",{href:r.url,target:"_blank",rel:"noopener noreferrer",class:"text-link"},r.label)),ctx.errata.map(e=>p("Correzione del manuale "+e.book+", p. "+e.pages+": "+e.correction_it,"warning")),p("Sintesi ed esercizi originali. I rimandi non implicano lettura integrale o equivalenza con tutti gli esercizi della fonte.","muted"));
  }
  function todayLabel(){return new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"}).toUpperCase();}
  function weekStrip(){
    const today=new Date(),monday=new Date(today.getFullYear(),today.getMonth(),today.getDate()-((today.getDay()+6)%7));
    const active=new Set([...state.attempts.filter(a=>a.source!=="legacy").map(a=>a.date),...state.sessions.map(x=>x.completed_at),...state.writings.map(w=>w.created_at),...state.readings.map(x=>x.test?.completed_at)].filter(Boolean).map(d=>localDay(Date.parse(d))));
    const names=["L","M","M","G","V","S","D"],full=["lunedì","martedì","mercoledì","giovedì","venerdì","sabato","domenica"],todayKey=localDay();
    return h("section",{class:"week-strip","aria-label":"Questa settimana"},h("ol",{},names.map((name,i)=>{const day=new Date(monday.getFullYear(),monday.getMonth(),monday.getDate()+i),key=localDay(day.getTime()),done=active.has(key),isToday=key===todayKey,future=day>today&&!isToday;
      return h("li",{class:[done&&"done",isToday&&"today",future&&"future"].filter(Boolean).join(" ")},h("span",{"aria-hidden":"true"},name),h("span",{class:"dot"},done?h("span",{class:"sr-only"},full[i]+": studio svolto"):h("span",{class:"sr-only"},full[i]+(isToday?": oggi":future?"":": nessuna attività"))));})));
  }
  function startingLevelCard() {
    const selected=startingLevel(state);
    const input=h("select",{id:"starting-level"},h("option",{value:"",selected:!selected},"Scegli un livello"),STARTING_LEVELS.map(l=>h("option",{value:l.id,selected:selected?.id===l.id},l.label)));
    return card(h("h2",{},"Da quale livello vuoi partire?"),p("Scegli il tuo punto di partenza. Le risposte e il pretest, se lo fai, guideranno poi gli adattamenti."),h("label",{for:"starting-level"},"Livello iniziale"),input,button("Parti dal livello scelto",async()=>{
      if(!input.value)throw new Error("Scegli un livello oppure fai il pretest.");
      await change(s=>s.settings.starting_level=input.value);
      goto("lesson/"+learningPath(state)[0].id);
    }),p("È un’autovalutazione, non una certificazione. Puoi cambiarla nelle Impostazioni; progressi e attività già iniziate restano salvati.","small muted"),link("Non so: fai il pretest","placement","text-link"));
  }
  function home() {
    const plan=dailyPlan(state),planLesson=plan.lesson,next=learningPath(state)[0],profile=placementProfile(state.placement),due=dueTerms(),active=state.writings.findLast(w=>!w.comparison),activePractice=state.sessions.findLast(set=>!set.completed_at&&!set.path_id),activeCourse=state.writing_courses?.findLast(c=>!c.completed_at),activeGuide=state.lesson_guides?.findLast(g=>!g.completed_at);
    const courseCard=card(h("h2",{},activeCourse?"Riprendi la scrittura passo passo":"Dal modello al saggio e al rapporto"),p("MISSION, TARGET e CAMPAIGN: comprensione, frasi, paragrafo, scaletta e nuove prove autonome."),link(activeCourse?"Riprendi · passo "+(activeCourse.stage+1)+" di 6":"Impara a scrivere",activeCourse?"course/"+activeCourse.id:"writing","secondary"));
    const attempts=state.attempts.filter(a=>!a.assisted&&!a.disputed&&a.source!=="legacy"&&reliableItem(state.sessions.find(s=>s.id===a.session_id)?.items.find(i=>i.id===a.item_id),a.source)),score=attempts.length?Math.round(attempts.filter(a=>a.correct).length/attempts.length*100):null;
    if(!profile&&!startingLevel(state))return [
      restoreCard(),startingLevelCard(),
      title("IL TUO PUNTO DI PARTENZA","Prima capiamo da dove iniziare.","Un pretest adattivo di circa 15 minuti sceglie gli argomenti da ripassare e le basi che puoi saltare."),
      h("section",{class:"hero"},h("div",{},p("PRETEST · PUOI INTERROMPERE E RIPRENDERE","eyebrow"),h("h2",{},state.placement?"Riprendi il tuo pretest":"Trova le tue priorità"),p("Tempi verbali, negazioni, phrasal verbs e altre strutture. Le risposte corrette date con dubbio restano da confermare."),link(state.placement?"Riprendi il pretest":"Inizia il pretest","placement")),h("span",{class:"hero-mark","aria-hidden":"true"},"Aa")),
      card(h("h2",{},"Un percorso basato sui risultati"),p("Alla fine del pretest l'app ti propone un percorso. Le risposte successive e gli errori degli scritti lo aggiornano."),p("Con il tutor il percorso procede a cicli di 15 domande in tre blocchi da 5: dopo ogni ciclo l'app decide se salire di livello, restare o ripassare."),link("Esplora le lezioni","studio","secondary")),
      activePractice&&card(h("h2",{},"Esercizi già iniziati"),link("Riprendi la sessione","practice/"+activePractice.id)),
      activeGuide&&card(h("h2",{},"Riprendi la lezione passo passo"),link("Continua la lezione","lesson/"+activeGuide.lesson_id)),
      courseCard,
      active&&card(h("h2",{},"La tua bozza"),link("Riprendi la scrittura","writing/"+active.id,"secondary"))
    ];
    return [
      title(todayLabel(),"Un passo avanti, ogni giorno.","Per imparare un argomento nuovo segui il percorso consigliato. Il piano breve qui sotto serve ad allenarti e ripassare."),weekStrip(),
      h("section",{class:"hero daily-card","aria-labelledby":"daily-heading"},
        h("div",{class:"today-head"},p((plan.id?"IL TUO PIANO GIÀ INIZIATO":"IL PIANO DI OGGI")+" · CIRCA "+plan.minutes+" MINUTI","eyebrow"),h("h2",{id:"daily-heading"},planLesson.title)),
        h("ol",{class:"today-tiles"},
          h("li",{class:plan.practice_complete?"done":"current"},h("span",{class:"tile-label"},"Esercizi"),h("strong",{},"Pratica breve e ripasso"),h("span",{class:"tile-state"},plan.practice_complete?"Fatto":plan.terms.length?"+ "+plan.terms.length+" termini":"Da fare")),
          h("li",{class:plan.writing_complete?"done":plan.practice_complete?"current":""},h("span",{class:"tile-label"},"Breve scrittura"),h("strong",{},plan.writing_words+"/"+plan.minimum_words+" parole"),h("span",{class:"tile-state"},plan.writing_complete?"Fatto":"Da fare"))),
        h("progress",{max:2,value:plan.completed_steps,"aria-label":"Attività quotidiane svolte"}),p(plan.completed_steps+" di 2 attività svolte","small today-count"),
        button(plan.completed_steps===2?"Rivedi la breve scrittura":plan.id?"Riprendi il piano di oggi":"Inizia il piano di oggi",startDaily),
        h("details",{class:"today-more"},h("summary",{},"Come funziona il piano"),p(("Pratica offline su «")+planLesson.title+"»"+(plan.terms.length?" e recupero di "+plan.terms.length+" termini in scadenza.":". Nessun nuovo termine obbligatorio.")),p("Per i nuovi piani: fino a 6, 12 o 18 esercizi per 10, 20 o 30 minuti, con un massimo di due argomenti da ripassare a distanza. Le banche sono finite e alcune frasi possono ripetersi. Puoi fermarti e riprendere; 30 esercizi restano disponibili nelle lezioni."),p("Poi un breve rapporto con dati fittizi: revisione e riscrittura quando vuoi. Le attività svolte non certificano la padronanza; il piano parte offline e non invia richieste Groq."),link("Consulta la lezione","lesson/"+planLesson.id,"text-link"))),
      pathView.homeCard(),
      learning.pathCard(),
      learning.notice(),
      activePractice&&card(h("h2",{},"Riprendi gli esercizi"),p((LESSONS.find(l=>l.id===activePractice.lesson_id)?.title||"Pratica")+" · risposte e blocchi già verificati sono salvati."),link("Riprendi la sessione","practice/"+activePractice.id)),
      activeGuide&&card(h("h2",{},"Riprendi la lezione passo passo"),link("Continua la lezione","lesson/"+activeGuide.lesson_id)),
      courseCard,
      h("div",{class:"stats"},card(p("Verifiche senza aiuti","muted"),h("strong",{class:"big"},score===null?"—":score+"%"),p(attempts.length+" risposte valutate","small")),card(p("Parole da recuperare","muted"),h("strong",{class:"big"},due.length),link("Apri Ripasso","review","text-link")),card(p("I tuoi scritti","muted"),h("strong",{class:"big"},state.writings.length),link(active?"Riprendi la bozza":"Prepara un testo",active?"writing/"+active.id:"writing","text-link"))),
      profile?card(h("h2",{},"Il tuo punto di partenza"),p(profile.correct+" risposte corrette su "+profile.total+". Una risposta data con dubbio resta da confermare."),link("Vedi risultati e priorità","placement","text-link")):card(h("h2",{},"Livello iniziale: "+startingLevel(state).id),p("Il tutor parte da questa autovalutazione e si adatta alle tue risposte."),link("Cambia livello","settings","text-link"),link("Affina con il pretest","placement","text-link")),
      h("div",{class:"two-columns"},card(h("h2",{},"Phrasal verbs nel contesto"),p("Significato, particelle, ordine dei pronomi e registro. Una parola segnata come nota resta distinta da una risposta verificata."),link("Apri il laboratorio","phrasals")),card(h("h2",{},"Impara a comprendere"),p("Incolla un articolo: scopri il senso, le scelte linguistiche e salva le parole nel dizionario personale."),link("Incolla e comprendi un articolo","reading"))),
      link("Consulta i progressi","progress","text-link")
    ];
  }
  function studio() {
    const search=h("input",{id:"lesson-search",type:"search",placeholder:"Cerca un tempo o una costruzione…","aria-label":"Cerca una lezione"});
    const stage=h("select",{id:"stage-filter","aria-label":"Filtra per tappa"},h("option",{value:"all"},"Tutte le tappe"),STAGES.map((title,i)=>h("option",{value:String(i)},title)));
    const rows=h("div",{class:"lesson-grid"});
    function fill(value="") {rows.replaceChildren(...recommendation(state).filter(l=>(stage.value==="all"||l.stage===Number(stage.value))&&normal(l.title+" "+l.tool+" "+l.forms+" "+l.goal).includes(normal(value))).map(l=>h("a",{class:"lesson-card",href:"#/lesson/"+l.id},h("span",{class:"pill "+l.status},statusLabels[l.status]),h("h2",{},l.title),p(l.goal,"small"),h("span",{class:"arrow","aria-hidden":"true"},"→"))));}
    search.oninput=()=>fill(search.value);stage.onchange=()=>fill(search.value);fill();
    return [title("STUDIO","Percorso e lezioni.","Il percorso indica da dove partire. Sotto trovi tutte le "+LESSONS.length+" lezioni, se vuoi sceglierne una tu."),h("div",{class:"actions"},link("Phrasal verbs","phrasals","button secondary"),link("Comprendi","reading","button secondary")),...learning.overview(),h("h2",{},"Catalogo completo: scegli liberamente"),search,stage,rows];
  }
  function lesson(id,returnCourse) {
    const l=LESSONS.find(l=>l.id===id);if(!l)return [title("STUDIO","Lezione non trovata."),link("Torna alle lezioni","studio")];
    const course=recommendation(state),at=course.findIndex(x=>x.id===id),step=course[at],next=course[at+1];
    const selected=dueTerms().slice(0,3),personal=personalPractice(state,id);
    const study=state.lesson_studies?.find(x=>x.lesson_id===id),question=h("textarea",{id:"grammar-question",maxlength:500,rows:2,value:study?.question||"",placeholder:"Es. Perché qui non uso il past simple?"});
    return [link("← Tutte le lezioni","studio","back"),title("GRAMMATICA",l.title,l.goal),
      step&&card(h("h2",{},"Il tuo percorso"),p(step.course_reason),next&&p("Prossima tappa prevista: «"+next.title+"». Recuperi e ripassi possono precederla.","small muted"),step.course_target&&link("Conosci già queste basi? Verificale con il pretest","placement","text-link")),
      lessonGuide(l),learning.lessonPanel(id,returnCourse),
      card(h("h2",{},"Quando usarla"),p(l.when),l.forms&&p(l.forms,"formula"),list(l.examples.map(t=>h("span",{lang:"en"},t))),h("h3",{},"La differenza che conta"),p(l.contrast),p(l.pitfall,"warning")),
      l.sections&&card(h("h2",{},"Approfondisci e usa la regola"),l.sections.map(s=>h("details",{},h("summary",{},s.title),p(s.text)))), 
      l.related?.length&&card(h("h2",{},"Collega le strutture"),p("Sono collegamenti di studio, non lezioni dichiarate già acquisite dal pretest.","small muted"),h("div",{class:"actions"},l.related.map(id=>{const item=LESSONS.find(l=>l.id===id);return item&&link(item.title,"lesson/"+id,"text-link");}))),
      card(h("h2",{},"Studia questa lezione con il tutor"),p("Prima degli esercizi, chiedi una spiegazione della forma, del significato e della differenza rispetto alla struttura più simile. Puoi aggiungere un dubbio specifico."),h("label",{for:"grammar-question"},"Il tuo dubbio (facoltativo)"),question,button("Spiegami questa lezione",async()=>{const asked=question.value.trim(),result=await tutor(state.settings,"/tutor","grammar_explain",{lesson_id:id,question:asked});await change(s=>{s.lesson_studies??=[];const record={lesson_id:id,question:asked,result,created_at:now()},index=s.lesson_studies.findIndex(x=>x.lesson_id===id);if(index<0)s.lesson_studies.push(record);else s.lesson_studies[index]=record;});await refresh();},"secondary"),p("Una richiesta Groq. La spiegazione ricevuta resta consultabile offline.","small muted")),
      study&&card(h("h2",{},"La spiegazione salvata"),study.question&&p("Il tuo dubbio: "+study.question,"muted"),p(study.result.summary),h("h3",{},"Come costruirla"),p(study.result.form,"formula"),h("h3",{},"Quando e perché"),list(study.result.when),study.result.examples.map(e=>h("div",{class:"course-focus"},h("blockquote",{lang:"en"},e.en),p(e.it),p(e.why,"muted"))),h("h3",{},"Confronta le due scelte"),p(study.result.contrast),h("h3",{},"Errori da evitare"),list(study.result.pitfalls)),
      h("div",{class:"two-columns"},card(h("h2",{},"Pratica senza connessione"),p(id==="negatives"?"30 esercizi in cinque blocchi: ausiliari, tempi, modali, parole negative, significato e uso in situazioni reali. Ogni risposta ha una spiegazione specifica; sugli errori puoi riprovare con frasi diverse.":CORE_LESSONS.includes(id)?"30 esercizi controllati: significato, completamento, negazione, domanda e confronto fra strutture, più alcune domande nuove su scelta del tempo, uso e ordine delle parole. Le situazioni di base sono riprese in più operazioni; non equivalgono a 30 contesti indipendenti. Le varianti cambiano il soggetto e la concordanza resta controllata.":lessonItems(id).length+" esercizi locali con soluzione e motivazione. La ripetizione ruota le stesse domande; per altri contesti usa il tutor."),button("Esercizi offline",()=>makeSession(id,[...lessonItems(id,state.sessions.length),...recoveryItems(selected)]))),pathView.lessonCard(id,h("details",{class:"path-classic"},h("summary",{},"Altre modalità con il tutor"),p("Modalità precedente: 30 esercizi sulla sola lezione, in cinque blocchi da sei. Le sessioni già iniziate restano disponibili.","small muted"),button("Inizia 30 esercizi con il tutor",()=>startAiPractice(id),"secondary"),button("Genera 6 esercizi con il tutor",()=>startAiPractice(id,BLOCK_SIZE),"quiet")))),
      personal.length>0&&card(h("h2",{},"Le tue domande AI, anche offline"),p("Riprendi fino a sei domande già controllate automaticamente, dando precedenza a quelle difficili per te. È un ripasso: le risposte su frasi già viste non contano come nuove prove di padronanza."),button("Ripassa le domande salvate",()=>makeSession(id,personal,"local",{assisted:true}))),
      selected.length&&p("Recupero di oggi: "+selected.map(v=>v.expression).join(" · "),"muted"),sourceNotes(id)];
  }
  function practice(id) {
    const set=state.sessions.find(s=>s.id===id);if(!set)return [title("ESERCIZI","Sessione non trovata."),link("Apri Studio","studio")];
    const l=LESSONS.find(l=>l.id===set.lesson_id),done=!!set.completed_at,flow=practiceBlock(set),locked=done||flow.checked;
    const form=h("form",{id:"practice-form"}),visibleIds=new Set(flow.items.map(it=>it.id));
    const results=state.attempts.filter(a=>a.session_id===id).map(a=>({...a,disputed:a.disputed||!reliableItem(set.items.find(i=>i.id===a.item_id),a.source)})),blockResults=results.filter(a=>visibleIds.has(a.item_id));
    const adaptation=blockAdaptation(state,set),assessment=set.adaptive_plans?.find(x=>x.page===flow.page)?.assessment;
    const mistakes=flow.items.filter(it=>it.kind!=="retrieval"&&blockResults.some(a=>a.item_id===it.id&&!a.correct&&!a.disputed));
    const answerTarget=flow.target-set.items.filter(it=>it.doubt).length;
    const progressLabel=p("","small muted"),progressBar=h("progress",{max:answerTarget,value:0,"aria-label":"Risposte compilate nella sessione"});
    function updateProgress(){
      const current=repo.get().sessions.find(s=>s.id===id);
      const other=current.items.filter(it=>!it.doubt&&!visibleIds.has(it.id)&&current.answers[it.id]?.trim()).length;
      const here=[...form.querySelectorAll(".exercise")].filter(block=>block.querySelector('input[type="radio"]:checked')||[...block.querySelectorAll('input:not([type="radio"])')].some(input=>input.value.trim())).length;
      const filled=other+here;progressLabel.textContent=filled+" di "+answerTarget+" risposte compilate"+(set.training?" · "+results.length+" verificate":"");progressBar.value=filled;
    }
    for(const [i,item] of flow.items.entries()) {
      if(set.path_id&&item.group&&!flow.items.slice(0,i).some(x=>x.group===item.group))form.append(pathView.passage(set,item));
      if(!set.path_id&&item.passage)form.append(h("blockquote",{class:"path-passage",lang:"en"},item.passage));
      if(item.doubt){form.append(h("section",{class:"exercise-excluded"},p("Esercizio "+(flow.start+i+1)+" escluso: il controllo automatico non ha confermato la soluzione. Non devi rispondere e non incide sul punteggio.","small warning check-note")));continue;}
      const value=set.answers[item.id]||"",result=locked?results.find(a=>a.item_id===item.id):null;
      const block=h("fieldset",{class:"exercise"},h("legend",{},(flow.start+i+1)+". "+(set.path_id?pathView.itemLabel(item,!!result):item.kind==="retrieval"?"Recupero lessicale":["recognise","meaning"].includes(item.skill)?"Significato":item.skill==="tense_choice"?"Scelta della forma":item.skill==="word_order"?"Ordine delle parole":item.skill==="use"?"Uso in una situazione":"Uso della forma")),p(item.stem,"stem"),!reliableItem(item,set.source)&&p("Controllo non disponibile: puoi esercitarti, ma questa risposta è esclusa dal punteggio e dall’avanzamento.","small warning"),item.doubt&&p(item.check_note||"Il controllo automatico non ha confermato la soluzione: l'esercizio non conta nel punteggio.","small warning check-note"));
      if(item.options?.length)for(const [j,opt] of item.options.entries())block.append(h("label",{class:"option",for:item.id+"-"+j},h("input",{id:item.id+"-"+j,type:"radio",name:item.id,value:opt,checked:value===opt,disabled:locked,onchange:e=>{autosave(s=>{s.sessions.find(x=>x.id===id).answers[item.id]=e.target.value;});updateProgress();}}),h("span",{lang:"en"},opt)));
      else block.append(h("label",{class:"sr-only",for:item.id},"Risposta "+(flow.start+i+1)),answerHint(item)&&p(answerHint(item),"small muted answer-hint",item.id+"-hint"),h("input",{id:item.id,value,"aria-describedby":answerHint(item)?item.id+"-hint":null,disabled:locked,autocomplete:"off",lang:"en",autocapitalize:"none",autocorrect:"off",spellcheck:"false",maxlength:600,oninput:e=>{const v=e.target.value;autosave(s=>{s.sessions.find(x=>x.id===id).answers[item.id]=v;});updateProgress();}}));
      if(!locked){
        if(item.replacement_note)block.append(p(item.replacement_note,"small muted"));
        if(item.difficulty_label&&!set.path_id)block.append(p("Livello "+item.difficulty+" · "+item.difficulty_label,"small muted"));
        const steps=hintSteps(item,LESSONS.find(x=>x.id===item.focus_lesson)||l),hintId=item.id+"-reasoning-hint";
        let level=set.hint_levels?.[item.id]||(set.hinted_items?.includes(item.id)?1:0);
        const hintBox=h("div",{id:hintId,class:"exercise-hint",hidden:!level,role:"status"});
        const paint=()=>{hintBox.replaceChildren(...steps.slice(0,level).map(step=>h("section",{},h("strong",{},step.title),p(step.text))),p(set.assisted?"Questa sessione era già guidata e mantiene la valutazione con aiuti.":level>=steps.length?"Hai visto la soluzione: scrivila con parole tue per fissarla. La risposta conta come guidata.":"Questa risposta sarà registrata con aiuto. Le altre restano autonome.","small muted"));};paint();
        const nextLabel=()=>"Mostra "+(steps[level]?.label||"il prossimo aiuto");
        const hintButton=button(nextLabel(),async()=>{
          level=Math.min(level+1,steps.length);
          await change(s=>{const current=s.sessions.find(x=>x.id===id);current.hinted_items??=[];if(!current.hinted_items.includes(item.id))current.hinted_items.push(item.id);current.hint_levels??={};current.hint_levels[item.id]=level;});
          hintBox.hidden=false;paint();hintButton.textContent=level===steps.length?"Tutti gli aiuti mostrati":nextLabel();hintButton.setAttribute("aria-expanded","true");hintButton.hidden=level>=steps.length;
        },"quiet");
        hintButton.setAttribute("aria-controls",hintId);hintButton.setAttribute("aria-expanded",String(!!level));
        hintButton.setAttribute("aria-label","Suggerimento per la domanda "+(flow.start+i+1));
        if(level>=steps.length)hintButton.hidden=true;
        block.append(hintButton,hintBox);
      }
      if(result)block.append(h("div",{class:"exercise-feedback"},p(result.correct?"Risposta corretta":result.disputed?"Da verificare":"Da rivedere",result.correct?"good":"warning"),p("La tua risposta: "+result.answer,"small"),!result.correct&&p(answerFeedback(item,result.answer),"answer-diagnosis"),p(result.assisted?"Con aiuto":"Senza aiuti","small muted"),p("Risposta di riferimento: "+item.answer,"formula"),item.formula&&h("h3",{},"La forma"),item.formula&&p(item.formula,"small"),h("h3",{},"Perché"),p(item.why)));
      if(result&&!result.correct&&set.source==="groq"&&item.kind!=="retrieval")block.append(result.disputed?p("Risposta segnalata: esclusa dalle priorità finché resta da verificare.","small warning"):button("La mia risposta potrebbe essere valida",async()=>{await change(s=>s.attempts.find(a=>a.id===result.id).disputed=true);await refresh();},"quiet"));
      form.append(block);
    }
    form.addEventListener("submit",e=>{e.preventDefault();run(async()=>{
      const latest=repo.get().sessions.find(s=>s.id===id),currentBlock=practiceBlock(latest);
      if(latest.completed_at||currentBlock.checked)return;
      if(!currentBlock.items.length||currentBlock.items.some(it=>!it.doubt&&!latest.answers[it.id]?.trim()))throw new Error("Completa ogni risposta di questo blocco prima di verificare.");
      await change(s=>{
        const current=s.sessions.find(x=>x.id===id),items=practiceBlock(current).items.filter(it=>!it.doubt);
        for(const item of items) {
          const answer=current.answers[item.id],ok=correct(item,answer);
          s.attempts.push({id:uid("attempt"),session_id:id,item_id:item.id,lesson_id:item.kind==="retrieval"?"vocabulary":item.focus_lesson||current.lesson_id,stem:item.stem,...(item.context_id?{context_id:item.context_id}:{}),...(!reliableItem(item,current.source)?{disputed:true}:{}),answer,correct:ok,assisted:assistedItem(current,item),source:item.replacement_note?"local":current.source,date:now(),skill:item.skill||"form",term_id:item.term_id||null});
        }
        for(const termId of new Set(items.map(it=>it.term_id).filter(Boolean))) {
          const word=s.vocabulary.find(v=>v.id===termId),termItems=items.filter(it=>it.term_id===termId);
          if(word)recordReview(word,termItems.every(it=>correct(it,current.answers[it.id])),termItems.some(it=>assistedItem(current,it)));
        }
        if(current.training){current.training.checked.push(current.training.page);if(current.training.checked.length===Math.ceil(current.training.grammar_target/BLOCK_SIZE))current.completed_at=now();}
        else current.completed_at=now();
      });await refresh();
    });});
    if(!locked)form.append(h("button",{type:"submit"},set.training?"Verifica questo blocco":"Verifica le risposte"));
    updateProgress();
    const continueButton=set.path_id?pathView.continueButton(set):set.remediation_parent?link("Continua la sessione originale","practice/"+set.remediation_parent):set.guide_lesson_id?button("Continua: scrivi frasi tue",async()=>{await change(s=>{const g=s.lesson_guides?.find(g=>g.lesson_id===set.guide_lesson_id);if(g){g.skipped=false;g.completed_at=null;g.step=4;}});await goto("lesson/"+set.guide_lesson_id);}):set.daily_plan_id?button("Passa alla breve scrittura",()=>startDailyWriting(set.daily_plan_id)):link("Continua",set.writing_id?"writing/"+set.writing_id:"home");
    const nextNeedsAi=set.training&&set.source==="groq"&&set.items.filter(it=>it.kind!=="retrieval").length<Math.min(set.training.grammar_target,(flow.page+2)*BLOCK_SIZE);
    const blockNavigation=set.training&&h("div",{class:"actions practice-navigation"},flow.page>0&&button("Rivedi il blocco precedente",async()=>{await change(s=>s.sessions.find(x=>x.id===id).training.page--);await refresh();},"quiet"),flow.checked&&flow.page<flow.pages-1&&button((nextNeedsAi?"Genera":"Apri")+" il blocco "+(flow.page+2),()=>nextPracticeBlock(id)));
    return [link("← "+(l?.title||"Ripasso"),set.writing_id?"writing/"+set.writing_id:l?"lesson/"+set.lesson_id:"review","back"),title(set.source==="groq"?"ESERCIZI · GROQ":"ESERCIZI · OFFLINE",set.writing_id?"Verifica in un nuovo contesto":set.daily_plan_id?"Pratica breve e ripasso":l?.title||"Recupero del lessico"),
      set.path_id&&pathView.practiceHeader(set),
      set.training&&p("Blocco "+(flow.page+1)+" di "+flow.pages+" · "+set.training.grammar_target+" esercizi di grammatica"+(set.training.recovery.length?" + "+set.training.recovery.length+" recuperi lessicali":""),"practice-step"),
      set.training&&set.source==="groq"&&card(h("h2",{},assessment?"Perché questo blocco":blockGoal(flow.page).title),p(assessment?.reason||blockGoal(flow.page).goal),assessment&&p(assessment.goal)),
      set.training?.parent_id&&card(p("Riprova guidata dopo la spiegazione: le frasi sono nuove. I risultati restano separati dalle verifiche senza aiuti."),link("Torna alla sessione precedente","practice/"+set.training.parent_id,"text-link")),
      set.source==="local"&&set.items.some(it=>it.stem.startsWith("Scegli la forma corretta del verbo ("))&&card(p("Questa sessione conserva gli esercizi precedenti. È disponibile un nuovo allenamento con confronti di significato; le risposte già date restano salvate."),button("Apri il nuovo allenamento",()=>makeSession(set.lesson_id,[...lessonItems(set.lesson_id,state.sessions.length)]))),
      h("section",{class:"session-progress"},progressLabel,progressBar),
      done?card(h("h2",{},results.filter(r=>r.correct&&!r.disputed).length+"/"+results.filter(r=>!r.disputed).length+" corrette nelle risposte valutabili"),p(results.some(r=>r.assisted)?results.filter(r=>!r.assisted).length+" risposte senza aiuti · "+results.filter(r=>r.assisted).length+" con aiuto. Solo le prime contribuiscono ai risultati autonomi.":"Sessione senza suggerimenti, salvata nei tuoi progressi."),continueButton):flow.checked?card(h("h2",{},blockResults.filter(r=>r.correct&&!r.disputed).length+"/"+blockResults.filter(r=>!r.disputed).length+" corrette nel blocco"),p("Leggi la forma e il perché sotto ogni risposta. Poi prosegui oppure esercita di nuovo i punti da rivedere.")):h("div",{class:"actions"},p("Risposte salvate mentre scrivi. Forma, soluzione e spiegazione compaiono dopo la verifica.","muted"),p("Per un aiuto mirato usa il pulsante sotto la singola domanda. Solo la risposta per cui chiedi aiuto sarà segnata come guidata.","small muted")),
      locked&&!set.path_id&&card(h("h2",{},"Il prossimo passo"),p(set.adaptive_plans?.length?"Il prossimo blocco userà queste risposte insieme al pretest e ai risultati precedenti. Groq spiegherà quale competenza consolidare o rendere più impegnativa.":adaptation.message)),
      set.remediation_focus?.length>0&&card(h("h2",{},"Prima chiarisci l’errore"),set.remediation_focus.map(f=>h("div",{},p(f.stem),p("Avevi scritto: "+f.answer),p("Riferimento: "+f.reference,"formula"),f.diagnosis&&p(f.diagnosis),p(f.why))),p("Ora applica la stessa regola alle frasi diverse qui sotto.","small muted")),
      set.remediation_parent&&p("Riprova guidata: il risultato originale resta salvato. Alla fine puoi tornare al blocco di partenza.","small muted"),
      form,
      locked&&mistakes.length>0&&card(h("h2",{},"Capisci, poi riprova"),p("Riprova sulle regole sbagliate con frasi non ancora viste. Se la banca locale è esaurita, il pulsante indica la richiesta a Groq. Il risultato originale resta salvato."),button(localRetry(state,set,mistakes).length?"Rifai gli errori con frasi diverse":"Rifai gli errori con Groq",()=>retryMistakes(set,mistakes)),localRetry(state,set,mistakes).length>0&&button("Rifai gli errori con Groq",()=>startAiPractice(set.lesson_id,BLOCK_SIZE,set,mistakes),"secondary"),p("Puoi ripetere questo ciclo anche dopo la riprova.","small muted")),
      blockNavigation,
      done&&!set.training&&!set.path_id&&l&&card(h("h2",{},"Continua nel percorso"),button("Esercita questa lezione · "+DEFAULT_LENGTH+" min",()=>pathView.start(DEFAULT_LENGTH,set.lesson_id)),set.lesson_id==="negatives"&&button("Inizia 30 negazioni offline",()=>makeSession("negatives",grammarItems("negatives",state.sessions.length)),"secondary"))
    ];
  }
  // Scelta tra pretest adattivo (consigliato) e classico da 45 domande. Con again=true la prova
  // attuale va nell'archivio, da cui si può ripristinare.
  function pretestChoice(again=false){
    const start=fresh=>async()=>{if(again&&!window.confirm("Il risultato attuale resta nell'archivio e potrai ripristinarlo da questa pagina. Iniziare una nuova prova?"))return;await change(s=>{if(again){s.legacy??={};s.legacy.placement_history??=[];s.legacy.placement_history.push(s.placement);}s.placement=fresh();});await refresh();};
    return [card(h("h2",{},"Pretest adattivo · consigliato"),p("Circa 15 minuti, di solito 25-35 domande. Ogni area parte da poche domande: dove rispondi bene e con sicurezza si passa oltre, dove sbagli o hai un dubbio la stessa struttura viene ricontrollata, così un errore isolato non diventa una priorità. Le risposte confermate non si modificano."),button(again?"Inizia un nuovo pretest adattivo":"Inizia il pretest adattivo",start(()=>newAdaptivePlacement()))),
      card(h("h2",{},"Pretest classico"),p("Le stesse 45 domande per tutti, circa 20-25 minuti. Puoi tornare indietro e cambiare le risposte prima della consegna. Utile per confrontare il risultato con una prova precedente."),button(again?"Inizia un nuovo pretest classico":"Inizia il pretest classico",start(()=>newPlacement()),"secondary")),
      p("In entrambi: segna «Ho un dubbio» quando non sei sicuro; «Non so» lascia la risposta vuota e conta come da ripassare.","small muted")];
  }
  // Interrompere il pretest: salvare per riprendere più tardi, oppure uscire senza salvare.
  // Uscendo senza salvare, la prova in corso viene cancellata e, se c'era, torna il pretest
  // completato messo da parte quando questa prova è stata avviata.
  function pretestExit(test){
    const panel=h("section",{class:"card",id:"pretest-exit",hidden:true},h("h2",{},"Vuoi interrompere il pretest?"),
      p("Hai dato "+test.answers.length+(test.answers.length===1?" risposta.":" risposte.")),
      h("div",{class:"actions"},
        button("Salva e riprendi più tardi",async()=>{await repo.flush();notify("Pretest salvato: lo riprendi da Oggi o da questa pagina quando vuoi.");await goto("");}),
        button("Esci senza salvare e termina",async()=>{
          if(!window.confirm("Le risposte di questa prova verranno cancellate. Uscire senza salvare?"))return;
          await change(s=>{const history=s.legacy?.placement_history||[],i=history.findLastIndex(x=>placementProfile(x));s.placement=i>=0?history.splice(i,1)[0]:null;});
          notify("Pretest terminato senza salvare.");await goto("");
        },"secondary"),
        button("Continua il pretest",async()=>{panel.hidden=true;opener.hidden=false;},"quiet")));
    const opener=h("button",{type:"button",class:"quiet",onclick:()=>{panel.hidden=false;opener.hidden=true;panel.querySelector("button")?.focus();}},"Interrompi il pretest");
    return [opener,panel];
  }
  function finishPlacement(s){s.placement.submitted_at=now();const prof=placementProfile(s.placement);for(const row of prof?.errors||[]){const expression=PHRASAL_TARGETS[row.item.id],term=PHRASALS.find(t=>t.expression===expression);if(term)addTerm(s,term);}}
  function adaptivePlacementPage(test){
    const item=adaptiveNext(test),progress=adaptiveProgress(test);
    const head=title("PRETEST ADATTIVO","Una domanda alla volta.","Le domande successive dipendono dalle tue risposte, quindi una risposta confermata non si modifica. Nessuna chiamata AI.");
    if(!item)return [head,card(h("h2",{},"Pretest completato"),p(progress.answered+" risposte date."),button("Vedi il risultato",async()=>{await change(s=>finishPlacement(s));await refresh();}))];
    const form=h("form",{id:"placement-form"});
    form.append(h("fieldset",{},h("legend",{},"Domanda "+(progress.answered+1)+" · "+AREAS[item.area]),p(item.stem,"stem")));
    const box=form.querySelector("fieldset");
    if(item.options)for(const opt of orderedOptions(item,test.seed))box.append(h("label",{class:"option"},h("input",{type:"radio",name:"placement-answer",value:opt}),h("span",{},opt)));
    else box.append(h("label",{for:"placement-answer",class:"sr-only"},"La tua risposta"),answerHint(item)&&p(answerHint(item),"small muted answer-hint","placement-hint"),h("input",{id:"placement-answer","aria-describedby":answerHint(item)?"placement-hint":null,name:"placement-answer",maxlength:350,value:"",autocomplete:"off",lang:"en",autocapitalize:"off",spellcheck:"false"}));
    const unsure=h("input",{type:"checkbox",id:"unsure"});form.append(h("label",{class:"inline-check"},unsure,"Ho un dubbio"));
    const save=async value=>{await change(s=>{s.placement.answers.push({id:item.id,value,confidence:unsure.checked?"unsure":"sure"});if(!adaptiveNext(s.placement))finishPlacement(s);});await refresh();};
    form.onsubmit=e=>{e.preventDefault();run(async()=>{const v=item.options?form.querySelector('input[name="placement-answer"]:checked')?.value:form.querySelector("#placement-answer").value.trim();if(!v)throw new Error("Inserisci una risposta oppure scegli «Non so».");await save(v);});};
    form.append(h("div",{class:"actions"},h("button",{type:"submit"},"Conferma e continua"),button("Non so",()=>save(""),"secondary")));
    return [restoreCard(),head,h("progress",{max:progress.answered+progress.remaining,value:progress.answered,"aria-label":"Avanzamento del pretest"}),p("Risposte date: "+progress.answered+" · ne restano circa "+progress.remaining+" · aree completate: "+progress.areasDone+" di "+progress.areas,"muted"),form,...pretestExit(test)];
  }
  // Diagnosi del pretest: una parte locale (lezioni con errori, risposte vuote) e, su richiesta,
  // l'analisi del tutor sui tipi di errore. Una richiesta Groq, salvata per questa prova.
  function diagnosisCard(profile){
    const test=state.placement,blank=profile.errors.filter(r=>!r.answer.value).length,lessonTitle=id=>LESSONS.find(l=>l.id===id)?.title||id;
    const byArea=profile.areas.filter(a=>a.total&&a.correct<a.total).map(a=>{const rows=profile.rows.filter(r=>r.item.area===a.id),ids=[...new Set(rows.filter(r=>!r.correct).map(r=>r.item.lessons[0]))];
      return h("li",{},h("strong",{},a.title+": "),ids.map(id=>{const mine=rows.filter(r=>r.item.lessons[0]===id),wrong=mine.filter(r=>!r.correct).length;return lessonTitle(id)+" ("+wrong+" su "+mine.length+")";}).join(", "));});
    const saved=(state.diagnoses||[]).findLast(d=>d.placement_started_at===test.started_at);
    const ask=async()=>{
      const input={areas:profile.areas.filter(a=>a.total).map(a=>({area:a.title,correct:a.correct,total:a.total})),errors:profile.errors.slice(0,25).map(r=>({area:AREAS[r.item.area],lessons:r.item.lessons.slice(0,4),stem:r.item.stem,given:r.answer.value,expected:r.item.answer}))};
      const result=await tutor(state.settings,"/tutor","diagnosis",input);
      await change(s=>{s.diagnoses=[...(s.diagnoses||[]),{id:uid("diagnosis"),placement_started_at:test.started_at,created_at:now(),result}].slice(-10);});await refresh();
    };
    return card(h("h2",{},"Diagnosi"),
      byArea.length?[p("Dove hai sbagliato, struttura per struttura:"),h("ul",{},byArea)]:p("Nessun errore: il percorso parte dagli approfondimenti."),
      blank>0&&p("Hai lasciato vuote "+blank+(blank===1?" risposta":" risposte")+" con «Non so»: sono lacune da colmare, non sviste.","small"),
      profile.adaptive&&p("Le strutture sbagliate sono state ricontrollate con un'altra domanda: un errore seguito da una risposta giusta resta «da confermare», non diventa una priorità.","small muted"),
      saved?[h("h3",{},"L'analisi del tutor"),p(saved.result.summary),saved.result.patterns.map(x=>h("div",{class:"issue"},h("strong",{},x.title),p(x.explanation),p(x.evidence,"formula"),x.lesson_ids.filter(id=>LESSONS.some(l=>l.id===id)).length>0&&h("div",{class:"actions"},x.lesson_ids.filter(id=>LESSONS.some(l=>l.id===id)).map(id=>link(lessonTitle(id),"lesson/"+id,"text-link"))))),
        h("h3",{},"Da dove partire"),h("ol",{},saved.result.advice.map(a=>h("li",{},a))),p("Analisi del "+new Date(saved.created_at).toLocaleDateString("it-IT",{day:"numeric",month:"long"})+". È un parere del tutor: il percorso resta calcolato dalle tue risposte.","small muted")]
        :profile.errors.length>0&&[button("Chiedi la diagnosi al tutor",ask),p("Il tutor raggruppa gli errori per tipo (per esempio l'ausiliare nelle negative) e ti dice da dove partire. Una richiesta Groq.","small muted")]);
  }
  // Pretest completati e messi da parte con «Ripetere il pretest»: si possono ripristinare.
  function savedPretests(){return (state.legacy?.placement_history||[]).map((p,i)=>({p,i,profile:placementProfile(p)})).filter(x=>x.profile);}
  function restoreCard(){
    if(placementProfile(state.placement))return null;
    const last=savedPretests().at(-1);if(!last)return null;
    const when=new Date(last.p.submitted_at).toLocaleDateString("it-IT",{day:"numeric",month:"long"});
    return card(h("h2",{},"Hai già un pretest completato"),p("Prova del "+when+": "+last.profile.correct+" risposte corrette su "+last.profile.total+". È rimasta nell'archivio quando è stata avviata una nuova prova."+(state.placement?.answers?.length?" La prova in corso ("+state.placement.answers.length+" risposte) resterà a sua volta nell'archivio.":"")),
      button("Ripristina il pretest del "+when,async()=>{await change(s=>{const history=s.legacy.placement_history,restored=history.splice(last.i,1)[0];if(s.placement?.answers?.length)history.push(s.placement);s.placement=restored;});await refresh();}));
  }
  function placement() {
    const test=state.placement,profile=placementProfile(test);
    if(!test)return [restoreCard(),title("PRETEST","Dove conviene iniziare?","Due versioni, senza aiuti. Non è una certificazione di livello."),...pretestChoice()];
    if(profile)return [title("PRETEST","Il tuo punto di partenza",profile.correct+" risposte corrette su "+profile.total+" · "+profile.uncertain.length+" giuste ma date con dubbio"),
      learning.pathCard("Il tuo percorso consigliato"),
      diagnosisCard(profile),
      card(h("h2",{},"Risultato per area"),h("table",{},h("thead",{},h("tr",{},["Area","Corrette","Proposta"].map(v=>h("th",{},v)))),h("tbody",{},profile.areas.map(a=>h("tr",{},h("td",{},a.title),h("td",{},a.correct+"/"+a.total),h("td",{},statusLabels[a.status]))))),p("Priorità: meno del 70% di risposte corrette. Da confermare: almeno il 70%. Basi già controllate: almeno l'85% corrette e date con sicurezza. Con tre domande un solo errore porta sotto il 70%.","small muted")),
      card(h("h2",{},"Rivedi errori e dubbi"),profile.rows.filter(r=>!r.secure).map(r=>h("details",{},h("summary",{},r.item.stem),p("La tua risposta: "+(r.answer.value||"Non so")),p("Risposta di riferimento: "+r.item.answer,"formula"),p(r.item.why),p(r.item.ref,"muted")))),
      h("details",{},h("summary",{},"Ripetere il pretest"),p("Il risultato precedente sarà conservato nell'archivio; il percorso userà la nuova prova."),...pretestChoice(true))];
    if(test.version===2)return adaptivePlacementPage(test);
    const questions=orderedQuestions(test.seed),item=questions[test.position],answer=test.answers.find(a=>a.id===item.id),form=h("form",{id:"placement-form"});
    form.append(h("fieldset",{},h("legend",{},"Domanda "+(test.position+1)+" di 45 · "+AREAS[item.area]),p(item.stem,"stem")));
    const box=form.querySelector("fieldset");
    if(item.options)for(const [i,opt] of orderedOptions(item,test.seed).entries())box.append(h("label",{class:"option"},h("input",{type:"radio",name:"placement-answer",value:opt,checked:answer?.value===opt}),h("span",{},opt)));
    else box.append(h("label",{for:"placement-answer",class:"sr-only"},"La tua risposta"),answerHint(item)&&p(answerHint(item),"small muted answer-hint","placement-hint"),h("input",{id:"placement-answer","aria-describedby":answerHint(item)?"placement-hint":null,name:"placement-answer",maxlength:350,value:answer?.value||"",autocomplete:"off"}));
    const unsure=h("input",{type:"checkbox",id:"unsure",checked:answer?.confidence==="unsure"});form.append(h("label",{class:"inline-check"},unsure,"Ho un dubbio"));
    async function saveAnswer(value,advance=true) {
      await change(s=>{const a={id:item.id,value,confidence:unsure.checked?"unsure":"sure"},p=s.placement;p.answers=p.answers.filter(x=>x.id!==item.id);p.answers.push(a);if(advance)p.position=Math.min(44,p.position+1);});await refresh();
    }
    form.onsubmit=e=>{e.preventDefault();run(async()=>{const v=item.options?form.querySelector('input[name="placement-answer"]:checked')?.value:form.querySelector("#placement-answer").value.trim();if(!v)throw new Error("Inserisci una risposta oppure scegli «Non so».");await saveAnswer(v);});};
    form.append(h("div",{class:"actions"},h("button",{type:"submit"},test.position===44?"Salva la risposta":"Salva e continua"),button("Non so",()=>saveAnswer(""),"secondary"),test.position>0&&button("Indietro",async()=>{await change(s=>s.placement.position--);await refresh();},"quiet")));
    return [restoreCard(),title("PRETEST","Una prova, un percorso.","Nessuna chiamata AI. Il risultato compare dopo tutte le 45 domande."),h("progress",{max:45,value:test.answers.length,"aria-label":"Domande salvate"}),p(test.answers.length+"/45 risposte salvate","muted"),form,
      test.answers.length===45&&card(h("h2",{},"Pronto per la consegna"),p("Puoi tornare alle domande per modificarle; dopo la consegna vedrai le soluzioni."),button("Consegna il pretest",async()=>{await change(s=>{s.placement.submitted_at=now();const prof=placementProfile(s.placement);for(const row of prof.errors){const expression=PHRASAL_TARGETS[row.item.id],term=PHRASALS.find(t=>t.expression===expression);if(term)addTerm(s,term);}});await refresh();})),...pretestExit(test)];
  }
  function phrasals() {
    const search=h("input",{type:"search",id:"phrasal-search",placeholder:"Cerca espressione, significato o contesto…","aria-label":"Cerca nei phrasal verbs"}),rows=h("div",{class:"lesson-grid"});
    const core=["carry out","look into","call off","rule out","hand over","fill in","run out of","put up with","find out","point out","set up","bring up","turn down","follow up"];
    function fill(v=""){const terms=PHRASALS.filter(t=>normal(t.expression+" "+t.meaning_it+" "+t.topic).includes(normal(v))).sort((a,b)=>(core.includes(a.expression)?0:1)-(core.includes(b.expression)?0:1));rows.replaceChildren(...terms.map(t=>h("a",{href:"#/word/"+t.id,class:"lesson-card"},p(t.topic,"eyebrow"),h("h2",{lang:"en"},t.expression),p(t.meaning_it),p(PATTERNS[t.pattern],"small muted"))));}
    search.oninput=()=>fill(search.value);fill();
    const scenarios=PHRASAL_SCENARIOS.map(s=>{
      const links=PHRASALS.filter(t=>s.expressions.includes(t.expression)).map(t=>link(t.expression+" · "+t.meaning_it,"word/"+t.id,"text-link"));
      return h("details",{},h("summary",{},s.title),h("blockquote",{lang:"en"},s.text),p("Leggi, chiudi il modello e ricostruisci lo scenario con parole tue. Poi controlla i significati nelle schede.","small muted"),h("div",{class:"actions"},links));
    });
    return [title("LESSICO","Phrasal verbs da usare.",PHRASALS.length+" schede di verbi multiword e significati: non sono "+PHRASALS.length+" lemmi distinti."),card(h("h2",{},"Non basta riconoscere la traduzione"),p("Prima il contesto, poi le particelle e la posizione dell'oggetto. Una scheda verificata non conferma gli altri sensi dello stesso verbo.")),card(h("h2",{},"Mini-scenari da ricostruire"),scenarios),search,rows];
  }
  function word(id) {
    const t=VOCABULARY.find(v=>v.id===id)||state.vocabulary.find(v=>v.id===id);
    if(!t)return [title("LESSICO","Termine non trovato."),link("Apri Ripasso","review")];
    const learned=state.vocabulary.find(v=>v.id===t.id);
    return [link("← Lessico","phrasals","back"),title(t.topic||"LESSICO",t.expression,t.meaning_it),card(p(t.example,"stem"),t.pattern&&p(PATTERNS[t.pattern],"formula"),p("Registro: "+(t.register||"dipende dal contesto")),t.alternative&&p("Alternativa possibile: "+t.alternative+". Controlla che mantenga lo stesso significato nel tuo testo."),button(learned?"Già nel tuo ripasso":"Aggiungi al ripasso",async()=>{await change(s=>addTerm(s,t));await refresh();},"secondary")),
      card(h("h2",{},"Significato → costruzione → uso"),button("Esercita questo termine",async()=>{await change(s=>addTerm(s,t));await makeSession("phrasal-basics",t.pattern?phrasalItems(t,state.sessions.length):recoveryItems([t]));}),p("Dopo gli esercizi, scrivi una frase originale usando lo stesso significato.","muted"),field("La tua frase","word-context",learned?.context||"",value=>autosave(s=>{addTerm(s,t).context=value;}),{area:true,max:1200}),button("Spiega l'uso nel mio contesto",async()=>{const context=repo.get().vocabulary.find(v=>v.id===t.id)?.context;if(!context?.trim())throw new Error("Scrivi prima una frase.");const result=await tutor(state.settings,"/tutor","clarify",{term:t.expression,context});notify(result.explanation+" Esempio: "+result.example);},"secondary")),
      t.source_text&&card(h("h2",{},"Dal testo originale"),h("blockquote",{lang:"en"},t.source_text),t.source_url&&p("Fonte: "+t.source_url),t.explanation&&p(t.explanation),t.ai_generated&&p("Significato proposto dall'AI nel contesto: puoi rivederlo.","muted"),field("Significato personale","word-meaning",t.meaning_it,value=>autosave(s=>{const x=s.vocabulary.find(v=>v.id===id);if(x&&value.trim())x.meaning_it=value;}),{area:true,max:300})),
      t.dictionary_url&&h("a",{href:t.dictionary_url,target:"_blank",rel:"noopener noreferrer",class:"text-link"},"Consulta il dizionario"),sourceNotes("phrasal-basics")];
  }
  function review() {
    const due=dueTerms(),search=h("input",{type:"search",placeholder:"Cerca nel tuo lessico…","aria-label":"Cerca nel tuo lessico"}),rows=h("div",{class:"word-list"});
    function fill(v=""){rows.replaceChildren(...state.vocabulary.filter(t=>normal(t.expression+" "+t.meaning_it).includes(normal(v))).map(t=>h("a",{class:"word-row",href:"#/word/"+t.id},h("strong",{},t.expression),h("span",{},t.meaning_it),h("small",{},t.streak?("Prossimo: "+date(t.due)):t.legacy_known?"Conosciuto in precedenza · da verificare":"Da recuperare"))));}search.oninput=()=>fill(search.value);fill();
    return [title("RIPASSO","Dizionario personale e ripasso.",due.length+" termini in scadenza. Una risposta sbagliata torna presto; una corretta senza aiuti si distanzia."),card(h("h2",{},"Recupero attivo"),due.length?button("Ripassa "+Math.min(due.length,6)+" termini",()=>makeSession("vocabulary",recoveryItems(due.slice(0,6)))):p("Nessun termine in scadenza. Aggiungi parole dal laboratorio o dalla lettura."),link("Scopri i phrasal verbs","phrasals","text-link")),search,rows];
  }
  function feedbackPanel(w) {
    if(!w.feedback)return w.legacy_feedback?card(h("h2",{},"Feedback precedente"),p("Conservato nel backup originale. Puoi richiedere una nuova revisione della bozza.")):null;
    const f=w.feedback;
    return card(h("h2",{},"Le priorità della revisione"),w.feedback_source!==w.draft&&p("La bozza è cambiata: questa revisione si riferisce alla versione precedente.","warning"),p(f.summary),list(f.priorities),h("div",{class:"rubric"},Object.entries(f.rubric).map(([k,v])=>h("div",{},h("strong",{},({grammar:"Grammatica",content:"Consegna",cohesion:"Coesione",register:"Registro"})[k]),p(v)))),f.issues.map(i=>h("div",{class:"issue"},p(i.kind==="style"?"Suggerimento di stile":"Errore · "+i.category,"eyebrow"),h("blockquote",{},i.quote),p(i.correction,"formula"),p(i.explanation))),f.omitted>0&&p("Sono state omesse "+f.omitted+" osservazioni senza una citazione verificabile nella bozza.","muted"));
  }
  function writing(id) {
    if(!id) {
      const genre=h("select",{id:"genre"},Object.entries(GENRES).map(([k,g])=>h("option",{value:k},g.label))),topic=h("textarea",{id:"new-topic",value:GENRES.report.topic,maxlength:2000});
      genre.onchange=()=>{topic.value=GENRES[genre.value].topic;};
      const exam=h("input",{type:"checkbox",id:"exam"});
      return [title("SCRITTURA","Dalla prima frase al testo autonomo.","Studia un modello, prova un passo alla volta, poi scrivi su nuovi fatti senza aiuti."),...courses.overview(),
        card(h("h2",{},"Prepara un testo"),h("label",{for:"genre"},"Tipo di testo"),genre,h("label",{for:"new-topic"},"Consegna"),topic,h("label",{class:"inline-check"},exam,"Simulazione senza suggerimenti durante la stesura"),button("Apri l'editor",async()=>{if(topic.value.trim().length<15)throw new Error("Scrivi una consegna più precisa.");const w={id:uid("writing"),type:genre.value,topic:topic.value.trim(),mode:exam.checked?"exam":"guided",ideas:"",outline:"",draft:"",rewrite:"",feedback:null,comparison:null,transfer:[],created_at:now()};await change(s=>s.writings.push(w));await goto("writing/"+w.id);})),
        state.writings.length>0&&card(h("h2",{},"I tuoi testi"),h("div",{class:"word-list"},state.writings.slice().reverse().map(w=>h("a",{class:"word-row",href:"#/writing/"+w.id},h("strong",{},w.topic.slice(0,90)+(w.topic.length>90?"…":"")),h("span",{},GENRES[w.type]?.label||"Testo"),h("small",{},date(w.created_at)+" · "+(w.comparison?"Confrontato":w.feedback?"Da riscrivere":"Bozza"))))))];
    }
    const w=state.writings.find(x=>x.id===id);if(!w)return [title("SCRITTURA","Testo non trovato."),link("Apri i tuoi testi","writing")];
    const bind=(key,value)=>autosave(s=>{s.writings.find(x=>x.id===id)[key]=value;});
    const savedPlan=state.daily_plans?.find(x=>x.writing_id===w.id),daily=savedPlan?dailyPlan(state,new Date(savedPlan.day+"T12:00:00").getTime()):null;
    const target=daily?daily.minimum_words+" parole per l'allenamento breve":GENRES[w.type].range;
    const draftCount=p(countWords(w.draft)+" parole · obiettivo indicativo "+target,"muted");
    const draft=field("La tua bozza","draft",w.draft,value=>{draftCount.textContent=countWords(value)+" parole · obiettivo indicativo "+target;bind("draft",value);},{area:true,placeholder:"Scrivi qui il testo in inglese…"});
    draft.querySelector("textarea").setAttribute("lang","en");
    const rewriteCount=p(countWords(w.rewrite)+" parole","muted"),rewrite=field("La tua riscrittura","rewrite",w.rewrite,value=>{rewriteCount.textContent=countWords(value)+" parole";bind("rewrite",value);},{area:true,placeholder:"Riscrivi tenendo conto delle priorità…"});
    rewrite.querySelector("textarea").setAttribute("lang","en");
    const comparison=w.comparison;
    return [link("← I tuoi testi","writing","back"),title(w.mode==="exam"?"SCRITTURA · SIMULAZIONE":"SCRITTURA · ALLENAMENTO",GENRES[w.type].label),card(p(w.topic)),daily&&link("← Piano di oggi","home","text-link"),daily&&card(h("h2",{},"Dai fatti al paragrafo"),p("1. Prima di consultare la lezione, prova a ricordare quale rapporto temporale o logico vuoi esprimere."),p("2. Negli appunti separa fatti, dichiarazioni e azioni previste. Nella scaletta mettili in ordine; poi scrivi frasi tue e collegale."),p("3. Rileggi: il lettore capisce chi fa cosa e quando? Controlla ausiliari, negazioni e collegamenti. Solo dopo chiedi la revisione e riscrivi tu."),p("Il conteggio delle parole indica attività svolta, non padronanza. La revisione AI può sbagliare; una nuova prova a distanza è più informativa della copia della correzione.","small muted")),
      w.mode!=="exam"&&h("details",{class:"card"},h("summary",{},"Prima di scrivere: idee e scaletta"),p(w.type==="report"?"Ordina i fatti nel tempo e attribuisci le dichiarazioni.":"Definisci destinatario, scopo e un punto per paragrafo."),field("Appunti","ideas",w.ideas,value=>bind("ideas",value),{area:true,max:2000}),field("Scaletta","outline",w.outline,value=>bind("outline",value),{area:true,max:2000})),
      card(h("h2",{},"1. Stesura"),draft,draftCount,button(w.feedback?"Revisiona la bozza attuale":"Chiedi la revisione",async()=>{const current=repo.get().writings.find(x=>x.id===id);writingReady(current,"review");const result=await tutor(state.settings,"/tutor","writing_review",{type:current.type,topic:current.topic,text:current.draft,mode:current.mode,...(current.grammar_lesson_id?{lesson_id:current.grammar_lesson_id}:{})});await change(s=>{const x=s.writings.find(x=>x.id===id);x.feedback=sanitizeFeedback(result,current.draft);x.feedback_source=current.draft;x.comparison=null;});await refresh();},"secondary"),p("La revisione invia consegna e bozza a Groq. Usa dati fittizi nei tuoi esercizi.","small muted")),
      feedbackPanel(w),
      w.feedback&&card(h("h2",{},"2. Riscrittura"),p("Riscrivi tu il testo. Cerca di risolvere gli errori mantenendo fatti, significato e voce."),rewrite,rewriteCount,button("Confronta bozza e riscrittura",async()=>{const current=repo.get().writings.find(x=>x.id===id);writingReady(current,"compare");const result=await tutor(state.settings,"/tutor","writing_compare",{type:current.type,topic:current.topic,text:current.draft,rewrite:current.rewrite,issues:current.feedback.issues});await change(s=>{const x=s.writings.find(x=>x.id===id);x.comparison=result;x.compare_source={draft:current.draft,rewrite:current.rewrite};x.transfer=[];});await refresh();})),
      comparison&&card(h("h2",{},"3. Confronto e trasferimento"),p(comparison.summary),w.compare_source?.rewrite!==w.rewrite&&p("La riscrittura è cambiata: rifai il confronto prima della verifica.","warning"),h("h3",{},"Risolto secondo il tutor"),list(comparison.resolved),h("h3",{},"Da controllare ancora"),comparison.remaining.length?list(comparison.remaining):p("Il tutor non segnala errori residui; la verifica successiva resta utile."),button("Verifica in un nuovo contesto",async()=>{const current=repo.get().writings.find(x=>x.id===id);if(current.compare_source?.rewrite!==current.rewrite||current.compare_source?.draft!==current.draft)throw new Error("Il testo è cambiato: rifai il confronto.");const session=await makeSession("mixed",current.comparison.transfer.map(i=>({...i,id:uid("transfer"),kind:"completion",skill:"form",options:[]})),"groq",{writing_id:id});await change(s=>{s.writings.find(x=>x.id===id).transfer.push(session);});},"secondary"),w.transfer?.map(sid=>{const results=state.attempts.filter(a=>a.session_id===sid);return results.length?p("Nuovo contesto: "+results.filter(a=>a.correct&&!a.assisted&&!a.disputed).length+"/"+results.filter(a=>!a.disputed).length+" corrette senza aiuti."):link("Riprendi la verifica","practice/"+sid,"text-link");})),
      sourceNotes("","WRITING_REVIEW",w.type),
      h("div",{class:"danger-zone"},button("Elimina questo testo",async()=>{if(!window.confirm("Eliminare il testo «"+w.topic.slice(0,60)+"»? Bozza, riscrittura e revisioni verranno cancellate da questo dispositivo. I risultati degli esercizi restano."))return;await change(s=>{s.writings=s.writings.filter(x=>x.id!==id);for(const plan of s.daily_plans||[])if(plan.writing_id===id)plan.writing_id=null;for(const set of s.sessions)if(set.writing_id===id)delete set.writing_id;});notify("Testo eliminato.");await goto("writing");},"quiet danger"))];
  }
  function comprehension(r) {
    const selection=h("input",{id:"understand-selection",maxlength:120,placeholder:"Facoltativo: parola o espressione esatta del testo",lang:"en",autocorrect:"off"});
    const explain=async()=>{
      const current=repo.get().readings.find(x=>x.id===r.id),text=current.text,source=current.source,chosen=selection.value.trim();
      if(!text.trim())throw new Error("Incolla prima il passaggio inglese.");
      if(chosen&&!text.includes(chosen))throw new Error("L'espressione deve comparire esattamente nel testo.");
      const result=anchorReading(await tutor(state.settings,"/tutor","reading_understand",{text,selection:chosen}),text);
      await change(s=>{const x=s.readings.find(x=>x.id===r.id);x.understanding=result;x.understanding_answers={};x.understanding_source={text,source,selection:chosen};});await refresh();
    };
    const u=r.understanding,snapshot=r.understanding_source;
    return card(h("h2",{},"Impara a comprendere"),p("Non serve tradurre prima. Il tutor spiega il senso e le scelte linguistiche; non verifica la veridicità dell'articolo."),h("label",{for:"understand-selection"},"Parola o espressione da approfondire"),selection,
      button("Usa il testo selezionato",()=>{const area=document.getElementById("reading-text");const chosen=area.value.slice(area.selectionStart,area.selectionEnd);if(!chosen||chosen.length>120)throw new Error("Seleziona da 1 a 120 caratteri nel passaggio, oppure incollali nel campo.");selection.value=chosen;},"quiet"),
      button("Spiega il testo con Groq",explain),
      u&&h("div",{},snapshot.text!==r.text&&p("Il testo è cambiato. Questa analisi si riferisce al passaggio precedente.","warning"),p(u.summary),u.omitted>0&&p(u.omitted+" elementi senza riscontro letterale sono stati esclusi. Puoi riprovare.","warning"),
      u.segments.map(x=>h("section",{class:"issue"},h("blockquote",{lang:"en"},x.quote),p(x.meaning_it),p(x.why))),
      h("h3",{},"Le parole nel loro contesto"),u.terms.map(t=>h("section",{class:"issue"},h("h4",{},t.expression),p(t.meaning_it),h("blockquote",{lang:"en"},t.quote),p(t.why),p("Registro: "+t.register),p("Confronto: "+t.alternative),p("Esempio originale: "+t.example),button("Salva nel dizionario personale",async()=>{await change(s=>addTerm(s,{...t,topic:"lettura",source_text:t.quote,source_url:snapshot.source,explanation:t.why,ai_generated:true}));notify("Parola salvata nel dizionario personale e nel ripasso.");},"secondary"))),
      h("h3",{},"Ora ricostruisci il senso"),p("Scrivi una risposta, poi confrontala con la spiegazione. Questa attività non certifica un livello."),u.questions.map((q,i)=>h("section",{class:"issue"},p(q.question),field("La tua risposta "+(i+1),"reading-answer-"+i,r.understanding_answers?.[i]||"",value=>autosave(s=>{const x=s.readings.find(x=>x.id===r.id);(x.understanding_answers??={})[i]=value;}),{area:true,max:1200}),h("details",{},h("summary",{},"Mostra la risposta ragionata"),p(q.answer),h("blockquote",{lang:"en"},q.quote)))),link("Apri il dizionario personale","review","text-link")));
  }
  function translationChunks(paragraphs) {
    const chunks=[];let current=[],size=0;
    for(const para of paragraphs){if(current.length&&(size+para.length>3000||current.length>=40)){chunks.push(current);current=[];size=0;}current.push(para);size+=para.length;}
    if(current.length)chunks.push(current);
    return chunks;
  }
  function translatePanes(r) {
    const auto=r.auto_translation,stale=auto&&auto.source_text!==r.text;
    const source=h("textarea",{id:"reading-text",lang:"en",maxlength:8000,spellcheck:"false",value:r.text,placeholder:"Incolla qui il testo inglese",oninput:e=>autosave(s=>{s.readings.find(x=>x.id===r.id).text=e.target.value;})});
    const output=h("div",{class:"pane-output",id:"auto-translation",lang:"it",tabindex:"0","aria-labelledby":"auto-translation-label"},auto?auto.translations.map(t=>h("p",{},t)):p("La traduzione comparirà qui, paragrafo per paragrafo.","muted"));
    let syncing=false;const sync=(from,to)=>()=>{if(syncing)return;syncing=true;const max=from.scrollHeight-from.clientHeight;to.scrollTop=max>0?from.scrollTop/max*(to.scrollHeight-to.clientHeight):0;requestAnimationFrame(()=>{syncing=false;});};
    source.addEventListener("scroll",sync(source,output));output.addEventListener("scroll",sync(output,source));
    const translate=async()=>{
      const current=repo.get().readings.find(x=>x.id===r.id),paragraphs=splitParagraphs(current.text);
      if(!paragraphs.length)throw new Error("Incolla prima il testo inglese nel riquadro a sinistra.");
      const chunks=translationChunks(paragraphs),translations=[];
      for(const [k,chunk] of chunks.entries()){if(chunks.length>1)notify("Traduzione in corso: parte "+(k+1)+" di "+chunks.length+".");const result=await tutor(state.settings,"/tutor","translate",{paragraphs:chunk});translations.push(...result.translations);}
      await change(s=>{const x=s.readings.find(x=>x.id===r.id);x.auto_translation={paragraphs,translations,source_text:current.text,created_at:now()};});
      await refresh();
    };
    return h("section",{class:"translate"},
      h("div",{class:"translate-panes"},
        h("div",{class:"pane"},h("label",{for:"reading-text"},"Testo inglese"),source),
        h("div",{class:"pane"},h("span",{class:"pane-label",id:"auto-translation-label"},"Traduzione italiana"),output)),
      stale&&p("Hai modificato il testo: la traduzione si riferisce alla versione precedente. Traduci di nuovo per aggiornarla.","warning"),
      h("div",{class:"actions"},button(auto?"Traduci di nuovo con Groq":"Traduci con Groq",translate),p("Traduzione automatica: utile per capire, non sostituisce lo studio del testo. Non incollare dati riservati.","small muted")));
  }
  const TEST_TYPES={main_idea:"Idea principale",detail:"Dettaglio",inference:"Inferenza",purpose:"Scopo e tono",vocabulary:"Lessico nel contesto"};
  function jfltTest(r) {
    const t=r.test;
    const create=async()=>{
      const current=repo.get().readings.find(x=>x.id===r.id),text=current.text;
      const result=await tutor(state.settings,"/tutor","reading_test",{text});
      const anchored=anchorTest(result,text);
      if(anchored.questions.length<4)throw new Error("Troppe domande senza riscontro letterale nel testo. Riprova.");
      await change(s=>{const x=s.readings.find(x=>x.id===r.id);
        if(x.test?.completed_at){x.test_history=[...(x.test_history||[]),{score:x.test.score,total:x.test.total,completed_at:x.test.completed_at}].slice(-20);}
        x.test={id:uid("rtest"),questions:anchored.questions.map(q=>({...q,...(!reliableItem(q,"groq")?{doubt:true,check_note:q.check_note||"Domanda non verificata: esclusa dal punteggio."}:{})})),omitted:anchored.omitted,verification:result.verification||null,source_text:text,answers:{},started_at:now(),completed_at:null,score:null,total:null};});
      await refresh();
    };
    const intro=[h("h2",{},"Prova di comprensione · stile JFLT"),p("Sei domande a scelta multipla in inglese: idea principale, dettagli, inferenze, scopo dell'autore e lessico nel contesto. Ogni risposta è collegata a una frase del testo. Tempo indicativo: 9 minuti."),p("Serve un testo inglese autentico di almeno 120 parole. La prova allena il formato; non stima il livello STANAG.","small muted")];
    if(!t)return card(...intro,button("Crea la prova con Groq",create));
    const stale=t.source_text!==r.text&&p("Il testo è cambiato: questa prova si riferisce al passaggio precedente.","warning");
    const scored=t.questions.filter(q=>!q.doubt);
    if(t.completed_at){
      const minutes=Math.max(1,Math.round((Date.parse(t.completed_at)-Date.parse(t.started_at))/60000));
      return card(...intro.slice(0,1),stale,h("p",{class:"test-score"},h("strong",{},t.score+"/"+t.total)," corrette · "+minutes+" min"+(t.questions.length>scored.length?" · "+(t.questions.length-scored.length===1?"1 domanda esclusa":(t.questions.length-scored.length)+" domande escluse")+" dal punteggio":"")),
        t.questions.map((q,i)=>{const chosen=t.answers[i],ok=chosen===q.answer;return h("section",{class:"issue test-review"},p((i+1)+". "+TEST_TYPES[q.type],"eyebrow"),h("p",{lang:"en",class:"stem"},q.question),q.doubt?p(q.check_note||"Domanda non confermata dal controllo automatico: esclusa dal punteggio.","small warning"):p(ok?"Risposta corretta":"Da rivedere",ok?"good":"warning"),!ok&&p("Hai scelto: "+(chosen||"—"),"small muted"),p("Risposta: "+q.answer,"formula"),h("blockquote",{lang:"en"},q.quote),p(q.why));}),
        (r.test_history||[]).length>0&&p("Prove precedenti su questo testo: "+r.test_history.map(x=>x.score+"/"+x.total).join(" · "),"small muted"),
        button("Nuova prova sullo stesso testo",create,"secondary"));
    }
    const form=h("form",{class:"reading-test"},t.questions.map((q,i)=>h("fieldset",{class:"exercise"},h("legend",{},(i+1)+". "+TEST_TYPES[q.type]),h("p",{lang:"en",class:"stem"},q.question),q.doubt&&p(q.check_note||"Domanda non confermata dal controllo automatico: non conta nel punteggio.","small warning check-note"),
      q.options.map((opt,j)=>h("label",{class:"option",for:t.id+"-"+i+"-"+j},h("input",{id:t.id+"-"+i+"-"+j,type:"radio",name:t.id+"-"+i,value:opt,checked:t.answers[i]===opt,onchange:e=>autosave(s=>{s.readings.find(x=>x.id===r.id).test.answers[i]=e.target.value;})}),h("span",{lang:"en"},opt))))),
      h("button",{type:"submit"},"Verifica le risposte"));
    form.addEventListener("submit",e=>{e.preventDefault();run(async()=>{
      const latest=repo.get().readings.find(x=>x.id===r.id).test;
      if(latest.questions.some((q,i)=>!latest.answers[i]))throw new Error("Rispondi a tutte le domande prima di verificare.");
      await change(s=>{const x=s.readings.find(x=>x.id===r.id).test,valid=x.questions.map((q,i)=>[q,i]).filter(([q])=>!q.doubt);x.total=valid.length;x.score=valid.filter(([q,i])=>x.answers[i]===q.answer).length;x.completed_at=now();});
      await refresh();
    });});
    return card(...intro.slice(0,1),stale,p("Iniziata alle "+new Date(t.started_at).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"})+" · tempo indicativo 9 minuti. Rileggi il testo quando vuoi: anche nel test puoi tornare al passaggio.","small muted"),t.omitted>0&&p((t.omitted===1?"1 domanda senza riscontro nel testo è stata esclusa.":t.omitted+" domande senza riscontro nel testo sono state escluse."),"small warning"),form);
  }
  function reading(id) {
    if(!id)return [title("COMPRENDI","Impara a comprendere.","Incolla un passaggio inglese da studiare. Aggiungi l'indirizzo della fonte se è un articolo."),
      card(button("Nuova lettura",async()=>{const r={id:uid("reading"),title:"Nuova lettura",source:"",text:"",translation:"",feedback:null,created_at:now()};await change(s=>s.readings.push(r));await goto("reading/"+r.id);})),
      state.readings.length>0&&card(h("h2",{},"Letture salvate"),state.readings.slice().reverse().map(r=>link(r.title+" · "+date(r.created_at),"reading/"+r.id,"word-row")))];
    const r=state.readings.find(x=>x.id===id);if(!r)return [title("COMPRENDI","Lettura non trovata."),link("Tutte le letture","reading")];
    const bind=(key,value)=>autosave(s=>{s.readings.find(x=>x.id===id)[key]=value;});
    const term=h("input",{id:"reading-term",maxlength:120,placeholder:"Es. account for"});
    const meaning=h("input",{id:"reading-meaning",maxlength:300,placeholder:"Significato nel passaggio"});
    return [link("← Letture salvate","reading","back"),title("COMPRENDI",r.title),
      card(field("Titolo","reading-title",r.title,v=>bind("title",v),{max:200}),field("Fonte (facoltativa)","reading-source",r.source,v=>bind("source",v),{max:1000}),
        translatePanes(r),
        h("details",{class:"own-translation"},h("summary",{},"Prova a tradurre tu e confronta"),field("La tua traduzione italiana (facoltativa)","translation",r.translation,v=>bind("translation",v),{area:true,max:12000}),button("Confronta la traduzione con Groq",async()=>{const current=repo.get().readings.find(x=>x.id===id);if(countWords(current.text)<10||countWords(current.translation)<5)throw new Error("Inserisci un passaggio e una tua traduzione.");const result=await tutor(state.settings,"/tutor","reading_review",{text:current.text,translation:current.translation});await change(s=>{const x=s.readings.find(x=>x.id===id);x.feedback={...result,segments:result.segments.filter(v=>current.text.includes(v.quote)),terms:result.terms.filter(v=>normal(current.text).includes(normal(v.expression)))};x.feedback_source={text:current.text,translation:current.translation};});await refresh();}))),
      comprehension(r),
      jfltTest(r),
      r.feedback&&card(h("h2",{},"Confronto ragionato"),(r.feedback_source.text!==r.text||r.feedback_source.translation!==r.translation)&&p("Hai modificato il testo: questo confronto si riferisce alla versione precedente.","warning"),p(r.feedback.summary),r.feedback.segments.map(v=>h("div",{class:"issue"},h("blockquote",{lang:"en"},v.quote),p(v.translation),p(v.explanation,"muted"))),r.feedback.terms.map(v=>h("div",{class:"word-row"},h("strong",{},v.expression),p(v.meaning_it),button("Aggiungi al ripasso",async()=>{await change(s=>addTerm(s,v,r.text.slice(0,1200)));notify("Termine aggiunto al recupero attivo.");},"quiet")))),
      card(h("h2",{},"Conserva una parola utile"),h("label",{for:"reading-term"},"Espressione"),term,h("label",{for:"reading-meaning"},"Significato"),meaning,h("div",{class:"actions"},button("Salva nel lessico",async()=>{if(!term.value.trim()||!meaning.value.trim())throw new Error("Inserisci espressione e significato.");await change(s=>addTerm(s,{expression:term.value.trim(),meaning_it:meaning.value.trim(),example:"",topic:"lettura"},r.text.slice(0,1200)));notify("Parola salvata nel ripasso.");},"secondary"),button("Spiega nel contesto",async()=>{if(!term.value.trim())throw new Error("Inserisci il termine da spiegare.");const result=await tutor(state.settings,"/tutor","clarify",{term:term.value.trim(),context:termContext(repo.get().readings.find(x=>x.id===id).text,term.value.trim())});meaning.value=result.meaning_it;notify(result.explanation+" Esempio: "+result.example);},"quiet"))),
      sourceNotes("","ARTICLE_FEEDBACK"),
      h("div",{class:"danger-zone"},button("Elimina questa lettura",async()=>{if(!window.confirm("Eliminare la lettura «"+r.title+"»? Testo, traduzioni e prove di comprensione verranno cancellati da questo dispositivo."))return;await change(s=>{s.readings=s.readings.filter(x=>x.id!==id);});notify("Lettura eliminata.");await goto("reading");},"quiet danger"))];
  }
  function progress() {
    const recent=state.attempts.filter(a=>a.source!=="legacy"&&!a.disputed&&reliableItem(state.sessions.find(s=>s.id===a.session_id)?.items.find(i=>i.id===a.item_id),a.source)),rows=recommendation(state).filter(l=>l.attempts>0),guided=state.writings.filter(w=>w.mode!=="exam"),independent=state.writings.filter(w=>w.mode==="exam");
    return [title("PROGRESSI","Conta ciò che riesci a fare.","Il pretest orienta; le risposte senza suggerimenti confermano. La scrittura richiede anche un nuovo contesto."),
      h("div",{class:"stats"},card(h("strong",{class:"big"},recent.filter(a=>!a.assisted).length),p("Risposte senza aiuti")),card(h("strong",{class:"big"},guided.length),p("Scritti guidati")),card(h("strong",{class:"big"},independent.length),p("Scritti in simulazione"))),
      card(h("h2",{},"Le strutture esercitate"),rows.length?h("table",{},h("thead",{},h("tr",{},["Struttura","Senza aiuti","Proposta"].map(v=>h("th",{},v)))),h("tbody",{},rows.map(l=>h("tr",{},h("td",{},link(l.title,"lesson/"+l.id,"text-link")),h("td",{},Math.round(l.accuracy*100)+"% su "+l.window+" risposte recenti · "+l.attempts+" in totale"),h("td",{},statusLabels[l.status]))))):p("I risultati appariranno dopo i primi esercizi.")),
      state.writing_courses?.length>0&&card(h("h2",{},"La scrittura passo passo"),state.writing_courses.map(c=>h("div",{},link((c.completed_at?"Percorso svolto":"Passo "+(c.stage+1)+" di 6")+" · "+c.checks.length+" tappe completate","course/"+c.id,"text-link"),p(c.completed_at?"Nuovi fatti affrontati senza aiuti anche in un'altra giornata.":c.stage===5?"Prima prova autonoma svolta; conferma in un altro giorno.":"Aiuti e tentativi sono salvati separatamente dalle prove autonome.","small muted")))),
      card(h("h2",{},"Gli errori da riprendere"),list(recent.filter(a=>!a.correct).slice(-8).reverse().map(a=>h("span",{},a.stem," → ",a.answer))),state.legacy&&p("L'archivio precedente è conservato nel backup. Le vecchie auto-valutazioni non diventano nuove prove di padronanza.","muted")),link("Continua a studiare","home")];
  }
  let healthCheckGeneration=0;
  async function checkHealth(){const generation=++healthCheckGeneration;try{const result=await tutor(state.settings,"/health");if(generation===healthCheckGeneration){health=result;healthError="";}return result;}catch(e){if(generation===healthCheckGeneration){health=null;healthError=e.message;}return null;}}
  function settings() {
    const theme=h("select",{id:"theme-preference"},Object.entries(themeNames).map(([value,label])=>h("option",{value,selected:value===(state.settings.theme||"auto")},label)));
    theme.onchange=()=>run(async()=>{await change(s=>s.settings.theme=theme.value);applyTheme();});
    const minutes=h("select",{id:"daily-minutes"},[10,20,30].map(value=>h("option",{value,selected:value===(state.settings.daily_minutes||20)},value+" minuti")));
    minutes.onchange=()=>run(async()=>{await change(s=>s.settings.daily_minutes=Number(minutes.value));});
    const address=h("input",{id:"endpoint",type:"url",value:state.settings.endpoint,maxlength:200}),token=h("input",{id:"token",type:"password",autocomplete:"off",placeholder:getToken()?"Codice già presente sul dispositivo":"Codice personale APP_TOKEN",maxlength:300}),remember=h("input",{type:"checkbox",id:"remember",checked:isTokenRemembered()});
    async function saveConnection(){
      const value=endpoint(address.value),entered=token.value.trim(),keep=remember.checked;
      invalidateHealth();healthCheckGeneration++;
      if(entered)saveToken(entered,keep);
      else if(getToken()&&keep!==isTokenRemembered())saveToken(getToken(),keep);
      await change(s=>s.settings.endpoint=value);health=null;groq=null;
    }
    async function verifyConnection(){await saveConnection();const result=await checkHealth();notify(result?"Collegamento verificato. Il codice personale è presente." :healthError,!result);await refresh();}
    const statusBox=card(h("h2",{},"Stato del tutor"),h("dl",{},h("dt",{},"App"),h("dd",{},VERSION),h("dt",{},"Worker"),h("dd",{},health?health.version:"Da verificare"),h("dt",{},"Groq"),h("dd",{},groq?"Risposta verificata il "+new Date(groq).toLocaleTimeString("it-IT"):health?.groq_configured?"Chiave configurata; risposta non ancora verificata":"Da verificare")),healthError&&p(healthError,"warning"),h("div",{class:"actions"},button("Verifica collegamento Worker",verifyConnection,"secondary"),button("Verifica Groq",async()=>{await saveConnection();const result=await tutor(state.settings,"/check");if(result.provider_checked){groq=now();await checkHealth();notify("Groq ha risposto correttamente. Collegamento verificato.");}await refresh();})),p("Il collegamento al Worker non consuma una chiamata Groq. Il test Groq ne usa una.","small muted"));
    const file=h("input",{type:"file",id:"backup-file",accept:".json,application/json"});
    const preview=h("div",{});let candidate=null;
    file.onchange=()=>run(async()=>{candidate=null;preview.replaceChildren();if(!file.files[0])return;const parsed=parseBackup(await file.files[0].text());candidate=parsed;preview.replaceChildren(p("Backup valido: "+parsed.writings.length+" scritti, "+parsed.attempts.length+" tentativi, "+parsed.vocabulary.length+" termini."),button("Importa questo backup",async()=>{if(!candidate)return;await repo.replace(candidate);state=repo.get();candidate=null;notify("Backup importato. Il token del tutor resta sul dispositivo.");await refresh();},"secondary"),p("L'importazione sostituisce i dati della nuova app. Esporta prima una copia dei progressi attuali.","warning"));});
    const downloadBackup=async()=>{const text=await repo.backup(),blob=new Blob([text],{type:"application/json"}),url=URL.createObjectURL(blob),a=h("a",{href:url,download:"jflt-progressi-"+now().slice(0,10)+".json"});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
    // Ricomincia da zero in due passi: prima il backup scaricato, poi la conferma esplicita.
    const resetArea=h("div",{class:"reset-confirm"});
    const resetCard=h("section",{class:"card danger-zone"},h("h2",{},"Ricomincia da zero"),
      p("Cancella da questo dispositivo pretest, esercizi, percorsi, livelli, scritti, letture e lessico. Restano il codice del tutor, l'indirizzo del Worker, il tema e i minuti del piano."),
      button("Prepara il backup e ricomincia",async()=>{await downloadBackup();resetArea.replaceChildren(
        p("Backup scaricato: controlla di averlo salvato (su iPhone in File → Download). Poi conferma.","warning"),
        button("Sì, cancella tutti i progressi",async()=>{await repo.replace(resetProgress(repo.get()));state=repo.get();notify("Progressi cancellati. Scegli il livello di partenza o fai il pretest per ricominciare.");await goto("home");},"danger"),
        button("Annulla",async()=>{resetArea.replaceChildren();},"quiet"));},"secondary"),
      resetArea);
    return [title("IMPOSTAZIONI","Ritmo, aspetto e tutor.","I progressi restano su questo dispositivo. Il tutor usa il tuo Worker Cloudflare e Groq."),
      startingLevelCard(),
      card(h("h2",{},"Il tuo ritmo"),h("label",{for:"theme-preference"},"Aspetto"),theme,h("label",{for:"daily-minutes"},"Tempo indicativo del piano quotidiano"),minutes,p("Automatico segue il tema del dispositivo. Un piano già iniziato mantiene obiettivo e contenuti fino a fine giornata.","small muted")),
      card(h("h2",{},"Collega il tutor"),h("label",{for:"endpoint"},"Indirizzo Worker"),address,h("label",{for:"token"},"Codice personale del tutor"),token,h("label",{class:"inline-check"},remember,"Ricorda il codice su questo dispositivo"),button("Salva collegamento",verifyConnection),button("Rimuovi il codice dal dispositivo",async()=>{saveToken("");healthCheckGeneration++;health=null;healthError="";groq=null;notify("Codice rimosso da questo dispositivo.");await refresh();},"quiet"),p("La chiave Groq va nei secret Cloudflare. Qui si inserisce solo il codice personale APP_TOKEN; non viene incluso nei backup.","small muted")),
      statusBox,card(h("h2",{},"Proteggi i tuoi progressi"),button("Esporta backup JSON",async()=>{await downloadBackup();notify("Backup preparato. Conserva il file scaricato.");},"secondary"),h("label",{for:"backup-file"},"Importa un backup"),file,preview,p("Gli aggiornamenti dell'app conservano i tuoi dati. Il backup serve per cambiare dispositivo e per passare da Safari all'app sulla schermata Home: su iPhone le due hanno archivi separati.","muted")),
      resetCard,
      card(h("h2",{},"Studio senza connessione"),p("Lezioni, pretest, esercizi originali, lessico e bozze funzionano offline dopo il primo caricamento. Le richieste Groq partono solo quando premi un comando del tutor."),button("Cerca aggiornamenti",async()=>{const reg=await navigator.serviceWorker?.getRegistration();if(!reg)throw new Error("Aggiornamenti disponibili dopo la pubblicazione HTTPS dell'app.");await reg.update();notify("Controllo avviato. Se arriva una nuova versione comparirà un avviso.");},"quiet")),link("Vedi i progressi","progress","text-link")];
  }
  async function render() {
    const turn=++renderId;await repo.flush();if(turn!==renderId)return;
    state=repo.get();applyTheme();
    state=repo.get();const [route="home",id,returnCourse]=location.hash.replace(/^#\/?/,"").split("/");
    const paths={learn:"studio",guided:"writing",articles:"reading",connect:"settings",lexicon:"phrasals",write:"writing",tenses:"studio"};
    const page=paths[route]||route||"home";
    const pages={home,studio,lesson:()=>lesson(id,returnCourse),checkpoint:()=>learning.page(id),practice:()=>practice(id),path:()=>pathView.page(id),placement,phrasals,word:()=>word(id),review,writing:()=>writing(id==="new"?undefined:id),course:()=>courses.page(id),reading:()=>reading(id==="new"?undefined:id),progress,settings};
    document.body.dataset.page=page;document.querySelectorAll("[data-app-version]").forEach(el=>{el.textContent=VERSION;});
    root.replaceChildren(...(pages[page]||home)().flat().filter(Boolean));
    document.querySelectorAll("nav a").forEach(a=>{const section=a.dataset.section;const active=section===page||section==="writing"&&page==="course"||section==="studio"&&["lesson","practice","phrasals","word","placement","checkpoint"].includes(page)||section==="home"&&["progress","path"].includes(page);a.setAttribute("aria-current",active?"page":"false");});
    document.title=(root.querySelector("h1")?.textContent||"Studio")+" · JFLT Coach";
    window.scrollTo?.(0,0);
  }
  window.addEventListener("hashchange",()=>render().catch(e=>notify(e.message,true)));
  await render();
  if(getToken())checkHealth(); // Non ricreare il modulo mentre lo studente sta digitando.
  return {render,goto,flush:()=>repo.flush(),get:()=>repo.get(),notify};
}
export async function start() {
  try {
    const repo=await openRepository(globalThis.indexedDB,()=>{document.getElementById("notice").hidden=false;document.getElementById("notice").textContent="Chiudi le altre schede di JFLT Coach per aggiornare l'archivio, poi riapri l'app.";});
    const app=await mountApp(repo);
    function online(){const el=document.getElementById("connection");el.textContent=navigator.onLine?"Online":"Offline";el.dataset.state=navigator.onLine?"online":"offline";}
    online();window.addEventListener("online",online);window.addEventListener("offline",online);
    // Il funzionamento offline è un di più: se il browser rifiuta il service worker
    // (navigazione privata, browser integrati) l'app resta aperta e usabile.
    if("serviceWorker" in navigator) try {
      const reg=await navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"});
      if(!reg)throw new Error("service worker non disponibile");
      const offer=worker=>{if(!worker)return;const banner=document.getElementById("update");banner.hidden=false;banner.querySelector("button").onclick=async()=>{await app.flush();let reload=true;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(reload){reload=false;location.reload();}});worker.postMessage({type:"SKIP_WAITING"});};};
      if(reg.waiting)offer(reg.waiting);
      reg.addEventListener("updatefound",()=>{const worker=reg.installing;worker?.addEventListener("statechange",()=>{if(worker.state==="installed"&&navigator.serviceWorker.controller)offer(reg.waiting);});});
      reg.update().catch(()=>{});
    }catch(error){console.warn("Offline non disponibile:",error.message);}
    navigator.storage?.persist?.().catch(()=>{});
    return app;
  }catch(e){document.getElementById("view").replaceChildren(title("AVVIO","Non ho potuto aprire l'archivio."),p(e.message,"warning"),p("I dati precedenti non vengono cancellati. Prova a chiudere le altre schede e a riaprire l'app."));}
}
