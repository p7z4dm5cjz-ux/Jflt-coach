const CACHE="jflt-shell-"+VERSION+"-"+REVISION;
const assetUrls=ASSETS.map(asset=>new URL(asset.path,self.registration.scope).href);
async function cacheAsset(cache,asset) {
  const response=await fetch(new Request(asset.path,{cache:"reload"}));
  if(!response.ok)throw new Error("Incomplete shell: "+asset.path);
  const bytes=await response.clone().arrayBuffer();
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",bytes)),b=>b.toString(16).padStart(2,"0")).join("");
  if(digest!==asset.hash)throw new Error("Release non coerente: "+asset.path);
  await cache.put(asset.path,response);
}
self.addEventListener("install",event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  const required=await Promise.allSettled(ASSETS.filter(asset=>asset.required).map(asset=>cacheAsset(cache,asset)));
  const failure=required.find(result=>result.status==="rejected");
  if(failure){await caches.delete(CACHE);throw failure.reason;}
  await Promise.all(ASSETS.filter(asset=>!asset.required).map(asset=>cacheAsset(cache,asset).catch(()=>{})));
  if((await caches.keys()).some(key=>key.startsWith("jflt-coach-0.")))await self.skipWaiting();
})()));
self.addEventListener("activate",event=>event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key!==CACHE&&(key.startsWith("jflt-shell-")||key.startsWith("jflt-coach-")))await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener("message",event=>{if(event.data?.type==="SKIP_WAITING"||event.data==="SKIP_WAITING")self.skipWaiting();});
self.addEventListener("fetch",event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=="GET"||url.origin!==self.location.origin)return;
  if(request.mode==="navigate"&&url.href.startsWith(self.registration.scope)){
    event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match("./index.html"))||fetch(request)));return;
  }
  if(assetUrls.includes(url.href))event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(request))||fetch(request)));
});
