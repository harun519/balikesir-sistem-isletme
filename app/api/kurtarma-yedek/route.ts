import {NextRequest,NextResponse} from "next/server";

export const runtime="nodejs";
export const dynamic="force-dynamic";
export const maxDuration=60;

const SB_URL="https://uxbhhkoxcayjkbsxfabk.supabase.co";
const SB_KEY="sb_publishable_IvnK60RCaP2upVGhyijtCA_tkPOvocY";
const endpoints={
  trafo:"https://balikesir-trafo-degisimi.vercel.app/api/sunucu-yedek",
  scada:"https://scada-saha-kontrol-vercel.vercel.app/api/backup",
  teyit:"https://goruntulu-teyit-v1.vercel.app/api/backup",
} as const;
type AppKey=keyof typeof endpoints;

function fail(error:string,status=400){return NextResponse.json({ok:false,error},{status,headers:{"Cache-Control":"no-store"}})}
function bearer(req:NextRequest){const value=req.headers.get("authorization")||"";return value.startsWith("Bearer ")?value.slice(7).trim():""}
function appKey(value:unknown):AppKey|null{return typeof value==="string"&&value in endpoints?value as AppKey:null}

async function requireAdmin(req:NextRequest){
  const token=bearer(req);if(!token)throw Object.assign(new Error("Admin oturumu gerekli."),{status:401});
  const authHeader=`Bearer ${token}`;
  const userRes=await fetch(`${SB_URL}/auth/v1/user`,{headers:{apikey:SB_KEY,Authorization:authHeader},cache:"no-store"});
  const user=await userRes.json().catch(()=>null);
  if(!userRes.ok||!user?.id)throw Object.assign(new Error("Oturum doğrulanamadı."),{status:401});
  const profileRes=await fetch(`${SB_URL}/rest/v1/app_users?id=eq.${encodeURIComponent(user.id)}&select=role,email`,{headers:{apikey:SB_KEY,Authorization:authHeader,Accept:"application/json"},cache:"no-store"});
  const rows=await profileRes.json().catch(()=>[]);
  if(!profileRes.ok||!Array.isArray(rows)||rows[0]?.role!=="admin")throw Object.assign(new Error("Bu bölüm yalnızca admin kullanıcılar içindir."),{status:403});
  return {token,email:String(rows[0]?.email||user.email||"")};
}

async function callApp(app:AppKey,token:string,init:RequestInit={}){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),55000);
  try{
    const response=await fetch(endpoints[app],{
      ...init,
      cache:"no-store",
      signal:controller.signal,
      headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json",...(init.headers||{})}
    });
    const data=await response.json().catch(()=>({error:"Uygulama geçersiz cevap verdi."}));
    if(!response.ok)throw Object.assign(new Error(String(data?.error||"Yedek servisi işlemi reddetti.")),{status:response.status});
    return data;
  }finally{clearTimeout(timer)}
}

export async function GET(req:NextRequest){
  try{
    const admin=await requireAdmin(req);
    const app=appKey(new URL(req.url).searchParams.get("app"));
    if(!app)return fail("Geçerli bir uygulama seçilmedi.");
    const data=await callApp(app,admin.token);
    return NextResponse.json({ok:true,app,backups:Array.isArray(data?.backups)?data.backups:[],count:Number(data?.count||0),retention:Number(data?.retention||0)},{headers:{"Cache-Control":"no-store"}});
  }catch(error:any){return fail(error?.message||"Yedek listesi alınamadı.",Number(error?.status)||500)}
}

export async function POST(req:NextRequest){
  try{
    const admin=await requireAdmin(req);
    const body=await req.json().catch(()=>({}));
    const app=appKey(body?.app);
    if(!app)return fail("Geçerli bir uygulama seçilmedi.");
    if(body?.action!=="restore")return fail("Desteklenmeyen işlem.");
    const path=typeof body?.path==="string"?body.path.trim():"";
    if(!path||path.includes("..")||!path.endsWith(".json"))return fail("Geçerli bir yedek seçilmedi.");
    if(body?.confirm!=="GERI YUKLE")return fail("Geri yükleme onayı geçersiz.");
    const data=await callApp(app,admin.token,{method:"POST",body:JSON.stringify({action:"restore",path,confirm:"GERI YUKLE"})});
    if(!data?.safetyBackup)throw Object.assign(new Error("Güvenlik yedeği doğrulanamadığı için işlem tamamlanmış sayılmadı."),{status:502});
    return NextResponse.json({ok:true,app,restored:data.restored||path,safetyBackup:data.safetyBackup,restoredAt:data.restoredAt||new Date().toISOString(),summary:data.summary||null},{headers:{"Cache-Control":"no-store"}});
  }catch(error:any){return fail(error?.name==="AbortError"?"Geri yükleme zaman aşımına uğradı. Mevcut veriyi değiştirmeden önce uygulama durumunu kontrol edin.":error?.message||"Geri yükleme başarısız.",Number(error?.status)||500)}
}
