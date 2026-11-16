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

const formaDJRArabic = localFont({
  src: "../fonts/FormaDJRArabicDisplay-Regular-Testing.otf",
  variable: "--font-forma-ar",
  weight: "400",
  style: "normal",
  display: "swap",
});

const massimo = localFont({
  src: [
    { path: "../fonts/Massimo/Massimo-UltraLight.ttf", weight: "100", style: "normal" },
    { path: "../fonts/Massimo/Massimo-UltraLightitalic.ttf", weight: "100", style: "italic" },
    { path: "../fonts/Massimo/Massimo-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../fonts/Massimo/Massimo-ExtraLightitalic.ttf", weight: "200", style: "italic" },
    { path: "../fonts/Massimo/Massimo-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/Massimo/Massimo-Lightitalic.ttf", weight: "300", style: "italic" },
    { path: "../fonts/Massimo/Massimo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Massimo/Massimo-Italic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/Massimo/Massimo-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Massimo/Massimo-Mediumitalic.ttf", weight: "500", style: "italic" },
    { path: "../fonts/Massimo/Massimo-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Massimo/Massimo-SemiBolditalic.ttf", weight: "600", style: "italic" },
    { path: "../fonts/Massimo/Massimo-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Massimo/Massimo-Bolditalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-massimo",
  display: "swap",
});

const xbNiloofar = localFont({
  src: [
    { path: "../fonts/Niloofar/XB Niloofar.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Niloofar/XB NiloofarIt.ttf", weight: "400", style: "italic" },
    { path: "../fonts/Niloofar/XB NiloofarBd.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Niloofar/XB NiloofarBdIt.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-xb-niloofar",
  display: "swap",
});

const xbShafigh = localFont({
  src: [
    { path: "../fonts/XB-Shafigh-Font-Family-UrduFonts.com_/XB Shafigh Uzbek Regular - [UrduFonts.com].ttf", weight: "400", style: "normal" },
    { path: "../fonts/XB-Shafigh-Font-Family-UrduFonts.com_/XB Shafigh Italic - [UrduFonts.com].ttf", weight: "400", style: "italic" },
    { path: "../fonts/XB-Shafigh-Font-Family-UrduFonts.com_/XB Shafigh Kurd Bold - [UrduFonts.com].ttf", weight: "700", style: "normal" },
    { path: "../fonts/XB-Shafigh-Font-Family-UrduFonts.com_/XB Shafigh Bold Italic - [UrduFonts.com].ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-xb-shafigh",
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
      className={`${freightDisp.variable} ${sfPro.variable} ${pinyonScript.variable} ${formaDJRArabic.variable} ${massimo.variable} ${xbNiloofar.variable} ${xbShafigh.variable}`}
    >
      <body>
        <CMSProvider initialContentMap={initialContentMap}>
          <LayoutShell>{children}</LayoutShell>
        </CMSProvider>
      </body>
    </html>
  );
}