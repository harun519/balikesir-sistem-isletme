import {NextRequest,NextResponse} from "next/server";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const SHARED_URL="https://uxbhhkoxcayjkbsxfabk.supabase.co";
const SHARED_KEY="sb_publishable_IvnK60RCaP2upVGhyijtCA_tkPOvocY";
const TEYIT_URL="https://xyphsavbyhpwkcwmvzgw.supabase.co";
const TEYIT_KEY="sb_publishable_8rhIC0pw3RUGClrdA_etLA_3FK0zzLJ";

const allowedOrigins=new Set([
 "https://balikesir-sistem-isletme.vercel.app",
 "https://balikesir-trafo-degisimi.vercel.app",
 "https://scada-saha-kontrol-vercel.vercel.app",
 "https://goruntulu-teyit-v1.vercel.app",
 "http://localhost:3000",
 "http://localhost:3001",
]);
function cors(req:NextRequest){const origin=req.headers.get("origin")||"";return {"Access-Control-Allow-Origin":allowedOrigins.has(origin)?origin:"https://balikesir-sistem-isletme.vercel.app","Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin","Cache-Control":"no-store"}}
function json(req:NextRequest,body:unknown,status=200){return NextResponse.json(body,{status,headers:cors(req)})}
async function supabaseLogin(url:string,key:string,email:string,password:string){const r=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:"POST",cache:"no-store",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});if(!r.ok)return null;const d=await r.json().catch(()=>({})) as any;return d?.access_token?String(d.access_token):null}
async function supabaseChange(url:string,key:string,token:string,newPassword:string){const r=await fetch(`${url}/auth/v1/user`,{method:"PUT",cache:"no-store",headers:{apikey:key,Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({password:newPassword})});return r.ok}
export async function OPTIONS(req:NextRequest){return new NextResponse(null,{status:204,headers:cors(req)})}
export async function POST(req:NextRequest){const body=await req.json().catch(()=>({})) as any;const identity=String(body.identity||body.email||"").trim().toLowerCase();const currentPassword=String(body.currentPassword||"");const newPassword=String(body.newPassword||"");if(!identity||!identity.includes("@"))return json(req,{ok:false,error:"Geçerli e-posta adresi gerekli."},400);if(currentPassword.length<4)return json(req,{ok:false,error:"Mevcut şifre gerekli."},400);if(newPassword.length<8)return json(req,{ok:false,error:"Yeni şifre en az 8 karakter olmalı."},400);if(newPassword===currentPassword)return json(req,{ok:false,error:"Yeni şifre mevcut şifreyle aynı olamaz."},400);const [sharedToken,teyitToken]=await Promise.all([supabaseLogin(SHARED_URL,SHARED_KEY,identity,currentPassword),supabaseLogin(TEYIT_URL,TEYIT_KEY,identity,currentPassword)]);if(!sharedToken&&!teyitToken)return json(req,{ok:false,error:"Mevcut şifre doğrulanamadı. E-posta veya şifreyi kontrol edin."},401);const updated:string[]=[],failed:string[]=[];if(sharedToken){(await supabaseChange(SHARED_URL,SHARED_KEY,sharedToken,newPassword)?updated:failed).push("Trafo / SCADA")}if(teyitToken){(await supabaseChange(TEYIT_URL,TEYIT_KEY,teyitToken,newPassword)?updated:failed).push("Görüntülü Teyit")}if(!updated.length)return json(req,{ok:false,error:"Şifre doğrulandı ancak güncelleme tamamlanamadı.",failed},502);return json(req,{ok:true,updated,failed,message:failed.length?`Şifre güncellendi: ${updated.join(", ")}. Güncellenemeyen: ${failed.join(", ")}.`:`Şifreniz ${updated.join(", ")} sistemlerinde güncellendi.`})}
