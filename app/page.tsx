"use client";

import { useEffect, useState } from "react";

function formatClock(date: Date) {
  return {
    dateText: new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date),
    dayText: new Intl.DateTimeFormat("tr-TR", {
      weekday: "long",
    }).format(date),
    timeText: new Intl.DateTimeFormat("tr-TR", {
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
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const clock = now ? formatClock(now) : null;

  return (
    <main className="portal">
      <div className="stage">
        <img
          className="portalImage"
          src="/enerji-portal-final.png"
          alt="Balıkesir Sistem İşletme Portalı"
        />

        {/* Canlı tarih / saat - görseldeki sabit alanın üstünü tamamen kapatır */}
        <div className="liveClock" aria-label="Canlı tarih ve saat">
          <div className="calendarIcon">▦</div>
          <div className="clockText">
            <div className="dateLine">{clock?.dateText ?? "09 Eylül 2026"}</div>
            <div className="subLine">
              <span>{clock?.dayText ?? "Çarşamba"}</span>
              <span className="dot">•</span>
              <span>{clock?.timeText ?? "--:--:--"}</span>
            </div>
          </div>
        </div>

        {/* Görseldeki kartların üstüne denk gelen tıklama alanları */}
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

        .liveClock {
          position: absolute;
          z-index: 20;
          top: 1.3%;
          right: 3.3%;
          width: 182px;
          min-height: 64px;
          padding: 10px 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 15px;
          background: rgba(9, 24, 45, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
          color: white;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .calendarIcon {
          flex: 0 0 auto;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          font-size: 21px;
          line-height: 1;
          background: rgba(141, 119, 255, 0.18);
          color: #d9d3ff;
        }

        .clockText {
          min-width: 0;
          flex: 1;
        }

        .dateLine {
          font-size: 14px;
          font-weight: 800;
          line-height: 1.15;
          white-space: nowrap;
        }

        .subLine {
          margin-top: 5px;
          font-size: 10px;
          font-weight: 600;
          opacity: 0.9;
          display: flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
        }

        .dot {
          opacity: 0.55;
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

          .liveClock {
            width: 150px;
            min-height: 54px;
            padding: 8px 10px;
            border-radius: 12px;
          }

          .calendarIcon {
            width: 26px;
            height: 26px;
            font-size: 17px;
          }

          .dateLine {
            font-size: 11px;
          }

          .subLine {
            margin-top: 3px;
            font-size: 8px;
            gap: 4px;
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

          .liveClock {
            top: 8px;
            right: 28px;
            width: 165px;
          }
        }
      `}</style>
    </main>
  );
}
