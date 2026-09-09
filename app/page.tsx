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
          width: 100%;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          background:
            radial-gradient(circle at 50% 10%, #12375d 0%, #0a1c31 38%, #071426 72%);
        }

        .frame {
          position: relative;
          width: min(88vw, 1480px);
          aspect-ratio: 1664 / 928;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 28px 70px rgba(0, 0, 0, .38);
          background: #071426;
        }

        .portalImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: fill;
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
            overflow: auto;
          }

          .portal {
            align-items: flex-start;
            min-height: 100dvh;
            padding: 10px;
          }

          .frame {
            width: 96vw;
            border-radius: 14px;
          }
        }

        @media (orientation: portrait) and (max-width: 700px) {
          :global(body) {
            overflow-x: auto;
          }

          .portal {
            justify-content: flex-start;
            width: max-content;
            min-width: 100%;
          }

          .frame {
            width: 980px;
            min-width: 980px;
            border-radius: 0;
          }
        }
      `}</style>
    </main>
  );
}
