import {NextRequest,NextResponse} from "next/server";

export const runtime="nodejs";
export const dynamic="force-dynamic";
export const maxDuration=60;

const CRM="https://crm-evrak-takip.vercel.app";

function fail(error:string,status=400){return NextResponse.json({ok:false,error},{status,headers:{"Cache-Control":"no-store"}})}

async function crmSession(username:string,password:string){
 const r=await fetch(`${CRM}/api/crm-auth`,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"login",username,password,remember:false})});
 const data=await r.json().catch(()=>({}));
 if(!r.ok||data?.user?.role!=="admin")throw Object.assign(new Error(data?.error||"CRM yönetici girişi başarısız."),{status:r.status||401});
 const raw=r.headers.get("set-cookie")||"";
 const cookie=raw.split(";")[0];
 if(!cookie.startsWith("crm_session="))throw Object.assign(new Error("CRM yönetici oturumu oluşturulamadı."),{status:401});
 return cookie;
}

async function callCrm(cookie:string,path:string,init:RequestInit={}){
 const r=await fetch(`${CRM}${path}`,{...init,cache:"no-store",headers:{Cookie:cookie,"Content-Type":"application/json",...(init.headers||{})}});
 const text=await r.text();
 let data:any;try{data=JSON.parse(text)}catch{data={raw:text}}
 if(!r.ok)throw Object.assign(new Error(data?.error||"CRM işlemi başarısız."),{status:r.status});
 return data;
}

export async function POST(req:NextRequest){
 try{
  const body=await req.json().catch(()=>({}));
  const username=String(body?.username||"").trim();
  const password=String(body?.password||"");
  const action=String(body?.action||"");
  if(!username||!password)return fail("CRM yönetici kullanıcı adı ve şifresi gerekli.",401);
  const cookie=await crmSession(username,password);

  if(action==="users:list")return NextResponse.json(await callCrm(cookie,"/api/crm-users"),{headers:{"Cache-Control":"no-store"}});
  if(action==="users:create")return NextResponse.json(await callCrm(cookie,"/api/crm-users",{method:"POST",body:JSON.stringify(body.payload||{})}),{headers:{"Cache-Control":"no-store"}});
  if(action==="users:update")return NextResponse.json(await callCrm(cookie,"/api/crm-users",{method:"PATCH",body:JSON.stringify(body.payload||{})}),{headers:{"Cache-Control":"no-store"}});
  if(action==="users:delete")return NextResponse.json(await callCrm(cookie,"/api/crm-users",{method:"DELETE",body:JSON.stringify(body.payload||{})}),{headers:{"Cache-Control":"no-store"}});
  if(action==="recovery:status")return NextResponse.json(await callCrm(cookie,"/api/crm-recovery"),{headers:{"Cache-Control":"no-store"}});
  if(action==="recovery:download")return NextResponse.json({ok:true,backup:await callCrm(cookie,"/api/crm-recovery?download=1")},{headers:{"Cache-Control":"no-store"}});
  if(action==="recovery:create")return NextResponse.json(await callCrm(cookie,"/api/crm-recovery",{method:"POST",body:JSON.stringify({action:"create"})}),{headers:{"Cache-Control":"no-store"}});
  if(action==="recovery:restore-stored")return NextResponse.json(await callCrm(cookie,"/api/crm-recovery",{method:"POST",body:JSON.stringify({action:"restore-stored",backupId:body?.payload?.backupId})}),{headers:{"Cache-Control":"no-store"}});
  if(action==="recovery:restore")return NextResponse.json(await callCrm(cookie,"/api/crm-recovery",{method:"POST",body:JSON.stringify(body.payload||{})}),{headers:{"Cache-Control":"no-store"}});
  return fail("Desteklenmeyen CRM yönetim işlemi.");
 }catch(error:any){return fail(error?.message||"CRM yönetim işlemi başarısız.",Number(error?.status)||500)}
}
