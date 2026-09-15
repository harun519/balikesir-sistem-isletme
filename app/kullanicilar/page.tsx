"use client";

import {FormEvent,useState} from "react";

type Role="admin"|"editor"|"viewer";
type Choice=Role|"none";
type SharedUser={id:string;email:string;trafoRole:Role|null;scadaRole:Role|null;lastSignIn?:string|null};
type TeyitUser={id:string;email:string;role:Role;lastSignIn?:string|null};
type CrmUser={id:string;username:string;email:string;role:Role;active:boolean;lastLogin:string|null};

const SHARED_URL="https://uxbhhkoxcayjkbsxfabk.supabase.co";
const SHARED_KEY="sb_publishable_IvnK60RCaP2upVGhyijtCA_tkPOvocY";
const TEYIT_URL="https://xyphsavbyhpwkcwmvzgw.supabase.co";
const TEYIT_KEY="sb_publishable_8rhIC0pw3RUGClrdA_etLA_3FK0zzLJ";

async function supabaseLogin(url:string,key:string,email:string,password:string){
 const r=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
 const d=await r.json().catch(()=>({}));if(!r.ok||!d.access_token)throw new Error(d?.error_description||d?.msg||"Yönetici girişi başarısız.");return String(d.access_token);
}
async function portalCall(target:"shared"|"teyit",token:string,body?:unknown){
 const r=await fetch(`/api/merkezi-kullanicilar?target=${target}`,{method:body?"POST":"GET",headers:{Authorization:`Bearer ${token}`,...(body?{"Content-Type":"application/json"}:{})},body:body?JSON.stringify(body):undefined,cache:"no-store"});
 const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error||"Kullanıcı servisi işlemi başarısız.");return d;
}
const roleText=(r:Choice|null|undefined)=>r==="admin"?"Admin":r==="editor"?"Editör":r==="viewer"?"Görüntüleyici":"Kapalı";
const RoleSelect=({value,onChange,disabled=false}:{value:Choice;onChange:(v:Choice)=>void;disabled?:boolean})=><select value={value} disabled={disabled} onChange={e=>onChange(e.target.value as Choice)}><option value="none">Kapalı</option><option value="admin">Admin</option><option value="editor">Editör</option><option value="viewer">Görüntüleyici</option></select>;

