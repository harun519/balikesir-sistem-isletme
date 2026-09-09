import "./globals.css";

export const metadata = {
  title: "Balıkesir Sistem İşletme",
  description: "Saha ve işletme uygulamaları",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
