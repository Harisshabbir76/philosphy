"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL, getStoredUser } from "./api";

export type EditableContentData = Record<string, unknown>;

type PageContent = Record<string, unknown>;

// A page renders many editable components, each of which previously fetched
// `/api/content/{page}` on its own — e.g. 5 identical requests on the home page,
// all with `cache: "no-store"`. We dedupe to a single request per page and cache
// the result for the session so components share it and navigation is instant.
const pageCache = new Map<string, PageContent>();
const inflight = new Map<string, Promise<PageContent | null>>();

async function fetchPageContent(page: string): Promise<PageContent | null> {
  const cached = pageCache.get(page);
  if (cached) return cached;

  const pending = inflight.get(page);
  if (pending) return pending;

  const request = fetch(`${API_BASE_URL}/api/content/${page}`)
    .then((response) => (response.ok ? response.json() : null))
    .then((data: PageContent | null) => {
      if (data) pageCache.set(page, data);
      return data;
    })
    .catch(() => null)
    .finally(() => {
      inflight.delete(page);
    });

  inflight.set(page, request);
  return request;
}

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
      const data = await fetchPageContent(page);
      const override = data?.[component];

      if (isMounted && override && typeof override === "object" && !Array.isArray(override)) {
        setContent({ ...defaults, ...(override as Partial<T>) });
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
      // Keep the shared page cache in sync so other components (and later
      // navigations) see the freshly saved content without a refetch.
      const cachedPage = pageCache.get(page);
      if (cachedPage) {
        pageCache.set(page, { ...cachedPage, [component]: { ...defaults, ...(data as Partial<T>) } });
      }
    } catch (err) {
      setError("Failed to save. Please try again later.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return { content, setContent, saveContent, isSaving, error };
}
