const C='tinywins-ios-v1',F=["./", "./index.html", "./style.css", "./sounds.js", "./core.js", "./ios.js", "./manifest.json", "./icon.svg", "./favicon.svg", "./icon-192.png", "./icon-512.png", "./icon-maskable-192.png", "./icon-maskable-512.png", "./apple-touch-icon.png", "./favicon-32.png"];
// Splash images are cached when Safari asks for them (cache-as-you-go), app files up front.
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('tinywins-ios')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Only same-origin GETs. Lofi streams (cross-origin, range requests) always go to the network.
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==self.location.origin||r.headers.has('range'))return;
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(h=>h||fetch(r).then(res=>{if(res.ok&&u.pathname.includes('/splash/')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>r.mode==='navigate'?caches.match('./index.html'):Response.error())))});
