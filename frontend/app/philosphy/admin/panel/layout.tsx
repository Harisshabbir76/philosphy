"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AdminPanelShell from "./AdminPanelShell";
import { API_BASE_URL } from "../../../lib/api";

type StoredUser = {
  isAdmin?: boolean;
  token?: string;
};

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? (JSON.parse(storedUser) as StoredUser) : null;

        // Not logged in -> send to the login page
        if (!user?.token) {
          setIsAllowed(false);
          router.replace("/login");
          return;
        }

        if (user.isAdmin) {
          setIsAllowed(true);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        const nextIsAllowed = Boolean(response.ok && data.isAdmin);

        if (response.ok) {
          localStorage.setItem("user", JSON.stringify({ ...user, ...data, token: user.token }));
        }

        if (nextIsAllowed) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
          // Logged in but not an admin -> send to the home page
          router.replace(response.ok ? "/" : "/login");
        }
      } catch {
        setIsAllowed(false);
        router.replace("/login");
      }
    };

    verifyAdmin();
  }, [router]);

  if (isAllowed === null || isAllowed === false) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#fffdf7",
          color: "#350008",
        }}
      >
        Loading...
      </main>
    );
  }

  return <AdminPanelShell>{children}</AdminPanelShell>;
}
