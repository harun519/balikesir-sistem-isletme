"use client";

import { useEffect, useMemo, useState } from "react";

function getClock(date: Date) {
  return {
    date: new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date),
    day: new Intl.DateTimeFormat("tr-TR", {
      weekday: "long",
    }).format(date),
    time: new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date),
  };
}

export default function Home() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const clock = useMemo(() => (now ? getClock(now) : null), [now]);

  return (
    <main className="portal">
      <div className="stage">
        <img
          className="portalImage"
          src="/enerji-portal-final-v2.png"
          alt="Balıkesir Sistem İşletme Portalı"
        />

        {/* PNG içindeki sabit tarih kutusunu TAM OLARAK örten canlı kutu */}
        <div className="liveClock" aria-label="Canlı tarih ve saat">
          <div className="calendarIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="100%" height="100%">
              <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M7 3v4M17 3v4M3 9h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2M15 17h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="clockText">
            <div className="dateLine">{clock?.date ?? "09 Eylül 2026"}</div>
            <div className="subLine">
              <span>{clock?.day ?? "Çarşamba"}</span>
              <span className="sep">•</span>
              <span>{clock?.time ?? "--:--:--"}</span>
            </div>
          </div>
        </div>

        {/* Kartların üstüne gelen görünmez bağlantılar */}
        <a className="hotspot trafo" href="https://balikesir-trafo-degisimi.vercel.app" aria-label="Trafo Değişimi" />
        <a className="hotspot scada" href="https://scada-saha-kontrol-vercel.vercel.app" aria-label="SCADA Saha Kontrol" />
        <a className="hotspot teyit" href="https://goruntulu-teyit-v1.vercel.app" aria-label="Görüntülü Teyit" />
        <div className="hotspot bakim disabled" title="Yakında Hizmetinizde" aria-label="3. Seviye Bakım yakında" />
      </div>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }

        :global(html),
        :global(body) {
          margin: 0;
          width: 100%;
          min-width: 320px;
          min-height: 100%;
          background: #071426;
          font-family: Arial, Helvetica, sans-serif;
          overflow-x: hidden;
        }

        .portal {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #071426;
        }

        .stage {
          position: relative;
          width: 100vw;
          aspect-ratio: 1664 / 928;
          overflow: hidden;
          background: #071426;
        }

        .portalImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }

        .liveClock {
          position: absolute;
          z-index: 30;

          /* Görseldeki eski kutunun tamamını kapatır */
          top: 1.55%;
          right: 1.45%;
          width: 15.7%;
          height: 8.75%;

          display: flex;
          align-items: center;
          gap: 4.2%;

          padding: 1.0% 1.15%;
          border-radius: 14px;

          background: #0a1b31;
          border: 1px solid rgba(255,255,255,.16);
          box-shadow: 0 8px 24px rgba(0,0,0,.28);
          color: white;
        }

        .calendarIcon {
          flex: 0 0 18%;
          aspect-ratio: 1;
          border-radius: 9px;
          display: grid;
          place-items: center;
          padding: 12%;
          color: #d8d4ff;
          background: #172a48;
        }

        .clockText {
          min-width: 0;
          flex: 1;
        }

        .dateLine {
          font-size: clamp(9px, 1.02vw, 17px);
          line-height: 1.1;
          font-weight: 800;
          white-space: nowrap;
        }

        .subLine {
          margin-top: 6%;
          display: flex;
          gap: 5%;
          align-items: center;
          white-space: nowrap;
          font-size: clamp(7px, .73vw, 12px);
          line-height: 1;
          font-weight: 600;
          opacity: .94;
        }

        .sep { opacity: .6; }

        .hotspot {
          position: absolute;
          z-index: 10;
          top: 31.1%;
          height: 38.9%;
          border-radius: 20px;
          background: transparent;
          text-decoration: none;
          cursor: pointer;
        }

        .hotspot:hover {
          box-shadow: inset 0 0 0 2px rgba(255,255,255,.15);
          background: rgba(255,255,255,.025);
        }

        .trafo { left: 9.2%; width: 18.7%; }
        .scada { left: 28.6%; width: 18.5%; }
        .teyit { left: 48.6%; width: 18.1%; }
        .bakim { left: 67.1%; width: 18.2%; }

        .disabled { cursor: default; }
        .disabled:hover { box-shadow: none; background: transparent; }

        @media (max-width: 700px) {
          .portal {
            min-height: 100dvh;
            align-items: flex-start;
          }

          .stage {
            width: 100vw;
            aspect-ratio: 1664 / 928;
          }

          .liveClock {
            border-radius: 7px;
            border-width: .5px;
          }
        }
      `}</style>
    </main>
  );
}
