"use client";

import React, { useState, useEffect } from "react";
import { useCMS } from "../../lib/CMSProvider";
import { useLanguage } from "../../lib/LanguageContext";
import "../../Styles/EditableContent.css";

type EditableContentProps = {
  /** Globally-unique id, e.g. "wardrobe.hero.title". */
  contentId: string;
  /** Component CSS class kept on the element so foundation styling applies. */
  defaultClass?: string;
  /** Tag to render. Use a semantic tag for plain slots, "div" for rich blocks. */
  as?: React.ElementType;
  /** Default content shown until the CMS has a saved value (plain text or HTML). */
  fallback?: string;
  /** Arabic default content, used when the site language is Arabic. */
  fallbackAr?: string;
  /**
   * Plain/single-line slot (title, eyebrow). The inner block TipTap produces
   * inherits the element's styling so it looks identical to the original tag.
   */
  plain?: boolean;
};

export function EditableContent({
  contentId,
  defaultClass = "",
  as,
  fallback = "",
  fallbackAr = "",
  plain = false,
}: EditableContentProps) {
  const { contentMap, setActiveElement, activeElement, isLoading, editingEnabled } = useCMS();
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const contentObj = contentMap[contentId];
  const isActive = activeElement?.contentId === contentId;

  // Custom style overrides (responsive cascade: desktop → tablet → mobile)
  let overrides: React.CSSProperties = {};
  if (contentObj?.customStyleEnabled && contentObj.styles) {
    const { desktop = {}, tablet = {}, mobile = {} } = contentObj.styles;
    if (windowWidth < 768) overrides = { ...desktop, ...mobile } as React.CSSProperties;
    else if (windowWidth < 1024) overrides = { ...desktop, ...tablet } as React.CSSProperties;
    else overrides = desktop as React.CSSProperties;
  }

  // CMS content wins when present; otherwise show the component's default.
  // In Arabic, prefer the Arabic CMS value / Arabic fallback, gracefully
  // falling back to the English value if no Arabic has been provided yet.
  const savedEn = contentObj?.content;
  const savedAr = contentObj?.contentAr;
  const fbAr = fallbackAr || fallback;
  let html: string;
  if (isAr) {
    html = (!isLoading && (savedAr || savedEn)) ? (savedAr || savedEn || fbAr) : fbAr;
  } else {
    html = !isLoading && savedEn ? savedEn : fallback;
  }

  // Strip any hardcoded origin (e.g. http://localhost:3000 or https://xyz.vercel.app)
  // from internal hrefs saved by the CMS editor so links always work on any domain.
  html = html.replace(
    /href="https?:\/\/[^/"]+(\/[^"]*)"/g,
    'href="$1"'
  );

  // Remove target="_blank"/rel that the editor's Link extension baked into
  // older saved content, so internal links open in the same tab.
  html = html
    .replace(/\s+target="_blank"/g, "")
    .replace(/\s+rel="[^"]*"/g, "");


  const Tag = (as || "div") as React.ElementType;
  const className = ["cms-ec", defaultClass, plain ? "cms-ec--plain" : "",
    editingEnabled ? "cms-ec--editable" : "", isActive ? "cms-ec--active" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={className}
      style={overrides}
      data-cms-id={contentId}
      onClick={
        editingEnabled
          ? (e: React.MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();
              // Pass the current on-page defaults so the sidebar can seed its
              // editors with the existing text even when nothing is saved yet
              // (i.e. the text is still the hardcoded fallback).
              setActiveElement({ contentId, type: "text", fallback, fallbackAr: fbAr });
            }
          : undefined
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
