"use client";

import { useEffect } from "react";

const APPS = [
  { selector: ".blueVersion", url: "https://balikesir-trafo-degisimi.vercel.app/api/version" },
  { selector: ".greenVersion", url: "https://scada-saha-kontrol-vercel.vercel.app/api/version" },
  { selector: ".purpleVersion", url: "https://goruntulu-teyit-v1.vercel.app/api/version" },
];

function formatVersion(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  return raw.toLowerCase().startsWith("v") ? raw : `v${raw}`;
}

export default function VersionSync() {
  useEffect(() => {
    let cancelled = false;

    async function syncVersions() {
      await Promise.all(
        APPS.map(async ({ selector, url }) => {
          try {
            const response = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
            if (!response.ok) return;
            const data = await response.json();
            const version = formatVersion(data?.version);
            if (!version || cancelled) return;
            document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
              el.textContent = version;
            });
          } catch {
            // API erişilemezse portal mevcut sürüm bilgisini göstermeye devam eder.
          }
        })
      );
    }

    syncVersions();
    const timer = window.setInterval(syncVersions, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
