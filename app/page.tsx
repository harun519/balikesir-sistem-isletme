"use client";

const apps = [
  {
    icon:"⚡", title:"Trafo Değişimi",
    desc:"Trafo değişim kayıtları, raporlar ve arşiv yönetimi.",
    version:"v10.0", status:"Aktif",
    url:"https://balikesir-trafo-degisimi.vercel.app",
    tone:"blue"
  },
  {
    icon:"📡", title:"SCADA Saha Kontrol",
    desc:"SCADA istasyonları saha kontrolleri, uygunsuzluklar ve raporlar.",
    version:"v7.5.1", status:"Aktif",
    url:"#SCADA_URL",
    tone:"green"
  },
  {
    icon:"🎥", title:"Görüntülü Teyit",
    desc:"Saha çalışmalarının görüntülü teyitleri, haftalık raporlar ve performans analizleri.",
    version:"v100", status:"Aktif",
    url:"#GORUNTULU_TEYIT_URL",
    tone:"violet"
  },
  {
    icon:"🛠️", title:"3. Seviye Bakım",
    desc:"Planlı bakım çalışmaları, kontrol formları ve bakım kayıtları.",
    version:"v0.1", status:"Hazırlık",
    url:"",
    tone:"orange"
  }
];

const tone:any = {
  blue:{box:"border-blue-200 bg-blue-50/90",icon:"bg-blue-100 text-blue-700",button:"bg-blue-600 hover:bg-blue-700"},
  green:{box:"border-emerald-200 bg-emerald-50/90",icon:"bg-emerald-100 text-emerald-700",button:"bg-emerald-600 hover:bg-emerald-700"},
  violet:{box:"border-violet-200 bg-violet-50/90",icon:"bg-violet-100 text-violet-700",button:"bg-violet-600 hover:bg-violet-700"},
  orange:{box:"border-orange-200 bg-orange-50/90",icon:"bg-orange-100 text-orange-700",button:"bg-orange-500"}
};

export default function Home(){
  const openApp=(url:string)=>{
    if(!url || url.startsWith("#")){
      alert("Bu uygulamanın adresini birazdan bağlayacağız.");
      return;
    }
    window.location.href=url;
  };

  return <main className="min-h-screen bg-[radial-gradient(circle_at_70%_0%,rgba(251,191,36,.20),transparent_25%),radial-gradient(circle_at_10%_20%,rgba(59,130,246,.14),transparent_28%),linear-gradient(180deg,#eef6ff_0%,#f8fbff_50%,#eaf3fb_100%)] text-slate-900">
    <header className="border-b border-white/70 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-300 text-2xl shadow-lg">⚡</div>
          <div><div className="text-sm font-black tracking-[.08em] text-blue-950 sm:text-lg">BALIKESİR SİSTEM İŞLETME</div><div className="text-[10px] font-bold text-slate-500 sm:text-xs">Saha ve işletme uygulamaları</div></div>
        </div>
        <div className="hidden items-center gap-3 sm:flex"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-black text-white">HB</div><div><div className="text-xs font-black">Harun Başkurt</div><div className="text-[10px] text-slate-500">Yönetici</div></div></div>
      </div>
    </header>

    <section className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10 lg:py-12">
      <div className="mb-7">
        <div className="text-[10px] font-black uppercase tracking-[.22em] text-blue-600">Uygulama Merkezi</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-blue-950 sm:text-5xl">Uygulamalarım</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Saha çalışmalarını, raporları ve işletme süreçlerini tek merkezden açın.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {apps.map(a=><article key={a.title} className={`rounded-[26px] border p-5 shadow-[0_18px_45px_rgba(15,23,42,.10)] backdrop-blur ${tone[a.tone].box}`}>
          <div className="flex items-start justify-between gap-3">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${tone[a.tone].icon}`}>{a.icon}</div>
            <span className={`rounded-full px-3 py-1.5 text-[10px] font-black ${a.status==="Aktif"?"bg-emerald-100 text-emerald-700":"bg-slate-200 text-slate-600"}`}>● {a.status}</span>
          </div>
          <h2 className="mt-5 text-xl font-black text-blue-950">{a.title}</h2>
          <p className="mt-2 min-h-16 text-sm leading-6 text-slate-600">{a.desc}</p>
          <div className="mt-5 flex items-center gap-2 text-[10px] font-bold text-slate-500"><span className="font-black text-slate-700">{a.version}</span><span>•</span><span>{a.status==="Aktif"?"09.09.2026":"Yakında"}</span></div>
          <button onClick={()=>openApp(a.url)} className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-black text-white shadow-md transition ${a.status==="Aktif"?tone[a.tone].button:"cursor-default bg-orange-300"}`}>{a.status==="Aktif"?"Uygulamayı Aç  →":"Yakında"}</button>
        </article>)}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-lg">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xl">✓</div><div><h3 className="text-sm font-black">Sistem Durumu</h3><p className="text-[11px] text-slate-500">Aktif uygulamalar kullanıma hazır.</p></div></div>
          <div className="mt-5 flex flex-wrap gap-3 text-[10px] font-bold text-slate-600"><span>🟢 Trafo Değişimi</span><span>🟢 SCADA</span><span>🟢 Görüntülü Teyit</span></div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-lg">
          <h3 className="text-sm font-black">📌 Son Güncellemeler</h3>
          <div className="mt-4 space-y-3 text-[11px] text-slate-600"><div>🔵 Trafo Değişimi v10.0</div><div>🟢 SCADA Saha Kontrol v7.5.1</div><div>🟣 Görüntülü Teyit v100</div></div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-lg">
          <h3 className="text-sm font-black">🔖 Hızlı Erişim</h3>
          <div className="mt-4 space-y-2 text-[11px] font-bold text-slate-600"><div className="rounded-xl bg-slate-50 px-3 py-2.5">📖 Kullanım Rehberi <span className="float-right">›</span></div><div className="rounded-xl bg-slate-50 px-3 py-2.5">🛡️ Güvenli • Yetkiler uygulama içinde <span className="float-right">›</span></div><div className="rounded-xl bg-slate-50 px-3 py-2.5">🧰 Sürüm Notları <span className="float-right">›</span></div></div>
        </section>
      </div>
    </section>

    <footer className="mt-8 border-t border-slate-200 bg-blue-950 px-5 py-5 text-center text-[10px] text-blue-100">
      © 2026 • BALIKESİR SİSTEM İŞLETME • Güvenli • Verimli • Birlikte Daha Güçlü
    </footer>
  </main>
}
