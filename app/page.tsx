"use client";

export default function Home() {
  return (
    <main className="portal">
      <div className="frame">
        <img
          className="portalImage"
          src="/portal-final-kompakt.png"
          alt="Balıkesir Sistem İşletme Portalı"
        />

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
        }

        :global(body) {
          overflow: hidden;
        }

        .portal {
          width: 100vw;
          height: 100dvh;
          margin: 0;
          padding: 0;
          background: #071426;
          overflow: hidden;
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
          top: 31.0%;
          height: 38.5%;
          border-radius: 18px;
          background: transparent;
          text-decoration: none;
          cursor: pointer;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .hotspot:hover,
        .hotspot:focus,
        .hotspot:active {
          background: transparent;
          box-shadow: none;
          outline: none;
        }

        .trafo { left: 4.0%; width: 19.5%; }
        .scada { left: 24.6%; width: 19.2%; }
        .teyit { left: 45.1%; width: 19.0%; }
        .bakim { left: 65.5%; width: 19.2%; }

        .disabled {
          cursor: default;
        }

        .disabled:hover {
          background: transparent;
          box-shadow: none;
        }

        @media (max-width: 900px) {
          :global(body) {
            overflow: auto;
          }

          .portal {
            min-height: 100dvh;
            height: auto;
          }

          .frame {
            width: 100vw;
            aspect-ratio: 1713 / 918;
            height: auto;
          }

          .portalImage {
            object-fit: fill;
          }
        }

        @media (orientation: portrait) and (max-width: 700px) {
          :global(body) {
            overflow-x: auto;
          }

          .portal {
            width: max-content;
            min-width: 100%;
          }

          .frame {
            width: 1000px;
            min-width: 1000px;
            aspect-ratio: 1713 / 918;
          }
        }
      `}</style>
    </main>
  );
}
