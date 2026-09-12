"use client";

import {FormEvent,useEffect,useState} from "react";

const SB_URL="https://uxbhhkoxcayjkbsxfabk.supabase.co";
const SB_KEY="sb_publishable_IvnK60RCaP2upVGhyijtCA_tkPOvocY";
type Health={reachable?:boolean;database?:boolean;lastBackupAt?:string|null;lastBackupName?:string|null;lastDataAt?:string|null;ms?:number;error?:string};
type Systems={trafo?:Health;scada?:Health;teyit?:Health};
type Key="trafo"|"scada"|"teyit";
type Session={email:string;token:string};
type Backup={name:string;path:string;created_at?:string|null;updated_at?:string|null;size?:number|null};

async function loginAdmin(email:string,password:string):Promise<Session>{
  const r=await fetch(`${SB_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{apikey:SB_KEY,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||!d.access_token||!d.user?.id)throw new Error(d?.error_description||d?.msg||"Giriş başarısız.");
  const p=await fetch(`${SB_URL}/rest/v1/app_users?id=eq.${encodeURIComponent(d.user.id)}&select=role,email`,{headers:{apikey:SB_KEY,Authorization:`Bearer ${d.access_token}`},cache:"no-store"});
  const rows=await p.json().catch(()=>[]);
  if(!p.ok||!Array.isArray(rows)||rows[0]?.role!=="admin")throw new Error("Bu bölüm yalnızca admin kullanıcılar içindir.");
  return {email:String(rows[0]?.email||d.user.email||email),token:String(d.access_token)};
}
function fmt(v?:string|null){if(!v)return "Henüz yok";try{return new Date(v).toLocaleString("tr-TR",{timeZone:"Europe/Istanbul"})}catch{return v}}
function bytes(v?:number|null){const n=Number(v||0);if(!n)return "Boyut bilgisi yok";if(n<1024)return `${n} B`;if(n<1048576)return `${(n/1024).toFixed(1)} KB`;return `${(n/1048576).toFixed(1)} MB`}

const meta={
 trafo:{icon:"⚡",name:"Trafo Değişimi",url:"https://balikesir-trafo-degisimi.vercel.app"},
 scada:{icon:"🖥️",name:"SCADA Saha Kontrol",url:"https://scada-saha-kontrol-vercel.vercel.app"},
 teyit:{icon:"🎥",name:"Görüntülü Teyit",url:"https://goruntulu-teyit-v1.vercel.app"}
} as const;

export default function Kurtarma(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [session,setSession]=useState<Session|null>(null);
 const [busy,setBusy]=useState(false);const [msg,setMsg]=useState("");const [loading,setLoading]=useState(false);const [systems,setSystems]=useState<Systems>({});
 const [selected,setSelected]=useState<Key|null>(null);const [backups,setBackups]=useState<Partial<Record<Key,Backup[]>>>({});const [backupErrors,setBackupErrors]=useState<Partial<Record<Key,string>>>({});const [backupLoading,setBackupLoading]=useState<Key|null>(null);const [restoreBusy,setRestoreBusy]=useState("");const [success,setSuccess]=useState("");

 async function load(){setLoading(true);try{const r=await fetch("/api/kurtarma-durum",{cache:"no-store"});const d=await r.json();setSystems(d.systems||{});setMsg("")}catch{setMsg("Servis bilgileri alınamadı.")}finally{setLoading(false)}}
 useEffect(()=>{if(session)void load()},[session]);

 async function connect(e:FormEvent){e.preventDefault();setBusy(true);setMsg("");try{const s=await loginAdmin(email.trim(),password);setSession(s);setPassword("")}catch(err:any){setMsg(err?.message||"Giriş başarısız.")}finally{setBusy(false)}}
 async function listBackups(key:Key){
   if(!session)return;setBackupLoading(key);setMsg("");setSuccess("");setBackupErrors(x=>({...x,[key]:""}));
   try{const r=await fetch(`/api/kurtarma-yedek?app=${key}`,{headers:{Authorization:`Bearer ${session.token}`},cache:"no-store"});const d=await r.json();if(!r.ok)throw new Error(d?.error||"Yedekler alınamadı.");setBackups(x=>({...x,[key]:d.backups||[]}))}
   catch(err:any){const error=err?.message||"Yedekler alınamadı.";setBackupErrors(x=>({...x,[key]:error}));setMsg(error)}finally{setBackupLoading(null)}
 }
 async function choose(key:Key){if(selected===key){setSelected(null);return}setSelected(key);await listBackups(key)}
 async function restore(key:Key,b:Backup){
   if(!session||restoreBusy)return;
   const ok=window.confirm(`${meta[key].name} verileri “${b.name}” yedeğine döndürülecek. İşlemden hemen önce mevcut verinin güvenlik yedeği otomatik alınacak. Devam edilsin mi?`);
   if(!ok)return;
   setRestoreBusy(b.path);setMsg("");setSuccess("");
   try{
     const r=await fetch("/api/kurtarma-yedek",{method:"POST",headers:{Authorization:`Bearer ${session.token}`,"Content-Type":"application/json"},body:JSON.stringify({app:key,action:"restore",path:b.path,confirm:"GERI YUKLE"})});
     const d=await r.json();if(!r.ok)throw new Error(d?.error||"Geri yükleme başarısız.");
     setSuccess(`${meta[key].name} geri yüklendi. İşlem öncesi güvenlik yedeği: ${d.safetyBackup}`);
     await Promise.all([listBackups(key),load()]);
   }catch(err:any){setMsg(err?.message||"Geri yükleme başarısız.")}finally{setRestoreBusy("")}
 }
 function logout(){setSession(null);setSystems({});setBackups({});setSelected(null);setEmail("");setPassword("");setMsg("");setSuccess("")}

 if(!session)return <main className="page"><div className="wrap"><a className="back" href="/">← Portala Dön</a><div className="loginCard"><div className="lock">🔐</div><h1>Acil Kurtarma Merkezi</h1><p>Yedek listeleme ve geri yükleme işlemleri yalnızca sistem yöneticisine açıktır.</p><form onSubmit={connect}><input type="email" placeholder="Yönetici e-posta" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Şifre" value={password} onChange={e=>setPassword(e.target.value)} required/><button disabled={busy}>{busy?"Doğrulanıyor...":"Admin Girişi"}</button></form>{msg&&<div className="msg">{msg}</div>}<small>Admin parolası portal sunucusunda saklanmaz; giriş sonrası yalnızca kısa ömürlü kullanıcı oturumu kullanılır.</small></div></div><style>{styles}</style></main>;

 const items=(Object.keys(meta) as Key[]).map(key=>({key,...meta[key],data:systems[key]}));
 const sel=selected?items.find(x=>x.key===selected):null;
 const selectedBackups=selected?(backups[selected]||[]):[];

 return <main className="page"><div className="wrap">
   <div className="top"><div><a className="back" href="/">← Portala Dön</a><h1>🛟 Acil Kurtarma Merkezi</h1><p>Yedeği seç; sistem mevcut veriyi güvenlik yedeğine aldıktan sonra geri yüklesin.</p></div><div className="admin"><b>ADMIN</b><span>{session.email}</span><button onClick={logout}>Çıkış</button></div></div>
   <div className="toolbar"><span>{loading?"Kontrol ediliyor...":"Servis ve yedek bilgileri güncel"}</span><button onClick={load} disabled={loading}>↻ Sağlığı Yenile</button></div>
   {msg&&<div className="msg">{msg}</div>}{success&&<div className="success">{success}</div>}
   <div className="grid">{items.map(x=><button type="button" className={`card ${selected===x.key?"selected":""}`} key={x.key} onClick={()=>void choose(x.key)}><div className="cardHead"><h2>{x.icon} {x.name}</h2><span className={`state ${x.data?.reachable?"ok":"bad"}`}>{x.data?.reachable?"ÇALIŞIYOR":"KONTROL"}</span></div><div className="row"><span>Servis</span><b>{x.data?.reachable?"Erişilebilir":"Ulaşılamıyor"}</b></div><div className="row"><span>Veritabanı</span><b>{x.data?.database===undefined?"Bilgi yok":x.data.database?"Bağlı":"Bağlantı yok"}</b></div><div className="row"><span>Son yedek</span><b>{fmt(x.data?.lastBackupAt)}</b></div><div className="row"><span>Yedek adı</span><b className="file">{x.data?.lastBackupName||"Bilgi yok"}</b></div><div className="tap">{selected===x.key?"Yedekleri kapat ↑":"Yedekleri listele ↓"}</div></button>)}</div>
   {sel&&<section className="detail">
     <div className="detailHead"><span className="detailIcon">{sel.icon}</span><div><h2>{sel.name}</h2><p>Sunucudaki geri yüklenebilir yedekler</p></div></div>
     <div className="detailActions"><a href={sel.url} target="_blank" rel="noreferrer">Uygulamayı Aç</a><button onClick={()=>void listBackups(sel.key)} disabled={backupLoading===sel.key}>{backupLoading===sel.key?"Yükleniyor...":"↻ Yedekleri Yenile"}</button></div>
     <div className="warning"><b>Güvenli geri yükleme</b><span>Seçilen yedek yazılmadan önce uygulamanın mevcut verisi otomatik olarak GÜVENLİK/SAFETY yedeğine alınır. Bu adım başarısız olursa geri yükleme başlamaz.</span></div>
     <div className="backupList">{backupLoading===sel.key&&!selectedBackups.length?<div className="empty">Yedekler yükleniyor…</div>:backupErrors[sel.key]?<div className="empty">{backupErrors[sel.key]}</div>:selectedBackups.length?selectedBackups.map(b=><article className="backup" key={b.path}><div><b>{b.name}</b><span>{fmt(b.created_at||b.updated_at)} · {bytes(b.size)}</span><small>{b.path}</small></div><button disabled={!!restoreBusy} onClick={()=>void restore(sel.key,b)}>{restoreBusy===b.path?"Güvenlik yedeği alınıyor…":"Bu Yedeği Geri Yükle"}</button></article>):<div className="empty">Geri yüklenebilir yedek bulunamadı.</div>}</div>
   </section>}
   <div className="note"><b>Güvenlik:</b> Yedek içerikleri ve service-role anahtarları bu sayfaya gönderilmez. Listeleme ve geri yükleme yalnızca portalın server-side route’u üzerinden, admin rolü yeniden doğrulanarak yapılır.</div>
 </div><style>{styles}</style></main>
}

const styles=`*{box-sizing:border-box}body{margin:0;background:#071426;font-family:Arial,Helvetica,sans-serif}.page{min-height:100vh;background:radial-gradient(circle at 50% -20%,#15395b,#071426 58%);color:#fff;padding:28px 16px}.wrap{width:min(1040px,100%);margin:auto}.back{color:#fff;text-decoration:none}.loginCard{width:min(440px,100%);margin:7vh auto 0;background:linear-gradient(180deg,#10283f,#091b2d);border:1px solid #ffffff18;border-radius:18px;padding:24px;box-shadow:0 20px 55px #0005}.lock{font-size:30px}.loginCard h1{margin:8px 0 6px;font-size:26px}.loginCard p{color:#a9bdd0;font-size:12px}.loginCard form{display:grid;gap:9px;margin-top:16px}.loginCard input{height:42px;border-radius:10px;border:1px solid #ffffff1c;background:#0b2035;color:#fff;padding:0 12px}.loginCard button,.toolbar button{height:38px;border:0;border-radius:9px;background:#e8590c;color:#fff;font-weight:900;cursor:pointer;padding:0 12px}.loginCard small{display:block;color:#7890a8;margin-top:12px;font-size:9px;line-height:1.45}.msg,.success{margin:10px 0;padding:10px;border-radius:9px;font-size:10px;overflow-wrap:anywhere}.msg{background:#7f1d1d77;color:#fecaca}.success{background:#064e3b;color:#a7f3d0}.top{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.top h1{font-size:29px;margin:10px 0 6px}.top p{color:#a9bdd0;font-size:12px}.admin{display:flex;align-items:center;gap:7px;background:#ffffff08;border:1px solid #ffffff14;padding:7px 9px;border-radius:11px}.admin b{font-size:8px;color:#86efac}.admin span{font-size:9px;color:#cbd8e7}.admin button{border:0;background:#7f1d1d55;color:#fecaca;border-radius:8px;padding:5px 8px;font-size:8px;cursor:pointer}.toolbar{margin-top:14px;display:flex;justify-content:space-between;align-items:center;padding:9px 11px;border:1px solid #ffffff14;border-radius:11px;background:#ffffff08;color:#a9bdd0;font-size:10px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:10px}.card{width:100%;background:#10283f;border:1px solid #ffffff18;border-radius:14px;padding:13px;color:#fff;text-align:left;font:inherit;cursor:pointer;transition:.18s transform,.18s border-color,.18s background}.card:hover,.card.selected{transform:translateY(-1px);border-color:#60a5fa88;background:#12304c}.cardHead,.detailHead{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:6px}.card h2{font-size:14px;margin:0}.state{font-size:7px;font-weight:900;padding:4px 7px;border-radius:20px}.state.ok{background:#064e3b;color:#86efac}.state.bad{background:#7f1d1d;color:#fecaca}.row{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px solid #ffffff0e}.row span{font-size:9px;color:#8fa4b9}.row b{font-size:9px;text-align:right}.row .file{max-width:58%;overflow-wrap:anywhere;color:#bfdbfe}.tap{margin-top:8px;padding-top:8px;border-top:1px solid #ffffff12;color:#93c5fd;font-size:9px;font-weight:800}.detail{margin-top:10px;padding:14px;border:1px solid #60a5fa55;background:linear-gradient(180deg,#12304c,#0b2035);border-radius:14px}.detailHead{justify-content:flex-start!important}.detailIcon{width:38px;height:38px;border-radius:10px;background:#ffffff12;display:grid;place-items:center;font-size:20px}.detail h2{margin:0;font-size:15px}.detail p{margin:3px 0 0;color:#9fb2c5;font-size:9px}.detailActions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:11px}.detailActions a,.detailActions button{height:38px;border:0;border-radius:9px;display:grid;place-items:center;text-decoration:none;font-weight:900;font-size:10px;cursor:pointer}.detailActions a{background:#2563eb;color:#fff}.detailActions button{background:#e8590c;color:#fff}.warning{display:grid;gap:4px;margin-top:10px;padding:10px;border-radius:10px;background:#78350f55;border:1px solid #f59e0b55}.warning b{font-size:10px;color:#fde68a}.warning span{font-size:9px;line-height:1.45;color:#fef3c7}.backupList{display:grid;gap:7px;margin-top:10px}.backup{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:11px;border:1px solid #ffffff12;background:#07142699;border-radius:10px}.backup>div{min-width:0;display:grid;gap:3px}.backup b{font-size:10px;overflow-wrap:anywhere}.backup span,.backup small{font-size:8px;color:#8fa4b9;overflow-wrap:anywhere}.backup button{flex:0 0 auto;border:0;border-radius:8px;background:#b91c1c;color:#fff;padding:9px 11px;font-weight:900;font-size:8px;cursor:pointer}.backup button:disabled,.detailActions button:disabled{opacity:.55;cursor:wait}.empty{padding:18px;text-align:center;border:1px dashed #ffffff22;border-radius:10px;color:#8fa4b9;font-size:10px}.note{margin-top:12px;padding:12px;border-radius:12px;background:#ffffff08;border:1px solid #ffffff14;color:#cbd8e7;font-size:10px;line-height:1.5}.note b{color:#fff}@media(max-width:800px){.grid{grid-template-columns:1fr}.page{padding:14px 10px}.top{display:block}.admin{margin-top:10px;width:100%;justify-content:space-between}.top h1{font-size:22px}.top p{font-size:10px}.loginCard{margin-top:3vh;padding:18px}.toolbar{margin-top:10px}.card{padding:11px;border-radius:13px}.cardHead{margin-bottom:4px}.card h2{font-size:13px}.row{padding:6px 0}.detail{padding:12px}.detailActions{grid-template-columns:1fr 1fr}.backup{align-items:stretch;flex-direction:column}.backup button{width:100%;padding:11px}.note{font-size:9px}}`;
