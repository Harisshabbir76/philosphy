import AnalysisHero from "../../../../components/AnalysisHero";
import AnalysisServices from "../../../../components/AnalysisServices";
import GettingStarted from "../../../../components/GettingStartedbottom";

export default function AdminAnalysisPage() {
  return (
    <main className="admin-page-preview">
      <header className="admin-page-preview__header">
        <p>Website Page Editor</p>
        <h1>Analysis</h1>
      </header>
      <AnalysisHero editable />
      <AnalysisServices editable />
      <GettingStarted editable />
    </main>
  );
}
