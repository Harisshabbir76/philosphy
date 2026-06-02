"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboardRoute = useMemo(() => {
    return pathname === "/philosphy/admin/panel" || pathname?.startsWith("/philosphy/admin/panel/");
  }, [pathname]);

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      {children}
      {!isDashboardRoute && <Footer />}
    </>
  );
}
