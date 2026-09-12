export const dynamic = "force-dynamic";

type HealthPayload={ok?:boolean;database?:boolean;lastDataAt?:string|null;lastBackupAt?:string|null;lastBackupName?:string|null;latencyMs?:number;checkedAt?:string;error?:string};
type Check={ok:boolean;ms:number;data?:HealthPayload};

async function ping(url:string):Promise<Check>{
  const t=Date.now();
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),8000);
    const r=await fetch(url,{cache:"no-store",signal:controller.signal,headers:{"Cache-Control":"no-cache"}});
    clearTimeout(timer);
    let data:HealthPayload|undefined;
    try{data=await r.json()}catch{}
    return {ok:r.ok&&data?.ok!==false,ms:Date.now()-t,data};
  }catch{return {ok:false,ms:Date.now()-t}}
}

const systems=[
  {key:"trafo",name:"Trafo Değişimi",icon:"⚡",url:"https://balikesir-trafo-degisimi.vercel.app",health:"https://balikesir-trafo-degisimi.vercel.app/api/health",backup:"Her gün 05:30",tone:"#2563eb"},
  {key:"scada",name:"SCADA Saha Kontrol",icon:"🖥️",url:"https://scada-saha-kontrol-vercel.vercel.app",health:"https://scada-saha-kontrol-vercel.vercel.app/api/health",backup:"Her gün 03:00",tone:"#10b981"},
  {key:"teyit",name:"Görüntülü Teyit",icon:"🎥",url:"https://goruntulu-teyit-v1.vercel.app",health:"https://goruntulu-teyit-v1.vercel.app/api/health",backup:"Her gün 03:00",tone:"#7c3aed"},
] as const;

function fmtDate(v?:string|null){if(!v)return "Henüz yok";try{return new Date(v).toLocaleString("tr-TR",{timeZone:"Europe/Istanbul"})}catch{return v}}
function age(v?:string|null){if(!v)return null;const n=Date.now()-new Date(v).getTime();if(!Number.isFinite(n))return null;const h=Math.max(0,Math.floor(n/3600000));if(h<1)return "1 saatten yeni";if(h<24)return `${h} saat önce`;return `${Math.floor(h/24)} gün önce`}
function backupHealthy(v?:string|null){if(!v)return false;return Date.now()-new Date(v).getTime()<48*3600000}

