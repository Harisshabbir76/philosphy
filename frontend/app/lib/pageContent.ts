"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, getStoredUser } from "./api";

export type EditableContentData = Record<string, unknown>;

export function usePageComponentContent<T extends EditableContentData>(
  page: string,
  component: string,
  defaults: T
) {
  const [content, setContent] = useState<T>(defaults);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/content/${page}`, { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        const override = data?.[component];

        if (isMounted && override && typeof override === "object" && !Array.isArray(override)) {
          setContent({ ...defaults, ...(override as Partial<T>) });
        }
      } catch {
        if (isMounted) setContent(defaults);
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [page, component]);

  const saveContent = async (nextContent: T) => {
    const user = getStoredUser();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/content/${page}/${component}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        body: JSON.stringify({ data: nextContent }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save content");
      }

      setContent({ ...defaults, ...(data as Partial<T>) });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save content";
      setError(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return { content, setContent, saveContent, isSaving, error };
}
