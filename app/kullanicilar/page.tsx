"use client";

import {FormEvent,useState,type CSSProperties,type ReactNode} from "react";

type Role="admin"|"editor"|"viewer";
type Choice=Role|"none";
type SharedUser={id:string;email:string;trafoRole:Role|null;scadaRole:Role|null;trafoManaged?:boolean;scadaManaged?:boolean;lastSignIn?:string|null};
type TeyitUser={id:string;email:string;role:Role|null;managed?:boolean;lastSignIn?:string|null};
type CrmUser={id:string;username:string;email:string;role:Role;active:boolean;lastLogin:string|null};

const SHARED_URL="https://uxbhhkoxcayjkbsxfabk.supabase.co";
const SHARED_KEY="sb_publishable_IvnK60RCaP2upVGhyijtCA_tkPOvocY";
const TEYIT_URL="https://xyphsavbyhpwkcwmvzgw.supabase.co";
const TEYIT_KEY="sb_publishable_8rhIC0pw3RUGClrdA_etLA_3FK0zzLJ";

async function supabaseLogin(url:string,key:string,email:string,password:string){
 const r=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
 const d=await r.json().catch(()=>({}));
 if(!r.ok||!d.access_token)throw new Error(d?.error_description||d?.msg||"Yönetici girişi başarısız.");
 return String(d.access_token);
}
async function portalCall(target:"shared"|"teyit",token:string,body?:unknown){
 const r=await fetch(`/api/merkezi-kullanicilar?target=${target}`,{method:body?"POST":"GET",headers:{Authorization:`Bearer ${token}`,...(body?{"Content-Type":"application/json"}:{})},body:body?JSON.stringify(body):undefined,cache:"no-store"});
 const d=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(d?.error||"Kullanıcı servisi işlemi başarısız.");
 return d;
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

 const trafoUsers=sharedUsers.filter(u=>u.trafoManaged!==false||!!u.trafoRole);
 const scadaUsers=sharedUsers.filter(u=>u.scadaManaged!==false||!!u.scadaRole);
 const isSharedSelf=(u:SharedUser)=>u.email.toLowerCase()===adminEmail.trim().toLowerCase();
 const isTeyitSelf=(u:TeyitUser)=>u.email.toLowerCase()===adminEmail.trim().toLowerCase();
 const isCrmSelf=(u:CrmUser)=>u.username.toLowerCase()===crmAdmin.trim().toLowerCase()||u.email?.toLowerCase()===crmAdmin.trim().toLowerCase();

 async function crmCall(action:string,payload?:unknown){
  const r=await fetch("/api/crm-yonetim",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:crmAdmin,password:crmPassword,action,payload})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d?.error||"CRM işlemi başarısız.");
  return d;
 }
 async function refreshCrm(){if(!crmConnected&&!crmAdmin)return;const d=await crmCall("users:list");setCrmUsers(d.users||[])}

 async function connectSupabase(e:FormEvent){
  e.preventDefault();setBusy("connect");setMsg("");setError("");
  const notes:string[]=[];let sharedOk=false,teyitOk=false;
  try{
   try{const t=await supabaseLogin(SHARED_URL,SHARED_KEY,adminEmail.trim(),adminPassword);const d=await portalCall("shared",t);setSharedToken(t);setSharedUsers(d.users||[]);sharedOk=true;notes.push("Trafo + SCADA bağlandı")}catch(err:any){setSharedToken("");setSharedUsers([]);notes.push(`Trafo/SCADA: ${err?.message||"bağlanamadı"}`)}
   try{const t=await supabaseLogin(TEYIT_URL,TEYIT_KEY,adminEmail.trim(),adminPassword);const d=await portalCall("teyit",t);setTeyitToken(t);setTeyitUsers(d.users||[]);teyitOk=true;notes.push("Görüntülü Teyit bağlandı")}catch(err:any){setTeyitToken("");setTeyitUsers([]);notes.push(`Görüntülü Teyit: ${err?.message||"bağlanamadı"}`)}
   if(!sharedOk&&!teyitOk)setError(notes.join(" · "));else setMsg(notes.join(" · "));
  }finally{setBusy("");setAdminPassword("")}
 }
 async function connectCrm(e:FormEvent){
  e.preventDefault();setBusy("crmconnect");setMsg("");setError("");
  try{const d=await crmCall("users:list");setCrmUsers(d.users||[]);setCrmConnected(true);setMsg("CRM yönetici bağlantısı kuruldu.")}
  catch(err:any){setCrmConnected(false);setCrmUsers([]);setError(err?.message||"CRM bağlantısı kurulamadı.")}
  finally{setBusy("")}
 }

 async function createCentral(e:FormEvent){
  e.preventDefault();setBusy("create");setMsg("");setError("");
  const email=form.email.trim().toLowerCase(),username=form.username.trim();
  if(!email||!username||form.password.length<6){setBusy("");setError("Kullanıcı adı, geçerli e-posta ve en az 6 karakterli şifre gerekli.");return}
  const ok:string[]=[],fail:string[]=[];
  try{
   if(sharedToken){
    try{const d=await portalCall("shared",sharedToken,{action:"save",email,password:form.password,trafoRole:form.trafo==="none"?null:form.trafo,scadaRole:form.scada==="none"?null:form.scada,trafoManaged:true,scadaManaged:true});setSharedUsers(d.users||[]);ok.push("Trafo/SCADA")}
    catch(err:any){fail.push(`Trafo/SCADA: ${err.message}`)}
   }else if(form.trafo!=="none"||form.scada!=="none")fail.push("Trafo/SCADA yönetici bağlantısı yok");

   if(teyitToken){
    try{const d=await portalCall("teyit",teyitToken,{action:"save",email,password:form.password,role:form.teyit==="none"?null:form.teyit});setTeyitUsers(d.users||[]);ok.push("Görüntülü Teyit")}
    catch(err:any){fail.push(`Görüntülü Teyit: ${err.message}`)}
   }else if(form.teyit!=="none")fail.push("Görüntülü Teyit yönetici bağlantısı yok");

   if(crmConnected){
    try{
     const list=await crmCall("users:list");let existing=(list.users||[]).find((u:CrmUser)=>u.email?.toLowerCase()===email||u.username.toLowerCase()===username.toLowerCase());
     if(form.crm==="none"){
      if(!existing){await crmCall("users:create",{username,email,password:form.password,role:"viewer"});const after=await crmCall("users:list");existing=(after.users||[]).find((u:CrmUser)=>u.email?.toLowerCase()===email||u.username.toLowerCase()===username.toLowerCase())}
      if(existing)await crmCall("users:update",{id:existing.id,active:false,password:form.password});
     }else if(existing)await crmCall("users:update",{id:existing.id,username,email,password:form.password,role:form.crm,active:true});
     else await crmCall("users:create",{username,email,password:form.password,role:form.crm});
     await refreshCrm();ok.push("CRM");
    }catch(err:any){fail.push(`CRM: ${err.message}`)}
   }else if(form.crm!=="none")fail.push("CRM yönetici bağlantısı yok");

   if(ok.length)setMsg(`${username} oluşturuldu/güncellendi: ${ok.join(", ")}.`);
   if(fail.length)setError(fail.join(" · "));
   if(ok.length&&!fail.length)setForm({username:"",email:"",password:"",trafo:"viewer",scada:"viewer",teyit:"viewer",crm:"viewer"});
  }finally{setBusy("")}
 }

 async function changeShared(u:SharedUser,app:"trafo"|"scada",value:Choice){
  if(!sharedToken)return setError("Önce Trafo/SCADA yönetici bağlantısını kur.");
  setBusy(`${app}:${u.id}`);setError("");setMsg("");
  try{
   const t=app==="trafo"?(value==="none"?null:value):u.trafoRole;
   const s=app==="scada"?(value==="none"?null:value):u.scadaRole;
   const d=await portalCall("shared",sharedToken,{action:"save",email:u.email,password:"",trafoRole:t,scadaRole:s,trafoManaged:u.trafoManaged!==false,scadaManaged:u.scadaManaged!==false});
   setSharedUsers(d.users||[]);setMsg(`${u.email} · ${app==="trafo"?"Trafo":"SCADA"} = ${roleText(value)}`);
  }catch(err:any){setError(err.message)}finally{setBusy("")}
 }
 async function removeShared(u:SharedUser,app:"trafo"|"scada"){
  if(!sharedToken)return setError("Önce Trafo/SCADA yönetici bağlantısını kur.");
  const appText=app==="trafo"?"Trafo":"SCADA";
  if(!window.confirm(`${u.email} kullanıcısı ${appText} listesinden silinsin mi? Diğer uygulamadaki hesabı korunur.`))return;
  setBusy(`delete-${app}:${u.id}`);setError("");setMsg("");
  try{const d=await portalCall("shared",sharedToken,{action:"remove-app",id:u.id,app});setSharedUsers(d.users||[]);setMsg(`${u.email} · ${appText} listesinden silindi.`)}catch(err:any){setError(err.message)}finally{setBusy("")}
 }
 async function changeTeyit(u:TeyitUser,value:Choice){
  if(!teyitToken)return setError("Önce Görüntülü Teyit yönetici bağlantısını kur.");
  setBusy(`teyit:${u.id}`);setError("");setMsg("");
  try{const d=await portalCall("teyit",teyitToken,{action:"save",email:u.email,password:"",role:value==="none"?null:value});setTeyitUsers(d.users||[]);setMsg(`${u.email} · Görüntülü Teyit = ${roleText(value)}`)}catch(err:any){setError(err.message)}finally{setBusy("")}
 }
 async function removeTeyit(u:TeyitUser){
  if(!teyitToken)return setError("Önce Görüntülü Teyit yönetici bağlantısını kur.");
  if(!window.confirm(`${u.email} Görüntülü Teyit sisteminden tamamen silinsin mi?`))return;
  setBusy(`delete-teyit:${u.id}`);setError("");setMsg("");
  try{const d=await portalCall("teyit",teyitToken,{action:"delete",id:u.id,deleteAccount:true});setTeyitUsers(d.users||[]);setMsg(`${u.email} · Görüntülü Teyit kullanıcısı silindi.`)}catch(err:any){setError(err.message)}finally{setBusy("")}
 }
 async function changeCrm(u:CrmUser,value:Choice){
  if(!crmConnected)return setError("Önce CRM yönetici bağlantısını kur.");
  setBusy(`crm:${u.id}`);setError("");setMsg("");
  try{if(value==="none")await crmCall("users:update",{id:u.id,active:false});else await crmCall("users:update",{id:u.id,active:true,role:value});await refreshCrm();setMsg(`${u.username} · CRM = ${roleText(value)}`)}catch(err:any){setError(err.message)}finally{setBusy("")}
 }
 async function removeCrm(u:CrmUser){
  if(!crmConnected)return setError("Önce CRM yönetici bağlantısını kur.");
  if(!window.confirm(`${u.username} CRM sisteminden tamamen silinsin mi?`))return;
  setBusy(`delete-crm:${u.id}`);setError("");setMsg("");
  try{await crmCall("users:delete",{id:u.id});await refreshCrm();setMsg(`${u.username} · CRM kullanıcısı silindi.`)}catch(err:any){setError(err.message)}finally{setBusy("")}
 }

 return <main className="page"><div className="wrap">
  <header className="top"><div><div className="eyebrow">BALIKESİR SİSTEM İŞLETME</div><h1>Merkezi Kullanıcı Yönetimi</h1><p>Kullanıcıyı bir kez oluştur, dört uygulamadaki yetkisini ayrı ayrı belirle.</p></div><a href="/">← Portala Dön</a></header>

  <section className="statusGrid">
   <Status icon="⚡" title="Trafo + SCADA" ok={!!sharedToken} text={sharedToken?"Yönetici bağlantısı hazır":"Bağlantı gerekli"}/>
   <Status icon="🎥" title="Görüntülü Teyit" ok={!!teyitToken} text={teyitToken?"Yönetici bağlantısı hazır":"Bağlantı gerekli"}/>
   <Status icon="🗂️" title="CRM Evrak Takibi" ok={crmConnected} text={crmConnected?"Yönetici bağlantısı hazır":"Bağlantı gerekli"}/>
  </section>

  <section className="connections">
   {sharedToken&&teyitToken?<div className="connectBox connected"><div className="connectedMark">✓</div><div><b>Supabase Yönetici Bağlantısı Hazır</b><span>Trafo, SCADA ve Görüntülü Teyit kullanıcıları aşağıda yönetilebilir.</span></div><strong>BAĞLI</strong></div>:<form className="connectBox" onSubmit={connectSupabase}><div><b>Supabase Yönetici Girişi</b><span>Trafo, SCADA ve Görüntülü Teyit için mevcut yönetici hesabın.</span></div><input type="email" placeholder="Yönetici e-posta" value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} required/><input type="password" placeholder="Şifre" value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} required/><button disabled={!!busy}>{busy==="connect"?"Bağlanıyor...":"Bağlan"}</button></form>}
   {crmConnected?<div className="connectBox connected crm"><div className="connectedMark">✓</div><div><b>CRM Yönetici Bağlantısı Hazır</b><span>CRM kullanıcıları aşağıda yönetilebilir.</span></div><strong>BAĞLI</strong></div>:<form className="connectBox crm" onSubmit={connectCrm}><div><b>CRM Yönetici Girişi</b><span>CRM giriş ekranındaki Admin kullanıcı adı ve şifresi.</span></div><input placeholder="CRM Admin kullanıcı adı" value={crmAdmin} onChange={e=>setCrmAdmin(e.target.value)} required/><input type="password" placeholder="Şifre" value={crmPassword} onChange={e=>setCrmPassword(e.target.value)} required/><button disabled={!!busy}>{busy==="crmconnect"?"Bağlanıyor...":"Bağlan"}</button></form>}
  </section>
  <p className="privacy">🔒 Yönetici şifreleri portal veritabanına kaydedilmez; yalnızca bu tarayıcı oturumunda kullanılır.</p>
  {msg&&<div className="alert good">✓ {msg}</div>}{error&&<div className="alert bad">⚠ {error}</div>}

  <section className="createPanel">
   <div className="panelTitle"><div><small>YENİ MERKEZİ HESAP</small><h2>Kullanıcı Oluştur / Güncelle</h2><p>Kapalı seçilen uygulamada hesap saklanır; sonradan tekrar yetki verebilirsin.</p></div><div className="shield">♟</div></div>
   <form onSubmit={createCentral}>
    <div className="identity"><label>Kullanıcı Adı<input value={form.username} onChange={e=>setForm(x=>({...x,username:e.target.value}))} placeholder="Örn. Ahmet Yılmaz" required/></label><label>E-posta<input type="email" value={form.email} onChange={e=>setForm(x=>({...x,email:e.target.value}))} placeholder="ornek@kurum.com" required/></label><label>Şifre<input type="password" minLength={6} value={form.password} onChange={e=>setForm(x=>({...x,password:e.target.value}))} placeholder="En az 6 karakter" required/></label></div>
    <div className="roles"><RoleBox icon="⚡" title="Trafo Değişimi" tone="#2563eb" value={form.trafo} set={v=>setForm(x=>({...x,trafo:v}))}/><RoleBox icon="🖥️" title="SCADA Saha Kontrol" tone="#10b981" value={form.scada} set={v=>setForm(x=>({...x,scada:v}))}/><RoleBox icon="🎥" title="Görüntülü Teyit" tone="#7c3aed" value={form.teyit} set={v=>setForm(x=>({...x,teyit:v}))}/><RoleBox icon="🗂️" title="CRM Evrak Takibi" tone="#0891b2" value={form.crm} set={v=>setForm(x=>({...x,crm:v}))}/></div>
    <button className="createBtn" disabled={!!busy}>{busy==="create"?"Kullanıcı kaydediliyor...":"＋ Kullanıcıyı Oluştur / Güncelle"}</button>
   </form>
  </section>

  <section className="legend"><b>Rol mantığı</b><span><i className="a"/> Admin: tam yetki ve yönetim</span><span><i className="e"/> Editör: kayıt ekleme/düzenleme</span><span><i className="v"/> Görüntüleyici: salt okunur</span><span><i className="n"/> Kapalı: giriş yok, kullanıcı saklanır</span><span><i className="d"/> Sil: kullanıcı kaydı kaldırılır</span></section>

  <section className="apps">
   <AppPanel icon="⚡" title="Trafo Kullanıcıları" tone="#2563eb" ready={!!sharedToken} count={trafoUsers.length} empty="Yönetici bağlantısını kurduğunda Trafo kullanıcıları burada görünür.">
    {trafoUsers.map(u=><UserRow key={`t-${u.id}`} user={<User who={u.email}/>} role={<RoleSelect value={u.trafoRole||"none"} disabled={!!busy} onChange={v=>void changeShared(u,"trafo",v)}/>} onDelete={()=>void removeShared(u,"trafo")} deleteDisabled={!!busy||isSharedSelf(u)}/>) }
   </AppPanel>

   <AppPanel icon="🖥️" title="SCADA Kullanıcıları" tone="#10b981" ready={!!sharedToken} count={scadaUsers.length} empty="Yönetici bağlantısını kurduğunda SCADA kullanıcıları burada görünür.">
    {scadaUsers.map(u=><UserRow key={`s-${u.id}`} user={<User who={u.email}/>} role={<RoleSelect value={u.scadaRole||"none"} disabled={!!busy} onChange={v=>void changeShared(u,"scada",v)}/>} onDelete={()=>void removeShared(u,"scada")} deleteDisabled={!!busy||isSharedSelf(u)}/>) }
   </AppPanel>

   <AppPanel icon="🎥" title="Görüntülü Teyit Kullanıcıları" tone="#7c3aed" ready={!!teyitToken} count={teyitUsers.length} empty="Yönetici bağlantısını kurduğunda Görüntülü Teyit kullanıcıları burada görünür.">
    {teyitUsers.map(u=><UserRow key={u.id} user={<User who={u.email}/>} role={<RoleSelect value={u.role||"none"} disabled={!!busy} onChange={v=>void changeTeyit(u,v)}/>} onDelete={()=>void removeTeyit(u)} deleteDisabled={!!busy||isTeyitSelf(u)}/>) }
   </AppPanel>

   <AppPanel icon="🗂️" title="CRM Kullanıcıları" tone="#0891b2" ready={crmConnected} count={crmUsers.length} empty="CRM yönetici bağlantısını kurduğunda kullanıcılar burada görünür.">
    {crmUsers.map(u=><UserRow key={u.id} user={<User who={u.username} sub={u.email||"E-posta yok"}/>} role={<RoleSelect value={u.active?u.role:"none"} disabled={!!busy} onChange={v=>void changeCrm(u,v)}/>} onDelete={()=>void removeCrm(u)} deleteDisabled={!!busy||isCrmSelf(u)}/>) }
   </AppPanel>
  </section>
 </div><style>{CSS}</style></main>
}