export default async function Saglik(){
  const rows=await Promise.all(systems.map(async s=>{
    const [app,health]=await Promise.all([ping(s.url),ping(s.health)]);
    const db=!!health.data?.database&&health.ok;
    const backupOk=backupHealthy(health.data?.lastBackupAt);
    return {...s,app,health,db,backupOk};
  }));
  const allOk=rows.every(r=>r.app.ok&&r.db&&r.backupOk);
  const checked=new Date().toLocaleString("tr-TR",{timeZone:"Europe/Istanbul"});
  const issueCount=rows.reduce((n,r)=>n+(!r.app.ok?1:0)+(!r.db?1:0)+(!r.backupOk?1:0),0);
  return <main className="page"><div className="wrap">
    <div className="top"><div><div className="eyebrow">BALIKESİR SİSTEM İŞLETME</div><h1>Sistem Sağlığı</h1><p>Üç uygulamanın canlı erişim, veri bağlantısı ve yedek durumunu tek ekranda izler.</p></div><a href="/">← Portala Dön</a></div>

    <div className={`overall ${allOk?"ok":"bad"}`}><div><b>{allOk?"✓ Tüm sistemler sağlıklı":`⚠ ${issueCount} kontrol noktası dikkat istiyor`}</b><small>{allOk?"Uygulamalar, veritabanları ve günlük yedekler normal.":"Aşağıdaki kırmızı satırları kontrol et."}</small></div><span>Son kontrol: {checked}</span></div>

    <section className="summary">
      <Summary label="Uygulama" value={`${rows.filter(r=>r.app.ok).length}/3`} ok={rows.every(r=>r.app.ok)}/>
      <Summary label="Veritabanı" value={`${rows.filter(r=>r.db).length}/3`} ok={rows.every(r=>r.db)}/>
      <Summary label="Güncel Yedek" value={`${rows.filter(r=>r.backupOk).length}/3`} ok={rows.every(r=>r.backupOk)}/>
    </section>

    <section className="grid">{rows.map(r=><article className="card" key={r.name} style={{"--tone":r.tone} as React.CSSProperties}>
      <div className="head"><div className="ico">{r.icon}</div><div><h2>{r.name}</h2><span>{r.url.replace("https://","")}</span></div><span className={`bigstate ${r.app.ok&&r.db&&r.backupOk?"ok":"bad"}`}>{r.app.ok&&r.db&&r.backupOk?"SAĞLIKLI":"KONTROL"}</span></div>
      <div className="checks">
        <Status label="Vercel / Uygulama" ok={r.app.ok} detail={r.app.ok?`${r.app.ms} ms yanıt` : "Uygulamaya erişilemiyor"}/>
        <Status label="Supabase / Veri" ok={r.db} detail={r.db?`Bağlantı aktif · ${r.health.data?.latencyMs??r.health.ms} ms`:r.health.data?.error||"Veri bağlantısı yok"}/>
        <Status label="Son Veri Güncellemesi" ok={r.db} detail={fmtDate(r.health.data?.lastDataAt)} neutral/>
        <Status label="Son Otomatik Yedek" ok={r.backupOk} detail={`${fmtDate(r.health.data?.lastBackupAt)}${age(r.health.data?.lastBackupAt)?` · ${age(r.health.data?.lastBackupAt)}`:""}`}/>
        <div className="row"><div><b>Yedek Planı</b><small>{r.backup} · son yedekler geri yüklenebilir</small></div><span className="pill backup">GÜNLÜK</span></div>
      </div>
      <div className="actions"><a className="open" href={r.url} target="_blank" rel="noreferrer">Uygulamayı Aç →</a></div>
    </article>)}</section>

    <div className="note"><b>Kontrol mantığı:</b> Uygulama adresi canlı olarak açılır, her uygulamanın kendi güvenli sağlık servisi veritabanına erişir ve son yedek tarihini okur. Son başarılı yedek 48 saati aşarsa sistem sarı/kırmızı uyarıya düşer. Bu ekran hiçbir servis anahtarını tarayıcıya göndermez.</div>
  </div><style>{`
    *{box-sizing:border-box}body{margin:0;background:#071426;font-family:Arial,Helvetica,sans-serif}.page{min-height:100vh;background:radial-gradient(circle at 50% -20%,#15395b,#071426 58%);color:#fff;padding:34px 18px}.wrap{width:min(1180px,100%);margin:auto}.top{display:flex;justify-content:space-between;gap:20px;align-items:center;margin-bottom:22px}.eyebrow{font-size:11px;font-weight:900;letter-spacing:3px;color:#8fa9c3}.top h1{font-size:34px;margin:6px 0}.top p{margin:0;color:#a9bdd0;font-size:13px}.top>a{color:#fff;text-decoration:none;border:1px solid #ffffff25;background:#ffffff0d;padding:11px 15px;border-radius:12px;font-weight:800;font-size:12px}.overall{display:flex;justify-content:space-between;align-items:center;padding:15px 18px;border-radius:14px;margin-bottom:12px;border:1px solid}.overall.ok{background:#064e3b55;border-color:#34d39955}.overall.bad{background:#7f1d1d55;border-color:#fb718555}.overall b,.overall small{display:block}.overall small{font-size:10px;color:#c8d6e3;margin-top:4px}.overall span{font-size:11px;color:#c8d6e3}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}.summaryBox{border:1px solid #ffffff12;border-radius:13px;background:#ffffff08;padding:12px 14px;display:flex;justify-content:space-between;align-items:center}.summaryBox span{font-size:10px;color:#9fb2c5}.summaryBox b{font-size:19px}.summaryBox.ok b{color:#6ee7b7}.summaryBox.bad b{color:#fda4af}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card{background:linear-gradient(180deg,#122b45,#0b1d30);border:1px solid #ffffff14;border-top:3px solid var(--tone);border-radius:18px;padding:18px;box-shadow:0 14px 35px #0004}.head{display:flex;align-items:center;gap:12px;padding-bottom:15px;border-bottom:1px solid #ffffff12}.ico{width:46px;height:46px;flex:0 0 46px;border-radius:13px;background:var(--tone);display:grid;place-items:center;font-size:23px}.head>div:nth-child(2){min-width:0}.head h2{margin:0;font-size:16px}.head span{display:block;color:#829bb3;font-size:9px;margin-top:5px;overflow:hidden;text-overflow:ellipsis}.bigstate{margin-left:auto!important;font-size:8px!important;font-weight:900!important;padding:6px 8px;border-radius:20px;white-space:nowrap}.bigstate.ok{background:#064e3b;color:#6ee7b7!important}.bigstate.bad{background:#7f1d1d;color:#fda4af!important}.checks{padding:8px 0}.row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 2px;border-bottom:1px solid #ffffff0c}.row b,.row small{display:block}.row b{font-size:11px}.row small{font-size:9px;color:#8fa4b9;margin-top:3px;line-height:1.35}.pill{font-size:8px;font-weight:900;padding:5px 8px;border-radius:20px;white-space:nowrap}.pill.ok,.pill.backup{background:#064e3b;color:#6ee7b7}.pill.bad{background:#7f1d1d;color:#fda4af}.pill.neutral{background:#172554;color:#bfdbfe}.actions{margin-top:8px}.open{display:block;text-align:center;text-decoration:none;color:#fff;background:var(--tone);border-radius:10px;padding:10px;font-size:11px;font-weight:900}.note{margin-top:16px;padding:15px 17px;border:1px solid #ffffff12;border-radius:13px;background:#ffffff08;color:#a9bdd0;font-size:11px;line-height:1.55}.note b{color:#fff}@media(max-width:900px){.grid{grid-template-columns:1fr}.summary{grid-template-columns:repeat(3,1fr)}}@media(max-width:620px){.top{align-items:flex-start;flex-direction:column}.overall{align-items:flex-start;gap:7px;flex-direction:column}.page{padding:20px 12px}.top h1{font-size:27px}.summary{grid-template-columns:1fr}.head h2{font-size:14px}}
  `}</style></main>
}

function Status({label,ok,detail,neutral=false}:{label:string;ok:boolean;detail:string;neutral?:boolean}){return <div className="row"><div><b>{label}</b><small>{detail}</small></div><span className={`pill ${neutral?"neutral":ok?"ok":"bad"}`}>{neutral?"BİLGİ":ok?"ÇALIŞIYOR":"HATA"}</span></div>}
function Summary({label,value,ok}:{label:string;value:string;ok:boolean}){return <div className={`summaryBox ${ok?"ok":"bad"}`}><span>{label}</span><b>{value}</b></div>}
