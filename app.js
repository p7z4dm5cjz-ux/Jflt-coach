import {LESSONS,PHRASALS,VOCABULARY,PATTERNS} from "./catalog.js";
import {bookContext} from "./bookshelf.js";
import {QUESTIONS,orderedQuestions,orderedOptions,AREAS,PHRASAL_TARGETS} from "./placement.js";
import {VERSION,now,uid,countWords,normal,correct,endpoint,newPlacement,placementProfile,recommendation,addTerm,recordReview,recoveryItems,phrasalItems,writingReady,sanitizeFeedback,GENRES} from "./engine.js";
import {grammarItems} from "./practice-bank.js";
import {openRepository,parseBackup} from "./storage.js";
import {callTutor,getToken,saveToken} from "./tutor.js";

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
const p=(text,cls="")=>h("p",{class:cls},text);
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
    if(busy)return;busy=true;root.setAttribute("aria-busy","true");
    if(button)button.disabled=true;
    saveStatus.textContent="Operazione in corso…";
    try{await repo.flush();state=repo.get();await fn();}
    catch(e){notify(e.message+(e.requestId?" Riferimento: "+e.requestId:""),true);}
    finally{busy=false;root.removeAttribute("aria-busy");if(button?.isConnected)button.disabled=false;saveStatus.textContent="Salvato sul dispositivo";}
  }
  const button=(text,fn,cls="")=>h("button",{type:"button",class:cls,onclick:e=>run(fn,e.currentTarget)},text);
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
  async function makeSession(lessonId,items,source="local",extra={}) {
    const id=uid("session");
    await change(s=>s.sessions.push({id,lesson_id:lessonId,items:items.map((it,i)=>({...it,id:it.id||id+"-"+i,accept:[it.answer,...(it.accept||[])],options:shuffled(it.options||[])})),answers:{},assisted:false,completed_at:null,source,created_at:now(),...extra}));
    await goto("practice/"+id);return id;
  }
  function dueTerms() {return state.vocabulary.filter(v=>Date.parse(v.due)<=Date.now()).sort((a,b)=>a.due.localeCompare(b.due));}
  function sourceNotes(id,mode,type) {
    const ctx=bookContext(id,mode,type);
    return h("details",{class:"sources"},h("summary",{},"Riferimenti nei tuoi libri"),ctx.notes.map(n=>h("div",{},h("strong",{},n.book+" · "+(n.units?"unità "+n.units+" · ":"")+"p. "+n.pages),p(n.note_it))),ctx.further.map(n=>p(n.book+" · "+n.pages+" · "+n.purpose_it)),ctx.errata.map(e=>p("Correzione del manuale "+e.book+", p. "+e.pages+": "+e.correction_it,"warning")),p("Sintesi ed esercizi originali. I PDF restano nei tuoi materiali.","muted"));
  }
  function home() {
    const next=recommendation(state)[0],profile=placementProfile(state.placement),due=dueTerms(),active=state.writings.findLast(w=>!w.comparison);
    const attempts=state.attempts.filter(a=>!a.assisted&&a.source!=="legacy"),score=attempts.length?Math.round(attempts.filter(a=>a.correct).length/attempts.length*100):null;
    return [
      title("IL TUO PERCORSO","Un passo avanti, ogni giorno.","Grammatica mirata, parole da usare e scrittura da migliorare."),
      h("section",{class:"hero"},h("div",{},p("PROSSIMA SESSIONE · CIRCA 20 MINUTI","eyebrow"),h("h2",{},next.title),p(profile?"La proposta tiene conto del pretest e dei tuoi tentativi senza aiuti.":"Partiamo dai punti più utili: tempi, negazioni e costruzioni. Il pretest renderà la scelta personale."),link("Inizia la sessione","lesson/"+next.id)),h("span",{class:"hero-mark","aria-hidden":"true"},"Aa")),
      h("div",{class:"stats"},card(p("Verifiche senza aiuti","muted"),h("strong",{class:"big"},score===null?"—":score+"%"),p(attempts.length+" risposte valutate","small")),card(p("Parole da recuperare","muted"),h("strong",{class:"big"},due.length),link("Apri Ripasso","review","text-link")),card(p("I tuoi scritti","muted"),h("strong",{class:"big"},state.writings.length),link(active?"Riprendi la bozza":"Prepara un testo",active?"writing/"+active.id:"writing","text-link"))),
      !profile?card(h("h2",{},state.placement?"Riprendi il pretest":"Salta ciò che sai già"),p("45 domande: 14 sui tempi, 8 su negazioni e domande, 8 sui phrasal verbs e 15 sulle altre strutture. Puoi interromperti e riprendere. Le soluzioni arrivano alla consegna."),link(state.placement?"Continua il pretest":"Fai il pretest","placement")):card(h("h2",{},"Il tuo punto di partenza"),p(profile.correct+"/45 risposte corrette. Una risposta data con dubbio resta da confermare."),link("Vedi risultati e priorità","placement","text-link")),
      h("div",{class:"two-columns"},card(h("h2",{},"Phrasal verbs nel contesto"),p("Significato, particelle, ordine dei pronomi e registro. Una parola segnata come nota resta distinta da una risposta verificata."),link("Apri il laboratorio","phrasals")),card(h("h2",{},"Leggi e ricostruisci il senso"),p("Traduci un passaggio, confronta le scelte e recupera le parole utili."),link("Apri Lettura","reading"))),
      link("Consulta i progressi","progress","text-link")
    ];
  }
  function studio() {
    const search=h("input",{id:"lesson-search",type:"search",placeholder:"Cerca un tempo o una costruzione…","aria-label":"Cerca una lezione"});
    const rows=h("div",{class:"lesson-grid"});
    function fill(value="") {rows.replaceChildren(...recommendation(state).filter(l=>normal(l.title+" "+l.tool).includes(normal(value))).map(l=>h("a",{class:"lesson-card",href:"#/lesson/"+l.id},h("span",{class:"pill "+l.status},statusLabels[l.status]),h("h2",{},l.title),p(l.goal,"small"),h("span",{class:"arrow","aria-hidden":"true"},"→"))));}
    search.oninput=()=>fill(search.value);fill();
    return [title("STUDIO","Scegli la struttura giusta.","Le priorità compaiono per prime. Le basi già controllate restano consultabili."),h("div",{class:"actions"},link("Tempi verbali","studio","button secondary"),link("Phrasal verbs","phrasals","button secondary"),link("Lettura","reading","button secondary")),search,rows];
  }
  function lesson(id) {
    const l=LESSONS.find(l=>l.id===id);if(!l)return [title("STUDIO","Lezione non trovata."),link("Torna alle lezioni","studio")];
    const selected=dueTerms().slice(0,3);
    return [link("← Tutte le lezioni","studio","back"),title("GRAMMATICA",l.title,l.goal),
      card(h("h2",{},"Quando usarla"),p(l.when),l.forms&&p(l.forms,"formula"),list(l.examples.map(t=>h("span",{lang:"en"},t))),h("h3",{},"La differenza che conta"),p(l.contrast),p(l.pitfall,"warning")),
      h("div",{class:"two-columns"},card(h("h2",{},"Metti alla prova la forma"),p("Esercizi originali disponibili anche offline. Le risposte con suggerimenti non entrano nei risultati autonomi."),button("Esercizi offline",()=>makeSession(id,[...grammarItems(id,state.sessions.length),...recoveryItems(selected)]))),card(h("h2",{},"Cambia contesto con il tutor"),p("Sei esercizi nuovi: scelte, completamenti e trasformazioni. Recupero lessicale separato per le parole in scadenza."),button("Genera 6 esercizi con Groq",async()=>{const result=await tutor(state.settings,"/tutor","exercises",{lesson_id:id,terms:selected.map(v=>({expression:v.expression,meaning_it:v.meaning_it})),recent_errors:state.attempts.filter(a=>a.lesson_id===id&&!a.correct).slice(-3).map(a=>({stem:a.stem,answer:a.answer}))});await makeSession(id,[...result.items.map((it,i)=>({...it,id:uid("ai"),skill:it.kind==="choice"?"choose":"form",origin:"groq"})),...recoveryItems(selected)],"groq");},"secondary"))),
      selected.length&&p("Recupero di oggi: "+selected.map(v=>v.expression).join(" · "),"muted"),sourceNotes(id)];
  }
  function practice(id) {
    const set=state.sessions.find(s=>s.id===id);if(!set)return [title("ESERCIZI","Sessione non trovata."),link("Apri Studio","studio")];
    const l=LESSONS.find(l=>l.id===set.lesson_id),done=!!set.completed_at;
    const form=h("form",{id:"practice-form"});
    for(const [i,item] of set.items.entries()) {
      const value=set.answers[item.id]||"",result=state.attempts.find(a=>a.session_id===id&&a.item_id===item.id);
      const block=h("fieldset",{class:"exercise"},h("legend",{},(i+1)+". "+(item.kind==="retrieval"?"Recupero lessicale":item.skill==="recognise"?"Significato":"Uso della forma")),p(item.stem,"stem"));
      if(item.options?.length)for(const [j,opt] of item.options.entries())block.append(h("label",{class:"option",for:item.id+"-"+j},h("input",{id:item.id+"-"+j,type:"radio",name:item.id,value:opt,checked:value===opt,disabled:done,onchange:e=>autosave(s=>{s.sessions.find(x=>x.id===id).answers[item.id]=e.target.value;})}),h("span",{lang:"en"},opt)));
      else block.append(h("label",{class:"sr-only",for:item.id},"Risposta "+(i+1)),h("input",{id:item.id,value,disabled:done,autocomplete:"off",maxlength:600,oninput:e=>{const v=e.target.value;autosave(s=>{s.sessions.find(x=>x.id===id).answers[item.id]=v;});}}));
      if(result)block.append(p(result.correct?"Risposta corretta":"Da rivedere",result.correct?"good":"warning"),p(item.why),!result.correct&&p("Risposta di riferimento: "+item.answer,"formula"));
      form.append(block);
    }
    form.addEventListener("submit",e=>{e.preventDefault();run(async()=>{
      const latest=repo.get().sessions.find(s=>s.id===id);
      if(latest.completed_at)return;
      if(latest.items.some(it=>!latest.answers[it.id]?.trim()))throw new Error("Completa ogni risposta prima di verificare.");
      await change(s=>{
        const current=s.sessions.find(x=>x.id===id);
        for(const item of current.items) {
          const answer=current.answers[item.id],ok=correct(item,answer);
          s.attempts.push({id:uid("attempt"),session_id:id,item_id:item.id,lesson_id:item.kind==="retrieval"?"vocabulary":current.lesson_id,stem:item.stem,answer,correct:ok,assisted:current.assisted,source:current.source,date:now(),skill:item.skill||"form",term_id:item.term_id||null});
        }
        for(const termId of new Set(current.items.map(it=>it.term_id).filter(Boolean))) {
          const word=s.vocabulary.find(v=>v.id===termId),termItems=current.items.filter(it=>it.term_id===termId);
          if(word)recordReview(word,termItems.every(it=>correct(it,current.answers[it.id])),current.assisted);
        }
        current.completed_at=now();
      });await refresh();
    });});
    if(!done)form.append(h("button",{type:"submit"},"Verifica le risposte"));
    const results=state.attempts.filter(a=>a.session_id===id);
    return [link("← "+(l?.title||"Ripasso"),set.writing_id?"writing/"+set.writing_id:l?"lesson/"+set.lesson_id:"review","back"),title(set.source==="groq"?"ESERCIZI · GROQ":"ESERCIZI · OFFLINE",set.writing_id?"Verifica in un nuovo contesto":l?.title||"Recupero del lessico"),
      done?card(h("h2",{},results.filter(r=>r.correct).length+"/"+results.length+" corrette"),p(set.assisted?"Sessione con suggerimenti: esclusa dai risultati autonomi.":"Sessione senza suggerimenti, salvata nei tuoi progressi."),link("Continua",set.writing_id?"writing/"+set.writing_id:"home")):h("div",{class:"actions"},p("Risposte salvate mentre scrivi. Le soluzioni compaiono solo dopo la verifica.","muted"),button("Mostra un suggerimento",async()=>{await change(s=>{s.sessions.find(x=>x.id===id).assisted=true;});notify(l?.forms||l?.pitfall||"Pensa al significato e alla costruzione. La sessione ora risulta svolta con un aiuto.");},"quiet")),
      form];
  }
  function placement() {
    const test=state.placement,profile=placementProfile(test);
    if(!test)return [title("PRETEST","Dove conviene iniziare?","45 domande senza aiuti, con una sola consegna finale. Non è una certificazione di livello."),card(h("h2",{},"Tempi, negazioni e phrasal verbs in primo piano"),p("Segna «Ho un dubbio» quando non sei sicuro. Puoi lasciare vuota una risposta scegliendo «Non so»: il percorso la considererà da ripassare."),button("Inizia il pretest",async()=>{await change(s=>{s.placement=newPlacement();});await refresh();}))];
    if(profile)return [title("PRETEST","Il tuo punto di partenza",profile.correct+"/45 corrette · "+profile.uncertain.length+" corrette da confermare"),
      card(h("h2",{},"Aree da cui partire"),h("table",{},h("thead",{},h("tr",{},["Area","Corrette","Proposta"].map(v=>h("th",{},v)))),h("tbody",{},profile.areas.map(a=>h("tr",{},h("td",{},a.title),h("td",{},a.correct+"/"+a.total),h("td",{},statusLabels[a.status]))))),link("Apri il percorso personale","studio")),
      card(h("h2",{},"Rivedi errori e dubbi"),profile.rows.filter(r=>!r.secure).map(r=>h("details",{},h("summary",{},r.item.stem),p("La tua risposta: "+(r.answer.value||"Non so")),p("Risposta di riferimento: "+r.item.answer,"formula"),p(r.item.why),p(r.item.ref,"muted")))),
      h("details",{},h("summary",{},"Ripetere il pretest"),p("Il risultato precedente sarà conservato nell'archivio; il percorso userà la nuova prova."),button("Inizia una nuova prova",async()=>{await change(s=>{s.legacy??={};s.legacy.placement_history??=[];s.legacy.placement_history.push(s.placement);s.placement=newPlacement();});await refresh();},"secondary"))];
    const questions=orderedQuestions(test.seed),item=questions[test.position],answer=test.answers.find(a=>a.id===item.id),form=h("form",{id:"placement-form"});
    form.append(h("fieldset",{},h("legend",{},"Domanda "+(test.position+1)+" di 45 · "+AREAS[item.area]),p(item.stem,"stem")));
    const box=form.querySelector("fieldset");
    if(item.options)for(const [i,opt] of orderedOptions(item,test.seed).entries())box.append(h("label",{class:"option"},h("input",{type:"radio",name:"placement-answer",value:opt,checked:answer?.value===opt}),h("span",{},opt)));
    else box.append(h("label",{for:"placement-answer",class:"sr-only"},"La tua risposta"),h("input",{id:"placement-answer",name:"placement-answer",maxlength:350,value:answer?.value||"",autocomplete:"off"}));
    const unsure=h("input",{type:"checkbox",id:"unsure",checked:answer?.confidence==="unsure"});form.append(h("label",{class:"inline-check"},unsure,"Ho un dubbio"));
    async function saveAnswer(value,advance=true) {
      await change(s=>{const a={id:item.id,value,confidence:unsure.checked?"unsure":"sure"},p=s.placement;p.answers=p.answers.filter(x=>x.id!==item.id);p.answers.push(a);if(advance)p.position=Math.min(44,p.position+1);});await refresh();
    }
    form.onsubmit=e=>{e.preventDefault();run(async()=>{const v=item.options?form.querySelector('input[name="placement-answer"]:checked')?.value:form.querySelector("#placement-answer").value.trim();if(!v)throw new Error("Inserisci una risposta oppure scegli «Non so».");await saveAnswer(v);});};
    form.append(h("div",{class:"actions"},h("button",{type:"submit"},test.position===44?"Salva la risposta":"Salva e continua"),button("Non so",()=>saveAnswer(""),"secondary"),test.position>0&&button("Indietro",async()=>{await change(s=>s.placement.position--);await refresh();},"quiet")));
    return [title("PRETEST","Una prova, un percorso.","Nessuna chiamata AI. Il risultato compare dopo tutte le 45 domande."),h("progress",{max:45,value:test.answers.length,"aria-label":"Domande salvate"}),p(test.answers.length+"/45 risposte salvate","muted"),form,
      test.answers.length===45&&card(h("h2",{},"Pronto per la consegna"),p("Puoi tornare alle domande per modificarle; dopo la consegna vedrai le soluzioni."),button("Consegna il pretest",async()=>{await change(s=>{s.placement.submitted_at=now();const prof=placementProfile(s.placement);for(const row of prof.errors){const expression=PHRASAL_TARGETS[row.item.id],term=PHRASALS.find(t=>t.expression===expression);if(term)addTerm(s,term);}});await refresh();}))];
  }
  function phrasals() {
    const search=h("input",{type:"search",id:"phrasal-search",placeholder:"Cerca espressione, significato o contesto…","aria-label":"Cerca nei phrasal verbs"}),rows=h("div",{class:"lesson-grid"});
    const core=["carry out","look into","call off","rule out","hand over","fill in","run out of","put up with","find out","point out","set up","bring up","turn down","follow up"];
    function fill(v=""){const terms=PHRASALS.filter(t=>normal(t.expression+" "+t.meaning_it+" "+t.topic).includes(normal(v))).sort((a,b)=>(core.includes(a.expression)?0:1)-(core.includes(b.expression)?0:1));rows.replaceChildren(...terms.map(t=>h("a",{href:"#/word/"+t.id,class:"lesson-card"},p(t.topic,"eyebrow"),h("h2",{lang:"en"},t.expression),p(t.meaning_it),p(PATTERNS[t.pattern],"small muted"))));}
    search.oninput=()=>fill(search.value);fill();
    return [title("LESSICO","Phrasal verbs da usare.","161 verbi ed espressioni multiword: studia un significato e la sua costruzione alla volta."),card(h("h2",{},"Non basta riconoscere la traduzione"),p("Prima il contesto, poi le particelle e la posizione dell'oggetto. Scrivi anche una frase tua; il tutor può spiegare la costruzione senza considerarla automaticamente acquisita.")),search,rows];
  }
  function word(id) {
    const t=VOCABULARY.find(v=>v.id===id)||state.vocabulary.find(v=>v.id===id);
    if(!t)return [title("LESSICO","Termine non trovato."),link("Apri Ripasso","review")];
    const learned=state.vocabulary.find(v=>v.id===t.id);
    return [link("← Lessico","phrasals","back"),title(t.topic||"LESSICO",t.expression,t.meaning_it),card(p(t.example,"stem"),t.pattern&&p(PATTERNS[t.pattern],"formula"),p("Registro: "+(t.register||"dipende dal contesto")),t.alternative&&p("Alternativa possibile: "+t.alternative+". Controlla che mantenga lo stesso significato nel tuo testo."),button(learned?"Già nel tuo ripasso":"Aggiungi al ripasso",async()=>{await change(s=>addTerm(s,t));await refresh();},"secondary")),
      card(h("h2",{},"Significato → costruzione → uso"),button("Esercita questo termine",async()=>{await change(s=>addTerm(s,t));await makeSession("phrasal-basics",t.pattern?phrasalItems(t,state.sessions.length):recoveryItems([t]));}),p("Dopo gli esercizi, scrivi una frase originale usando lo stesso significato.","muted"),field("La tua frase","word-context",learned?.context||"",value=>autosave(s=>{addTerm(s,t).context=value;}),{area:true,max:1200}),button("Spiega l'uso nel mio contesto",async()=>{const context=repo.get().vocabulary.find(v=>v.id===t.id)?.context;if(!context?.trim())throw new Error("Scrivi prima una frase.");const result=await tutor(state.settings,"/tutor","clarify",{term:t.expression,context});notify(result.explanation+" Esempio: "+result.example);},"secondary")),
      t.dictionary_url&&h("a",{href:t.dictionary_url,target:"_blank",rel:"noopener noreferrer",class:"text-link"},"Consulta il dizionario"),sourceNotes("phrasal-basics")];
  }
  function review() {
    const due=dueTerms(),search=h("input",{type:"search",placeholder:"Cerca nel tuo lessico…","aria-label":"Cerca nel tuo lessico"}),rows=h("div",{class:"word-list"});
    function fill(v=""){rows.replaceChildren(...state.vocabulary.filter(t=>normal(t.expression+" "+t.meaning_it).includes(normal(v))).map(t=>h("a",{class:"word-row",href:"#/word/"+t.id},h("strong",{},t.expression),h("span",{},t.meaning_it),h("small",{},t.streak?("Prossimo: "+date(t.due)):t.legacy_known?"Conosciuto in precedenza · da verificare":"Da recuperare"))));}search.oninput=()=>fill(search.value);fill();
    return [title("RIPASSO","Richiama prima di rileggere.",due.length+" termini in scadenza. Una risposta sbagliata torna presto; una corretta senza aiuti si distanzia."),card(h("h2",{},"Recupero attivo"),due.length?button("Ripassa "+Math.min(due.length,6)+" termini",()=>makeSession("vocabulary",recoveryItems(due.slice(0,6)))):p("Nessun termine in scadenza. Aggiungi parole dal laboratorio o dalla lettura."),link("Scopri i phrasal verbs","phrasals","text-link")),search,rows];
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
      return [title("SCRITTURA","Scrivi. Correggi. Verifica.","Un editor unico, la tua riscrittura e una prova nuova sugli errori emersi."),
        card(h("h2",{},"Prepara un testo"),h("label",{for:"genre"},"Tipo di testo"),genre,h("label",{for:"new-topic"},"Consegna"),topic,h("label",{class:"inline-check"},exam,"Simulazione senza suggerimenti durante la stesura"),button("Apri l'editor",async()=>{if(topic.value.trim().length<15)throw new Error("Scrivi una consegna più precisa.");const w={id:uid("writing"),type:genre.value,topic:topic.value.trim(),mode:exam.checked?"exam":"guided",ideas:"",outline:"",draft:"",rewrite:"",feedback:null,comparison:null,transfer:[],created_at:now()};await change(s=>s.writings.push(w));await goto("writing/"+w.id);})),
        state.writings.length>0&&card(h("h2",{},"I tuoi testi"),h("div",{class:"word-list"},state.writings.slice().reverse().map(w=>h("a",{class:"word-row",href:"#/writing/"+w.id},h("strong",{},w.topic.slice(0,90)+(w.topic.length>90?"…":"")),h("span",{},GENRES[w.type]?.label||"Testo"),h("small",{},date(w.created_at)+" · "+(w.comparison?"Confrontato":w.feedback?"Da riscrivere":"Bozza"))))))];
    }
    const w=state.writings.find(x=>x.id===id);if(!w)return [title("SCRITTURA","Testo non trovato."),link("Apri i tuoi testi","writing")];
    const bind=(key,value)=>autosave(s=>{s.writings.find(x=>x.id===id)[key]=value;});
    const draftCount=p(countWords(w.draft)+" parole · obiettivo indicativo "+GENRES[w.type].range,"muted");
    const draft=field("La tua bozza","draft",w.draft,value=>{draftCount.textContent=countWords(value)+" parole · obiettivo indicativo "+GENRES[w.type].range;bind("draft",value);},{area:true,placeholder:"Scrivi qui il testo in inglese…"});
    draft.querySelector("textarea").setAttribute("lang","en");
    const rewriteCount=p(countWords(w.rewrite)+" parole","muted"),rewrite=field("La tua riscrittura","rewrite",w.rewrite,value=>{rewriteCount.textContent=countWords(value)+" parole";bind("rewrite",value);},{area:true,placeholder:"Riscrivi tenendo conto delle priorità…"});
    rewrite.querySelector("textarea").setAttribute("lang","en");
    const comparison=w.comparison;
    return [link("← I tuoi testi","writing","back"),title(w.mode==="exam"?"SCRITTURA · SIMULAZIONE":"SCRITTURA · ALLENAMENTO",GENRES[w.type].label),card(p(w.topic)),
      w.mode!=="exam"&&h("details",{class:"card"},h("summary",{},"Prima di scrivere: idee e scaletta"),p(w.type==="report"?"Ordina i fatti nel tempo e attribuisci le dichiarazioni.":"Definisci destinatario, scopo e un punto per paragrafo."),field("Appunti","ideas",w.ideas,value=>bind("ideas",value),{area:true,max:2000}),field("Scaletta","outline",w.outline,value=>bind("outline",value),{area:true,max:2000})),
      card(h("h2",{},"1. Stesura"),draft,draftCount,button(w.feedback?"Revisiona la bozza attuale":"Chiedi la revisione",async()=>{const current=repo.get().writings.find(x=>x.id===id);writingReady(current,"review");const result=await tutor(state.settings,"/tutor","writing_review",{type:current.type,topic:current.topic,text:current.draft,mode:current.mode});await change(s=>{const x=s.writings.find(x=>x.id===id);x.feedback=sanitizeFeedback(result,current.draft);x.feedback_source=current.draft;x.comparison=null;});await refresh();},"secondary"),p("La revisione invia consegna e bozza a Groq. Usa dati fittizi nei tuoi esercizi.","small muted")),
      feedbackPanel(w),
      w.feedback&&card(h("h2",{},"2. Riscrittura"),p("Riscrivi tu il testo. Cerca di risolvere gli errori mantenendo fatti, significato e voce."),rewrite,rewriteCount,button("Confronta bozza e riscrittura",async()=>{const current=repo.get().writings.find(x=>x.id===id);writingReady(current,"compare");const result=await tutor(state.settings,"/tutor","writing_compare",{type:current.type,topic:current.topic,text:current.draft,rewrite:current.rewrite,issues:current.feedback.issues});await change(s=>{const x=s.writings.find(x=>x.id===id);x.comparison=result;x.compare_source={draft:current.draft,rewrite:current.rewrite};x.transfer=[];});await refresh();})),
      comparison&&card(h("h2",{},"3. Confronto e trasferimento"),p(comparison.summary),w.compare_source?.rewrite!==w.rewrite&&p("La riscrittura è cambiata: rifai il confronto prima della verifica.","warning"),h("h3",{},"Risolto secondo il tutor"),list(comparison.resolved),h("h3",{},"Da controllare ancora"),comparison.remaining.length?list(comparison.remaining):p("Il tutor non segnala errori residui; la verifica successiva resta utile."),button("Verifica in un nuovo contesto",async()=>{const current=repo.get().writings.find(x=>x.id===id);if(current.compare_source?.rewrite!==current.rewrite||current.compare_source?.draft!==current.draft)throw new Error("Il testo è cambiato: rifai il confronto.");const session=await makeSession("mixed",current.comparison.transfer.map(i=>({...i,id:uid("transfer"),kind:"completion",skill:"form",options:[]})),"groq",{writing_id:id});await change(s=>{s.writings.find(x=>x.id===id).transfer.push(session);});},"secondary"),w.transfer?.map(sid=>{const results=state.attempts.filter(a=>a.session_id===sid);return results.length?p("Nuovo contesto: "+results.filter(a=>a.correct&&!a.assisted).length+"/"+results.length+" corrette senza aiuti."):link("Riprendi la verifica","practice/"+sid,"text-link");})),
      sourceNotes("","WRITING_REVIEW",w.type)];
  }
  function reading(id) {
    if(!id)return [title("LETTURA","Dal testo al significato.","Incolla un passaggio inglese da studiare. Aggiungi l'indirizzo della fonte se è un articolo."),
      card(button("Nuova lettura",async()=>{const r={id:uid("reading"),title:"Nuova lettura",source:"",text:"",translation:"",feedback:null,created_at:now()};await change(s=>s.readings.push(r));await goto("reading/"+r.id);})),
      state.readings.length>0&&card(h("h2",{},"Letture salvate"),state.readings.slice().reverse().map(r=>link(r.title+" · "+date(r.created_at),"reading/"+r.id,"word-row")))];
    const r=state.readings.find(x=>x.id===id);if(!r)return [title("LETTURA","Lettura non trovata."),link("Tutte le letture","reading")];
    const bind=(key,value)=>autosave(s=>{s.readings.find(x=>x.id===id)[key]=value;});
    const term=h("input",{id:"reading-term",maxlength:120,placeholder:"Es. account for"});
    const meaning=h("input",{id:"reading-meaning",maxlength:300,placeholder:"Significato nel passaggio"});
    return [link("← Letture salvate","reading","back"),title("LETTURA",r.title),
      card(field("Titolo","reading-title",r.title,v=>bind("title",v),{max:200}),field("Fonte (facoltativa)","reading-source",r.source,v=>bind("source",v),{max:1000}),field("Passaggio inglese","reading-text",r.text,v=>bind("text",v),{area:true,max:8000}),field("La tua traduzione italiana","translation",r.translation,v=>bind("translation",v),{area:true,max:12000}),button("Confronta la traduzione con Groq",async()=>{const current=repo.get().readings.find(x=>x.id===id);if(countWords(current.text)<10||countWords(current.translation)<5)throw new Error("Inserisci un passaggio e una tua traduzione.");const result=await tutor(state.settings,"/tutor","reading_review",{text:current.text,translation:current.translation});await change(s=>{const x=s.readings.find(x=>x.id===id);x.feedback={...result,segments:result.segments.filter(v=>current.text.includes(v.quote)),terms:result.terms.filter(v=>normal(current.text).includes(normal(v.expression)))};x.feedback_source={text:current.text,translation:current.translation};});await refresh();})),
      r.feedback&&card(h("h2",{},"Confronto ragionato"),(r.feedback_source.text!==r.text||r.feedback_source.translation!==r.translation)&&p("Hai modificato il testo: questo confronto si riferisce alla versione precedente.","warning"),p(r.feedback.summary),r.feedback.segments.map(v=>h("div",{class:"issue"},h("blockquote",{lang:"en"},v.quote),p(v.translation),p(v.explanation,"muted"))),r.feedback.terms.map(v=>h("div",{class:"word-row"},h("strong",{},v.expression),p(v.meaning_it),button("Aggiungi al ripasso",async()=>{await change(s=>addTerm(s,v,r.text.slice(0,1200)));notify("Termine aggiunto al recupero attivo.");},"quiet")))),
      card(h("h2",{},"Conserva una parola utile"),h("label",{for:"reading-term"},"Espressione"),term,h("label",{for:"reading-meaning"},"Significato"),meaning,h("div",{class:"actions"},button("Salva nel lessico",async()=>{if(!term.value.trim()||!meaning.value.trim())throw new Error("Inserisci espressione e significato.");await change(s=>addTerm(s,{expression:term.value.trim(),meaning_it:meaning.value.trim(),example:"",topic:"lettura"},r.text.slice(0,1200)));notify("Parola salvata nel ripasso.");},"secondary"),button("Spiega nel contesto",async()=>{if(!term.value.trim())throw new Error("Inserisci il termine da spiegare.");const known=VOCABULARY.find(v=>normal(v.expression)===normal(term.value));if(known){meaning.value=known.meaning_it;notify(known.example+" "+(PATTERNS[known.pattern]||""));return;}const result=await tutor(state.settings,"/tutor","clarify",{term:term.value.trim(),context:repo.get().readings.find(x=>x.id===id).text.slice(0,1200)});meaning.value=result.meaning_it;notify(result.explanation+" Esempio: "+result.example);},"quiet"))),
      sourceNotes("","ARTICLE_FEEDBACK")];
  }
  function progress() {
    const recent=state.attempts.filter(a=>a.source!=="legacy"),rows=recommendation(state).filter(l=>l.attempts>0),guided=state.writings.filter(w=>w.mode!=="exam"),independent=state.writings.filter(w=>w.mode==="exam");
    return [title("PROGRESSI","Conta ciò che riesci a fare.","Il pretest orienta; le risposte senza suggerimenti confermano. La scrittura richiede anche un nuovo contesto."),
      h("div",{class:"stats"},card(h("strong",{class:"big"},recent.filter(a=>!a.assisted).length),p("Risposte senza aiuti")),card(h("strong",{class:"big"},guided.length),p("Scritti guidati")),card(h("strong",{class:"big"},independent.length),p("Scritti in simulazione"))),
      card(h("h2",{},"Le strutture esercitate"),rows.length?h("table",{},h("thead",{},h("tr",{},["Struttura","Senza aiuti","Proposta"].map(v=>h("th",{},v)))),h("tbody",{},rows.map(l=>h("tr",{},h("td",{},link(l.title,"lesson/"+l.id,"text-link")),h("td",{},Math.round(l.accuracy*100)+"% · "+l.attempts+" risposte"),h("td",{},statusLabels[l.status]))))):p("I risultati appariranno dopo i primi esercizi.")),
      card(h("h2",{},"Gli errori da riprendere"),list(recent.filter(a=>!a.correct).slice(-8).reverse().map(a=>h("span",{},a.stem," → ",a.answer))),state.legacy&&p("L'archivio precedente è conservato nel backup. Le vecchie auto-valutazioni non diventano nuove prove di padronanza.","muted")),link("Continua a studiare","home")];
  }
  async function checkHealth(){try{health=await tutor(state.settings,"/health");healthError="";}catch(e){health=null;healthError=e.message;}return health;}
  function settings() {
    const address=h("input",{id:"endpoint",type:"url",value:state.settings.endpoint,maxlength:200}),token=h("input",{id:"token",type:"password",autocomplete:"off",placeholder:getToken()?"Codice già presente sul dispositivo":"Codice personale APP_TOKEN",maxlength:300}),remember=h("input",{type:"checkbox",id:"remember"});
    const statusBox=card(h("h2",{},"Stato del tutor"),h("dl",{},h("dt",{},"App"),h("dd",{},VERSION),h("dt",{},"Worker"),h("dd",{},health?health.version:"Da verificare"),h("dt",{},"Groq"),h("dd",{},groq?"Risposta verificata il "+new Date(groq).toLocaleTimeString("it-IT"):health?.groq_configured?"Chiave configurata; risposta non ancora verificata":"Da verificare")),healthError&&p(healthError,"warning"),h("div",{class:"actions"},button("Verifica collegamento Worker",async()=>{await checkHealth();await refresh();},"secondary"),button("Verifica Groq",async()=>{const result=await tutor(state.settings,"/check");if(result.provider_checked){groq=now();await checkHealth();}await refresh();})),p("Il collegamento al Worker non consuma una chiamata Groq. Il test Groq ne usa una.","small muted"));
    const file=h("input",{type:"file",id:"backup-file",accept:".json,application/json"});
    const preview=h("div",{});let candidate=null;
    file.onchange=()=>run(async()=>{candidate=null;preview.replaceChildren();if(!file.files[0])return;const parsed=parseBackup(await file.files[0].text());candidate=parsed;preview.replaceChildren(p("Backup valido: "+parsed.writings.length+" scritti, "+parsed.attempts.length+" tentativi, "+parsed.vocabulary.length+" termini."),button("Importa questo backup",async()=>{if(!candidate)return;await repo.replace(candidate);state=repo.get();candidate=null;notify("Backup importato. Il token del tutor resta sul dispositivo.");await refresh();},"secondary"),p("L'importazione sostituisce i dati della nuova app. Esporta prima una copia dei progressi attuali.","warning"));});
    return [title("IMPOSTAZIONI","Una connessione, uno stato chiaro.","I progressi restano sul dispositivo. Il tutor usa il tuo Worker Cloudflare e Groq."),
      card(h("h2",{},"Collega il tutor"),h("label",{for:"endpoint"},"Indirizzo Worker"),address,h("label",{for:"token"},"Codice personale del tutor"),token,h("label",{class:"inline-check"},remember,"Ricorda il codice su questo dispositivo"),button("Salva collegamento",async()=>{const value=endpoint(address.value);await change(s=>s.settings.endpoint=value);if(token.value.trim())saveToken(token.value,remember.checked);health=null;groq=null;await checkHealth();await refresh();}),button("Rimuovi il codice dal dispositivo",async()=>{saveToken("");health=null;groq=null;await refresh();},"quiet"),p("La chiave Groq va nei secret Cloudflare. Qui si inserisce solo il codice personale APP_TOKEN; non viene incluso nei backup.","small muted")),
      statusBox,card(h("h2",{},"Proteggi i tuoi progressi"),button("Esporta backup JSON",async()=>{const text=await repo.backup(),blob=new Blob([text],{type:"application/json"}),url=URL.createObjectURL(blob),a=h("a",{href:url,download:"jflt-progressi-"+now().slice(0,10)+".json"});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify("Backup preparato. Conserva il file scaricato.");},"secondary"),h("label",{for:"backup-file"},"Importa un backup 0.2.x o 1.0.0"),file,preview,p("L'aggiornamento sulla stessa origine recupera automaticamente il vecchio archivio. Il backup serve anche per cambiare dispositivo.","muted")),
      card(h("h2",{},"Studio senza connessione"),p("Lezioni, pretest, esercizi originali, lessico e bozze funzionano offline dopo il primo caricamento. Le richieste Groq partono solo quando premi un comando del tutor."),button("Cerca aggiornamenti",async()=>{const reg=await navigator.serviceWorker?.getRegistration();if(!reg)throw new Error("Aggiornamenti disponibili dopo la pubblicazione HTTPS dell'app.");await reg.update();notify("Controllo avviato. Se arriva una nuova versione comparirà un avviso.");},"quiet")),link("Vedi i progressi","progress","text-link")];
  }
  async function render() {
    const turn=++renderId;await repo.flush();if(turn!==renderId)return;
    state=repo.get();const [route="home",id]=location.hash.replace(/^#\/?/,"").split("/");
    const paths={learn:"studio",guided:"writing",articles:"reading",connect:"settings",lexicon:"phrasals",write:"writing",tenses:"studio"};
    const page=paths[route]||route;
    const pages={home,studio,lesson:()=>lesson(id),practice:()=>practice(id),placement,phrasals,word:()=>word(id),review,writing:()=>writing(id==="new"?undefined:id),reading:()=>reading(id==="new"?undefined:id),progress,settings};
    root.replaceChildren(...(pages[page]||home)().flat().filter(Boolean));
    document.querySelectorAll("nav a").forEach(a=>{const section=a.dataset.section;const active=section===page||section==="studio"&&["lesson","practice","phrasals","word","placement","reading"].includes(page)||section==="home"&&page==="progress";a.setAttribute("aria-current",active?"page":"false");});
    document.title=(root.querySelector("h1")?.textContent||"Studio")+" · JFLT Coach";
    window.scrollTo?.(0,0);
  }
  window.addEventListener("hashchange",()=>render().catch(e=>notify(e.message,true)));
  await render();
  if(getToken())checkHealth().then(()=>{if(location.hash==="#/settings")refresh();});
  return {render,goto,flush:()=>repo.flush(),get:()=>repo.get(),notify};
}
export async function start() {
  try {
    const repo=await openRepository(globalThis.indexedDB,()=>{document.getElementById("notice").hidden=false;document.getElementById("notice").textContent="Chiudi le altre schede di JFLT Coach per aggiornare l'archivio, poi riapri l'app.";});
    const app=await mountApp(repo);
    function online(){document.getElementById("connection").textContent=navigator.onLine?"Online":"Offline";}
    online();window.addEventListener("online",online);window.addEventListener("offline",online);
    if("serviceWorker" in navigator) {
      const reg=await navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"});
      const offer=worker=>{if(!worker)return;const banner=document.getElementById("update");banner.hidden=false;banner.querySelector("button").onclick=async()=>{await app.flush();let reload=true;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(reload){reload=false;location.reload();}});worker.postMessage({type:"SKIP_WAITING"});};};
      if(reg.waiting)offer(reg.waiting);
      reg.addEventListener("updatefound",()=>{const worker=reg.installing;worker?.addEventListener("statechange",()=>{if(worker.state==="installed"&&navigator.serviceWorker.controller)offer(reg.waiting);});});
      reg.update().catch(()=>{});
    }
    navigator.storage?.persist?.().catch(()=>{});
    return app;
  }catch(e){document.getElementById("view").replaceChildren(title("AVVIO","Non ho potuto aprire l'archivio."),p(e.message,"warning"),p("I dati precedenti non vengono cancellati. Prova a chiudere le altre schede e a riaprire l'app."));}
}
