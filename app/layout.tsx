import "./globals.css";
import PWARegister from "./pwa-register";

export const metadata = {
  title: "Balıkesir Sistem İşletme",
  description: "Saha ve işletme uygulamaları",
  applicationName: "Balıkesir Sistem İşletme",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sistem İşletme",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#071426",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
