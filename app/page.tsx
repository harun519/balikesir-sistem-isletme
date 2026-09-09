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

        /* TABLET / DAR YATAY EKRAN */
        @media (max-width: 900px) and (orientation: landscape) {
          :global(html),
          :global(body) {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .portal,
          .frame {
            width: 100vw;
            height: 100dvh;
          }

          .portalImage {
            object-fit: cover;
            object-position: center;
          }
        }

        /* TELEFON PORTRE:
           max-width kullanmıyoruz. Safari viewport ölçüsü ne olursa olsun
           ekran dikeyse bu kural kesin devreye girer. */
        @media (orientation: portrait) {
          :global(html),
          :global(body) {
            margin: 0;
            width: 100%;
            min-width: 0;
            height: 100%;
            min-height: 100%;
            overflow: hidden;
            background: #071426;
          }

          .portal {
            width: 100vw;
            height: 100dvh;
            min-height: 100dvh;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            overflow: hidden;
            background: #071426;
          }

          .frame {
            position: relative;
            width: 100vw;
            height: calc(100vw * 918 / 1713);
            min-width: 0;
            max-width: 100vw;
            flex: 0 0 auto;
            overflow: hidden;
            background: #071426;
          }

          .portalImage {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: fill;
            object-position: center;
          }
        }

      `}</style>
    </main>
  );
}
