// Shared descriptions; the Worker selects these trusted goals by block number.
export const BLOCK_GOALS=[
  {title:"Riconosci il significato",goal:"Distingui quando e perché usare la struttura; rendi decisivo il contesto temporale o comunicativo."},
  {title:"Costruisci la forma",goal:"Costruisci affermazioni, negazioni e domande con gli ausiliari corretti."},
  {title:"Trasforma senza cambiare senso",goal:"Trasforma o correggi la frase conservando tempo, soggetto e significato richiesti."},
  {title:"Usa la regola nel contesto",goal:"Completa brevi contesti professionali fittizi; spiega il collegamento fra forma e significato."},
  {title:"Scegli in un ripasso misto",goal:"Mescola i nuclei della lezione e i contrasti pertinenti in contesti nuovi, senza suggerire la soluzione."}
];
export function blockGoal(page=0){return BLOCK_GOALS[Math.max(0,Math.min(4,Number.isInteger(page)?page:0))];}
