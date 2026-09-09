"use client";

import { useEffect, useState } from "react";

const apps = [
  {
    icon: "⚡",
    title: "Trafo Değişimi",
    version: "v10.0",
    desc: "Trafo değişim kayıtları,\nraporlar ve arşiv",
    url: "https://balikesir-trafo-degisimi.vercel.app",
    tone: "blue",
    active: true,
  },
  {
    icon: "▣",
    title: "SCADA Saha Kontrol",
    version: "v7.7.3",
    desc: "SCADA istasyon kontrolü,\nuygunsuzluklar ve raporlar",
    url: "https://scada-saha-kontrol-vercel.vercel.app",
    tone: "green",
    active: true,
  },
  {
    icon: "🎥",
    title: "Görüntülü Teyit",
    version: "v125",
    desc: "Saha görüntü teyitleri,\nuygunluk kontrolleri ve raporlar",
    url: "https://goruntulu-teyit-v1.vercel.app",
    tone: "violet",
    active: true,
  },
  {
    icon: "🔧",
    title: "3. Seviye Bakım",
    version: "Yakında",
    desc: "3. seviye bakım faaliyetleri,\nkontroller ve raporlar",
    url: "",
    tone: "orange",
    active: false,
  },
];

const tone: Record<string, {
  icon: string;
  badge: string;
  button: string;
}> = {
  blue: {
    icon: "from-blue-500 to-blue-700",
    badge: "bg-blue-600",
    button: "from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800",
  },
  green: {
    icon: "from-emerald-400 to-emerald-600",
    badge: "bg-emerald-600",
    button: "from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700",
  },
  violet: {
    icon: "from-violet-500 to-purple-700",
    badge: "bg-violet-600",
    button: "from-violet-500 to-purple-700 hover:from-violet-600 hover:to-purple-800",
  },
  orange: {
    icon: "from-orange-400 to-orange-600",
    badge: "bg-orange-500",
    button: "from-orange-500 to-amber-600",
  },
};

export default function Home() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const dateText = now
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(now)
    : "09 Eylül 2026";

  const dayText = now
    ? new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(now)
    : "Çarşamba";

  const timeText = now
    ? new Intl.DateTimeFormat("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now)
    : "09:59";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 font-sans text-white">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/enerji-portal-arka-plan.png')" }}
      />
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(2,8,23,.08),rgba(2,8,23,.22)_45%,rgba(2,8,23,.42)_100%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-[1540px] justify-end px-6 pt-5 sm:px-10 lg:px-12">
          <div className="rounded-2xl border border-white/20 bg-slate-950/55 px-5 py-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📅</div>
              <div>
                <div className="text-sm font-black">{dateText}</div>
                <div className="mt-0.5 text-[11px] font-semibold text-white/90">
                  {dayText} &nbsp;|&nbsp; {timeText}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-center px-5 pb-6 pt-2 sm:px-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-black tracking-[.025em] drop-shadow-[0_3px_7px_rgba(0,0,0,.55)] sm:text-4xl lg:text-5xl">
              BALIKESİR SİSTEM İŞLETME
            </h1>
            <p className="mt-2 text-sm font-medium text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,.55)] sm:text-base">
              Daha güvenli, daha kesintisiz bir enerji için...
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {apps.map((app) => (
              <article
                key={app.title}
                className="rounded-[22px] border border-white/20 bg-[linear-gradient(180deg,rgba(39,47,58,.66),rgba(17,24,39,.74))] p-5 shadow-[0_18px_50px_rgba(0,0,0,.34)] backdrop-blur-[14px]"
              >
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-3xl font-black shadow-xl ${tone[app.tone].icon}`}>
                  {app.icon}
                </div>

                <h2 className="mt-4 text-center text-xl font-black drop-shadow">
                  {app.title}
                </h2>

                <div className="mt-3 flex justify-center">
                  <span className={`rounded-full px-4 py-1.5 text-sm font-black shadow ${tone[app.tone].badge}`}>
                    {app.version}
                  </span>
                </div>

                <p className="mt-4 min-h-14 whitespace-pre-line text-center text-sm font-semibold leading-6 text-white/92">
                  {app.desc}
                </p>

                {app.active ? (
                  <a
                    href={app.url}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-3 text-sm font-black shadow-lg transition ${tone[app.tone].button}`}
                  >
                    <span>→</span>
                    Uygulamaya Git
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-700/80 to-amber-700/80 px-4 py-3 text-sm font-black text-white/85 shadow-lg"
                  >
                    <span>◷</span>
                    Yakında Hizmetinizde
                  </button>
                )}
              </article>
            ))}
          </div>

          <div className="mx-auto mt-5 grid w-full max-w-[760px] gap-5 md:grid-cols-2">
            <section className="rounded-[20px] border border-white/15 bg-slate-950/60 p-5 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl font-black shadow">
                  ✓
                </div>
                <div>
                  <div className="text-lg font-black">3 Uygulama Aktif</div>
                  <div className="mt-1 text-xs text-white/72">
                    Tüm sistemler hazır durumda
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[20px] border border-white/15 bg-slate-950/60 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="flex items-center gap-2 text-base font-black">
                <span>◷</span> Son Güncellemeler
              </h3>
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <span className="font-bold">Trafo Değişimi</span>
                  <span className="rounded-md bg-blue-600 px-2 py-1 font-black">v10.0</span>
                  <span className="text-white/72">09.09.2026</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <span className="font-bold">SCADA Saha Kontrol</span>
                  <span className="rounded-md bg-emerald-600 px-2 py-1 font-black">v7.7.3</span>
                  <span className="text-white/72">09.09.2026</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <span className="font-bold">Görüntülü Teyit</span>
                  <span className="rounded-md bg-violet-600 px-2 py-1 font-black">v125</span>
                  <span className="text-white/72">09.09.2026</span>
                </div>
              </div>
            </section>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-slate-950/68 px-7 py-4 text-xs backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-2 sm:flex-row">
            <div className="font-bold">Balıkesir Sistem İşletme Portalı</div>
            <div className="text-white/82">
              Güvenli <span className="mx-2">|</span>
              Sürdürülebilir <span className="mx-2">|</span>
              Kesintisiz Enerji
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