function Status({icon,title,ok,text}:{icon:string;title:string;ok:boolean;text:string}){return <div className="status"><div className="statusIcon">{icon}</div><div><b>{title}</b><span>{text}</span></div><em className={ok?"ok":"off"}>{ok?"BAĞLI":"BEKLİYOR"}</em></div>}
function RoleBox({icon,title,tone,value,set}:{icon:string;title:string;tone:string;value:Choice;set:(v:Choice)=>void}){return <label className="roleBox" style={{"--tone":tone} as CSSProperties}><span>{icon}</span><b>{title}</b><RoleSelect value={value} onChange={set}/></label>}
function User({who,sub}:{who:string;sub?:string}){return <div className="who"><div>{(who||"?").slice(0,1).toUpperCase()}</div><p><b>{who||"Kullanıcı"}</b><span>{sub||"Portal hesabı"}</span></p></div>}
function UserRow({user,role,onDelete,deleteDisabled}:{user:ReactNode;role:ReactNode;onDelete:()=>void;deleteDisabled?:boolean}){return <div className="userRow single"><div>{user}</div><label>Yetki{role}</label><button className="deleteBtn" type="button" disabled={deleteDisabled} onClick={onDelete} title={deleteDisabled?"Bağlı yönetici hesabı silinemez":"Kullanıcıyı sil"}>Sil</button></div>}
function AppPanel({icon,title,tone,ready,empty,count,children}:{icon:string;title:string;tone:string;ready:boolean;empty:string;count:number;children:ReactNode}){return <article className="appPanel" style={{"--tone":tone} as CSSProperties}><div className="appHead"><div><span>{icon}</span><h3>{title}</h3><b className="count">{ready?count:0}</b></div><em className={ready?"ok":"off"}>{ready?"BAĞLI":"BAĞLANTI YOK"}</em></div>{!ready?<div className="empty">{empty}</div>:count===0?<div className="empty">Henüz kullanıcı yok.</div>:<div className="userList">{children}</div>}</article>}

