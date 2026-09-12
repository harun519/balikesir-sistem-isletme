"use client";

import {FormEvent,useMemo,useState} from "react";

type Role="admin"|"editor"|"viewer";
type Row={id:string;email:string|null;role:Role};
type AppKey="trafo"|"scada"|"teyit";

const TRAFO_URL="https://uxbhhkoxcayjkbsxfabk.supabase.co";
const TRAFO_KEY="sb_publishable_IvnK60RCaP2upVGhyijtCA_tkPOvocY";
const TEYIT_URL="https://xyphsavbyhpwkcwmvzgw.supabase.co";
const TEYIT_KEY="sb_publishable_8rhIC0pw3RUGClrdA_etLA_3FK0zzLJ";

async function login(url:string,key:string,email:string,password:string){
  const r=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||!d.access_token)throw new Error(d?.error_description||d?.msg||"Giriş başarısız.");
  return String(d.access_token);
}
async function readRows(url:string,key:string,token:string,table:string){
  const r=await fetch(`${url}/rest/v1/${table}?select=id,email,role&order=email.asc`,{headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"});
  if(!r.ok)throw new Error(await r.text());
  return await r.json() as Row[];
}
async function patchRole(url:string,key:string,token:string,table:string,id:string,role:Role){
  const r=await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",headers:{apikey:key,Authorization:`Bearer ${token}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({role,updated_at:new Date().toISOString()})});
  if(!r.ok)throw new Error(await r.text());
}

export default function Kullanicilar(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false); const [msg,setMsg]=useState("");
  const [trafoToken,setTrafoToken]=useState(""); const [teyitToken,setTeyitToken]=useState("");
  const [trafo,setTrafo]=useState<Row[]>([]); const [scada,setScada]=useState<Row[]>([]); const [teyit,setTeyit]=useState<Row[]>([]);
  const [active,setActive]=useState<AppKey>("trafo"); const [saving,setSaving]=useState("");
  const connected=!!trafoToken;

  const current=useMemo(()=>active==="trafo"?trafo:active==="scada"?scada:teyit,[active,trafo,scada,teyit]);

  async function connect(e:FormEvent){e.preventDefault();setBusy(true);setMsg("");try{
    const t1=await login(TRAFO_URL,TRAFO_KEY,email.trim(),password);setTrafoToken(t1);
    const [a,s]=await Promise.all([readRows(TRAFO_URL,TRAFO_KEY,t1,"app_users"),readRows(TRAFO_URL,TRAFO_KEY,t1,"scada_users")]);setTrafo(a);setScada(s);
    try{const t2=await login(TEYIT_URL,TEYIT_KEY,email.trim(),password);setTeyitToken(t2);setTeyit(await readRows(TEYIT_URL,TEYIT_KEY,t2,"gt_users"));setMsg("Üç uygulamanın kullanıcıları yüklendi.")}catch{setMsg("Trafo ve SCADA bağlandı. Görüntülü Teyit için bu hesapta parola girişi doğrulanamadı.")}
  }catch(err:any){setMsg(err?.message||"Bağlantı kurulamadı.")}finally{setBusy(false)}}

  async function changeRole(app:AppKey,row:Row,role:Role){
    const key=`${app}:${row.id}`;setSaving(key);setMsg("");try{
      if(app==="trafo")await patchRole(TRAFO_URL,TRAFO_KEY,trafoToken,"app_users",row.id,role);
      if(app==="scada")await patchRole(TRAFO_URL,TRAFO_KEY,trafoToken,"scada_users",row.id,role);
      if(app==="teyit"){if(!teyitToken)throw new Error("Görüntülü Teyit yönetici bağlantısı yok.");await patchRole(TEYIT_URL,TEYIT_KEY,teyitToken,"gt_users",row.id,role)}
      const fn=app==="trafo"?setTrafo:app==="scada"?setScada:setTeyit;fn((old:Row[])=>old.map(x=>x.id===row.id?{...x,role}:x));setMsg(`${row.email||"Kullanıcı"} yetkisi kaydedildi.`)
    }catch(err:any){setMsg(err?.message||"Yetki kaydedilemedi.")}finally{setSaving("")}}

  const meta={trafo:{icon:"⚡",name:"Trafo Değişimi",roles:["admin","editor","viewer"] as Role[],tone:"#2563eb"},scada:{icon:"🖥️",name:"SCADA Saha Kontrol",roles:["admin","viewer"] as Role[],tone:"#10b981"},teyit:{icon:"🎥",name:"Görüntülü Teyit",roles:["admin","viewer"] as Role[],tone:"#7c3aed"}}[active];

  return <main className="page"><div className="wrap"><div className="top"><div><div className="eyebrow">BALIKESİR SİSTEM İŞLETME</div><h1>Kullanıcı & Yetki Merkezi</h1><p>Üç uygulamanın kullanıcı rollerini tek ekrandan yönet.</p></div><a href="/">← Portala Dön</a></div>

    {!connected&&<form className="login" onSubmit={connect}><div><b>🔐 Yönetici bağlantısı</b><small>Mevcut yönetici e-posta ve şifrenle bağlan. Şifre portalda saklanmaz.</small></div><input type="email" placeholder="Yönetici e-posta" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Şifre" value={password} onChange={e=>setPassword(e.target.value)} required/><button disabled={busy}>{busy?"Bağlanıyor...":"Kullanıcıları Getir"}</button></form>}
    {msg&&<div className="message">{msg}</div>}

    <section className="grid">
      <button type="button" className={`card blue ${active==="trafo"?"active":""}`} onClick={()=>setActive("trafo")}><div className="icon">⚡</div><div><small>UYGULAMA 1</small><b>Trafo Değişimi</b><span>Admin · Editör · Görüntüleyici</span></div><em>Yönet ↓</em></button>
      <button type="button" className={`card green ${active==="scada"?"active":""}`} onClick={()=>setActive("scada")}><div className="icon">🖥️</div><div><small>UYGULAMA 2</small><b>SCADA Saha Kontrol</b><span>Admin · Görüntüleyici</span></div><em>Yönet ↓</em></button>
      <button type="button" className={`card purple ${active==="teyit"?"active":""}`} onClick={()=>setActive("teyit")}><div className="icon">🎥</div><div><small>UYGULAMA 3</small><b>Görüntülü Teyit</b><span>Admin · Görüntüleyici</span></div><em>Yönet ↓</em></button>
    </section>

    <section className="manager" style={{"--tone":meta.tone} as React.CSSProperties}><div className="managerHead"><div><h2>{meta.icon} {meta.name}</h2><p>{connected?`${current.length} kullanıcı bulundu.`:"Önce yönetici bağlantısını kur."}</p></div><span>{active==="teyit"?(teyitToken?"BAĞLI":"BAĞLANTI YOK"):(trafoToken?"BAĞLI":"BAĞLANTI YOK")}</span></div>
      {!connected?<div className="empty">Kullanıcı listesi için yukarıdan yönetici hesabıyla bağlan.</div>:active==="teyit"&&!teyitToken?<div className="empty">Görüntülü Teyit yönetici hesabı bu parola ile doğrulanamadı. Trafo ve SCADA yönetimi çalışmaya devam eder.</div>:current.length===0?<div className="empty">Kullanıcı bulunamadı.</div>:<div className="table">{current.map(r=><div className="userrow" key={r.id}><div className="avatar">{(r.email||"?").slice(0,1).toUpperCase()}</div><div className="who"><b>{r.email||"E-posta yok"}</b><small>{r.id.slice(0,8)}…</small></div><select value={r.role} disabled={saving===`${active}:${r.id}`} onChange={e=>changeRole(active,r,e.target.value as Role)}>{meta.roles.map(x=><option value={x} key={x}>{x==="admin"?"Admin":x==="editor"?"Editör":"Görüntüleyici"}</option>)}</select><span className={`saveState ${saving===`${active}:${r.id}`?"working":""}`}>{saving===`${active}:${r.id}`?"Kaydediliyor…":"Aktif"}</span></div>)}</div>}
    </section>
    <div className="note"><b>Yetkiler uygulama bazında ayrıdır.</b> Trafo ve SCADA aynı Supabase hesabını kullanır ama rolleri ayrı tablolarda tutulur. Görüntülü Teyit ayrı Supabase projesindedir ve kendi rol tablosundan yönetilir.</div>
  </div><style>{`*{box-sizing:border-box}body{margin:0;background:#071426;font-family:Arial,Helvetica,sans-serif}.page{min-height:100vh;background:radial-gradient(circle at 50% -20%,#15395b,#071426 58%);color:#fff;padding:34px 18px}.wrap{width:min(1120px,100%);margin:auto}.top{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:20px}.eyebrow{font-size:11px;font-weight:900;letter-spacing:3px;color:#8fa9c3}.top h1{font-size:34px;margin:6px 0}.top p{margin:0;color:#a9bdd0;font-size:13px}.top>a{color:#fff;text-decoration:none;border:1px solid #ffffff25;background:#ffffff0d;padding:11px 15px;border-radius:12px;font-weight:800;font-size:12px}.login{display:grid;grid-template-columns:1.25fr 1fr 1fr auto;gap:10px;align-items:center;background:#ffffff08;border:1px solid #ffffff16;padding:14px;border-radius:15px;margin-bottom:12px}.login b,.login small{display:block}.login small{font-size:9px;color:#91a7bd;margin-top:4px}.login input{height:42px;border:1px solid #ffffff1c;background:#0c2035;color:#fff;border-radius:10px;padding:0 12px;outline:none}.login button{height:42px;border:0;border-radius:10px;background:#2563eb;color:#fff;font-weight:900;padding:0 16px;cursor:pointer}.message{margin-bottom:12px;padding:11px 14px;border-radius:11px;background:#172554;color:#bfdbfe;font-size:11px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.card{appearance:none;color:#fff;text-align:left;cursor:pointer;border-radius:16px;padding:16px;background:linear-gradient(180deg,#122b45,#0b1d30);border:1px solid #ffffff14;display:flex;gap:12px;align-items:center;transition:.18s}.card:hover,.card.active{transform:translateY(-2px);border-color:var(--c);box-shadow:0 10px 28px #0003}.card.blue{--c:#2563eb;border-top:3px solid #2563eb}.card.green{--c:#10b981;border-top:3px solid #10b981}.card.purple{--c:#7c3aed;border-top:3px solid #7c3aed}.icon{width:44px;height:44px;border-radius:12px;background:#ffffff0c;display:grid;place-items:center;font-size:22px}.card div:nth-child(2){min-width:0;flex:1}.card small,.card b,.card span{display:block}.card small{font-size:7px;letter-spacing:1.5px;color:#7590aa}.card b{font-size:14px;margin:4px 0}.card span{font-size:9px;color:#91a7bd}.card em{font-style:normal;font-size:9px;font-weight:900;color:#dbeafe}.manager{margin-top:14px;border:1px solid #ffffff14;border-top:3px solid var(--tone);border-radius:17px;background:linear-gradient(180deg,#10283f,#091b2d);overflow:hidden}.managerHead{padding:16px 18px;border-bottom:1px solid #ffffff10;display:flex;align-items:center;justify-content:space-between}.managerHead h2{font-size:16px;margin:0}.managerHead p{font-size:9px;color:#91a7bd;margin:4px 0 0}.managerHead>span{font-size:8px;font-weight:900;padding:6px 9px;border-radius:20px;background:#064e3b;color:#86efac}.empty{padding:28px;text-align:center;color:#8fa4b9;font-size:11px}.table{padding:4px 14px 14px}.userrow{display:grid;grid-template-columns:38px minmax(0,1fr) 180px 90px;gap:12px;align-items:center;padding:11px 4px;border-bottom:1px solid #ffffff0d}.userrow:last-child{border-bottom:0}.avatar{width:34px;height:34px;border-radius:50%;background:#ffffff0d;display:grid;place-items:center;font-weight:900}.who b,.who small{display:block}.who b{font-size:11px}.who small{font-size:8px;color:#7890a8;margin-top:3px}.userrow select{height:36px;border-radius:9px;border:1px solid #ffffff1c;background:#0b2035;color:#fff;padding:0 9px}.saveState{font-size:8px;text-align:center;padding:6px;border-radius:20px;background:#064e3b;color:#86efac;font-weight:900}.saveState.working{background:#78350f;color:#fde68a}.note{margin-top:13px;padding:13px 15px;border:1px solid #ffffff12;border-radius:12px;background:#ffffff07;color:#9fb2c5;font-size:10px;line-height:1.55}.note b{color:#fff}@media(max-width:850px){.login{grid-template-columns:1fr 1fr}.login>div{grid-column:1/-1}.grid{grid-template-columns:1fr}.userrow{grid-template-columns:36px 1fr 145px}.saveState{display:none}}@media(max-width:600px){.page{padding:18px 10px}.top{flex-direction:column;align-items:flex-start}.top h1{font-size:27px}.login{grid-template-columns:1fr}.login>div{grid-column:auto}.userrow{grid-template-columns:34px 1fr}.userrow select{grid-column:2;width:100%}}`}</style></main>
}
