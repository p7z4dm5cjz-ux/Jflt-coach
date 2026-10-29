// Definizioni originali, sempre disponibili senza chiamare il tutor.
export const GLOSSARY = [
  ['soggetto','Soggetto','Chi o che cosa compie l’azione, oppure ciò di cui si parla. Determina la concordanza del verbo.','The patrol checks the gate. → The patrol è il soggetto.','sentence'],
  ['ausiliare','Ausiliare','Verbo che aiuta a costruire domande, negazioni, tempi composti o passivi: be, have, do. Dopo did si usa la forma base.','Did she leave? / She did not leave.','questions'],
  ['forma-base','Forma base','Forma del verbo senza to e senza desinenze. Si usa dopo i modali e dopo do, does e did.','She can swim. / Did they arrive?','sentence'],
  ['infinito','Infinito','Forma non personale del verbo. Può avere to (to leave) oppure esserne priva (leave), secondo la costruzione.','We want to leave. / We must leave.','verb-patterns'],
  ['participio-passato','Participio passato','Forma usata nei tempi perfetti e nel passivo. Nei regolari termina in -ed; negli irregolari va imparata: gone, written, seen.','They have written a report. / The report was written.','present-perfect-simple'],
  ['participio-presente','Participio presente','Forma in -ing usata, per esempio, nei tempi continui. Non basta da sola per costruire un tempo continuo: serve be.','They are checking the gate.','present-continuous'],
  ['gerundio','Gerundio','Forma in -ing con funzione nominale. In inglese compare dopo preposizioni e dopo alcuni verbi; non corrisponde sempre al gerundio italiano.','Checking the gate takes time. / After checking it, she left.','verb-patterns'],
  ['concordanza','Concordanza','Accordo tra soggetto e verbo. Nel present simple affermativo la terza persona singolare aggiunge normalmente -s.','The officer works. / The officers work.','sentence'],
  ['clausola','Proposizione (clausola)','Unità con un verbo e, di solito, un soggetto. Una frase può contenere una proposizione principale e una o più subordinate.','I left because it was late. → principale + subordinata causale.','clauses'],
  ['subordinata','Subordinata','Proposizione che dipende da un’altra: può esprimere causa, tempo, condizione o aggiungere informazioni su un nome.','Call me when you arrive.','clauses'],
  ['contesto','Contesto','Situazione e informazioni attorno a una frase che permettono di scegliere significato e struttura. Una parola come yesterday aiuta, ma la scelta dipende dalla frase intera.','I worked yesterday. / At six yesterday I was working.','time-contrasts'],
  ['contrazione','Forma contratta','Unione di parole con apostrofo. Controlla il contesto: he’s può significare he is oppure he has.','He’s working = He is working. / He’s left = He has left.','negatives'],
  ['perfetto','Aspetto perfetto','Costruzione con have e participio passato: guarda a un fatto da un momento di riferimento. Quel momento può essere presente, passato o futuro.','I have finished. / I had finished before she arrived.','present-perfect-simple'],
  ['continuo','Aspetto continuo','Costruzione con be e forma in -ing: presenta un’attività nel suo svolgimento rispetto a un momento di riferimento.','At ten we were checking the gate.','past-continuous'],
  ['verbo-stativo','Verbo stativo','Verbo che descrive uno stato, una conoscenza o un possesso. Molti usi stativi preferiscono forme semplici; il significato può cambiare con la forma continua.','I know the answer. / I am thinking about it.','stative-dynamic'],
  ['modale','Verbo modale','Verbo come can, must, may o should che esprime capacità, obbligo, possibilità o consiglio. È seguito dalla forma base senza to.','You must show your pass.','obligation'],
  ['passivo','Passivo','Costruzione che mette al centro chi o che cosa riceve l’azione: be + participio passato. L’agente può comparire dopo by.','The gate was checked by the patrol.','passive'],
  ['ipotetico','Periodo ipotetico','Collega una condizione e la sua conseguenza. La scelta delle forme dipende da quanto la situazione è presentata come reale, possibile o irreale.','If it rains, we will stay inside.','conditionals-real'],
  ['relativo','Pronome relativo','Parola come who, which o that che collega una proposizione a un nome. Nelle relative identificative l’oggetto può spesso essere omesso.','The officer who called is here.','relatives'],
  ['numerabile','Nome numerabile','Nome che, nel significato considerato, può essere contato e avere singolare e plurale. I non numerabili richiedono altre costruzioni.','Two reports, but some information.','quantifiers'],
  ['collocazione','Collocazione','Combinazione di parole abituale in inglese. Va imparata come insieme, senza tradurre ogni parola isolatamente.','Make a decision; do an exercise.','phrasal-basics'],
  ['phrasal-verb','Phrasal verb','Verbo unito a una o più particelle. Significato e posizione dell’oggetto dipendono dall’uso specifico: controlla la scheda del termine.','Turn the light off. / Turn it off.','phrasal-basics'],
  ['registro','Registro','Scelta linguistica adatta al destinatario e alla situazione: informale, neutra o formale. Una forma più complessa non è automaticamente migliore.','Can you help? / Could you assist us?','hedging'],
  ['coesione','Coesione','Legami linguistici che rendono un testo connesso: pronomi chiari, riferimenti, connettivi e riprese lessicali.','The gate was open. However, nobody entered.','cohesion'],
  ['inversione','Inversione','Ordine in cui l’ausiliare precede il soggetto. Compare nelle domande e in alcune costruzioni enfatiche formali.','Never have I seen this before.','inversion']
].map(([id,label,definition,example,lesson])=>({id,label,definition,example,lesson}));

