import {NextResponse} from "next/server";

export const dynamic="force-dynamic";

type Payload={ok?:boolean;database?:boolean;lastDataAt?:string|null;lastBackupAt?:string|null;lastBackupName?:string|null;latencyMs?:number;checkedAt?:string;error?:string;version?:string};

async function read(url:string){
  const started=Date.now();
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),8000);
    const r=await fetch(url,{cache:"no-store",signal:controller.signal,headers:{"Cache-Control":"no-cache"}});
    clearTimeout(timer);
    const data=await r.json().catch(()=>({})) as Payload;
    return {reachable:r.ok&&data?.ok!==false,ms:Date.now()-started,...data};
  }catch(err:any){return {reachable:false,ms:Date.now()-started,error:err?.message||"Servise ulaşılamadı"}}
}

export async function GET(){
  const [trafo,scada,teyit]=await Promise.all([
    read("https://balikesir-trafo-degisimi.vercel.app/api/health"),
    read("https://scada-saha-kontrol-vercel.vercel.app/api/health"),
    read("https://goruntulu-teyit-v1.vercel.app/api/version")
  ]);
  return NextResponse.json({ok:true,checkedAt:new Date().toISOString(),systems:{trafo,scada,teyit}},{headers:{"Cache-Control":"no-store"}})
}
