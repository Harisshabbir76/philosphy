import { Extension } from "@tiptap/core";

/* ── helpers ──────────────────────────────────────────────────────────────── */

function parseStyleString(style?: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!style) return out;
  style.split(";").forEach((decl) => {
    const idx = decl.indexOf(":");
    if (idx === -1) return;
    const prop = decl.slice(0, idx).trim();
    const val = decl.slice(idx + 1).trim();
    if (prop && val) out[prop] = val;
  });
  return out;
}

function stringifyStyle(map: Record<string, string>): string {
  return Object.entries(map)
    .filter(([, v]) => v !== "" && v != null)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}

/* ── ExtraTextStyle: extra inline (selection) attributes on the textStyle mark ─
   Adds font-weight / letter-spacing / text-transform so they can be applied to
   just the selected text via setMark("textStyle", { ... }).                    */

export const ExtraTextStyle = Extension.create({
  name: "extraTextStyle",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).style.fontWeight || null,
            renderHTML: (attrs) =>
              attrs.fontWeight ? { style: `font-weight: ${attrs.fontWeight}` } : {},
          },
          letterSpacing: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).style.letterSpacing || null,
            renderHTML: (attrs) =>
              attrs.letterSpacing ? { style: `letter-spacing: ${attrs.letterSpacing}` } : {},
          },
          textTransform: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).style.textTransform || null,
            renderHTML: (attrs) =>
              attrs.textTransform ? { style: `text-transform: ${attrs.textTransform}` } : {},
          },
        },
      },
    ];
  },
});

/* ── BlockStyle: per-block inline style on selected paragraphs / headings ─────
   Lets the sidebar apply margin / padding / width / line-height to ONLY the
   block nodes that intersect the current selection (the "selected lines").     */

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    blockStyle: {
      /** Merge the given CSS declarations into every selected block node. */
      updateBlockStyle: (css: Record<string, string>) => ReturnType;
      /** Remove all custom block style from selected block nodes. */
      clearBlockStyle: () => ReturnType;
    };
  }
}

export const BlockStyle = Extension.create({
  name: "blockStyle",

  addOptions() {
    return { types: ["paragraph", "heading", "listItem"] as string[] };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          blockStyle: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).getAttribute("style") || null,
            renderHTML: (attrs) =>
              attrs.blockStyle ? { style: attrs.blockStyle } : {},
          },
        },
      },
    ];
  },

  addCommands() {
    const types = this.options.types;
    return {
      updateBlockStyle:
        (css) =>
        ({ state, tr, dispatch }) => {
          const { from, to } = state.selection;
          let changed = false;
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (!types.includes(node.type.name)) return;
            // If this is a paragraph/heading sitting directly inside a list item,
            // skip it and let the style apply to the <li> instead — that way a
            // margin/padding moves the bullet marker together with the text.
            if (node.type.name !== "listItem") {
              const parent = state.doc.resolve(pos).parent;
              if (parent && parent.type.name === "listItem") return;
            }
            const merged = { ...parseStyleString(node.attrs.blockStyle), ...css };
            const styleStr = stringifyStyle(merged);
            tr.setNodeAttribute(pos, "blockStyle", styleStr || null);
            changed = true;
          });
          if (changed && dispatch) dispatch(tr);
          return changed;
        },
      clearBlockStyle:
        () =>
        ({ state, tr, dispatch }) => {
          const { from, to } = state.selection;
          let changed = false;
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (!types.includes(node.type.name)) return;
            tr.setNodeAttribute(pos, "blockStyle", null);
            changed = true;
          });
          if (changed && dispatch) dispatch(tr);
          return changed;
        },
    };
  },
});

export { parseStyleString, stringifyStyle };