export default function Kullanicilar(){
 const [adminEmail,setAdminEmail]=useState(""),[adminPassword,setAdminPassword]=useState("");
 const [sharedToken,setSharedToken]=useState(""),[teyitToken,setTeyitToken]=useState("");
 const [sharedUsers,setSharedUsers]=useState<SharedUser[]>([]),[teyitUsers,setTeyitUsers]=useState<TeyitUser[]>([]);
 const [crmAdmin,setCrmAdmin]=useState(""),[crmPassword,setCrmPassword]=useState(""),[crmConnected,setCrmConnected]=useState(false),[crmUsers,setCrmUsers]=useState<CrmUser[]>([]);
 const [busy,setBusy]=useState(""),[msg,setMsg]=useState(""),[error,setError]=useState("");
 const [form,setForm]=useState({username:"",email:"",password:"",trafo:"viewer" as Choice,scada:"viewer" as Choice,teyit:"viewer" as Choice,crm:"viewer" as Choice});

 async function crmCall(action:string,payload?:unknown){
  const r=await fetch("/api/crm-yonetim",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:crmAdmin,password:crmPassword,action,payload})});
  const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error||"CRM işlemi başarısız.");return d;
 }
 async function refreshShared(token=sharedToken){if(!token)return;const d=await portalCall("shared",token);setSharedUsers(d.users||[])}
 async function refreshTeyit(token=teyitToken){if(!token)return;const d=await portalCall("teyit",token);setTeyitUsers(d.users||[])}
 async function refreshCrm(){if(!crmConnected&&!crmAdmin)return;const d=await crmCall("users:list");setCrmUsers(d.users||[])}

 async function connectSupabase(e:FormEvent){
  e.preventDefault();setBusy("connect");setMsg("");setError("");
  const notes:string[]=[];
  try{
   try{const t=await supabaseLogin(SHARED_URL,SHARED_KEY,adminEmail.trim(),adminPassword);const d=await portalCall("shared",t);setSharedToken(t);setSharedUsers(d.users||[]);notes.push("Trafo + SCADA bağlandı")}catch(err:any){setSharedToken("");notes.push(`Trafo/SCADA: ${err?.message||"bağlanamadı"}`)}
   try{const t=await supabaseLogin(TEYIT_URL,TEYIT_KEY,adminEmail.trim(),adminPassword);const d=await portalCall("teyit",t);setTeyitToken(t);setTeyitUsers(d.users||[]);notes.push("Görüntülü Teyit bağlandı")}catch(err:any){setTeyitToken("");notes.push(`Görüntülü Teyit: ${err?.message||"bağlanamadı"}`)}
   if(!sharedToken&&!teyitToken&&notes.every(x=>x.includes(":")))setError(notes.join(" · "));else setMsg(notes.join(" · "));
  }finally{setBusy("");setAdminPassword("")}
 }
 async function connectCrm(e:FormEvent){e.preventDefault();setBusy("crmconnect");setMsg("");setError("");try{const d=await crmCall("users:list");setCrmUsers(d.users||[]);setCrmConnected(true);setMsg("CRM yönetici bağlantısı kuruldu.")}catch(err:any){setCrmConnected(false);setError(err?.message||"CRM bağlantısı kurulamadı.")}finally{setBusy("")}}

 async function createCentral(e:FormEvent){
  e.preventDefault();setBusy("create");setMsg("");setError("");
  const email=form.email.trim().toLowerCase(),username=form.username.trim();
  if(!email||!username||form.password.length<6){setBusy("");setError("Kullanıcı adı, geçerli e-posta ve en az 6 karakterli şifre gerekli.");return}
  if([form.trafo,form.scada,form.teyit,form.crm].every(x=>x==="none")){setBusy("");setError("En az bir uygulama için yetki seçmelisin.");return}
  const ok:string[]=[],fail:string[]=[];
  try{
   if(form.trafo!=="none"||form.scada!=="none"){
    if(!sharedToken)fail.push("Trafo/SCADA yönetici bağlantısı yok");
    else try{const d=await portalCall("shared",sharedToken,{action:"save",email,password:form.password,trafoRole:form.trafo==="none"?null:form.trafo,scadaRole:form.scada==="none"?null:form.scada});setSharedUsers(d.users||[]);ok.push("Trafo/SCADA")}catch(err:any){fail.push(`Trafo/SCADA: ${err.message}`)}
   }
   if(form.teyit!=="none"){
    if(!teyitToken)fail.push("Görüntülü Teyit yönetici bağlantısı yok");
    else try{const d=await portalCall("teyit",teyitToken,{action:"save",email,password:form.password,role:form.teyit});setTeyitUsers(d.users||[]);ok.push("Görüntülü Teyit")}catch(err:any){fail.push(`Görüntülü Teyit: ${err.message}`)}
   }
   if(form.crm!=="none"){
    if(!crmConnected)fail.push("CRM yönetici bağlantısı yok");
    else try{
     const list=await crmCall("users:list");const existing=(list.users||[]).find((u:CrmUser)=>u.email?.toLowerCase()===email||u.username.toLowerCase()===username.toLowerCase());
     if(existing)await crmCall("users:update",{id:existing.id,username,email,password:form.password,role:form.crm,active:true});
     else await crmCall("users:create",{username,email,password:form.password,role:form.crm});
     await refreshCrm();ok.push("CRM");
    }catch(err:any){fail.push(`CRM: ${err.message}`)}
   }
   if(ok.length)setMsg(`${username} oluşturuldu/güncellendi: ${ok.join(", ")}.`);
   if(fail.length)setError(fail.join(" · "));
   if(ok.length&&!fail.length)setForm({username:"",email:"",password:"",trafo:"viewer",scada:"viewer",teyit:"viewer",crm:"viewer"});
  }finally{setBusy("")}
 }

 async function changeShared(u:SharedUser,app:"trafo"|"scada",value:Choice){
  if(!sharedToken)return setError("Önce Trafo/SCADA yönetici bağlantısını kur.");setBusy(`${app}:${u.id}`);setError("");setMsg("");
  try{const t=app==="trafo"?(value==="none"?null:value):u.trafoRole;const s=app==="scada"?(value==="none"?null:value):u.scadaRole;let d;if(!t&&!s)d=await portalCall("shared",sharedToken,{action:"delete",id:u.id,deleteAccount:false});else d=await portalCall("shared",sharedToken,{action:"save",email:u.email,password:"",trafoRole:t,scadaRole:s});setSharedUsers(d.users||[]);setMsg(`${u.email} · ${app==="trafo"?"Trafo":"SCADA"} = ${roleText(value)}`)}catch(err:any){setError(err.message)}finally{setBusy("")}
 }
 async function changeTeyit(u:TeyitUser,value:Choice){
  if(!teyitToken)return setError("Önce Görüntülü Teyit yönetici bağlantısını kur.");setBusy(`teyit:${u.id}`);setError("");setMsg("");
  try{const d=value==="none"?await portalCall("teyit",teyitToken,{action:"delete",id:u.id,deleteAccount:false}):await portalCall("teyit",teyitToken,{action:"save",email:u.email,password:"",role:value});setTeyitUsers(d.users||[]);setMsg(`${u.email} · Görüntülü Teyit = ${roleText(value)}`)}catch(err:any){setError(err.message)}finally{setBusy("")}
 }
 async function changeCrm(u:CrmUser,value:Choice){
  if(!crmConnected)return setError("Önce CRM yönetici bağlantısını kur.");setBusy(`crm:${u.id}`);setError("");setMsg("");
  try{if(value==="none")await crmCall("users:update",{id:u.id,active:false});else await crmCall("users:update",{id:u.id,active:true,role:value});await refreshCrm();setMsg(`${u.username} · CRM = ${roleText(value)}`)}catch(err:any){setError(err.message)}finally{setBusy("")}
 }

 return <main className="page"><div className="wrap">
  <header className="top"><div><div className="eyebrow">BALIKESİR SİSTEM İŞLETME</div><h1>Merkezi Kullanıcı Yönetimi</h1><p>Kullanıcıyı bir kez oluştur, dört uygulamadaki yetkisini buradan belirle.</p></div><a href="/">← Portala Dön</a></header>

  <section className="statusGrid">
   <Status icon="⚡" title="Trafo + SCADA" ok={!!sharedToken} text={sharedToken?"Yönetici bağlantısı hazır":"Bağlantı gerekli"}/>
   <Status icon="🎥" title="Görüntülü Teyit" ok={!!teyitToken} text={teyitToken?"Yönetici bağlantısı hazır":"Bağlantı gerekli"}/>
   <Status icon="🗂️" title="CRM Evrak Takibi" ok={crmConnected} text={crmConnected?"Yönetici bağlantısı hazır":"Bağlantı gerekli"}/>
  </section>

  <section className="connections">
   <form className="connectBox" onSubmit={connectSupabase}><div><b>Supabase Yönetici Girişi</b><span>Trafo, SCADA ve Görüntülü Teyit için mevcut yönetici hesabın.</span></div><input type="email" placeholder="Yönetici e-posta" value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} required/><input type="password" placeholder="Şifre" value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} required/><button disabled={!!busy}>{busy==="connect"?"Bağlanıyor...":"Bağlan"}</button></form>
   <form className="connectBox crm" onSubmit={connectCrm}><div><b>CRM Yönetici Girişi</b><span>CRM giriş ekranındaki Admin kullanıcı adı ve şifresi.</span></div><input placeholder="CRM Admin kullanıcı adı" value={crmAdmin} onChange={e=>setCrmAdmin(e.target.value)} required/><input type="password" placeholder="Şifre" value={crmPassword} onChange={e=>setCrmPassword(e.target.value)} required/><button disabled={!!busy}>{busy==="crmconnect"?"Bağlanıyor...":"Bağlan"}</button></form>
  </section>
  <p className="privacy">🔒 Yönetici şifreleri portal veritabanına kaydedilmez; yalnızca bu tarayıcı oturumunda kullanılır.</p>
  {msg&&<div className="alert good">✓ {msg}</div>}{error&&<div className="alert bad">⚠ {error}</div>}

  <section className="createPanel">
   <div className="panelTitle"><div><small>YENİ MERKEZİ HESAP</small><h2>Kullanıcı Oluştur / Güncelle</h2><p>Aynı e-posta ve şifre seçtiğin uygulamalarda geçerli olur.</p></div><div className="shield">♟</div></div>
   <form onSubmit={createCentral}>
    <div className="identity"><label>Kullanıcı Adı<input value={form.username} onChange={e=>setForm(x=>({...x,username:e.target.value}))} placeholder="Örn. Ahmet Yılmaz" required/></label><label>E-posta<input type="email" value={form.email} onChange={e=>setForm(x=>({...x,email:e.target.value}))} placeholder="ornek@kurum.com" required/></label><label>Şifre<input type="password" minLength={6} value={form.password} onChange={e=>setForm(x=>({...x,password:e.target.value}))} placeholder="En az 6 karakter" required/></label></div>
    <div className="roles"><RoleBox icon="⚡" title="Trafo Değişimi" tone="#2563eb" value={form.trafo} set={v=>setForm(x=>({...x,trafo:v}))}/><RoleBox icon="🖥️" title="SCADA Saha Kontrol" tone="#10b981" value={form.scada} set={v=>setForm(x=>({...x,scada:v}))}/><RoleBox icon="🎥" title="Görüntülü Teyit" tone="#7c3aed" value={form.teyit} set={v=>setForm(x=>({...x,teyit:v}))}/><RoleBox icon="🗂️" title="CRM Evrak Takibi" tone="#0891b2" value={form.crm} set={v=>setForm(x=>({...x,crm:v}))}/></div>
    <button className="createBtn" disabled={!!busy}>{busy==="create"?"Kullanıcı kaydediliyor...":"＋ Kullanıcıyı Oluştur / Güncelle"}</button>
   </form>
  </section>

  <section className="legend"><b>Rol mantığı</b><span><i className="a"/> Admin: tam yetki ve yönetim</span><span><i className="e"/> Editör: kayıt ekleme/düzenleme</span><span><i className="v"/> Görüntüleyici: salt okunur</span><span><i className="n"/> Kapalı: uygulamaya giriş yok</span></section>

  <section className="apps">
   <AppPanel icon="⚡ 🖥️" title="Trafo + SCADA Kullanıcıları" tone="#2563eb" ready={!!sharedToken} empty="Yönetici bağlantısını kurduğunda kullanıcılar burada görünür.">
    {sharedUsers.map(u=><div className="userRow" key={u.id}><User who={u.email}/><label>Trafo<RoleSelect value={u.trafoRole||"none"} disabled={!!busy} onChange={v=>void changeShared(u,"trafo",v)}/></label><label>SCADA<RoleSelect value={u.scadaRole||"none"} disabled={!!busy} onChange={v=>void changeShared(u,"scada",v)}/></label></div>)}
   </AppPanel>
   <AppPanel icon="🎥" title="Görüntülü Teyit Kullanıcıları" tone="#7c3aed" ready={!!teyitToken} empty="Yönetici bağlantısını kurduğunda kullanıcılar burada görünür.">
    {teyitUsers.map(u=><div className="userRow two" key={u.id}><User who={u.email}/><label>Yetki<RoleSelect value={u.role} disabled={!!busy} onChange={v=>void changeTeyit(u,v)}/></label></div>)}
   </AppPanel>
   <AppPanel icon="🗂️" title="CRM Kullanıcıları" tone="#0891b2" ready={crmConnected} empty="CRM yönetici bağlantısını kurduğunda kullanıcılar burada görünür.">
    {crmUsers.map(u=><div className="userRow two" key={u.id}><User who={u.username} sub={u.email||"E-posta yok"}/><label>Yetki<RoleSelect value={u.active?u.role:"none"} disabled={!!busy} onChange={v=>void changeCrm(u,v)}/></label></div>)}
   </AppPanel>
  </section>
 </div><style>{CSS}</style></main>
}

