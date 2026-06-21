import type { Metadata } from "next";
import localFont from "next/font/local";
import { Pinyon_Script } from "next/font/google";
import "./globals.css";
import LayoutShell from "./components/LayoutShell";
import { CMSProvider } from "./lib/CMSProvider";

const freightDisp = localFont({
  src: "../fonts/FreightDispPro/FreightDispProLight-Regular.ttf",
  variable: "--font-freight",
  weight: "200",
  style: "normal",
  display: "swap",
});

const sfPro = localFont({
  display: "swap",
  src: [
    {
      path: "../fonts/sp-fonts/SF-Pro-Display-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/sp-fonts/SF-Pro-Display-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/sp-fonts/SF-Pro-Display-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/sp-fonts/SF-Pro-Display-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/sp-fonts/SF-Pro-Display-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
});

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

import { API_BASE_URL } from "./lib/api";

export const metadata: Metadata = {
  title: "Philosophy",
  description: "Philosophy - intentional personal styling and fashion consulting.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialContentMap = {};
  try {
    const res = await fetch(`${API_BASE_URL}/api/cms/all`, { next: { revalidate: 60 } });
    const data = await res.json();
    if (data.success && data.data) {
      initialContentMap = data.data;
    }
  } catch (err) {
    console.error("Failed to fetch initial CMS content:", err);
  }

  return (
    <html
      lang="en"
      className={`${freightDisp.variable} ${sfPro.variable} ${pinyonScript.variable}`}
    >
      <body>
        <CMSProvider initialContentMap={initialContentMap}>
          <LayoutShell>{children}</LayoutShell>
        </CMSProvider>
      </body>
    </html>
  );
}