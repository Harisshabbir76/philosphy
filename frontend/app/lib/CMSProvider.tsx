"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "./api";

type ContentStyles = {
  desktop?: React.CSSProperties;
  tablet?: React.CSSProperties;
  mobile?: React.CSSProperties;
};

export type ContentObject = {
  contentId: string;
  type: string;
  content: string;
  /** Arabic version of the content, shown when the site language is Arabic. */
  contentAr?: string;
  styles: ContentStyles;
  customStyleEnabled: boolean;
};

type ActiveEditElement = {
  contentId: string;
  type: string;
};

type CMSContextType = {
  contentMap: Record<string, ContentObject>;
  activeElement: ActiveEditElement | null;
  setActiveElement: (el: ActiveEditElement | null) => void;
  updateContentState: (contentId: string, updates: Partial<ContentObject>) => void;
  saveContent: (contentId: string) => Promise<void>;
  isLoading: boolean;
  /** True only inside the admin dashboard — turns on edit badges + sidebar. */
  editingEnabled: boolean;
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({
  children,
  editingEnabled = false,
}: {
  children: React.ReactNode;
  editingEnabled?: boolean;
}) {
  const [contentMap, setContentMap] = useState<Record<string, ContentObject>>({});
  const [activeElement, setActiveElement] = useState<ActiveEditElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the shared API base so this works in both local dev and on Vercel.
  const backendUrl = `${API_BASE_URL}/api/cms`;

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        const res = await fetch(`${backendUrl}/all`);
        const data = await res.json();
        if (data.success && data.data) {
          setContentMap(data.data);
        }
      } catch (err) {
        console.error("CMSProvider: Failed to fetch content map", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllContent();
  }, [backendUrl]);

  const updateContentState = useCallback((contentId: string, updates: Partial<ContentObject>) => {
    setContentMap((prev) => {
      const existing = prev[contentId] || {
        contentId,
        type: "text",
        content: "",
        contentAr: "",
        styles: { desktop: {}, tablet: {}, mobile: {} },
        customStyleEnabled: false,
      };
      return {
        ...prev,
        [contentId]: { ...existing, ...updates },
      };
    });
  }, []);

  const saveContent = useCallback(async (contentId: string) => {
    const dataToSave = contentMap[contentId];
    if (!dataToSave) return;
    try {
      await fetch(`${backendUrl}/${contentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
    } catch (err) {
      console.error(`CMSProvider: Failed to save content ${contentId}`, err);
    }
  }, [contentMap, backendUrl]);

  return (
    <CMSContext.Provider
      value={{
        contentMap,
        activeElement,
        setActiveElement,
        updateContentState,
        saveContent,
        isLoading,
        editingEnabled,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

const NOOP_CMS: CMSContextType = {
  contentMap: {},
  activeElement: null,
  setActiveElement: () => {},
  updateContentState: () => {},
  saveContent: async () => {},
  isLoading: false,
  editingEnabled: false,
};

export function useCMS() {
  const context = useContext(CMSContext);
  // Outside a provider (shouldn't normally happen) return a read-only no-op
  // context so EditableContent renders its fallback instead of crashing.
  return context ?? NOOP_CMS;
}
