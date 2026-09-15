import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "CRM Evrak Takibi",
  description: "CRM voltaj düşüklüğü evrak ve kayıt yönetimi",
  applicationName: "CRM Evrak Takibi",
  manifest: "/crm-evrak-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CRM Evrak Takibi",
  },
  icons: {
    icon: [{ url: "/crm-icon.svg?v=2", type: "image/svg+xml" }],
    shortcut: [{ url: "/crm-icon.svg?v=2", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e7490",
};

export default function CrmEvrakLayout({ children }: { children: React.ReactNode }) {
  return children;
}
