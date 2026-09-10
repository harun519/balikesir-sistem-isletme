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
            <div>
              <h3>Tüm Sistemler Aktif</h3>
              <p>Saha operasyonları normal seyrinde.</p>
            </div>
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
        .bg{position:fixed;inset:0;background:url('/portal-final-kompakt-clean.jpg') center center/cover no-repeat;z-index:0}
        .shade{position:fixed;inset:0;z-index:1;background:linear-gradient(180deg,rgba(2,10,20,.18),rgba(2,10,20,.44)),radial-gradient(circle at 50% 18%,rgba(10,40,72,.08),transparent 42%)}
        .content{position:relative;z-index:2;width:min(1320px,calc(100% - 48px));min-height:100dvh;margin:0 auto;padding:42px 0 24px;display:flex;flex-direction:column;justify-content:center}
        .header{text-align:center;margin-bottom:24px;text-shadow:0 3px 20px rgba(0,0,0,.35)}
        .eyebrow{font-size:15px;font-weight:900;letter-spacing:6px}
        .header h1{margin:6px 0 8px;font-size:clamp(42px,4.5vw,64px);line-height:.95;font-weight:900;letter-spacing:.5px}
        .header p{margin:0;font-size:14px;color:rgba(255,255,255,.92)}
        .appGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
        .card{min-height:310px;padding:26px 22px 20px;border:1px solid rgba(255,255,255,.16);border-radius:20px;background:linear-gradient(180deg,rgba(14,31,51,.90),rgba(4,15,28,.94));box-shadow:0 16px 44px rgba(0,0,0,.34);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;text-decoration:none;display:flex;flex-direction:column;align-items:center;text-align:center;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}
        .card:not(.disabled):hover{transform:translateY(-4px);border-color:rgba(255,255,255,.34);box-shadow:0 22px 52px rgba(0,0,0,.40)}
        .icon{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;font-size:30px;margin-bottom:22px;box-shadow:0 10px 26px rgba(0,0,0,.28)}
        .card h2{margin:0;min-height:50px;display:flex;align-items:center;justify-content:center;font-size:22px;line-height:1.15;font-weight:900}
        .card p{margin:14px 0 18px;font-size:13px;line-height:1.55;color:rgba(255,255,255,.84)}
        .button{width:100%;min-height:44px;margin-top:auto;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900}
        .blue .icon,.blue .button{background:#0b82ff}.blue .icon{color:#ffd43b}
        .green .icon,.green .button{background:#10bf8a}
        .purple .icon,.purple .button{background:linear-gradient(135deg,#7a2cff,#ab00e9)}
        .orange .icon,.orange .button{background:linear-gradient(135deg,#ff7100,#c44b00)}
        .disabled{opacity:.80;cursor:default}
        .bottomGrid{display:grid;grid-template-columns:.9fr 1.1fr;gap:14px;width:min(790px,100%);margin:14px auto 0}
        .infoCard{border:1px solid rgba(255,255,255,.14);border-radius:18px;background:linear-gradient(180deg,rgba(14,31,51,.90),rgba(4,15,28,.94));box-shadow:0 14px 40px rgba(0,0,0,.30);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
        .statusCard{padding:22px 24px;display:flex;align-items:center;gap:18px}
        .statusIcon{width:60px;height:60px;flex:0 0 60px;border-radius:50%;display:grid;place-items:center;background:#10bf8a;font-size:36px;font-weight:900}
        .statusCard h3,.notices h3{margin:0 0 8px;font-size:16px}.statusCard p{margin:0;font-size:12px;color:rgba(255,255,255,.78)}
        .notices{padding:18px 22px}.noticeRow{display:grid;grid-template-columns:1fr auto;align-items:center;gap:12px;padding:5px 0;font-size:12px}.noticeRow b{font-size:10px;padding:4px 8px;border-radius:7px;background:#10bf8a;color:#fff}
        footer{text-align:center;padding-top:14px;font-size:10px;color:rgba(255,255,255,.66)}

        @media(max-width:1050px){.content{width:min(960px,calc(100% - 28px));padding-top:26px}.header{margin-bottom:18px}.appGrid{gap:10px}.card{min-height:270px;padding:20px 12px 16px}.card h2{font-size:17px}.card p{font-size:11px}.icon{width:56px;height:56px;font-size:26px;margin-bottom:15px}.bottomGrid{width:min(720px,100%)}}
        @media(max-width:700px){.bg{background-image:url('/portal-final-kompakt-clean.png');background-position:center}.shade{background:linear-gradient(180deg,rgba(2,10,20,.26),rgba(2,10,20,.56))}.content{width:100%;padding:24px 10px 22px;justify-content:flex-start}.header{margin-bottom:18px}.eyebrow{font-size:11px;letter-spacing:4px}.header h1{font-size:31px}.header p{font-size:11px}.appGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.card{min-height:238px;padding:15px 8px 10px;border-radius:15px}.icon{width:46px;height:46px;font-size:22px;margin-bottom:10px}.card h2{min-height:38px;font-size:13px}.card p{font-size:9.5px;line-height:1.45;margin:9px 0 10px}.button{min-height:34px;font-size:10px}.bottomGrid{grid-template-columns:1fr;gap:8px;margin-top:8px}.statusCard{padding:14px 16px}.statusIcon{width:44px;height:44px;flex-basis:44px;font-size:26px}.notices{padding:13px 16px}.statusCard h3,.notices h3{font-size:13px}.statusCard p,.noticeRow{font-size:10px}footer{padding-top:12px;font-size:9px}}
      `}</style>
    </main>
  );
}
