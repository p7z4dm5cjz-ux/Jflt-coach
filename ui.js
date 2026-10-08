// Piccole icone vettoriali locali: nessuna libreria o richiesta di rete.
const paths={
  book:'<path d="M4 5h7l1 2 1-2h7v15h-7l-1 1-1-1H4z"/><path d="M12 7v14M7 10h2M15 10h2M7 14h2M15 14h2"/>',
  review:'<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/><path d="M12 8v4l3 2"/>',
  lexicon:'<path d="M5 4h14v16H5zM8 8h8M8 12h3M8 16h5"/>',
  writing:'<path d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3M13 20h7"/>',
  article:'<path d="M5 4h14v16H5zM8 8h8M8 12h3M13 12h3M8 16h8"/>',
  arrow:'<path d="M5 12h14M14 7l5 5-5 5"/>'
};
export const icon=name=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name]||paths.book}</svg>`;
