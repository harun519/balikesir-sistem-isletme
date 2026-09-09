export const metadata = {
  title: "Balıkesir Sistem İşletme",
  description: "Saha ve işletme uygulamaları",
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="tr"><body>{children}</body></html>;
}
