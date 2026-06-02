"use client";

import Image, { type StaticImageData } from "next/image";
import { useState, type ReactNode } from "react";
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
      // The API hook exposes the real error message; keep edit mode open so changes are not lost.
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

type EditableHtmlProps = {
  className?: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  value: string;
};

export function EditableHtml({ className, isEditing, onChange, value }: EditableHtmlProps) {
  return (
    <div
      className={className}
      contentEditable={isEditing}
      dangerouslySetInnerHTML={{ __html: value }}
      suppressContentEditableWarning
      onBlur={(event) => onChange(event.currentTarget.innerHTML)}
    />
  );
}

type EditableImageProps = {
  alt: string;
  className?: string;
  fill?: boolean;
  isEditing: boolean;
  onChange: (value: string) => void;
  sizes?: string;
  src: string | StaticImageData;
};

export function EditableImage({ alt, className, fill, isEditing, onChange, sizes, src }: EditableImageProps) {
  const image = src;

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <label
      className={isEditing ? "admin-editable-image admin-editable-image--editing" : "admin-editable-image"}
      style={fill ? { position: "absolute", inset: 0 } : undefined}
    >
      <Image
        className={className}
        src={image}
        alt={alt}
        fill={fill}
        unoptimized={typeof image === "string" && image.startsWith("data:")}
        sizes={sizes}
      />
      {isEditing && (
        <>
          <span className="admin-editable-image__hint">Replace image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) readFile(file);
              event.currentTarget.value = "";
            }}
          />
        </>
      )}
    </label>
  );
}
