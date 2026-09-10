"use client";

export default function Home(){return <main className="portal">
  <div className="stage">
    <img className="portalImage" src="/portal-final-kompakt-clean.jpg" alt="Balıkesir Sistem İşletme Portalı" />
    <a className="hit trafo" href="https://balikesir-trafo-degisimi.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Trafo Değişimi" />
    <a className="hit scada" href="https://scada-saha-kontrol-vercel.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="SCADA Saha Kontrol" />
    <a className="hit teyit" href="https://goruntulu-teyit-v1.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Görüntülü Teyit" />
  </div>
  <style jsx>{`
    :global(*){box-sizing:border-box}
    :global(html),:global(body){margin:0;width:100%;height:100%;background:#071426;overflow:hidden}
    .portal{width:100vw;height:100dvh;background:#071426;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .stage{position:relative;width:min(100vw,177.7778vh);height:min(100dvh,56.25vw);aspect-ratio:16/9;flex:none;background:#071426}
    .portalImage{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:fill;user-select:none;-webkit-user-drag:none;pointer-events:none}
    .hit{position:absolute;z-index:5;top:31.5%;height:38%;border:0!important;border-radius:0!important;background:transparent!important;background-color:transparent!important;box-shadow:none!important;opacity:1!important;cursor:pointer;text-decoration:none!important;-webkit-tap-highlight-color:transparent!important;outline:0!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;transition:none!important}
    .hit:hover,.hit:focus,.hit:focus-visible,.hit:active,.hit:visited{background:transparent!important;background-color:transparent!important;border:0!important;box-shadow:none!important;outline:0!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;opacity:1!important;transform:none!important}
    .hit::before,.hit::after{display:none!important;content:none!important}
    .trafo{left:13.5%;width:18.8%}
    .scada{left:33.1%;width:18.8%}
    .teyit{left:52.7%;width:18.8%}
    @media(max-width:700px) and (orientation:portrait){
      :global(html),:global(body){overflow:auto;background:#071426}
      .portal{min-height:100dvh;height:auto;align-items:flex-start;overflow:auto}
      .stage{margin-top:18vh;width:100vw;height:56.25vw;aspect-ratio:16/9}
      .hit{top:31%;height:40%}
    }
  `}</style>
 </main>}
