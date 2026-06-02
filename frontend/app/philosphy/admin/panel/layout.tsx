"use client";

import { useEffect, useState, type ReactNode } from "react";
import NotFoundScreen from "./NotFoundScreen";
import AdminPanelShell from "./AdminPanelShell";

type StoredUser = {
  isAdmin?: boolean;
  token?: string;
};

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? (JSON.parse(storedUser) as StoredUser) : null;

        if (!user?.token) {
          setIsAllowed(false);
          return;
        }

        if (user.isAdmin) {
          setIsAllowed(true);
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();
        const nextIsAllowed = Boolean(response.ok && data.isAdmin);

        if (response.ok) {
          localStorage.setItem("user", JSON.stringify({ ...user, ...data, token: user.token }));
        }

        setIsAllowed(nextIsAllowed);
      } catch {
        setIsAllowed(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isAllowed === null) {
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

  if (!isAllowed) {
    return <NotFoundScreen />;
  }

  return <AdminPanelShell>{children}</AdminPanelShell>;
}
