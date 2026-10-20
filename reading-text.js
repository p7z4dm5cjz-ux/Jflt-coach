// Preserve every non-whitespace character, even when a single sentence exceeds the API limit.
export function splitParagraphs(text){
 const out=[];
 for(const block of String(text).split(/\n\s*\n/).map(t=>t.replace(/\s+/g,' ').trim()).filter(Boolean)){
  let rest=block;
  while(rest.length>3000){let end=rest.lastIndexOf(' ',3000);if(end<1500)end=3000;out.push(rest.slice(0,end));rest=rest.slice(end).trimStart();}
  if(rest)out.push(rest);
 }
 return out;
}
export function termContext(text,term,max=1200){
 const at=text.toLowerCase().indexOf(term.trim().toLowerCase());
 if(at<0)throw new Error('La parola deve comparire nel testo: selezionala o copiala dal passaggio.');
 const start=Math.max(0,Math.min(at-Math.floor((max-term.length)/2),text.length-max));
 return text.slice(start,start+max);
}
