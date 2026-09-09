"use client";

export default function Home() {
  return (
    <main className="portal">
      <div className="stage">
        <img
          className="portalImage"
          src="/enerji-portal-final.png"
          alt="Balıkesir Sistem İşletme Portalı"
        />

        {/* Görselin üzerindeki kartlara denk gelen şeffaf tıklama alanları */}
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
          overflow-x: hidden;
          font-family: Arial, Helvetica, sans-serif;
        }

        .portal {
          width: 100%;
          min-height: 100vh;
          background: #071426;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stage {
          position: relative;
          width: 100vw;
          aspect-ratio: 16 / 9;
          max-height: 100vh;
          overflow: hidden;
          background: #071426;
        }

        .portalImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }

        .hotspot {
          position: absolute;
          z-index: 5;
          top: 29.4%;
          height: 35.5%;
          border-radius: 18px;
          cursor: pointer;
          text-decoration: none;
          background: transparent;
          transition: background 0.18s ease, box-shadow 0.18s ease;
        }

        .hotspot:hover {
          background: rgba(255, 255, 255, 0.035);
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.16);
        }

        .trafo { left: 14.9%; width: 17.2%; }
        .scada { left: 32.8%; width: 16.6%; }
        .teyit { left: 50.1%; width: 16.7%; }
        .bakim { left: 67.1%; width: 17.3%; }

        .disabled {
          cursor: default;
        }

        .disabled:hover {
          background: transparent;
          box-shadow: none;
        }

        @media (max-width: 900px) {
          .portal {
            align-items: flex-start;
          }

          .stage {
            width: 100vw;
            min-width: 100vw;
            height: auto;
            aspect-ratio: 16 / 9;
          }
        }

        @media (orientation: portrait) and (max-width: 700px) {
          :global(body) {
            overflow-x: auto;
          }

          .portal {
            justify-content: flex-start;
          }

          .stage {
            width: 1100px;
            min-width: 1100px;
            height: 619px;
          }
        }
      `}</style>
    </main>
  );
}