const CSS=`
*{box-sizing:border-box}body{margin:0;background:#071426;font-family:Inter,Arial,Helvetica,sans-serif}.page{min-height:100vh;color:#fff;background:radial-gradient(circle at 50% -15%,#173d61,#071426 58%);padding:30px 16px 55px}.wrap{width:min(1280px,100%);margin:auto}.top{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:18px}.eyebrow{font-size:11px;font-weight:900;letter-spacing:3px;color:#86a4c0}.top h1{font-size:34px;margin:5px 0}.top p{margin:0;color:#b2c5d7;font-size:13px}.top>a{color:#fff;text-decoration:none;border:1px solid #ffffff20;background:#ffffff0c;padding:11px 15px;border-radius:11px;font-size:12px;font-weight:900}.statusGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.status,.connectBox,.createPanel,.appPanel,.legend{border:1px solid #ffffff14;background:linear-gradient(180deg,#112b45,#0a1d30);box-shadow:0 14px 36px #0003}.status{border-radius:14px;padding:14px;display:flex;align-items:center;gap:11px}.statusIcon{width:44px;height:44px;border-radius:11px;background:#ffffff0d;display:grid;place-items:center;font-size:21px}.status>div:nth-child(2){flex:1}.status b,.status span{display:block}.status b{font-size:14px}.status span{margin-top:4px;font-size:11px;color:#9db4c9}.status em,.appHead em{font-style:normal;font-size:9px;font-weight:900;padding:6px 9px;border-radius:20px}.ok{background:#064e3b;color:#86efac}.off{background:#3f4858;color:#cbd5e1}.connections{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.connectBox{border-radius:14px;padding:13px;display:grid;grid-template-columns:1.2fr 1fr 1fr auto;gap:8px;align-items:center}.connectBox b,.connectBox span{display:block}.connectBox b{font-size:14px}.connectBox span{font-size:11px;color:#9db4c9;margin-top:4px;line-height:1.35}.connectBox input,.identity input,.roleBox select,.userRow select{height:40px;border:1px solid #ffffff1c;background:#081b2d;color:#fff;border-radius:9px;padding:0 10px;outline:0}.connectBox button{height:40px;border:0;border-radius:9px;background:#2563eb;color:#fff;font-weight:900;padding:0 14px;cursor:pointer}.connectBox.crm button{background:#0891b2}.connectBox.connected{grid-template-columns:auto 1fr auto;background:linear-gradient(180deg,#0b3d36,#0a302d);border-color:#1c8a72}.connectBox.connected.crm{background:linear-gradient(180deg,#0b3541,#0a2a35);border-color:#1389a6}.connectBox.connected strong{font-size:11px;letter-spacing:1px;color:#86efac;background:#065f46;padding:8px 11px;border-radius:999px}.connectedMark{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:#10b981;color:#fff;font-size:22px;font-weight:900}.privacy{margin:10px 2px 0;color:#9db4c9;font-size:11px}.alert{margin-top:10px;padding:12px 14px;border-radius:11px;font-size:12px;font-weight:800}.alert.good{background:#064e3b88;color:#a7f3d0;border:1px solid #34d39944}.alert.bad{background:#7f1d1d88;color:#fecaca;border:1px solid #fb718544}.createPanel{margin-top:14px;border-radius:18px;padding:18px}.panelTitle{display:flex;align-items:center;justify-content:space-between}.panelTitle small{font-size:10px;letter-spacing:2px;color:#60a5fa;font-weight:900}.panelTitle h2{font-size:22px;margin:5px 0}.panelTitle p{font-size:12px;color:#a9bdd0;margin:0}.shield{width:46px;height:46px;border-radius:13px;display:grid;place-items:center;background:#2563eb;font-size:22px}.identity{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:9px;margin-top:16px}.identity label{font-size:12px;font-weight:900;color:#d0dce7}.identity input{display:block;width:100%;margin-top:6px}.roles{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:12px}.roleBox{border:1px solid #ffffff12;border-top:3px solid var(--tone);border-radius:13px;background:#ffffff06;padding:12px}.roleBox>span,.roleBox>b{display:block}.roleBox>span{font-size:22px}.roleBox>b{font-size:13px;margin:8px 0 10px}.roleBox select{width:100%;height:36px}.createBtn{width:100%;height:46px;margin-top:12px;border:0;border-radius:11px;background:linear-gradient(90deg,#1677e8,#0758b8);color:#fff;font-size:15px;font-weight:900;cursor:pointer}.createBtn:disabled,.connectBox button:disabled,.deleteBtn:disabled{opacity:.45;cursor:not-allowed}.legend{margin-top:10px;border-radius:13px;padding:13px 15px;display:flex;align-items:center;gap:18px;flex-wrap:wrap;font-size:12px;color:#c0d0df}.legend>b{color:#fff}.legend span{display:flex;align-items:center;gap:5px}.legend i{width:8px;height:8px;border-radius:50%}.legend .a{background:#ef4444}.legend .e{background:#f59e0b}.legend .v{background:#22c55e}.legend .n{background:#64748b}.legend .d{background:#dc2626}.apps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}.appPanel{border-radius:16px;border-top:3px solid var(--tone);overflow:hidden}.appHead{display:flex;align-items:center;justify-content:space-between;padding:14px 15px;border-bottom:1px solid #ffffff10}.appHead>div{display:flex;align-items:center;gap:9px}.appHead h3{margin:0;font-size:16px}.appHead>div>span{font-size:20px}.count{min-width:25px;height:25px;border-radius:999px;background:#ffffff12;display:grid;place-items:center;font-size:11px;color:#dce7f1}.empty{padding:28px;text-align:center;color:#9bb0c4;font-size:12px}.userList{padding:4px 13px 13px;max-height:500px;overflow:auto}.userRow{align-items:end;padding:11px 2px;border-bottom:1px solid #ffffff0d}.userRow.single{display:grid;grid-template-columns:minmax(0,1fr) 155px 70px;gap:9px}.userRow label{font-size:11px;color:#a9bdd0;font-weight:900}.userRow select{display:block;width:100%;height:39px;margin-top:5px;font-size:13px}.who{display:flex;align-items:center;gap:9px;min-width:0;min-height:44px}.who>div{width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:grid;place-items:center;background:#ffffff10;font-size:11px;font-weight:900}.who p{margin:0;min-width:0}.who b,.who span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.who b{font-size:13px}.who span{font-size:10px;color:#91a7bc;margin-top:4px}.deleteBtn{height:39px;border:1px solid #ef444455;background:#7f1d1d66;color:#fecaca;border-radius:9px;font-size:12px;font-weight:900;cursor:pointer}.deleteBtn:not(:disabled):hover{background:#991b1b}.deleteBtn:disabled{border-color:#ffffff10;background:#ffffff08;color:#6f8295}@media(max-width:1050px){.connections{grid-template-columns:1fr}.connectBox{grid-template-columns:1fr 1fr 1fr auto}.roles{grid-template-columns:repeat(2,1fr)}}@media(max-width:820px){.apps{grid-template-columns:1fr}}@media(max-width:700px){.page{padding:20px 10px 45px}.top{align-items:flex-start;flex-direction:column}.top h1{font-size:27px}.statusGrid{grid-template-columns:1fr}.connectBox{grid-template-columns:1fr}.connections{gap:8px}.identity{grid-template-columns:1fr}.roles{grid-template-columns:1fr 1fr}.legend{gap:10px}.userRow.single{grid-template-columns:1fr 1fr}.userRow.single>div:first-child{grid-column:1/-1}.deleteBtn{align-self:end}.createPanel{padding:14px}}@media(max-width:430px){.roles{grid-template-columns:1fr}.userRow.single{grid-template-columns:1fr}.userRow.single>div:first-child{grid-column:auto}.deleteBtn{width:100%}}
`;
