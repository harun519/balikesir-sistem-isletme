import {NextRequest,NextResponse} from "next/server";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const endpoints={
 shared:"https://balikesir-trafo-degisimi.vercel.app/api/portal-kullanicilar",
 teyit:"https://goruntulu-teyit-v1.vercel.app/api/portal-users",
} as const;
type Target=keyof typeof endpoints;
function target(v:string|null):Target|null{return v&&v in endpoints?v as Target:null}
function fail(error:string,status=400){return NextResponse.json({ok:false,error},{status,headers:{"Cache-Control":"no-store"}})}
function bearer(req:NextRequest){const h=req.headers.get("authorization")||"";return h.startsWith("Bearer ")?h:""}
async function relay(url:string,auth:string,init:RequestInit={}){
 const r=await fetch(url,{...init,cache:"no-store",headers:{Authorization:auth,"Content-Type":"application/json",...(init.headers||{})}});
 const text=await r.text();let data:any;try{data=JSON.parse(text)}catch{data={raw:text}}
 return NextResponse.json(data,{status:r.status,headers:{"Cache-Control":"no-store"}});
}
export async function GET(req:NextRequest){
 const t=target(new URL(req.url).searchParams.get("target"));if(!t)return fail("Geçerli hedef gerekli.");
 const auth=bearer(req);if(!auth)return fail("Yönetici oturumu gerekli.",401);
 return relay(endpoints[t],auth);
}
export async function POST(req:NextRequest){
 const t=target(new URL(req.url).searchParams.get("target"));if(!t)return fail("Geçerli hedef gerekli.");
 const auth=bearer(req);if(!auth)return fail("Yönetici oturumu gerekli.",401);
 const body=await req.text();return relay(endpoints[t],auth,{method:"POST",body});
}
