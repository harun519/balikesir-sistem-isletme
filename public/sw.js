const CACHE='balikesir-portal-v2-private-safe';
const CORE=['/','/manifest.webmanifest','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{for(const u of CORE){try{const r=await fetch(u,{cache:'reload'});if(r.ok)await c.put(u,r)}catch{}}}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('balikesir-portal-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/')||r.headers.has('authorization'))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(async x=>{if(x.ok&&u.pathname==='/')(await caches.open(CACHE)).put(r,x.clone()).catch(()=>{});return x}).catch(async()=>u.pathname==='/'?(await caches.match('/'))||Response.error():new Response('Bu sayfa için internet bağlantısı gerekli.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})));return;}
 if(u.pathname.startsWith('/_next/static/')||/\.(png|svg|jpg|webmanifest)$/.test(u.pathname))e.respondWith(caches.match(r).then(x=>x||fetch(r).then(async y=>{if(y.ok)(await caches.open(CACHE)).put(r,y.clone()).catch(()=>{});return y})));
});
