"use client";

import React, { useState, useEffect, useReducer } from "react";
import type { Editor } from "@tiptap/react";
import { useCMS } from "../../lib/CMSProvider";
import { RichTextEditor } from "./RichTextEditor";
import { parseStyleString } from "./cmsEditorExtensions";
import { X, Save } from "lucide-react";

/** Read the style of the first block node intersecting the current selection. */
function selectedBlockStyle(editor: Editor | null): Record<string, string> {
  if (!editor) return {};
  const { from, to } = editor.state.selection;
  let found: Record<string, string> | null = null;
  editor.state.doc.nodesBetween(from, to, (node, pos) => {
    if (found) return;
    if (["paragraph", "heading", "listItem"].includes(node.type.name)) {
      // Mirror updateBlockStyle: a paragraph inside a list item defers to the <li>.
      if (node.type.name !== "listItem") {
        const parent = editor.state.doc.resolve(pos).parent;
        if (parent && parent.type.name === "listItem") return;
      }
      found = parseStyleString(node.attrs.blockStyle as string | null);
    }
  });
  return found || {};
}

export function RightSidebar() {
  const { activeElement, setActiveElement, contentMap, updateContentState, saveContent } = useCMS();
  const [enEditor, setEnEditor] = useState<Editor | null>(null);
  const [arEditor, setArEditor] = useState<Editor | null>(null);
  // Which editor (English or Arabic) the style controls act on.
  const [activeLang, setActiveLang] = useState<"en" | "ar">("en");
  const editor = activeLang === "ar" ? arEditor : enEditor;
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  // Re-render when the selection / document changes so controls reflect it.
  const [, force] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!editor) return;
    const update = () => force();
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!activeElement) return null;

  const contentId = activeElement.contentId;
  const contentObj = contentMap[contentId] || {
    contentId,
    type: "text",
    content: "",
    styles: { desktop: {}, tablet: {}, mobile: {} },
    customStyleEnabled: false,
  };

  // ── Current selection state ────────────────────────────────────────────────
  const ts = (editor?.getAttributes("textStyle") || {}) as Record<string, string | undefined>;
  const block = selectedBlockStyle(editor);

  // ── Inline (selection) helpers — no .focus() so sidebar inputs stay typeable ─
  const setMarkAttr = (attr: string, value: string | null) => {
    if (!editor) return;
    const current = editor.getAttributes("textStyle");
    editor.chain().setMark("textStyle", { ...current, [attr]: value }).run();
  };
  const setColor = (v: string) => editor?.chain().setColor(v).run();
  const unsetColor = () => editor?.chain().unsetColor().run();
  const setBg = (v: string) => editor?.chain().setBackgroundColor(v).run();
  const unsetBg = () => editor?.chain().unsetBackgroundColor().run();
  const setFontSize = (v: string) =>
    v ? editor?.chain().setFontSize(v).run() : editor?.chain().unsetFontSize().run();
  const setFontFamily = (v: string) =>
    v ? editor?.chain().setFontFamily(v).run() : editor?.chain().unsetFontFamily().run();

  // ── Block (selected lines) helpers ──────────────────────────────────────────
  const setBlock = (prop: string, value: string) => {
    editor?.chain().updateBlockStyle({ [prop]: value }).run();
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveContent(contentId);
    setIsSaving(false);
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 2000);
  };

  return (
    <div className="cms-sidebar">
      {/* Header */}
      <div className="cms-sidebar__header">
        <span className="cms-sidebar__title">✏ {contentId}</span>
        <button className="cms-sidebar__close" onClick={() => setActiveElement(null)} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="cms-sidebar__body">
        <p className="cms-sidebar__hint">
          Select text in the editor, then use the controls below — they apply only to
          your selection (or the line your cursor is on).
        </p>

        {/* Content — English */}
        <div className="cms-sidebar__section">
          <p className="cms-sidebar__section-title">Content (English)</p>
          <RichTextEditor
            value={contentObj.content || ""}
            onChange={(html) => updateContentState(contentId, { content: html })}
            onEditor={setEnEditor}
            onFocus={() => setActiveLang("en")}
          />
        </div>

        {/* Content — Arabic */}
        <div className="cms-sidebar__section">
          <p className="cms-sidebar__section-title">المحتوى بالعربية · Content (Arabic)</p>
          <div dir="rtl">
            <RichTextEditor
              value={contentObj.contentAr || ""}
              onChange={(html) => updateContentState(contentId, { contentAr: html })}
              onEditor={setArEditor}
              onFocus={() => setActiveLang("ar")}
            />
          </div>
          <p className="cms-sidebar__hint" style={{ marginTop: 8 }}>
            Add the Arabic translation here. It shows on the site when the visitor
            selects عربي. Leave empty to fall back to the English text.
          </p>
        </div>

        {/* Typography — inline marks on the selection */}
        <div className="cms-sidebar__section">
          <p className="cms-sidebar__section-title">Typography (selected text)</p>
          <div className="cms-sidebar__grid">
            <div className="cms-sidebar__field cms-sidebar__field--full">
              <label>Font Family</label>
              <select value={ts.fontFamily || ""} onChange={(e) => setFontFamily(e.target.value)}>
                <option value="">Default (inherit)</option>
                <option value="var(--font-sf-pro), sans-serif">SF Pro</option>
                <option value="var(--font-freight), serif">Freight</option>
                <option value="Inter, sans-serif">Inter</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Arial, sans-serif">Arial</option>
              </select>
            </div>
            <div className="cms-sidebar__field">
              <label>Font Size</label>
              <input type="text" placeholder="e.g. 24px" value={ts.fontSize || ""}
                onChange={(e) => setFontSize(e.target.value)} />
            </div>
            <div className="cms-sidebar__field">
              <label>Font Weight</label>
              <select value={ts.fontWeight || ""} onChange={(e) => setMarkAttr("fontWeight", e.target.value || null)}>
                <option value="">Default</option>
                <option value="300">300 · Light</option>
                <option value="400">400 · Normal</option>
                <option value="500">500 · Medium</option>
                <option value="600">600 · Semi</option>
                <option value="700">700 · Bold</option>
                <option value="800">800 · Extra</option>
              </select>
            </div>
            <div className="cms-sidebar__field">
              <label>Letter Spacing</label>
              <input type="text" placeholder="e.g. 0.05em" value={ts.letterSpacing || ""}
                onChange={(e) => setMarkAttr("letterSpacing", e.target.value || null)} />
            </div>
            <div className="cms-sidebar__field">
              <label>Text Transform</label>
              <select value={ts.textTransform || ""} onChange={(e) => setMarkAttr("textTransform", e.target.value || null)}>
                <option value="">Default</option>
                <option value="none">None</option>
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
                <option value="capitalize">Capitalize</option>
              </select>
            </div>
          </div>
        </div>

        {/* Colors — inline marks on the selection */}
        <div className="cms-sidebar__section">
          <p className="cms-sidebar__section-title">Colors (selected text)</p>
          <div className="cms-sidebar__grid">
            <div className="cms-sidebar__field">
              <label>Text Color</label>
              <div className="cms-sidebar__color-row">
                <input type="color" value={ts.color || "#1f150f"} onChange={(e) => setColor(e.target.value)} />
                <button type="button" className="cms-sidebar__mini" onClick={unsetColor}>Reset</button>
              </div>
            </div>
            <div className="cms-sidebar__field">
              <label>Highlight</label>
              <div className="cms-sidebar__color-row">
                <input type="color" value={ts.backgroundColor || "#ffffff"} onChange={(e) => setBg(e.target.value)} />
                <button type="button" className="cms-sidebar__mini" onClick={unsetBg}>Reset</button>
              </div>
            </div>
            <div className="cms-sidebar__field cms-sidebar__field--full">
              <label>Bullet / List Color (selected lines)</label>
              <div className="cms-sidebar__color-row">
                <input type="color" value={block["color"] || "#1f150f"} onChange={(e) => setBlock("color", e.target.value)} />
                <button type="button" className="cms-sidebar__mini" onClick={() => setBlock("color", "")}>Reset</button>
              </div>
            </div>
          </div>
        </div>

        {/* Spacing — block style on the selected lines */}
        <div className="cms-sidebar__section">
          <p className="cms-sidebar__section-title">Spacing — Margin (selected lines)</p>
          <div className="cms-sidebar__grid">
            <div className="cms-sidebar__field">
              <label>Top</label>
              <input type="text" placeholder="px/rem" value={block["margin-top"] || ""} onChange={(e) => setBlock("margin-top", e.target.value)} />
            </div>
            <div className="cms-sidebar__field">
              <label>Bottom</label>
              <input type="text" placeholder="px/rem" value={block["margin-bottom"] || ""} onChange={(e) => setBlock("margin-bottom", e.target.value)} />
            </div>
            <div className="cms-sidebar__field">
              <label>Left</label>
              <input type="text" placeholder="px/rem" value={block["margin-left"] || ""} onChange={(e) => setBlock("margin-left", e.target.value)} />
            </div>
            <div className="cms-sidebar__field">
              <label>Right</label>
              <input type="text" placeholder="px/rem" value={block["margin-right"] || ""} onChange={(e) => setBlock("margin-right", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="cms-sidebar__section">
          <p className="cms-sidebar__section-title">Spacing — Padding (selected lines)</p>
          <div className="cms-sidebar__grid">
            <div className="cms-sidebar__field">
              <label>Top</label>
              <input type="text" placeholder="px/rem" value={block["padding-top"] || ""} onChange={(e) => setBlock("padding-top", e.target.value)} />
            </div>
            <div className="cms-sidebar__field">
              <label>Bottom</label>
              <input type="text" placeholder="px/rem" value={block["padding-bottom"] || ""} onChange={(e) => setBlock("padding-bottom", e.target.value)} />
            </div>
            <div className="cms-sidebar__field">
              <label>Left</label>
              <input type="text" placeholder="px/rem" value={block["padding-left"] || ""} onChange={(e) => setBlock("padding-left", e.target.value)} />
            </div>
            <div className="cms-sidebar__field">
              <label>Right</label>
              <input type="text" placeholder="px/rem" value={block["padding-right"] || ""} onChange={(e) => setBlock("padding-right", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Layout — block style on the selected lines */}
        <div className="cms-sidebar__section">
          <p className="cms-sidebar__section-title">Layout (selected lines)</p>
          <div className="cms-sidebar__grid">
            <div className="cms-sidebar__field">
              <label>Line Height</label>
              <input type="text" placeholder="e.g. 1.5" value={block["line-height"] || ""} onChange={(e) => setBlock("line-height", e.target.value)} />
            </div>
            <div className="cms-sidebar__field">
              <label>Width</label>
              <input type="text" placeholder="e.g. 100%" value={block["width"] || ""} onChange={(e) => setBlock("width", e.target.value)} />
            </div>
            <div className="cms-sidebar__field cms-sidebar__field--full">
              <label>Max Width</label>
              <input type="text" placeholder="e.g. 800px" value={block["max-width"] || ""} onChange={(e) => setBlock("max-width", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Save */}
      <div className="cms-sidebar__footer">
        <button className="cms-sidebar__save-btn" onClick={handleSave} disabled={isSaving}>
          <Save size={15} />
          {isSaving ? "Saving…" : savedOk ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
