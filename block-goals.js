// Shared descriptions; the Worker selects these trusted goals by block number.
export const BLOCK_GOALS=[
  {title:"Parti dalle basi",goal:"I primi cinque esercizi sono semplici: costruisci la forma, un solo obiettivo alla volta, soggetti diversi. Il sesto introduce una difficoltà in più. Usa distrattori plausibili nella stessa struttura, non tempi palesemente estranei."},
  {title:"Costruisci la forma",goal:"Aumenta rispetto ai primi cinque: costruisci la forma completa e interpreta il significato con meno parole già fornite. Non aumentare solo la lunghezza."},
  {title:"Trasforma senza cambiare senso",goal:"Trasforma o correggi la frase conservando il significato e gli elementi richiesti dalla consegna."},
  {title:"Usa la regola nel contesto",goal:"Completa brevi contesti professionali fittizi; spiega il collegamento fra forma e significato."},
  {title:"Scegli in un ripasso misto",goal:"Livello più impegnativo: mescola strutture vicine in contesti nuovi. Non nominare la forma da scegliere. Se più forme sono possibili, chiedi il significato o una parafrasi precisa anziché imporre una soluzione unica."}
];
export function blockGoal(page=0){return BLOCK_GOALS[Math.max(0,Math.min(4,Number.isInteger(page)?page:0))];}
