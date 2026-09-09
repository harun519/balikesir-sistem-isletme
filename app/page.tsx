"use client";

const apps = [
  { name: "Trafo Değişimi", href: "https://balikesir-trafo-degisimi.vercel.app", icon: "⚡", tone: "blue" },
  { name: "SCADA Saha Kontrol", href: "https://scada-saha-kontrol-vercel.vercel.app", icon: "▣", tone: "green" },
  { name: "Görüntülü Teyit", href: "https://goruntulu-teyit-v1.vercel.app", icon: "▰", tone: "purple" },
];

export default function Home() {
  return (
    <main className="portal">
      <div className="background" />
      <div className="shade" />
      <section className="content">
        <header>
          <div className="brandIcon">⚡</div>
          <div>
            <h1>BALIKESİR SİSTEM İŞLETME</h1>
            <p>Uygulamalar</p>
          </div>
        </header>

        <nav className="appGrid" aria-label="Sistem İşletme uygulamaları">
          {apps.map((app) => (
            <a key={app.name} className={`appButton ${app.tone}`} href={app.href}>
              <span className="appIcon">{app.icon}</span>
              <strong>{app.name}</strong>
              <span className="arrow">→</span>
            </a>
          ))}
          <div className="appButton orange disabled" aria-disabled="true">
            <span className="appIcon">🔧</span>
            <strong>3. Seviye Bakım</strong>
            <span className="soon">Yakında</span>
          </div>
        </nav>
      </section>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html),:global(body){margin:0;min-width:320px;min-height:100%;font-family:Arial,Helvetica,sans-serif;background:#071426}
        :global(body){overflow:auto}
        .portal{position:relative;min-height:100dvh;display:grid;place-items:center;overflow:hidden;color:#fff;padding:28px}
        .background{position:fixed;inset:-24px;background:url("/portal-final-kompakt.png") center/cover no-repeat;filter:blur(18px) brightness(.38) saturate(.85);transform:scale(1.06)}
        .shade{position:fixed;inset:0;background:linear-gradient(135deg,rgba(3,14,28,.72),rgba(8,35,67,.78))}
        .content{position:relative;z-index:1;width:min(1080px,100%);padding:34px;border:1px solid rgba(255,255,255,.14);border-radius:28px;background:rgba(8,22,40,.72);box-shadow:0 24px 70px rgba(0,0,0,.34);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
        header{display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:32px;text-align:left}
        .brandIcon{width:58px;height:58px;border-radius:17px;display:grid;place-items:center;background:#2563eb;font-size:27px;box-shadow:0 10px 26px rgba(37,99,235,.35)}
        h1{margin:0;font-size:clamp(24px,3.4vw,40px);line-height:1;font-weight:900;letter-spacing:.2px}
        p{margin:8px 0 0;color:rgba(255,255,255,.68);font-size:14px}
        .appGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
        .appButton{min-height:112px;display:grid;grid-template-columns:58px 1fr auto;align-items:center;gap:18px;padding:22px 24px;border:1px solid rgba(255,255,255,.15);border-radius:20px;color:#fff;text-decoration:none;background:rgba(15,32,54,.92);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
        a.appButton:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.36);box-shadow:0 15px 32px rgba(0,0,0,.24)}
        .appIcon{width:58px;height:58px;border-radius:17px;display:grid;place-items:center;font-size:25px;background:rgba(255,255,255,.10)}
        strong{font-size:clamp(16px,2vw,21px)}
        .arrow{font-size:29px;font-weight:900}
        .soon{padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.10);font-size:12px;font-weight:800}
        .blue{border-left:5px solid #3b82f6}.blue .appIcon{color:#8ec5ff;background:#172f58}
        .green{border-left:5px solid #22c55e}.green .appIcon{color:#78e49b;background:#143c2a}
        .purple{border-left:5px solid #a855f7}.purple .appIcon{color:#d3a4ff;background:#35204d}
        .orange{border-left:5px solid #f59e0b}.orange .appIcon{background:#493315}
        .disabled{opacity:.58;cursor:default}
        @media(max-width:700px){
          .portal{padding:14px;place-items:start center}
          .content{margin-top:10px;padding:24px 14px;border-radius:22px}
          header{justify-content:flex-start;margin:5px 5px 24px;gap:12px}
          .brandIcon{width:48px;height:48px;border-radius:14px;font-size:22px}
          h1{font-size:22px;line-height:1.08}
          p{font-size:12px;margin-top:5px}
          .appGrid{grid-template-columns:1fr;gap:11px}
          .appButton{min-height:82px;grid-template-columns:48px 1fr auto;gap:13px;padding:15px;border-radius:16px}
          .appIcon{width:48px;height:48px;border-radius:14px;font-size:21px}
          strong{font-size:16px}
          .arrow{font-size:24px}
        }
      `}</style>
    </main>
  );
}
