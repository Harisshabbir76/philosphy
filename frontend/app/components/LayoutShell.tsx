"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboardRoute = useMemo(() => {
    return pathname === "/heirloom/admin/panel/dashboard" || pathname?.startsWith("/heirloom/admin/panel/dashboard/");
  }, [pathname]);

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      {children}
      {!isDashboardRoute && <Footer />}
    </>
  );
}
