"use client";

import type { ReactNode } from "react";

type AppItem = {
  key: string;
  title: string;
  version: string;
  description: string;
  href: string;
  tone: "blue" | "green" | "purple" | "orange";
  disabled?: boolean;
  icon: ReactNode;
};

const apps: AppItem[] = [
  {
    key: "trafo",
    title: "Trafo Değişimi",
    version: "v10.0",
    description: "Trafo değişim kayıtları, raporlar ve arşiv",
    href: "https://balikesir-trafo-degisimi.vercel.app",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2 5.5 13H11l-1 9L18.5 10H13l0-8Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "scada",
    title: "SCADA Saha Kontrol",
    version: "v7.7.3",
    description: "SCADA istasyon kontrolü, uygunsuzluklar ve raporlar",
    href: "https://scada-saha-kontrol-vercel.vercel.app",
    tone: "green",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M9 21h6M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "teyit",
    title: "Görüntülü Teyit",
    version: "v125",
    description: "Saha görüntü teyitleri, uygunluk kontrolleri ve raporlar",
    href: "https://goruntulu-teyit-v1.vercel.app",
    tone: "purple",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="13" height="12" rx="3" fill="currentColor" />
        <path d="m17 10 4-2v8l-4-2v-4Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "bakim",
    title: "3. Seviye Bakım",
    version: "Yakında",
    description: "3. seviye bakım faaliyetleri, kontroller ve raporlar",
    href: "",
    tone: "orange",
    disabled: true,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.8 6.2a5 5 0 0 0-6.4 6.4L3 18l3 3 5.4-5.4a5 5 0 0 0 6.4-6.4l-3 3-3-3 3-3Z" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="portal">
      <div className="bg" />
      <div className="shade" />

      <section className="shell">
        <header className="hero">
          <h1>BALIKESİR SİSTEM İŞLETME</h1>
          <p>Daha güvenli, daha kesintisiz bir enerji için...</p>
        </header>

        <div className="appGrid">
          {apps.map((app) => {
            const content = (
              <>
                <div className={`iconWrap ${app.tone}`}>{app.icon}</div>
                <h2>{app.title}</h2>
                <span className={`badge ${app.tone}`}>{app.version}</span>
                <p>{app.description}</p>
                <div className={`button ${app.tone} ${app.disabled ? "isDisabled" : ""}`}>
                  {app.disabled ? "Yakında Hizmetinizde" : "Uygulamaya Git"}
                </div>
              </>
            );

            return app.disabled ? (
              <article key={app.key} className="appCard disabledCard">
                {content}
              </article>
            ) : (
              <a key={app.key} className="appCard" href={app.href}>
                {content}
              </a>
            );
          })}
        </div>

        <div className="bottomGrid">
          <section className="statusCard">
            <div className="checkIcon">✓</div>
            <div>
              <h3>3 Uygulama Aktif</h3>
              <p>Tüm sistemler hazır durumda</p>
            </div>
          </section>

          <section className="updatesCard">
            <div className="updatesTitle">
              <span className="clockIcon">◷</span>
              <h3>Son Güncellemeler</h3>
            </div>

            <div className="updateRow">
              <span>Trafo Değişimi</span>
              <b className="mini blue">v10.0</b>
              <time>09.09.2026</time>
            </div>
            <div className="updateRow">
              <span>SCADA Saha Kontrol</span>
              <b className="mini green">v7.7.3</b>
              <time>09.09.2026</time>
            </div>
            <div className="updateRow">
              <span>Görüntülü Teyit</span>
              <b className="mini purple">v125</b>
              <time>09.09.2026</time>
            </div>
          </section>
        </div>

        <footer>
          <span>Balıkesir Sistem İşletme Portalı</span>
          <span>Güvenli&nbsp;&nbsp; | &nbsp;&nbsp;Sürdürülebilir&nbsp;&nbsp; | &nbsp;&nbsp;Kesintisiz Enerji</span>
        </footer>
      </section>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html), :global(body) {
          margin: 0;
          min-width: 320px;
          min-height: 100%;
          background: #071426;
          font-family: Arial, Helvetica, sans-serif;
        }
        :global(body) { overflow-x: hidden; }

        .portal {
          position: relative;
          min-height: 100dvh;
          color: #fff;
          overflow: hidden;
          background: #071426;
        }

        .bg {
          position: fixed;
          inset: -18px;
          z-index: 0;
          background: url("/enerji-portal-tarihsiz-final.png") center / cover no-repeat;
          filter: blur(10px) brightness(.62) saturate(.9);
          transform: scale(1.035);
        }

        .shade {
          position: fixed;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(circle at 50% 15%, rgba(24, 76, 132, .18), transparent 35%),
            linear-gradient(180deg, rgba(3, 12, 26, .20), rgba(3, 12, 26, .48));
        }

        .shell {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 44px));
          min-height: 100dvh;
          margin: 0 auto;
          padding: 44px 0 22px;
          display: flex;
          flex-direction: column;
        }

        .hero {
          text-align: center;
          margin-bottom: 28px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(30px, 3.1vw, 46px);
          line-height: 1.06;
          font-weight: 800;
          letter-spacing: .6px;
          text-shadow: 0 3px 18px rgba(0,0,0,.28);
        }

        .hero p {
          margin: 10px 0 0;
          font-size: clamp(14px, 1.25vw, 18px);
          color: rgba(255,255,255,.90);
          text-shadow: 0 2px 10px rgba(0,0,0,.26);
        }

        .appGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .appCard {
          min-height: 310px;
          padding: 22px 18px 16px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.15);
          background: linear-gradient(180deg, rgba(18, 31, 50, .82), rgba(8, 18, 33, .88));
          box-shadow: 0 14px 38px rgba(0,0,0,.24);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #fff;
          text-decoration: none;
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }

        a.appCard:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,.28);
          background: linear-gradient(180deg, rgba(24, 40, 64, .88), rgba(9, 21, 38, .92));
        }

        .disabledCard {
          opacity: .96;
        }

        .iconWrap {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          margin-bottom: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,.18);
        }

        .iconWrap :global(svg) {
          width: 30px;
          height: 30px;
        }

        .appCard h2 {
          margin: 0;
          font-size: 19px;
          line-height: 1.2;
          font-weight: 800;
          text-align: center;
        }

        .badge {
          margin-top: 10px;
          padding: 6px 13px;
          border-radius: 999px;
          font-size: 12px;
          line-height: 1;
          font-weight: 800;
        }

        .appCard p {
          margin: 15px 0 18px;
          min-height: 44px;
          font-size: 13.5px;
          line-height: 1.55;
          text-align: center;
          color: rgba(255,255,255,.86);
        }

        .button {
          width: 100%;
          min-height: 44px;
          margin-top: auto;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13.5px;
          font-weight: 800;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.16);
        }

        .button:not(.isDisabled)::before {
          content: "→";
          margin-right: 8px;
        }

        .button.isDisabled::before {
          content: "◷";
          margin-right: 8px;
        }

        .blue { background: #0d6efd; }
        .green { background: #0bc58b; }
        .purple { background: linear-gradient(135deg, #7b35ff, #a100ff); }
        .orange { background: linear-gradient(135deg, #d95a00, #b94a00); }

        .iconWrap.blue { color: #ffd43b; }
        .iconWrap.green,
        .iconWrap.purple,
        .iconWrap.orange { color: #fff; }

        .bottomGrid {
          width: min(770px, 100%);
          margin: 18px auto 0;
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 16px;
        }

        .statusCard,
        .updatesCard {
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 18px;
          background: rgba(7, 20, 37, .84);
          box-shadow: 0 14px 34px rgba(0,0,0,.20);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .statusCard {
          min-height: 132px;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .checkIcon {
          width: 52px;
          height: 52px;
          flex: 0 0 52px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #0bc58b;
          font-size: 31px;
          font-weight: 800;
        }

        .statusCard h3,
        .updatesCard h3 {
          margin: 0;
          font-size: 17px;
          line-height: 1.2;
        }

        .statusCard p {
          margin: 7px 0 0;
          font-size: 12px;
          color: rgba(255,255,255,.72);
        }

        .updatesCard {
          padding: 18px 20px;
        }

        .updatesTitle {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .clockIcon {
          font-size: 23px;
          line-height: 1;
        }

        .updateRow {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 12px;
          min-height: 31px;
          font-size: 12px;
        }

        .updateRow > span:first-child {
          font-weight: 700;
        }

        .mini {
          min-width: 54px;
          padding: 5px 8px;
          border-radius: 6px;
          text-align: center;
          font-size: 11px;
          line-height: 1;
        }

        .updateRow time {
          color: rgba(255,255,255,.78);
          font-size: 11px;
        }

        footer {
          margin-top: auto;
          padding: 20px 2px 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          font-size: 10.5px;
          color: rgba(255,255,255,.72);
        }

        @media (max-width: 1050px) {
          .shell {
            width: min(860px, calc(100% - 32px));
            padding-top: 28px;
          }
          .appGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .appCard { min-height: 285px; }
          .bottomGrid { width: 100%; }
        }

        @media (max-width: 620px) {
          .shell {
            width: min(100% - 22px, 520px);
            padding-top: 24px;
          }
          .hero { margin-bottom: 20px; }
          .hero h1 { font-size: 28px; }
          .appGrid { grid-template-columns: 1fr; gap: 12px; }
          .appCard { min-height: 0; padding: 20px 16px 15px; }
          .appCard p { min-height: 0; }
          .bottomGrid { grid-template-columns: 1fr; }
          footer {
            flex-direction: column;
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
