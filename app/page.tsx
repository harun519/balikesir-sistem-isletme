"use client";

const apps = [
  {
    icon:"⚡",
    title:"Trafo Değişimi",
    desc:"Trafo değişim kayıtları, raporlar ve arşiv yönetimi.",
    version:"v10.0",
    status:"Aktif",
    updated:"09.09.2026",
    url:"https://balikesir-trafo-degisimi.vercel.app",
    tone:"blue"
  },
  {
    icon:"📡",
    title:"SCADA Saha Kontrol",
    desc:"SCADA istasyonları saha kontrolleri, uygunsuzluklar ve raporlar.",
    version:"v7.7.3",
    status:"Aktif",
    updated:"09.09.2026",
    url:"https://scada-saha-kontrol-vercel.vercel.app",
    tone:"green"
  },
  {
    icon:"🎥",
    title:"Görüntülü Teyit",
    desc:"Saha çalışmalarının görüntülü teyitleri, haftalık raporlar ve performans analizleri.",
    version:"v125",
    status:"Aktif",
    updated:"09.09.2026",
    url:"https://goruntulu-teyit-v1.vercel.app",
    tone:"violet"
  },
  {
    icon:"🛠️",
    title:"3. Seviye Bakım",
    desc:"Planlı bakım çalışmaları, kontrol formları ve bakım kayıtları.",
    version:"v0.1",
    status:"Hazırlık",
    updated:"Yakında",
    url:"",
    tone:"orange"
  }
];

const tone:any = {
  blue:{
    box:"border-blue-200/80 bg-blue-50/92",
    icon:"bg-blue-100 text-blue-700",
    button:"bg-blue-600 hover:bg-blue-700",
    version:"bg-blue-600 text-white"
  },
  green:{
    box:"border-emerald-200/80 bg-emerald-50/92",
    icon:"bg-emerald-100 text-emerald-700",
    button:"bg-emerald-600 hover:bg-emerald-700",
    version:"bg-emerald-600 text-white"
  },
  violet:{
    box:"border-violet-200/80 bg-violet-50/92",
    icon:"bg-violet-100 text-violet-700",
    button:"bg-violet-600 hover:bg-violet-700",
    version:"bg-violet-600 text-white"
  },
  orange:{
    box:"border-orange-200/80 bg-orange-50/92",
    icon:"bg-orange-100 text-orange-700",
    button:"bg-orange-500",
    version:"bg-orange-500 text-white"
  }
};

