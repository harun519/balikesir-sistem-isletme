"use client";

export default function Home(){return <main className="portal">
  <div className="stage">
    <img className="portalImage" src="/portal-final-kompakt-clean.jpg" alt="Balıkesir Sistem İşletme Portalı" />

    <a className="cardHit trafo" href="https://balikesir-trafo-degisimi.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Trafo Değişimi">
      <span className="hoverButton blueBtn">Uygulamaya Git →</span>
    </a>
    <a className="cardHit scada" href="https://scada-saha-kontrol-vercel.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="SCADA Saha Kontrol">
      <span className="hoverButton greenBtn">Uygulamaya Git →</span>
    </a>
    <a className="cardHit teyit" href="https://goruntulu-teyit-v1.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Görüntülü Teyit">
      <span className="hoverButton purpleBtn">Uygulamaya Git →</span>
    </a>
  </div>

  <style jsx>{`
    :global(*){box-sizing:border-box}
    :global(html),:global(body){margin:0;width:100%;height:100%;background:#071426;overflow:hidden}
    .portal{width:100vw;height:100dvh;background:#071426;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .stage{position:relative;width:min(100vw,177.7778vh);height:min(100dvh,56.25vw);aspect-ratio:16/9;flex:none;background:#071426}
    .portalImage{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:fill;user-select:none;-webkit-user-drag:none;pointer-events:none}

    .cardHit{position:absolute;z-index:5;top:31.5%;height:38%;background:transparent!important;border:0!important;box-shadow:none!important;outline:0!important;text-decoration:none!important;-webkit-tap-highlight-color:transparent!important}
    .cardHit:hover,.cardHit:focus,.cardHit:active{background:transparent!important;border:0!important;box-shadow:none!important;outline:0!important}
    .trafo{left:13.5%;width:18.8%}.scada{left:33.1%;width:18.8%}.teyit{left:52.7%;width:18.8%}

    .hoverButton{position:absolute;left:7.3%;right:7.3%;bottom:7.2%;height:14%;min-height:28px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:Arial,Helvetica,sans-serif;font-weight:800;font-size:clamp(8px,.72vw,13px);line-height:1;opacity:0;transform:scale(1);transition:transform .16s ease,opacity .08s ease;pointer-events:none;box-shadow:0 5px 16px rgba(0,0,0,.22)}
    .cardHit:hover .hoverButton,.cardHit:focus-visible .hoverButton{opacity:1;transform:scale(1.055)}
    .blueBtn{background:#168cff}.greenBtn{background:#0cc795}.purpleBtn{background:linear-gradient(90deg,#7d2dff,#b000e8)}

    @media(max-width:700px) and (orientation:portrait){
      :global(html),:global(body){overflow:auto;background:#071426}
      .portal{min-height:100dvh;height:auto;align-items:flex-start;overflow:auto}
      .stage{margin-top:18vh;width:100vw;height:56.25vw;aspect-ratio:16/9}
      .cardHit{top:31%;height:40%}
      .hoverButton{display:none}
    }
  `}</style>
 </main>}
