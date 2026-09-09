"use client";

export default function Home() {
  return (
    <main className="portal">
      <div className="stage">
        <img
          className="portalImage"
          src="/enerji-portal-tarihsiz-final.png"
          alt="Balıkesir Sistem İşletme Portalı"
        />

        {/* Kartların üstündeki görünmez bağlantılar */}
        <a
          className="hotspot trafo"
          href="https://balikesir-trafo-degisimi.vercel.app"
          aria-label="Trafo Değişimi uygulamasına git"
        />
        <a
          className="hotspot scada"
          href="https://scada-saha-kontrol-vercel.vercel.app"
          aria-label="SCADA Saha Kontrol uygulamasına git"
        />
        <a
          className="hotspot teyit"
          href="https://goruntulu-teyit-v1.vercel.app"
          aria-label="Görüntülü Teyit uygulamasına git"
        />
        <div
          className="hotspot bakim disabled"
          aria-label="3. Seviye Bakım yakında"
          title="Yakında Hizmetinizde"
        />
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html),
        :global(body) {
          margin: 0;
          width: 100%;
          min-width: 320px;
          min-height: 100%;
          background: #071426;
          font-family: Arial, Helvetica, sans-serif;
          overflow-x: hidden;
        }

        .portal {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #071426;
        }

        .stage {
          position: relative;
          width: 100vw;
          aspect-ratio: 1664 / 928;
          overflow: hidden;
          background: #071426;
        }

        .portalImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }

        .hotspot {
          position: absolute;
          z-index: 10;
          top: 33.4%;
          height: 43.0%;
          border-radius: 20px;
          background: transparent;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.15s ease, box-shadow 0.15s ease;
        }

        .hotspot:hover {
          background: rgba(255, 255, 255, 0.025);
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.13);
        }

        .trafo { left: 3.8%; width: 19.8%; }
        .scada { left: 24.2%; width: 19.5%; }
        .teyit { left: 44.4%; width: 19.5%; }
        .bakim { left: 64.5%; width: 19.7%; }

        .disabled {
          cursor: default;
        }

        .disabled:hover {
          background: transparent;
          box-shadow: none;
        }

        @media (max-width: 700px) {
          .portal {
            min-height: 100dvh;
            align-items: flex-start;
          }

          .stage {
            width: 100vw;
            aspect-ratio: 1664 / 928;
          }
        }
      `}</style>
    </main>
  );
}
