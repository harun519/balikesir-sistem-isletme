"use client";

const apps=[
 {key:"trafo",title:"Trafo Değişimi",desc:"Trafo değişim kayıtları, raporlar ve arşiv",href:"https://balikesir-trafo-degisimi.vercel.app",icon:"⚡",tone:"blue"},
 {key:"scada",title:"SCADA Saha Kontrol",desc:"SCADA istasyon kontrolü, uygunsuzluklar ve raporlar",href:"https://scada-saha-kontrol-vercel.vercel.app",icon:"🖥️",tone:"green"},
 {key:"teyit",title:"Görüntülü Teyit",desc:"Saha görüntü teyitleri, uygunluk kontrolleri ve raporlar",href:"https://goruntulu-teyit-v1.vercel.app",icon:"🎥",tone:"purple"}
] as const;

export default function Home(){return <main className="portal">
  <div className="content">
    <header><div className="eyebrow">BALIKESİR</div><h1>SİSTEM İŞLETME</h1><p>Daha güvenli, daha kesintisiz bir enerji için...</p></header>
    <section className="grid">
      {apps.map(a=><a key={a.key} className={`card ${a.tone}`} href={a.href} target="_blank" rel="noopener noreferrer"><div className="icon">{a.icon}</div><h2>{a.title}</h2><p>{a.desc}</p><div className="btn">Uygulamaya Git →</div></a>)}
    </section>
    <section className="bottom">
      <a className="status statusLink" href="/saglik"><div className="check">✓</div><div><h3>Sistem Sağlığı</h3><p>Canlı bağlantı, veri ve yedek durumunu görüntüle →</p></div></a>
      <a className="status statusLink users" href="/kullanicilar"><div className="check usersCheck">👥</div><div><h3>Kullanıcı Yönetimi</h3><p>Trafo, SCADA ve Teyit yetkilerini yönet →</p></div></a>
      <a className="status statusLink recovery" href="/kurtarma"><div className="check recoveryCheck">🛟</div><div><h3>Acil Kurtarma</h3><p>Uygulama ve kurtarma durumunu görüntüle →</p></div></a>
    </section>
    <footer>Balıkesir Sistem İşletme Portalı</footer>
  </div>
  <style jsx>{`
    :global(*){box-sizing:border-box}:global(html),:global(body){margin:0;min-width:320px;min-height:100%;font-family:Arial,Helvetica,sans-serif;background:#071426}:global(body){overflow-x:hidden}
    .portal{position:relative;min-height:100dvh;color:#fff;background-image:linear-gradient(180deg,rgba(3,12,25,.20),rgba(3,12,25,.38)),url('/portal-bg-ai.jpg');background-position:center;background-size:cover;background-repeat:no-repeat;background-attachment:fixed;overflow:hidden}.content{position:relative;z-index:1;width:min(1120px,calc(100% - 40px));min-height:100dvh;margin:auto;padding:42px 0 22px;display:flex;flex-direction:column;justify-content:center}header{text-align:center;margin-bottom:28px;text-shadow:0 3px 16px rgba(0,0,0,.5)}.eyebrow{font-size:14px;font-weight:900;letter-spacing:7px;color:#e5edf7}h1{margin:7px 0 8px;font-size:clamp(42px,4.7vw,64px);line-height:.95;font-weight:900}header p{margin:0;font-size:14px;color:#edf4fb}
    .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.card{min-height:300px;padding:28px 22px 20px;border:1px solid rgba(154,184,215,.22);border-radius:22px;background:linear-gradient(180deg,rgba(21,42,67,.94),rgba(7,22,39,.97));box-shadow:0 18px 45px rgba(0,0,0,.32);color:#fff;text-decoration:none;display:flex;flex-direction:column;align-items:center;text-align:center;transition:transform .18s ease,box-shadow .18s ease}.card:hover{transform:translateY(-7px) scale(1.025);box-shadow:0 28px 60px rgba(0,0,0,.42)}.icon{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;font-size:31px;margin-bottom:22px;box-shadow:0 10px 24px rgba(0,0,0,.24)}.card h2{margin:0;min-height:50px;display:flex;align-items:center;justify-content:center;font-size:21px;font-weight:900}.card p{margin:14px 0 20px;font-size:12px;line-height:1.55;color:#cbd8e7}.btn{width:100%;height:45px;margin-top:auto;border-radius:11px;display:grid;place-items:center;font-size:13px;font-weight:900}.blue .icon,.blue .btn{background:#0b82ff}.blue .icon{color:#ffd43b}.green .icon,.green .btn{background:#10bf8a}.purple .icon,.purple .btn{background:linear-gradient(135deg,#7930ff,#aa00ef)}
    .bottom{width:100%;margin:18px auto 0;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid rgba(154,184,215,.18);border-radius:18px;background:linear-gradient(180deg,rgba(20,39,61,.94),rgba(7,20,35,.97));box-shadow:0 16px 38px rgba(0,0,0,.30);overflow:hidden}.status{min-height:105px;padding:20px 16px;display:flex;align-items:center;gap:12px;border-right:1px solid rgba(255,255,255,.07)}.status:last-child{border-right:0}.statusLink{color:#fff;text-decoration:none}.check{width:48px;height:48px;flex:0 0 48px;border-radius:50%;display:grid;place-items:center;background:#10bf8a;font-size:27px;font-weight:900}.usersCheck{background:#2563eb;font-size:21px}.recoveryCheck{background:#e8590c;font-size:22px}.status h3{margin:0 0 7px;font-size:14px}.status p{margin:0;font-size:10px;color:#cbd8e7}footer{text-align:center;padding-top:14px;font-size:9px;color:#d6e2ef}
    @media(max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.bottom{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.portal{background-attachment:scroll}.content{width:100%;padding:24px 10px 20px;justify-content:flex-start}.grid{grid-template-columns:1fr;gap:8px}.card{min-height:210px;padding:14px 8px 10px;border-radius:15px}.icon{width:46px;height:46px;font-size:22px;margin-bottom:10px}.card h2{min-height:38px;font-size:13px}.card p{font-size:9.3px;margin:9px 0 10px}.btn{height:34px;font-size:9.8px}.bottom{grid-template-columns:1fr}.status{border-right:0;border-bottom:1px solid rgba(255,255,255,.07);min-height:82px;padding:13px 16px}.status:last-child{border-bottom:0}}
  `}</style>
</main>}
