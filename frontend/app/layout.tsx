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
});

const sfPro = localFont({
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
});

export const metadata: Metadata = {
  title: "Philosophy",
  description: "Philosophy - intentional personal styling and fashion consulting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${freightDisp.variable} ${sfPro.variable} ${pinyonScript.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <CMSProvider>
          <LayoutShell>{children}</LayoutShell>
        </CMSProvider>
      </body>
    </html>
  );
}