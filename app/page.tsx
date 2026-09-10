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
    .portalImage{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:fill;user-select:none;-webkit-user-drag:none}
    .hit{position:absolute;z-index:5;top:31.5%;height:38%;border-radius:18px;background:transparent;cursor:pointer;text-decoration:none;-webkit-tap-highlight-color:transparent;outline:none}
    .hit:hover,.hit:focus,.hit:active{background:rgba(255,255,255,.025);outline:none}
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
