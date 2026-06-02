import StoryHero from "../../../../components/StoryHero";
import StoryFounder from "../../../../components/StoryFounder";
import StoryFoundation from "../../../../components/StoryFoundation";
import StoryPhilosophy from "../../../../components/StoryPhilosophy";
import StyleMarquee from "../../../../components/StyleMarquee";

export default function OurStoryEditorPage() {
  return (
    <main className="admin-page-preview">
      <header className="admin-page-preview__header">
        <p>Website Page Editor</p>
        <h1>Our Story</h1>
      </header>
      <StoryHero editable />
      <StoryFounder editable />
      <StoryFoundation editable />
      <StoryPhilosophy editable />
      <StyleMarquee editable page="our-story" />
    </main>
  );
}
