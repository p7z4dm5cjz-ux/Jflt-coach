// JFLT Coach — service worker: l'app funziona offline dopo il primo caricamento.
// Ogni cache dell'app ha questo prefisso: si eliminano solo le versioni vecchie
// dell'app, mai le cache di altre applicazioni sullo stesso dominio.
const PREFIX = "jflt-coach-";
const VERSION = `${PREFIX}0.2.1`;
const SHELL = [
  "./", "index.html", "app.js", "core.js", "data.js", "schema.js", "manifest.webmanifest",
  "catalog.js", "learning.js", "studio.js", "ai-client.js", "ui.js", "theme.css",
  "icon-180.png", "icon-192.png", "icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache prima della rete per i file dell'app; le pagine esterne (ChatGPT) non passano di qui.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url=new URL(req.url),scope=new URL(self.registration.scope);
  if (req.method !== "GET" || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  e.respondWith(
    caches.open(VERSION).then(c=>c.match(req, { ignoreSearch: true })).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => (req.mode === "navigate" ? caches.open(VERSION).then(c=>c.match("index.html")) : Response.error()));
    })
  );
});
