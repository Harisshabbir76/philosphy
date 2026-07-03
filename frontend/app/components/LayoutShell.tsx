"use client";

import React, { useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import { LanguageProvider, useLanguage } from "../lib/LanguageContext";

/**
 * Renders the public chrome (Navbar/Footer) and controls text direction.
 * The dashboard always stays LTR even when the site language is Arabic.
 */
function Shell({
  isDashboardRoute,
  isBookingRoute,
  children,
}: {
  isDashboardRoute: boolean;
  isBookingRoute: boolean;
  children: React.ReactNode;
}) {
  const { language } = useLanguage();

  useEffect(() => {
    const dir = isDashboardRoute ? "ltr" : language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
  }, [isDashboardRoute, language]);

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      {children}
      {!isDashboardRoute && <Footer />}
      {!isDashboardRoute && !isBookingRoute && <WhatsAppButton />}
    </>
  );
}

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboardRoute = useMemo(() => {
    return pathname === "/philosphy/admin/panel" || pathname?.startsWith("/philosphy/admin/panel/");
  }, [pathname]);

  const isBookingRoute = useMemo(() => {
    return pathname === "/booking" || pathname?.startsWith("/booking/");
  }, [pathname]);

  return (
    <LanguageProvider>
      <Shell isDashboardRoute={!!isDashboardRoute} isBookingRoute={!!isBookingRoute}>
        {children}
      </Shell>
    </LanguageProvider>
  );
}
