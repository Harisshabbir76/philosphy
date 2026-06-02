import BridalHero from "../../../../components/BridalHero";
import BridalEducation from "../../../../components/BridalEducation";
import BridalCompleteLook from "../../../../components/BridalCompleteLook";
import BridalZahab from "../../../../components/BridalZahab";
import GettingStartedBottom from "../../../../components/GettingStartedbottom";
import BridalConcierge from "../../../../components/BridalConcierge";

export default function AdminBridalPage() {
  return (
    <main className="admin-page-preview">
      <header className="admin-page-preview__header">
        <p>Website Page Editor</p>
        <h1>Bridal</h1>
      </header>
      <BridalHero editable />
      <BridalEducation editable />
      <BridalCompleteLook editable />
      <BridalZahab editable />
      <BridalConcierge editable />
      <GettingStartedBottom editable />
    </main>
  );
}
