// Un solo confronto per pretest, esercizi e prove di conferma.
export function normal(value) {
  return String(value??"").normalize("NFKC").toLowerCase().replace(/[‘’]/g,"'").replace(/\bwon't\b/g,"will not").replace(/\bshan't\b/g,"shall not").replace(/\bcan't\b/g,"cannot").replace(/\bcan\s+not\b(?!\s+(?:only|just)\b)/g,"cannot").replace(/\b([a-z]+)n't\b/g,"$1 not").replace(/\bi'm\b/g,"i am").replace(/\b(i|you|we|they|could|should|would|might|must)'ve\b/g,"$1 have").replace(/\b(i|you|we|they|he|she|it)'ll\b/g,"$1 will").replace(/\b(you|we|they)'re\b/g,"$1 are").trim().replace(/[.,!?;:]+$/g,"").replace(/\s+/g," ").trim();
}
export function correct(item,answer) {
  if(item.case_sensitive){const exact=v=>String(v??"").normalize("NFKC").replace(/[‘’]/g,"'").replace(/\s+/g," ").trim().replace(/[.!?]+$/,"");return [item.answer,...(item.accept||[])].some(v=>exact(v)===exact(answer));}
  const variants=value=>{const text=String(value??"").replace(/[‘’]/g,"'");return [text,text.replace(/\b(he|she|it|that|there)'s\b/gi,"$1 is"),text.replace(/\b(he|she|it|that|there)'s\b/gi,"$1 has"),text.replace(/\b(i|you|we|they|he|she|it)'d\b/gi,"$1 had"),text.replace(/\b(i|you|we|they|he|she|it)'d\b/gi,"$1 would")].map(normal);};
  const candidates=variants(answer);
  return [item.answer,...(item.accept||[])].filter(v=>typeof v==="string").some(v=>variants(v).some(value=>candidates.includes(value)));
}

// Indicazione mostrata sotto ogni risposta aperta: dice se scrivere solo le parole mancanti
// o tutta la frase. Ricavata dall'esercizio, senza rivelare la soluzione.
export function answerHint(item) {
  if(!item||item.options?.length)return null;
  const stem=String(item.stem||item.question||""),answer=String(item.answer||"").trim(),gap=/_{2,}/.test(stem);
  const sentence=answer.split(/\s+/).length>=3&&/^[A-Z]/.test(answer);
  if(!gap||sentence&&["transformation","error_correction"].includes(item.kind))return "Scrivi tutta la frase.";
  return "Scrivi solo ciò che va al posto di ___, non tutta la frase.";
}
