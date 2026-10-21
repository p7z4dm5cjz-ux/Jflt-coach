// Un solo confronto per pretest, esercizi e prove di conferma.
export function normal(value) {
  return String(value??"").normalize("NFKC").toLowerCase().replace(/[‘’]/g,"'").replace(/\bwon't\b/g,"will not").replace(/\bshan't\b/g,"shall not").replace(/\bcan't\b/g,"cannot").replace(/\bcan\s+not\b(?!\s+(?:only|just)\b)/g,"cannot").replace(/\b([a-z]+)n't\b/g,"$1 not").replace(/\bi'm\b/g,"i am").replace(/\b(i|you|we|they|could|should|would|might|must)'ve\b/g,"$1 have").replace(/\b(i|you|we|they|he|she|it)'ll\b/g,"$1 will").replace(/\b(you|we|they)'re\b/g,"$1 are").trim().replace(/[.,!?;:]+$/g,"").replace(/\s+/g," ").trim();
}
export function correct(item,answer) {
  // Nel riordino la virgola che separa un complemento o una subordinata iniziale
  // non deve trasformare una variante già approvata in un errore. Non estendere
  // questa tolleranza alle relative: lì le virgole possono cambiare il senso.
  if(!item.options?.length&&/metti le parole in ordine/i.test(String(item.stem??item.question??""))){
    const withoutCommas=v=>String(v??"").replace(/,/g," ");
    const plain={...item,stem:"",question:"",answer:withoutCommas(item.answer),accept:(item.accept||[]).map(withoutCommas)};
    return correct(plain,withoutCommas(answer));
  }
  if(item.case_sensitive){const exact=v=>String(v??"").normalize("NFKC").replace(/[‘’]/g,"'").replace(/\s+/g," ").trim().replace(/[.!?]+$/,"");return [item.answer,...(item.accept||[])].some(v=>exact(v)===exact(answer));}
  const variants=value=>{const text=String(value??"").replace(/[‘’]/g,"'");return [text,text.replace(/\b(he|she|it|that|there)'s\b/gi,"$1 is"),text.replace(/\b(he|she|it|that|there)'s\b/gi,"$1 has"),text.replace(/\b(i|you|we|they|he|she|it)'d\b/gi,"$1 had"),text.replace(/\b(i|you|we|they|he|she|it)'d\b/gi,"$1 would")].map(normal);};
  const candidates=variants(answer);
  const keys=[item.answer,...(item.accept||[])].filter(v=>typeof v==="string");
  if(keys.some(v=>variants(v).some(value=>candidates.includes(value))))return true;
  // Frase intera al posto delle sole parole mancanti: è giusta se coincide con la frase
  // dell'esercizio completata con una soluzione accettata. Non vale per le scelte multiple.
  return gapSentences(item,keys).some(v=>variants(v).some(value=>candidates.includes(value)));
}
export function gapSentences(item,keys=[item.answer,...(item.accept||[])]){
  if(!item||item.options?.length)return [];
  const stem=String(item.stem??item.question??""),runs=stem.match(/_{2,}(?:\s+_{2,})*/g);
  if(!runs||runs.length!==1)return [];
  const at=stem.indexOf(runs[0]),colon=stem.lastIndexOf(": ",at);
  let sentence=stem.slice(colon<0?0:colon+2).trim();
  while(/\s*\([^()]*\)\s*$/.test(sentence))sentence=sentence.replace(/\s*\([^()]*\)\s*$/,"").trim();
  if(!sentence.includes(runs[0])||sentence.split(/\s+/).length<3)return [];
  return keys.filter(v=>typeof v==="string"&&v.trim()).map(v=>sentence.replace(runs[0],v.trim()));
}

// Indicazione mostrata sotto ogni risposta aperta: dice se scrivere solo le parole mancanti
// o tutta la frase. Ricavata dall'esercizio, senza rivelare la soluzione.
export function answerHint(item) {
  if(!item||item.options?.length)return null;
  const stem=String(item.stem||item.question||""),gap=/_{2,}/.test(stem);
  if(/(?:tutta|intera|completa) la frase|frase (?:intera|completa)/i.test(stem))return "Scrivi tutta la frase.";
  if(/scrivi solo/i.test(stem))return gap?"Scrivi solo ciò che va al posto di ___, non tutta la frase.":"Scrivi soltanto le parole richieste dalla consegna.";
  if(gap)return "Scrivi solo ciò che va al posto di ___, non tutta la frase.";
  if(item.kind==="retrieval")return "Scrivi la parola o l’espressione richiesta.";
  if(["transformation","error_correction"].includes(item.kind))return "Scrivi tutta la frase.";
  return "Scrivi la risposta richiesta dalla consegna.";
}
