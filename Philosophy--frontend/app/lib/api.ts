export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export type StoredUser = {
  token?: string;
  isAdmin?: boolean;
};

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? (JSON.parse(storedUser) as StoredUser) : null;
  } catch {
    return null;
  }
}