function Status({icon,title,ok,text}:{icon:string;title:string;ok:boolean;text:string}){return <div className="status"><div className="statusIcon">{icon}</div><div><b>{title}</b><span>{text}</span></div><em className={ok?"ok":"off"}>{ok?"BAĞLI":"BEKLİYOR"}</em></div>}
function RoleBox({icon,title,tone,value,set}:{icon:string;title:string;tone:string;value:Choice;set:(v:Choice)=>void}){return <label className="roleBox" style={{"--tone":tone} as React.CSSProperties}><span>{icon}</span><b>{title}</b><RoleSelect value={value} onChange={set}/></label>}
function User({who,sub}:{who:string;sub?:string}){return <div className="who"><div>{(who||"?").slice(0,1).toUpperCase()}</div><p><b>{who||"Kullanıcı"}</b><span>{sub||"Portal hesabı"}</span></p></div>}
function AppPanel({icon,title,tone,ready,empty,children}:{icon:string;title:string;tone:string;ready:boolean;empty:string;children:React.ReactNode}){return <article className="appPanel" style={{"--tone":tone} as React.CSSProperties}><div className="appHead"><div><span>{icon}</span><h3>{title}</h3></div><em className={ready?"ok":"off"}>{ready?"BAĞLI":"BAĞLANTI YOK"}</em></div>{!ready?<div className="empty">{empty}</div>:<div className="userList">{children}</div>}</article>}

