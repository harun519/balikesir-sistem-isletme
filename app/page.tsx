"use client";

const apps = [
  { key: "trafo", title: "Trafo Değişimi", desc: "Trafo değişim kayıtları, raporlar ve arşiv", href: "https://balikesir-trafo-degisimi.vercel.app", icon: "⚡", tone: "blue" },
  { key: "scada", title: "SCADA Saha Kontrol", desc: "SCADA istasyon kontrolü, uygunsuzluklar ve raporlar", href: "https://scada-saha-kontrol-vercel.vercel.app", icon: "🖥️", tone: "green" },
  { key: "teyit", title: "Görüntülü Teyit", desc: "Saha görüntü teyitleri, uygunluk kontrolleri ve raporlar", href: "https://goruntulu-teyit-v1.vercel.app", icon: "🎥", tone: "purple" },
] as const;

export default function Home() {
  return (
    <main className="portal">
      <div className="bg" />
      <div className="shade" />

      <div className="content">
        <header className="header">
          <div className="eyebrow">BALIKESİR</div>
          <h1>SİSTEM İŞLETME</h1>
          <p>Daha güvenli, daha kesintisiz bir enerji için...</p>
        </header>

        <section className="appGrid">
          {apps.map(app => (
            <a key={app.key} className={`card ${app.tone}`} href={app.href} target="_blank" rel="noopener noreferrer" aria-label={`${app.title} uygulamasını yeni sekmede aç`}>
              <div className="icon">{app.icon}</div>
              <h2>{app.title}</h2>
              <p>{app.desc}</p>
              <div className="button">Uygulamaya Git →</div>
            </a>
          ))}

          <article className="card orange disabled" aria-label="3. Seviye Bakım yakında">
            <div className="icon">🛠️</div>
            <h2>3. Seviye Bakım</h2>
            <p>3. seviye bakım faaliyetleri, kontroller ve raporlar</p>
            <div className="button">Yakında</div>
          </article>
        </section>

        <section className="bottomGrid">
          <div className="infoCard statusCard">
            <div className="statusIcon">✓</div>
            <div><h3>Tüm Sistemler Aktif</h3><p>Saha operasyonları normal seyrinde.</p></div>
          </div>
          <div className="infoCard notices">
            <h3>🔔 Son Duyurular</h3>
            <div className="noticeRow"><span>Trafo Değişimi</span><b>AKTİF</b></div>
            <div className="noticeRow"><span>SCADA Saha Kontrol</span><b>AKTİF</b></div>
            <div className="noticeRow"><span>Görüntülü Teyit</span><b>AKTİF</b></div>
          </div>
        </section>

        <footer>Balıkesir Sistem İşletme Portalı</footer>
      </div>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html),:global(body){margin:0;width:100%;min-width:320px;min-height:100%;font-family:Arial,Helvetica,sans-serif;background:#061426}
        :global(body){overflow-x:hidden}
        .portal{position:relative;min-height:100dvh;color:#fff;overflow:hidden;background:#061426}
        .bg{position:fixed;inset:0;background:url('/portal-final-kompakt-clean.jpg') center/cover no-repeat;z-index:0;filter:saturate(1.05) contrast(1.04)}
        .shade{position:fixed;inset:0;z-index:1;background:linear-gradient(180deg,rgba(2,10,20,.52) 0%,rgba(2,10,20,.34) 32%,rgba(2,10,20,.30) 62%,rgba(2,10,20,.68) 100%),radial-gradient(circle at 50% 22%,rgba(7,35,67,.22),rgba(1,8,18,.18) 52%,rgba(1,8,18,.42) 100%)}
        .content{position:relative;z-index:2;width:min(1280px,calc(100% - 44px));min-height:100dvh;margin:0 auto;padding:34px 0 20px;display:flex;flex-direction:column;justify-content:center}
        .header{text-align:center;margin-bottom:22px;text-shadow:0 4px 24px rgba(0,0,0,.68)}
        .eyebrow{font-size:14px;font-weight:900;letter-spacing:6px;color:#fff}
        .header h1{margin:6px 0 8px;font-size:clamp(42px,4.25vw,60px);line-height:.96;font-weight:900;letter-spacing:.4px}
        .header p{margin:0;font-size:13px;color:rgba(255,255,255,.92)}
        .appGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
        .card{min-height:320px;padding:26px 22px 20px;border:1px solid rgba(137,170,206,.34);border-radius:20px;background:linear-gradient(180deg,rgba(18,37,60,.94),rgba(5,17,31,.96));box-shadow:0 16px 42px rgba(0,0,0,.42);color:#fff;text-decoration:none;display:flex;flex-direction:column;align-items:center;text-align:center;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}
        .card:not(.disabled):hover{transform:translateY(-4px);border-color:rgba(255,255,255,.52);box-shadow:0 22px 54px rgba(0,0,0,.50)}
        .icon{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;font-size:30px;margin-bottom:22px;box-shadow:0 10px 26px rgba(0,0,0,.30)}
        .card h2{margin:0;min-height:50px;display:flex;align-items:center;justify-content:center;font-size:21px;line-height:1.15;font-weight:900;text-shadow:0 2px 8px rgba(0,0,0,.45)}
        .card p{margin:14px 0 18px;font-size:12.5px;line-height:1.55;color:rgba(255,255,255,.86)}
        .button{width:100%;min-height:44px;margin-top:auto;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;box-shadow:inset 0 1px 0 rgba(255,255,255,.14)}
        .blue .icon,.blue .button{background:#0b82ff}.blue .icon{color:#ffd43b}
        .green .icon,.green .button{background:#10bf8a}
        .purple .icon,.purple .button{background:linear-gradient(135deg,#7a2cff,#ab00e9)}
        .orange .icon,.orange .button{background:linear-gradient(135deg,#ff7100,#c44b00)}
        .disabled{opacity:.82;cursor:default}
        .bottomGrid{display:grid;grid-template-columns:.88fr 1.12fr;gap:14px;width:min(820px,100%);margin:14px auto 0}
        .infoCard{border:1px solid rgba(137,170,206,.28);border-radius:18px;background:linear-gradient(180deg,rgba(18,37,60,.94),rgba(5,17,31,.96));box-shadow:0 14px 36px rgba(0,0,0,.38)}
        .statusCard{padding:20px 22px;display:flex;align-items:center;gap:17px}.statusIcon{width:58px;height:58px;flex:0 0 58px;border-radius:50%;display:grid;place-items:center;background:#10bf8a;font-size:34px;font-weight:900}.statusCard h3,.notices h3{margin:0 0 8px;font-size:15px}.statusCard p{margin:0;font-size:11px;color:rgba(255,255,255,.78)}
        .notices{padding:16px 20px}.noticeRow{display:grid;grid-template-columns:1fr auto;align-items:center;gap:12px;padding:4px 0;font-size:11px}.noticeRow b{font-size:9px;padding:4px 8px;border-radius:7px;background:#10bf8a;color:#fff}
        footer{text-align:center;padding-top:12px;font-size:9px;color:rgba(255,255,255,.64)}
        @media(max-width:1050px){.content{width:min(950px,calc(100% - 26px));padding-top:22px}.header{margin-bottom:16px}.appGrid{gap:10px}.card{min-height:278px;padding:20px 12px 16px}.card h2{font-size:17px}.card p{font-size:10.5px}.icon{width:56px;height:56px;font-size:26px;margin-bottom:14px}.bottomGrid{width:min(710px,100%)}}
        @media(max-width:700px){.content{width:100%;padding:22px 10px 20px;justify-content:flex-start}.bg{background-image:url('/portal-final-kompakt-clean.png');background-position:center}.shade{background:linear-gradient(180deg,rgba(2,10,20,.60),rgba(2,10,20,.50) 55%,rgba(2,10,20,.72))}.header{margin-bottom:17px}.eyebrow{font-size:10px;letter-spacing:4px}.header h1{font-size:31px}.header p{font-size:10.5px}.appGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.card{min-height:236px;padding:14px 8px 10px;border-radius:15px}.icon{width:46px;height:46px;font-size:22px;margin-bottom:10px}.card h2{min-height:38px;font-size:13px}.card p{font-size:9.3px;line-height:1.45;margin:9px 0 10px}.button{min-height:34px;font-size:9.8px}.bottomGrid{grid-template-columns:1fr;gap:8px;margin-top:8px}.statusCard{padding:13px 15px}.statusIcon{width:44px;height:44px;flex-basis:44px;font-size:25px}.notices{padding:12px 15px}.statusCard h3,.notices h3{font-size:12.5px}.statusCard p,.noticeRow{font-size:9.5px}footer{padding-top:10px;font-size:8.5px}}
      `}</style>
    </main>
  );
}
