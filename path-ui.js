// Interfaccia del percorso adattivo: avvio 30/45/60 minuti, blocchi da 5, risultato del ciclo.
import {LESSONS} from "./catalog.js";
import {now} from "./engine.js";
import {LEVELS,ruleInfo} from "./item-tags.js";
import {levelState} from "./path-levels.js";
import {planCycle,closeCycle,newPath,pathCycles,cycleReason,isOpen,chooseMain,ROLE_LABELS,PATH_LENGTHS,DEFAULT_LENGTH} from "./path-planner.js";
import {activePath,pathStep,pathBlockRequest,pathItemsFromReply,fallbackBlock,cycleSummary,PATH_BLOCKS} from "./path-flow.js";
import {getToken} from "./tutor.js";

const title=id=>LESSONS.find(l=>l.id===id)?.title||id;
const decisionText={up:"Sali di livello",stay:"Resti allo stesso livello",down:"Torni al livello precedente",insufficient:"Servono altre risposte"};

export function pathUI(api){
  const {h,p,card,link,button,change,goto,refresh,getState,tutor,sessionRecord}=api;

  async function start(length=DEFAULT_LENGTH,forced=null){
    const open=activePath(getState());
    if(open&&!forced){await advance(open.id);return;}
    const path={...newPath(length,now()),...(forced?{forced_lesson:forced}:{})};
    // Un nuovo percorso chiude quello lasciato a metà: i cicli già fatti restano salvati.
    await change(s=>{s.paths??=[];for(const old of s.paths)if(!old.completed_at)old.completed_at=now();s.paths.push(path);});
    await advance(path.id);
  }

  // Esegue i passi automatici finché serve lo studente: un blocco da fare o un risultato da leggere.
  async function advance(pathId){
    for(let guard=0;guard<6;guard++){
      const state=getState(),path=state.paths.find(x=>x.id===pathId),step=pathStep(state,path);
      if(step.kind==="resume"){await goto("practice/"+step.session.id);return;}
      if(step.kind==="done"){await change(s=>{const x=s.paths.find(x=>x.id===pathId);x.completed_at??=now();});await goto("path/"+pathId);return;}
      if(step.kind==="close"){await change(s=>{const c=s.paths.find(x=>x.id===pathId).cycles.at(-1);c.result=closeCycle(s,c,now());});await goto("path/"+pathId);return;}
      if(step.kind==="plan"){
        const forced=path.forced_lesson&&(path.cycles.length===0||isOpen(state,path.forced_lesson))?path.forced_lesson:null;
        const plan=planCycle(state,{previous:step.previous||lastCycle(state),force:forced});
        if(!plan)throw new Error("Nessuna lezione disponibile per un nuovo ciclo.");
        await change(s=>{s.paths.find(x=>x.id===pathId).cycles.push({n:step.n,...plan,block_ids:[],result:null,created_at:now()});});
        continue;
      }
      if(step.kind==="block"){const id=await createBlock(pathId,step.page);await goto("practice/"+id);return;}
    }
  }
  // L'ultimo ciclo chiuso, anche di un percorso precedente: il nuovo percorso continua da lì.
  function lastCycle(state){return (state.paths||[]).flatMap(x=>x.cycles).filter(c=>c.result).sort((a,b)=>Date.parse(a.result.closed_at)-Date.parse(b.result.closed_at)).at(-1)||null;}

  async function createBlock(pathId,page){
    const state=getState(),path=state.paths.find(x=>x.id===pathId),cycle=path.cycles.at(-1);
    const data=pathBlockRequest(state,path,cycle,page);
    let items=null,passages=[],source="groq",note=null;
    if(getToken()&&navigator.onLine!==false){
      try{const result=await tutor(state.settings,"/tutor","path_block",data);items=pathItemsFromReply(result,data.slots);passages=result.passages;}
      catch(e){note="Il tutor non ha preparato il blocco ("+String(e.message||"errore").slice(0,160)+"). Esercizi dalla banca locale: le frasi mai viste contano, le altre sono ripasso.";}
    }else note=getToken()?"Sei offline: esercizi dalla banca locale. Le frasi mai viste contano, le altre sono ripasso.":"Tutor non collegato: esercizi dalla banca locale. Collega il tutor nelle Impostazioni per i testi del livello 4 e le domande nuove.";
    if(!items){const local=fallbackBlock(state,data.slots);items=local.items;source="local";if(local.exact<data.slots.length)note+=" Frasi nuove alla regola e al livello richiesti: "+local.exact+" su "+data.slots.length+"; le altre sono ripasso e non decidono il livello.";}
    if(!items.length)throw new Error("Non ci sono esercizi disponibili per questo blocco.");
    const set=sessionRecord(cycle.main,items,source,{path_id:pathId,path_block:{cycle:cycle.n,page},...(passages.length?{passages}:{}),...(note?{fallback_note:note.slice(0,400)}:{})});
    await change(s=>{s.sessions.push(set);s.paths.find(x=>x.id===pathId).cycles.at(-1).block_ids.push(set.id);});
    return set.id;
  }

  // Scheda in Oggi: riprendere o iniziare, con la durata.
  function homeCard(){
    const s=getState(),open=activePath(s);
    if(open){
      const cycle=open.cycles.at(-1),step=pathStep(s,open);
      return h("section",{class:"card current-priority path-card"},h("h2",{},"Continua il percorso"),
        cycle&&p("Ciclo "+cycle.n+" di "+pathCycles(open)+" · "+(step.kind==="resume"||step.kind==="block"?"blocco "+((step.page??0)+1)+" di "+PATH_BLOCKS:"risultato del ciclo")),
        cycle&&p(cycleReason(cycle),"small muted"),
        button("Riprendi il percorso",()=>advance(open.id)),
        link("Vedi i cicli","path/"+open.id,"text-link"));
    }
    const first=chooseMain(s,{continueWith:lastCycle(s)?.main});
    return h("section",{class:"card current-priority path-card"},h("h2",{},"Percorso con il tutor"),
      first&&p("Si parte da «"+title(first)+"» al livello "+levelState(s,first).level+" ("+LEVELS[levelState(s,first).level].toLowerCase()+")."),
      p("Cicli da 15 domande in tre blocchi da 5. L'app sceglie lezione, regole e livello; dopo ogni ciclo decide se salire, restare o ripassare. Il tutor prepara frasi nuove e testi dal livello 4."),
      h("div",{class:"actions"},Object.keys(PATH_LENGTHS).map(Number).map(m=>button(m+" minuti · "+PATH_LENGTHS[m]+" cicli",()=>start(m),m===DEFAULT_LENGTH?"":"secondary"))),
      p("Senza connessione il percorso usa la banca locale. Puoi fermarti e riprendere quando vuoi.","small muted"));
  }

  // Scheda nella lezione: livello attuale e «Esercita questa lezione».
  function lessonCard(lessonId,extra=null){
    const s=getState(),ls=levelState(s,lessonId);
    const status=ls.pending_transfer?"Livello 4 superato: in attesa della prova di trasferimento.":ls.autonomous?"Già autonoma: puoi ripassarla nel percorso.":"Livello "+ls.level+" · "+LEVELS[ls.level];
    return card(h("h2",{},"Percorso adattivo con il tutor"),p(status),
      p("Un ciclo da 15 domande parte da questa lezione e la intreccia con quelle collegate. Poi il percorso continua da solo."),
      h("div",{class:"actions"},Object.keys(PATH_LENGTHS).map(Number).map(m=>button("Esercita questa lezione · "+m+" min",()=>start(m,lessonId),m===DEFAULT_LENGTH?"":"secondary"))),extra);
  }

  // Intestazione del blocco nella pagina degli esercizi.
  function practiceHeader(set){
    const s=getState(),path=s.paths?.find(x=>x.id===set.path_id),cycle=path?.cycles.find(c=>c.n===set.path_block.cycle);
    if(!cycle)return null;
    return card(p("Percorso · ciclo "+cycle.n+" di "+pathCycles(path)+" · blocco "+(set.path_block.page+1)+" di "+PATH_BLOCKS,"eyebrow"),
      h("h2",{},"Perché questo blocco"),p(cycleReason(cycle)),
      set.fallback_note&&p(set.fallback_note,"small warning"));
  }
  // Etichetta sopra ogni esercizio: ruolo, regola e livello.
  function itemLabel(item){
    const rule=item.rules?.[0]&&ruleInfo(item.rules[0]);
    return [item.path_role&&ROLE_LABELS[item.path_role],rule?.name,item.level&&"livello "+item.level].filter(Boolean).join(" · ");
  }
  function passage(set,item){
    const text=set.passages?.find(x=>x.group===item.group)?.text;
    return text?h("blockquote",{class:"path-passage",lang:"en"},text):null;
  }
  function continueButton(set){
    return button(set.path_block.page<PATH_BLOCKS-1?"Prossimo blocco del percorso":"Chiudi il ciclo e vedi il risultato",()=>advance(set.path_id));
  }

  // Pagina del percorso: cicli, risultati e prossimo passo.
  function page(pathId){
    const s=getState(),path=s.paths?.find(x=>x.id===pathId);
    if(!path)return [p("Percorso non trovato."),link("Torna a Oggi","home")];
    const step=pathStep(s,path);
    return [link("← Oggi","home","back"),h("header",{class:"page-heading"},p("PERCORSO · "+path.length+" MINUTI","eyebrow"),h("h1",{tabindex:"-1"},path.completed_at?"Percorso concluso":"Il tuo percorso"),p("Ogni ciclo: 15 domande, poi la decisione sul livello della lezione principale.","intro")),
      path.cycles.slice().reverse().map(c=>{
        const summary=cycleSummary(s,c),r=c.result;
        return card(h("h2",{},"Ciclo "+c.n+" · "+title(c.main)),p(cycleReason(c),"small muted"),
          r?[p(decisionText[r.decision]+": livello "+r.level+(r.to!==r.level?" → "+r.to:"")+" ("+LEVELS[r.to]+")",r.decision==="up"?"good":r.decision==="down"?"warning":""),
            p(r.n?r.correct+" corrette su "+r.n+" risposte valide al livello "+r.level+" ("+Math.round(r.accuracy*100)+"%). Per salire serve almeno l'80% su almeno 9 risposte nuove, senza aiuti.":"Nessuna risposta valida a questo livello: frasi già viste, aiuti o esercizi non verificati non contano."),
            r.transfer&&p("Livello 4 superato: la lezione attende la prova di trasferimento e lascia il posto alla successiva.","good"),
            levelState(s,c.main).parked&&p("Tre cicli fermi allo stesso livello: la lezione va in pausa e torna più avanti, intanto resta tra ripassi e intrecciate.","small muted"),
            r.secondary?.length>0&&p("Da riprendere: "+r.secondary.map(x=>title(x.lesson_id)+" (livello "+x.level+")").join(", ")+".","warning")]
           :p(c.block_ids.length+" blocchi su "+PATH_BLOCKS+" preparati."),
          summary.answers>0&&h("details",{},h("summary",{},summary.correct+"/"+summary.answers+" corrette nel ciclo"),h("ul",{},Object.entries(summary.byLesson).map(([id,x])=>h("li",{},title(id)+": "+x.correct+"/"+x.n+(x.assisted?" · "+x.assisted+" con aiuto":""))))),
          summary.fallback&&p("Parte del ciclo usa la banca locale.","small muted"));
      }),
      step.kind==="done"||path.completed_at?h("div",{class:"actions"},button("Nuovo percorso · "+DEFAULT_LENGTH+" minuti",()=>start(DEFAULT_LENGTH)),link("Torna a Oggi","home","secondary"))
        :h("div",{class:"actions"},button(step.kind==="plan"?"Inizia il ciclo "+step.n:step.kind==="close"?"Vedi il risultato del ciclo":"Continua il blocco",()=>advance(path.id)),
          button("Termina qui",async()=>{await change(x=>{x.paths.find(y=>y.id===path.id).completed_at=now();});await refresh();},"quiet"))];
  }
  return {start,advance,homeCard,lessonCard,practiceHeader,itemLabel,passage,continueButton,page};
}
