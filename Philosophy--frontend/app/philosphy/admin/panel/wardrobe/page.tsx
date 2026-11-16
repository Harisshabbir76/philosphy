import WardrobeHero from "../../../../components/WardrobeHero";
import WardrobeServices from "../../../../components/WardrobeServices";
import GettingStarted from "../../../../components/GettingStartedbottom";

export default function AdminWardrobePage() {
  return (
    <main className="admin-page-preview">
      <header className="admin-page-preview__header">
        <p>Website Page Editor</p>
        <h1>Wardrobe</h1>
      </header>
      <WardrobeHero editable />
      <WardrobeServices editable />
      <GettingStarted editable />
    </main>
  );
}
