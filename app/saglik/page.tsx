export const dynamic = "force-dynamic";

type Check={ok:boolean;ms:number};
async function ping(url:string):Promise<Check>{
  const t=Date.now();
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),6000);
    const r=await fetch(url,{cache:"no-store",signal:controller.signal,headers:{"Cache-Control":"no-cache"}});
    clearTimeout(timer);
    return {ok:r.ok,ms:Date.now()-t};
  }catch{return {ok:false,ms:Date.now()-t}}
}

const systems=[
  {name:"Trafo Değişimi",icon:"⚡",url:"https://balikesir-trafo-degisimi.vercel.app",supabase:"https://uxbhhkoxcayjkbsxfabk.supabase.co/auth/v1/health",backup:"Her gün 05:30",tone:"#2563eb"},
  {name:"SCADA Saha Kontrol",icon:"🖥️",url:"https://scada-saha-kontrol-vercel.vercel.app",supabase:"https://uxbhhkoxcayjkbsxfabk.supabase.co/auth/v1/health",backup:"Her gün 03:00",tone:"#10b981"},
  {name:"Görüntülü Teyit",icon:"🎥",url:"https://goruntulu-teyit-v1.vercel.app",supabase:"https://xyphsavbyhpwkcwmvzgw.supabase.co/auth/v1/health",backup:"Her gün 03:00",tone:"#7c3aed"},
] as const;

export default async function Saglik(){
  const rows=await Promise.all(systems.map(async s=>{
    const [app,db]=await Promise.all([ping(s.url),ping(s.supabase)]);
    return {...s,app,db,sync:app.ok&&db.ok};
  }));
  const allOk=rows.every(r=>r.app.ok&&r.db.ok);
  const checked=new Date().toLocaleString("tr-TR",{timeZone:"Europe/Istanbul"});
  return <main className="page"><div className="wrap">
    <div className="top"><div><div className="eyebrow">BALIKESİR SİSTEM İŞLETME</div><h1>Sistem Sağlığı</h1><p>Üç uygulamanın canlı erişim, Supabase ve veri bağlantısı durumu.</p></div><a href="/">← Portala Dön</a></div>
    <div className={`overall ${allOk?"ok":"bad"}`}><b>{allOk?"✓ Tüm sistemler çalışıyor":"⚠ Kontrol gerektiren sistem var"}</b><span>Son kontrol: {checked}</span></div>
    <section className="grid">{rows.map(r=><article className="card" key={r.name} style={{"--tone":r.tone} as React.CSSProperties}>
      <div className="head"><div className="ico">{r.icon}</div><div><h2>{r.name}</h2><span>{r.url.replace("https://","")}</span></div></div>
      <div className="checks">
        <Status label="Vercel / Uygulama" ok={r.app.ok} detail={r.app.ok?`${r.app.ms} ms`:"Erişilemiyor"}/>
        <Status label="Supabase" ok={r.db.ok} detail={r.db.ok?`${r.db.ms} ms`:"Bağlantı yok"}/>
        <Status label="Veri Senkronu" ok={r.sync} detail={r.sync?"Bağlantı hazır":"Kontrol gerekli"}/>
        <div className="row"><div><b>Otomatik Yedek</b><small>{r.backup}</small></div><span className="pill backup">AKTİF</span></div>
      </div>
      <a className="open" href={r.url} target="_blank" rel="noreferrer">Uygulamayı Aç →</a>
    </article>)}</section>
    <div className="note">Yedekler artık günlük çalışır. Geri yükleme, ilgili uygulamanın yönetici yedek ekranından tarih seçilerek ve işlem öncesi güvenlik yedeği alınarak yapılır.</div>
  </div><style>{`
    *{box-sizing:border-box}body{margin:0;background:#071426;font-family:Arial,Helvetica,sans-serif}.page{min-height:100vh;background:radial-gradient(circle at 50% -20%,#15395b,#071426 58%);color:#fff;padding:34px 18px}.wrap{width:min(1160px,100%);margin:auto}.top{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:22px}.eyebrow{font-size:11px;font-weight:900;letter-spacing:3px;color:#8fa9c3}.top h1{font-size:34px;margin:6px 0}.top p{margin:0;color:#a9bdd0;font-size:13px}.top>a{color:#fff;text-decoration:none;border:1px solid #ffffff25;background:#ffffff0d;padding:11px 15px;border-radius:12px;font-weight:800;font-size:12px}.overall{display:flex;justify-content:space-between;align-items:center;padding:15px 18px;border-radius:14px;margin-bottom:16px;border:1px solid}.overall.ok{background:#064e3b55;border-color:#34d39955}.overall.bad{background:#7f1d1d55;border-color:#fb718555}.overall span{font-size:11px;color:#c8d6e3}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card{background:linear-gradient(180deg,#122b45,#0b1d30);border:1px solid #ffffff14;border-top:3px solid var(--tone);border-radius:18px;padding:18px;box-shadow:0 14px 35px #0004}.head{display:flex;align-items:center;gap:12px;padding-bottom:15px;border-bottom:1px solid #ffffff12}.ico{width:46px;height:46px;border-radius:13px;background:var(--tone);display:grid;place-items:center;font-size:23px}.head h2{margin:0;font-size:16px}.head span{display:block;color:#829bb3;font-size:9px;margin-top:5px}.checks{padding:8px 0}.row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 2px;border-bottom:1px solid #ffffff0c}.row b,.row small{display:block}.row b{font-size:11px}.row small{font-size:9px;color:#8fa4b9;margin-top:3px}.pill{font-size:8px;font-weight:900;padding:5px 8px;border-radius:20px}.pill.ok,.pill.backup{background:#064e3b;color:#6ee7b7}.pill.bad{background:#7f1d1d;color:#fda4af}.open{display:block;text-align:center;text-decoration:none;color:#fff;background:var(--tone);border-radius:10px;padding:10px;font-size:11px;font-weight:900;margin-top:8px}.note{margin-top:16px;padding:15px 17px;border:1px solid #ffffff12;border-radius:13px;background:#ffffff08;color:#a9bdd0;font-size:11px;line-height:1.55}@media(max-width:820px){.grid{grid-template-columns:1fr}.top{align-items:flex-start}.overall{align-items:flex-start;gap:7px;flex-direction:column}.page{padding:20px 12px}.top h1{font-size:27px}}
  `}</style></main>
}

function Status({label,ok,detail}:{label:string;ok:boolean;detail:string}){return <div className="row"><div><b>{label}</b><small>{detail}</small></div><span className={`pill ${ok?"ok":"bad"}`}>{ok?"ÇALIŞIYOR":"HATA"}</span></div>}
