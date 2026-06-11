"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { API_BASE_URL, getStoredUser } from "../lib/api";
import "../Styles/AdminEditableSection.css";

export type AdminInlineEditor<T extends Record<string, unknown>> = {
  content: T;
  isEditing: boolean;
  updateContent: (updater: Partial<T> | ((current: T) => T)) => void;
};

type AdminEditableSectionProps<T extends Record<string, unknown>> = {
  children: ReactNode | ((editor: AdminInlineEditor<T>) => ReactNode);
  content: T;
  editable?: boolean;
  error?: string | null;
  isSaving?: boolean;
  title: string;
  onSave: (content: T) => Promise<void>;
};

export default function AdminEditableSection<T extends Record<string, unknown>>({
  children,
  content,
  editable = false,
  error,
  isSaving = false,
  title,
  onSave,
}: AdminEditableSectionProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<T>(content);

  const openEditor = () => {
    setDraft(content);
    setIsEditing(true);
  };

  const save = async () => {
    try {
      await onSave(draft);
      setIsEditing(false);
    } catch {
      // keep edit mode open so changes are not lost
    }
  };

  const updateContent: AdminInlineEditor<T>["updateContent"] = (updater) => {
    setDraft((current) => (typeof updater === "function" ? updater(current) : { ...current, ...updater }));
  };

  const renderedChildren =
    typeof children === "function" ? children({ content: isEditing ? draft : content, isEditing, updateContent }) : children;

  if (!editable) return <>{renderedChildren}</>;

  return (
    <div className={isEditing ? "admin-editable-section admin-editable-section--editing" : "admin-editable-section"}>
      {!isEditing && (
        <button className="admin-editable-section__button" type="button" onClick={openEditor} aria-label={`Edit ${title}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 16.75V20h3.25L17.82 9.43l-3.25-3.25L4 16.75Zm16.71-10.04a1 1 0 0 0 0-1.42l-2-2a1 1 0 0 0-1.42 0l-1.3 1.3 3.25 3.25 1.47-1.13Z" />
          </svg>
        </button>
      )}

      {isEditing && (
        <div className="admin-editable-section__toolbar" aria-label={`${title} editor`}>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
          <button type="button" onClick={save} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      )}

      {renderedChildren}

      {isEditing && error && <p className="admin-editable-section__error">{error}</p>}
    </div>
  );
}

// ─── EditableText ─────────────────────────────────────────────────────────────

type EditableTextProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  value: string;
};

export function EditableText({ as: Tag = "span", className, isEditing, onChange, value }: EditableTextProps) {
  return (
    <Tag
      className={className}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={(event) => onChange(event.currentTarget.textContent || "")}
    >
      {value}
    </Tag>
  );
}

// ─── EditableHtml ─────────────────────────────────────────────────────────────

type EditableHtmlProps = {
  className?: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  value: string;
};

export function EditableHtml({ className, isEditing, onChange, value }: EditableHtmlProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && isEditing) {
      ref.current.innerHTML = value;
      // Make Enter create <p> elements instead of <div> so component CSS
      // selectors (which target `p`) apply to newly typed paragraphs.
      document.execCommand("defaultParagraphSeparator", false, "p");
    }
  }, [isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isEditing) {
    return (
      <div
        className={`editable-html-content${className ? ` ${className}` : ""}`}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }

  const syncContent = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  return (
    <div className="editable-html-wrap">
      {/* ── Editable area ── */}
      <div
        ref={ref}
        className={`editable-html-content${className ? ` ${className}` : ""}`}
        contentEditable
        suppressContentEditableWarning
        onInput={syncContent}
        onBlur={syncContent}
      />
    </div>
  );
}

// ─── EditableImage ─────────────────────────────────────────────────────────────

export type ImageStyleData = {
  width?: string;
  height?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  objectPosition?: string;
};

type EditableImageProps = {
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  isEditing: boolean;
  onChange: (value: string) => void;
  imageStyle?: ImageStyleData;
  sizes?: string;
  src: string | StaticImageData;
};

export function EditableImage({
  alt,
  className,
  fill,
  priority = false,
  isEditing,
  onChange,
  imageStyle,
  sizes,
  src,
}: EditableImageProps) {
  const labelRef = useRef<HTMLLabelElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Apply saved styles to parent container element (works without touching parent JSX)
  useEffect(() => {
    if (!imageStyle) return;
    const parent = labelRef.current?.parentElement;
    if (!parent) return;
    if (imageStyle.width) parent.style.width = imageStyle.width;
    if (imageStyle.height) parent.style.height = imageStyle.height;
    if (imageStyle.marginTop !== undefined) parent.style.marginTop = imageStyle.marginTop;
    if (imageStyle.marginRight !== undefined) parent.style.marginRight = imageStyle.marginRight;
    if (imageStyle.marginBottom !== undefined) parent.style.marginBottom = imageStyle.marginBottom;
    if (imageStyle.marginLeft !== undefined) parent.style.marginLeft = imageStyle.marginLeft;
  }, [imageStyle]);

  // Upload the chosen file to Cloudinary (via our backend) and store the URL.
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const user = getStoredUser();
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token || ""}` },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Image upload failed");
      }
      onChange(data.url);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const imageObj = src;
  const isRemote = typeof imageObj === "string" && (imageObj.startsWith("data:") || imageObj.startsWith("http"));
  const imgStyle: CSSProperties = {};
  if (imageStyle?.objectPosition) {
    imgStyle.objectPosition = imageStyle.objectPosition;
  }

  return (
    <>
      <label
        ref={labelRef}
        className={isEditing ? "admin-editable-image admin-editable-image--editing" : "admin-editable-image"}
        style={fill ? { position: "absolute", inset: 0 } : undefined}
      >
        <Image
          className={className}
          src={imageObj}
          alt={alt}
          fill={fill}
          priority={priority}
          unoptimized={isRemote}
          sizes={sizes}
          style={Object.keys(imgStyle).length ? imgStyle : undefined}
        />
        {isEditing && (
          <>
            <span className="admin-editable-image__hint">{isUploading ? "Uploading…" : "Replace image"}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) uploadFile(file);
                event.currentTarget.value = "";
              }}
            />
          </>
        )}
      </label>
    </>
  );
}
