"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  TextStyle,
  Color,
  FontSize,
  FontFamily,
  LineHeight,
  BackgroundColor,
} from "@tiptap/extension-text-style";
import { ExtraTextStyle, BlockStyle } from "./cmsEditorExtensions";
import { useEffect } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link as LinkIcon,
  Heading1, Heading2, Heading3, RemoveFormatting,
} from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  /** Exposes the TipTap instance so the sidebar panels can drive the selection. */
  onEditor?: (editor: Editor | null) => void;
  /** Called when this editor gains focus (used to track the active editor). */
  onFocus?: () => void;
};

const FONT_SIZES = ["10", "12", "14", "16", "18", "20", "24", "28", "32", "40", "48", "60"];
const FONT_FAMILIES: { label: string; value: string }[] = [
  { label: "Default", value: "" },
  { label: "SF Pro", value: "var(--font-sf-pro), sans-serif" },
  { label: "Freight", value: "var(--font-freight), serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
];

export function RichTextEditor({ value, onChange, onEditor, onFocus }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    onFocus: () => onFocus?.(),
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      FontFamily,
      LineHeight,
      BackgroundColor,
      ExtraTextStyle,
      BlockStyle,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // Expose / tear down the editor instance for the sidebar panels.
  useEffect(() => {
    onEditor?.(editor);
    return () => onEditor?.(null);
  }, [editor, onEditor]);

  if (!editor) return null;

  const toggleLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  // Current selection's inline style marks (so controls reflect the selection)
  const textStyle = editor.getAttributes("textStyle") as {
    color?: string;
    fontSize?: string;
    fontFamily?: string;
  };
  const currentColor = textStyle.color || "#1f150f";
  const currentSize = textStyle.fontSize ? String(parseInt(textStyle.fontSize, 10)) : "";
  const currentFamily = textStyle.fontFamily || "";

  const btn = (label: React.ReactNode, active: boolean, onClick: () => void, title?: string) => (
    <button
      type="button"
      className={`cms-tiptap-btn${active ? " active" : ""}`}
      // preventDefault keeps the editor selection while clicking the toolbar
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="cms-tiptap-toolbar">
        {/* Block format */}
        {btn(<Heading1 size={14} />, editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), "H1")}
        {btn(<Heading2 size={14} />, editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), "H2")}
        {btn(<Heading3 size={14} />, editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), "H3")}
        {btn(<span style={{ fontSize: 11, fontWeight: 600 }}>H4</span>, editor.isActive("heading", { level: 4 }), () => editor.chain().focus().toggleHeading({ level: 4 }).run(), "H4")}
        {btn(<span style={{ fontSize: 11, fontWeight: 600 }}>H5</span>, editor.isActive("heading", { level: 5 }), () => editor.chain().focus().toggleHeading({ level: 5 }).run(), "H5")}
        {btn(<span style={{ fontSize: 11, fontWeight: 600 }}>H6</span>, editor.isActive("heading", { level: 6 }), () => editor.chain().focus().toggleHeading({ level: 6 }).run(), "H6")}
        {btn(<span style={{ fontSize: 11 }}>P</span>, editor.isActive("paragraph"), () => editor.chain().focus().setParagraph().run(), "Paragraph")}

        <div className="cms-tiptap-divider" />

        {/* Inline marks */}
        {btn(<Bold size={14} />, editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), "Bold")}
        {btn(<Italic size={14} />, editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), "Italic")}
        {btn(<UnderlineIcon size={14} />, editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), "Underline")}
        {btn(<Strikethrough size={14} />, editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), "Strikethrough")}

        <div className="cms-tiptap-divider" />

        {/* Alignment */}
        {btn(<AlignLeft size={14} />, editor.isActive({ textAlign: "left" }), () => editor.chain().focus().setTextAlign("left").run(), "Left")}
        {btn(<AlignCenter size={14} />, editor.isActive({ textAlign: "center" }), () => editor.chain().focus().setTextAlign("center").run(), "Center")}
        {btn(<AlignRight size={14} />, editor.isActive({ textAlign: "right" }), () => editor.chain().focus().setTextAlign("right").run(), "Right")}
        {btn(<AlignJustify size={14} />, editor.isActive({ textAlign: "justify" }), () => editor.chain().focus().setTextAlign("justify").run(), "Justify")}

        <div className="cms-tiptap-divider" />

        {/* Lists + link */}
        {btn(<List size={14} />, editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), "Bullet List")}
        {btn(<ListOrdered size={14} />, editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), "Numbered List")}
        {btn(<LinkIcon size={14} />, editor.isActive("link"), toggleLink, "Link")}
      </div>

      {/* Second row: selection-based color / size / family */}
      <div className="cms-tiptap-toolbar cms-tiptap-toolbar--row2">
        <label className="cms-tiptap-color" title="Text color">
          <span
            className="cms-tiptap-color__swatch"
            style={{ background: currentColor }}
          />
          <input
            type="color"
            value={currentColor}
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>

        <select
          className="cms-tiptap-select"
          title="Font size (selected text)"
          value={currentSize}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const v = e.target.value;
            if (v) editor.chain().focus().setFontSize(`${v}px`).run();
            else editor.chain().focus().unsetFontSize().run();
          }}
        >
          <option value="">Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>

        <select
          className="cms-tiptap-select"
          title="Font family (selected text)"
          value={currentFamily}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const v = e.target.value;
            if (v) editor.chain().focus().setFontFamily(v).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>{f.label}</option>
          ))}
        </select>

        {btn(<RemoveFormatting size={14} />, false,
          () => editor.chain().focus().unsetColor().unsetFontSize().unsetFontFamily().unsetAllMarks().run(),
          "Clear text formatting")}
      </div>

      <div className="cms-tiptap-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
