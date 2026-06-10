"use client";

import { EditableContent } from "../../../../components/CMS";
import "../../../../Styles/CMSDemo.css";

/**
 * CMS DEMO — end-to-end proof of the universal editing engine.
 *
 * Each <EditableContent> below:
 *   • inherits its component CSS via `defaultClass` (the foundation look)
 *   • shows a "✏ Edit" badge on hover
 *   • opens the right sidebar (TipTap + style controls) when clicked
 *   • previews content + style changes live, with no save needed
 *   • persists to MongoDB (PUT /api/cms/:id) on "Save Changes"
 *
 * The CMSProvider + RightSidebar are already mounted by AdminPanelShell,
 * so this page only needs to drop in the editable blocks.
 */
export default function CmsDemoPage() {
  return (
    <main className="admin-page-preview">
      <header className="admin-page-preview__header">
        <p>Universal CMS Engine</p>
        <h1>CMS Demo</h1>
      </header>

      <div className="cms-demo">
        <div className="cms-demo__intro">
          <strong>How it works:</strong> hover any block below to reveal the{" "}
          <strong>✏ Edit</strong> badge, click it to open the right sidebar, then
          edit text in the TipTap editor and adjust typography / colors / spacing.
          Changes preview instantly. The blocks start with their{" "}
          <strong>component CSS</strong> as the default — your custom styles only
          layer on top, and turning off <strong>&ldquo;Enable Custom Styling&rdquo;</strong>{" "}
          returns the block to its original look.
        </div>

        <span className="cms-demo__label">Editable heading block · contentId &ldquo;hero-title&rdquo;</span>
        <EditableContent
          contentId="hero-title"
          defaultClass="cms-demo-hero-title"
          plain
          fallback="<h1>It&rsquo;s not just what you wear</h1>"
        />

        <span className="cms-demo__label">Editable body block · contentId &ldquo;about-description&rdquo;</span>
        <EditableContent
          contentId="about-description"
          defaultClass="cms-demo-body"
          fallback="<p>This paragraph inherits the body styling from its component CSS. Click Edit to rewrite it, change its size, weight, color, or spacing — and watch the preview update live.</p>"
        />
      </div>
    </main>
  );
}
