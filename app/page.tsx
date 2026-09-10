"use client";

export default function Home() {
  return (
    <main className="portal">
      {/* MASAÜSTÜ + TABLET: mevcut çalışan görünüm aynen korunuyor */}
      <div className="desktopFrame">
        <img
          className="portalImage"
          src="/portal-final-kompakt-clean.jpg"
          alt="Balıkesir Sistem İşletme Portalı"
        />

        <a className="hotspot trafo" href="https://balikesir-trafo-degisimi.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Trafo Değişimi uygulamasını yeni sekmede aç" />
        <a className="hotspot scada" href="https://scada-saha-kontrol-vercel.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="SCADA Saha Kontrol uygulamasını yeni sekmede aç" />
        <a className="hotspot teyit" href="https://goruntulu-teyit-v1.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Görüntülü Teyit uygulamasını yeni sekmede aç" />
        <div className="hotspot bakim disabled" aria-label="3. Seviye Bakım yakında" />
      </div>

      {/* TELEFON: ayrı mobil arayüz */}
      <div className="mobilePage">
        <div className="mobileBg" />
        <div className="mobileShade" />

        <div className="mobileContent">
          <header className="mobileHeader">
            <h1>BALIKESİR<br />SİSTEM İŞLETME</h1>
            <p>Daha güvenli, daha kesintisiz bir enerji için...</p>
          </header>

          <section className="mobileGrid">
            <a className="mobileCard blueCard" href="https://balikesir-trafo-degisimi.vercel.app" target="_blank" rel="noopener noreferrer">
              <div className="mobileIcon blueIcon">
                <svg viewBox="0 0 24 24"><path d="M13 2 5.5 13H11l-1 9L18.5 10H13V2Z" fill="currentColor"/></svg>
              </div>
              <h2>Trafo Değişimi</h2>
              <p>Trafo değişim kayıtları,<br />raporlar ve arşiv</p>
              <div className="mobileButton blueButton">→ Uygulamaya Git</div>
            </a>

            <a className="mobileCard greenCard" href="https://scada-saha-kontrol-vercel.vercel.app" target="_blank" rel="noopener noreferrer">
              <div className="mobileIcon greenIcon">
                <svg viewBox="0 0 24 24">
                  <rect x="4" y="5" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 21h6M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h2>SCADA Saha Kontrol</h2>
              <p>SCADA istasyon kontrolü,<br />uygunsuzluklar ve raporlar</p>
              <div className="mobileButton greenButton">→ Uygulamaya Git</div>
            </a>

            <a className="mobileCard purpleCard" href="https://goruntulu-teyit-v1.vercel.app" target="_blank" rel="noopener noreferrer">
              <div className="mobileIcon purpleIcon">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="6" width="13" height="12" rx="3" fill="currentColor"/>
                  <path d="m17 10 4-2v8l-4-2v-4Z" fill="currentColor"/>
                </svg>
              </div>
              <h2>Görüntülü Teyit</h2>
              <p>Saha görüntü teyitleri,<br />uygunluk kontrolleri ve raporlar</p>
              <div className="mobileButton purpleButton">→ Uygulamaya Git</div>
            </a>

            <article className="mobileCard orangeCard">
              <div className="mobileIcon orangeIcon">
                <svg viewBox="0 0 24 24"><path d="M14.8 6.2a5 5 0 0 0-6.4 6.4L3 18l3 3 5.4-5.4a5 5 0 0 0 6.4-6.4l-3 3-3-3 3-3Z" fill="currentColor"/></svg>
              </div>
              <h2>3. Seviye Bakım</h2>
              <p>3. seviye bakım faaliyetleri,<br />kontroller ve raporlar</p>
              <div className="mobileButton orangeButton">◷ Yakında</div>
            </article>
          </section>

          <footer>Balıkesir Sistem İşletme Portalı</footer>
        </div>
      </div>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html), :global(body) { margin:0;width:100%;min-width:320px;min-height:100%;background:#071426;font-family:Arial,Helvetica,sans-serif; }
        :global(body) { overflow:hidden; }
        .portal { width:100vw;height:100dvh;margin:0;padding:0;background:#071426;overflow:hidden; }
        .desktopFrame { position:relative;width:100vw;height:100dvh;overflow:hidden;background:#071426; }
        .portalImage { position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;object-position:center;user-select:none;-webkit-user-drag:none; }
        .hotspot { position:absolute;z-index:5;top:31%;height:38.5%;border-radius:18px;background:transparent;text-decoration:none;cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent; }
        .hotspot:hover,.hotspot:focus,.hotspot:active { background:transparent;box-shadow:none;outline:none; }
        .trafo { left:4%;width:19.5%; }.scada { left:24.6%;width:19.2%; }.teyit { left:45.1%;width:19%; }.bakim { left:65.5%;width:19.2%;cursor:default; }
        .mobilePage { display:none; }
        @media (orientation:portrait) and (max-width:700px) {
          :global(html),:global(body){width:100%;min-width:0;min-height:100%;overflow-x:hidden;overflow-y:auto;background:#071426}:global(body){overflow-y:auto}.portal{width:100%;height:auto;min-height:100dvh;overflow:visible}.desktopFrame{display:none}.mobilePage{position:relative;display:block;width:100%;min-height:100dvh;overflow:hidden;background:#071426}.mobileBg{position:fixed;inset:-30px;background:url("/portal-final-kompakt.png") center/cover no-repeat;filter:blur(18px) brightness(.48) saturate(.9);transform:scale(1.08)}.mobileShade{position:fixed;inset:0;background:linear-gradient(180deg,rgba(3,14,28,.20),rgba(3,14,28,.58)),radial-gradient(circle at 50% 5%,rgba(18,80,135,.22),transparent 40%)}.mobileContent{position:relative;z-index:2;width:100%;max-width:520px;margin:0 auto;padding:28px 12px 24px}.mobileHeader{text-align:center;padding:4px 4px 22px}.mobileHeader h1{margin:0;font-size:clamp(27px,8vw,38px);line-height:1.02;font-weight:900;letter-spacing:.3px;text-shadow:0 3px 18px rgba(0,0,0,.35)}.mobileHeader p{margin:10px 0 0;font-size:12px;color:rgba(255,255,255,.86)}.mobileGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.mobileCard{min-width:0;min-height:244px;padding:15px 9px 10px;border:1px solid rgba(255,255,255,.16);border-radius:16px;background:linear-gradient(180deg,rgba(19,33,52,.90),rgba(7,18,33,.94));box-shadow:0 10px 28px rgba(0,0,0,.25);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;text-decoration:none;display:flex;flex-direction:column;align-items:center;text-align:center;-webkit-tap-highlight-color:transparent}.mobileIcon{width:48px;height:48px;flex:0 0 48px;border-radius:50%;display:grid;place-items:center;margin-bottom:11px;box-shadow:0 7px 18px rgba(0,0,0,.22)}.mobileIcon :global(svg){width:25px;height:25px}.blueIcon{background:#0878ff;color:#ffd43b}.greenIcon{background:#08bf89;color:#fff}.purpleIcon{background:linear-gradient(135deg,#7436ff,#a400ff);color:#fff}.orangeIcon{background:linear-gradient(135deg,#ff7100,#d95100);color:#fff}.mobileCard h2{margin:0;min-height:34px;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1.15;font-weight:800}.mobileCard p{margin:12px 0 10px;font-size:10.5px;line-height:1.45;color:rgba(255,255,255,.84)}.mobileButton{width:100%;min-height:36px;margin-top:auto;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:7px 5px;font-size:10.5px;line-height:1.1;font-weight:800;color:#fff}.blueButton{background:#0878ff}.greenButton{background:#08bd86}.purpleButton{background:linear-gradient(90deg,#7639ff,#a100ef)}.orangeButton{background:linear-gradient(90deg,#c74c00,#a83f00)}footer{padding:18px 0 4px;text-align:center;font-size:9px;color:rgba(255,255,255,.58)}
        }
        @media (orientation:portrait) and (max-width:360px){.mobileContent{padding-left:8px;padding-right:8px}.mobileGrid{gap:7px}.mobileCard{padding-left:6px;padding-right:6px}.mobileCard h2{font-size:12.5px}.mobileCard p{font-size:9.5px}.mobileButton{font-size:9.5px}}
      `}</style>
    </main>
  );
}