export function glossaryPage({h,p,card,link,title}) {
  const search=h('input',{type:'search',id:'glossary-search',placeholder:'Cerca: ausiliare, participio, registro…','aria-label':'Cerca nel glossario'});
  const rows=h('div',{class:'glossary-list'});
  const fill=()=>{const q=search.value.trim().toLocaleLowerCase('it');const matches=GLOSSARY.filter(t=>(t.label+' '+t.definition).toLocaleLowerCase('it').includes(q));rows.replaceChildren(...matches.map(t=>h('details',{class:'card',id:'glossary-'+t.id},h('summary',{},t.label),p(t.definition),p(t.example,'formula'),link('Studia la struttura','lesson/'+t.lesson,'text-link'))));if(!matches.length)rows.append(p('Nessuna voce trovata. Prova un termine più breve.'));};
  search.oninput=fill;fill();
  return [title('GLOSSARIO','Le parole della grammatica.','Apri una voce per leggere la spiegazione e un esempio. Tutto è disponibile offline.'),link('Apri il tuo dizionario personale','review','secondary'),search,rows];
}

// Le spiegazioni si aprono accanto alla parola. Nessuna modifica agli esercizi.
export function decorateGlossary(root,h) {
  const terms=[['participio passato','participio-passato'],['forma base','forma-base'],['ausiliare','ausiliare'],['ausiliari','ausiliare'],['infinito','infinito'],['gerundio','gerundio'],['concordanza','concordanza'],['collocazione','collocazione'],['subordinata','subordinata'],['registro','registro']];
  const pattern=new RegExp('\\b('+terms.map(t=>t[0]).join('|')+')\\b','gi');
  for(const el of root.querySelectorAll('p')) {
    if(el.closest('fieldset, .exercise-hint, .glossary-note'))continue;
    for(const node of [...el.childNodes]) {
      if(node.nodeType!==3)continue;
      const text=node.textContent;pattern.lastIndex=0;const matches=[...text.matchAll(pattern)];if(!matches.length)continue;
      const fragment=document.createDocumentFragment();let offset=0;
      for(const m of matches){const t=GLOSSARY.find(t=>t.id===terms.find(([name])=>name===m[0].toLowerCase())[1]);fragment.append(text.slice(offset,m.index));const note=h('span',{class:'glossary-note',hidden:true,role:'note'},t.definition+' '+t.example);const button=h('button',{type:'button',class:'glossary-term','aria-expanded':'false',onclick:e=>{note.hidden=!note.hidden;e.currentTarget.setAttribute('aria-expanded',String(!note.hidden));}},m[0]);fragment.append(button,note);offset=m.index+m[0].length;}
      fragment.append(text.slice(offset));node.replaceWith(fragment);
    }
  }
}
