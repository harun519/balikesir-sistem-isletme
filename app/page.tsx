"use client";

export default function Home() {
  return (
    <main className="portal">
      <div className="frame">
        <img
          className="portalImage"
          src="/portal-tarihsiz-kompakt.png"
          alt="Balıkesir Sistem İşletme Portalı"
        />

        {/* Görseldeki kartların üstüne denk gelen şeffaf bağlantılar */}
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
          min-width: 320px;
          min-height: 100%;
          background: #071426;
          font-family: Arial, Helvetica, sans-serif;
        }

        :global(body) {
          overflow: hidden;
        }

        .portal {
          width: 100vw;
          height: 100dvh;
          min-height: 100dvh;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #071426;
        }

        .frame {
          position: relative;
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
          background: #071426;
        }

        .portalImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
          user-select: none;
          -webkit-user-drag: none;
        }

        .hotspot {
          position: absolute;
          z-index: 5;
          top: 33.4%;
          height: 43.0%;
          border-radius: 20px;
          background: transparent;
          text-decoration: none;
          cursor: pointer;
          transition: background .16s ease, box-shadow .16s ease;
        }

        .hotspot:hover {
          background: rgba(255, 255, 255, .025);
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, .12);
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

        @media (max-width: 1100px) {
          :global(body) {
            overflow: hidden;
          }

          .portal,
          .frame {
            width: 100vw;
            height: 100dvh;
          }
        }

        @media (orientation: portrait) and (max-width: 700px) {
          :global(body) {
            overflow: auto;
          }

          .portal {
            width: 100vw;
            min-height: 100dvh;
            overflow: auto;
          }

          .frame {
            width: 100vw;
            height: 100dvh;
            min-width: 100vw;
          }
        }

      `}</style>
    </main>
  );
}