const CSS=`
*{box-sizing:border-box}body{margin:0;background:#071426;font-family:Inter,Arial,Helvetica,sans-serif}.page{min-height:100vh;color:#fff;background:radial-gradient(circle at 50% -15%,#173d61,#071426 58%);padding:30px 16px 55px}.wrap{width:min(1240px,100%);margin:auto}.top{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:18px}.eyebrow{font-size:10px;font-weight:900;letter-spacing:3px;color:#86a4c0}.top h1{font-size:34px;margin:5px 0}.top p{margin:0;color:#a8bfd3;font-size:12px}.top>a{color:#fff;text-decoration:none;border:1px solid #ffffff20;background:#ffffff0c;padding:10px 14px;border-radius:11px;font-size:11px;font-weight:900}.statusGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.status,.connectBox,.createPanel,.appPanel,.legend{border:1px solid #ffffff14;background:linear-gradient(180deg,#112b45,#0a1d30);box-shadow:0 14px 36px #0003}.status{border-radius:14px;padding:13px;display:flex;align-items:center;gap:10px}.statusIcon{width:42px;height:42px;border-radius:11px;background:#ffffff0d;display:grid;place-items:center;font-size:20px}.status>div:nth-child(2){flex:1}.status b,.status span{display:block}.status b{font-size:12px}.status span{margin-top:4px;font-size:9px;color:#8fa8c0}.status em,.appHead em{font-style:normal;font-size:7px;font-weight:900;padding:5px 8px;border-radius:20px}.ok{background:#064e3b;color:#86efac}.off{background:#3f4858;color:#cbd5e1}.connections{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.connectBox{border-radius:14px;padding:12px;display:grid;grid-template-columns:1.2fr 1fr 1fr auto;gap:8px;align-items:center}.connectBox b,.connectBox span{display:block}.connectBox b{font-size:11px}.connectBox span{font-size:8px;color:#8fa8c0;margin-top:3px}.connectBox input,.identity input,.roleBox select,.userRow select{height:38px;border:1px solid #ffffff1c;background:#081b2d;color:#fff;border-radius:9px;padding:0 10px;outline:0}.connectBox button{height:38px;border:0;border-radius:9px;background:#2563eb;color:#fff;font-weight:900;padding:0 14px;cursor:pointer}.connectBox.crm button{background:#0891b2}.privacy{margin:8px 2px 0;color:#718aa3;font-size:8px}.alert{margin-top:10px;padding:11px 13px;border-radius:11px;font-size:10px;font-weight:800}.alert.good{background:#064e3b88;color:#a7f3d0;border:1px solid #34d39944}.alert.bad{background:#7f1d1d88;color:#fecaca;border:1px solid #fb718544}.createPanel{margin-top:14px;border-radius:18px;padding:18px}.panelTitle{display:flex;align-items:center;justify-content:space-between}.panelTitle small{font-size:8px;letter-spacing:2px;color:#60a5fa;font-weight:900}.panelTitle h2{font-size:20px;margin:4px 0}.panelTitle p{font-size:9px;color:#8fa8c0;margin:0}.shield{width:46px;height:46px;border-radius:13px;display:grid;place-items:center;background:#2563eb;font-size:22px}.identity{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:9px;margin-top:16px}.identity label{font-size:9px;font-weight:900;color:#a8bfd3}.identity input{display:block;width:100%;margin-top:6px}.roles{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:12px}.roleBox{border:1px solid #ffffff12;border-top:3px solid var(--tone);border-radius:13px;background:#ffffff06;padding:11px}.roleBox>span,.roleBox>b{display:block}.roleBox>span{font-size:21px}.roleBox>b{font-size:10px;margin:6px 0 8px}.roleBox select{width:100%;height:34px}.createBtn{width:100%;height:44px;margin-top:12px;border:0;border-radius:11px;background:linear-gradient(90deg,#1677e8,#0758b8);color:#fff;font-weight:900;cursor:pointer}.createBtn:disabled,.connectBox button:disabled{opacity:.55}.legend{margin-top:10px;border-radius:13px;padding:11px 14px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;font-size:9px;color:#a8bfd3}.legend>b{color:#fff}.legend span{display:flex;align-items:center;gap:5px}.legend i{width:8px;height:8px;border-radius:50%}.legend .a{background:#ef4444}.legend .e{background:#f59e0b}.legend .v{background:#22c55e}.legend .n{background:#64748b}.apps{display:grid;grid-template-columns:1.15fr .85fr .85fr;gap:10px;margin-top:10px}.appPanel{border-radius:16px;border-top:3px solid var(--tone);overflow:hidden}.appHead{display:flex;align-items:center;justify-content:space-between;padding:13px 14px;border-bottom:1px solid #ffffff10}.appHead>div{display:flex;align-items:center;gap:8px}.appHead h3{margin:0;font-size:12px}.appHead>div>span{font-size:19px}.empty{padding:25px;text-align:center;color:#7890a8;font-size:9px}.userList{padding:4px 12px 12px;max-height:470px;overflow:auto}.userRow{display:grid;grid-template-columns:minmax(0,1fr) 130px 130px;gap:8px;align-items:end;padding:10px 2px;border-bottom:1px solid #ffffff0d}.userRow.two{grid-template-columns:minmax(0,1fr) 135px}.userRow label{font-size:7px;color:#7f96ad;font-weight:900}.userRow select{display:block;width:100%;height:33px;margin-top:4px;font-size:9px}.who{display:flex;align-items:center;gap:8px;min-width:0}.who>div{width:32px;height:32px;flex:0 0 32px;border-radius:50%;display:grid;place-items:center;background:#ffffff10;font-size:10px;font-weight:900}.who p{margin:0;min-width:0}.who b,.who span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.who b{font-size:10px}.who span{font-size:7px;color:#7890a8;margin-top:3px}@media(max-width:1050px){.connections{grid-template-columns:1fr}.connectBox{grid-template-columns:1fr 1fr 1fr auto}.apps{grid-template-columns:1fr}.roles{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.page{padding:20px 10px 45px}.top{align-items:flex-start;flex-direction:column}.top h1{font-size:27px}.statusGrid{grid-template-columns:1fr}.connectBox{grid-template-columns:1fr}.connections{gap:8px}.identity{grid-template-columns:1fr}.roles{grid-template-columns:1fr 1fr}.legend{gap:10px}.userRow,.userRow.two{grid-template-columns:1fr 1fr}.who{grid-column:1/-1}.createPanel{padding:14px}}@media(max-width:430px){.roles{grid-template-columns:1fr}.userRow,.userRow.two{grid-template-columns:1fr}.who{grid-column:auto}}
`;