export default function Home(){
  const openApp=(url:string)=>{
    if(!url){
      alert("Bu uygulama henüz hazırlık aşamasında.");
      return;
    }
    window.location.href=url;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-900">
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{backgroundImage:"url('/portal-bg.svg')"}}
      />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(6,21,46,.38)_0%,rgba(235,244,255,.70)_28%,rgba(241,247,255,.92)_62%,rgba(232,241,250,.98)_100%)] backdrop-blur-[2px]" />

      <div className="relative z-10">
        <header className="border-b border-white/25 bg-blue-950/45 text-white shadow-sm backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-300 text-2xl shadow-lg shadow-orange-950/20">⚡</div>
              <div>
                <div className="text-sm font-black tracking-[.08em] sm:text-lg">BALIKESİR SİSTEM İŞLETME</div>
                <div className="text-[10px] font-bold text-blue-100 sm:text-xs">Saha ve işletme uygulamaları</div>
              </div>
            </div>
            <div className="hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-blue-900">HB</div>
              <div>
                <div className="text-xs font-black">Harun Başkurt</div>
                <div className="text-[10px] text-blue-100">Yönetici</div>
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1500px] px-5 pb-10 pt-8 lg:px-10 lg:pt-11">
          <div className="mb-7 rounded-[30px] border border-white/30 bg-white/14 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,.16)] backdrop-blur-md sm:p-8">
            <div className="text-[10px] font-black uppercase tracking-[.24em] text-amber-300">Uygulama Merkezi</div>
            <div className="mt-2 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-3xl font-black tracking-tight drop-shadow-sm sm:text-5xl">Uygulamalarım</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
                  Saha çalışmalarını, raporları ve işletme süreçlerini tek merkezden açın.
                </p>
              </div>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/15 px-4 py-2 text-[11px] font-black text-emerald-50">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,.9)]"/>
                3 uygulama aktif
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {apps.map(a=>(
              <article
                key={a.title}
                className={`group relative overflow-hidden rounded-[28px] border p-5 shadow-[0_20px_50px_rgba(15,23,42,.13)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(15,23,42,.18)] ${tone[a.tone].box}`}
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/45 blur-2xl"/>
                <div className="relative flex items-start justify-between gap-3">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm ${tone[a.tone].icon}`}>{a.icon}</div>
                  <span className={`rounded-full px-3 py-1.5 text-[10px] font-black ${a.status==="Aktif"?"bg-emerald-100 text-emerald-700":"bg-slate-200 text-slate-600"}`}>
                    ● {a.status}
                  </span>
                </div>

                <h2 className="relative mt-5 text-xl font-black text-blue-950">{a.title}</h2>
                <p className="relative mt-2 min-h-16 text-sm leading-6 text-slate-600">{a.desc}</p>

                <div className="relative mt-5 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[.16em] text-slate-400">Son Sürüm</div>
                    <div className={`mt-1 inline-flex rounded-lg px-3 py-1.5 text-sm font-black shadow-sm ${tone[a.tone].version}`}>{a.version}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-black uppercase tracking-[.12em] text-slate-400">Güncelleme</div>
                    <div className="mt-1 text-[10px] font-bold text-slate-600">{a.updated}</div>
                  </div>
                </div>

                <button
                  onClick={()=>openApp(a.url)}
                  className={`relative mt-5 w-full rounded-xl px-4 py-3.5 text-sm font-black text-white shadow-md transition ${a.status==="Aktif"?tone[a.tone].button:"cursor-default bg-orange-300"}`}
                >
                  {a.status==="Aktif"?"Uygulamayı Aç  →":"Yakında"}
                </button>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <section className="rounded-3xl border border-white/60 bg-white/88 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xl">✓</div>
                <div>
                  <h3 className="text-sm font-black">Sistem Durumu</h3>
                  <p className="text-[11px] text-slate-500">Aktif uygulamalar kullanıma hazır.</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-[10px] font-bold text-slate-600">
                <span>🟢 Trafo Değişimi</span>
                <span>🟢 SCADA</span>
                <span>🟢 Görüntülü Teyit</span>
              </div>
            </section>

            <section className="rounded-3xl border border-white/60 bg-white/88 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-black">📌 Son Güncellemeler</h3>
              <div className="mt-4 space-y-3 text-[11px] text-slate-600">
                <div className="flex justify-between gap-3"><span>🔵 Trafo Değişimi</span><b>v10.0</b></div>
                <div className="flex justify-between gap-3"><span>🟢 SCADA Saha Kontrol</span><b>v7.7.3</b></div>
                <div className="flex justify-between gap-3"><span>🟣 Görüntülü Teyit</span><b>v125</b></div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/60 bg-white/88 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-black">🔖 Hızlı Erişim</h3>
              <div className="mt-4 space-y-2 text-[11px] font-bold text-slate-600">
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">📖 Kullanım Rehberi <span className="float-right">›</span></div>
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">🛡️ Güvenli • Yetkiler uygulama içinde <span className="float-right">›</span></div>
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">🧰 Sürüm Notları <span className="float-right">›</span></div>
              </div>
            </section>
          </div>
        </section>

        <footer className="border-t border-white/15 bg-blue-950/90 px-5 py-5 text-center text-[10px] text-blue-100 backdrop-blur">
          © 2026 • BALIKESİR SİSTEM İŞLETME • Güvenli • Verimli • Birlikte Daha Güçlü
        </footer>
      </div>
    </main>
  );
}
