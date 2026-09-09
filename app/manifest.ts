import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Balıkesir Sistem İşletme",
    short_name: "Sistem İşletme",
    description: "Balıkesir Sistem İşletme uygulama portalı",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#071426",
    theme_color: "#071426",
    orientation: "any",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
