import PersonalShoppingHero from "../../../../components/PersonalShoppingHero";
import PersonalShoppingInPerson from "../../../../components/PersonalShoppingInPerson";
import PersonalShoppingStyleShop from "../../../../components/PersonalShoppingStyleShop";
import PersonalShoppingRemote from "../../../../components/PersonalShoppingRemote";
import GettingStartedBottom from "../../../../components/GettingStartedbottom";

export default function AdminPersonalShoppingPage() {
  return (
    <main className="admin-page-preview">
      <header className="admin-page-preview__header">
        <p>Website Page Editor</p>
        <h1>Personal Shopping</h1>
      </header>
      <PersonalShoppingHero editable />
      <PersonalShoppingInPerson editable />
      <PersonalShoppingStyleShop editable />
      <PersonalShoppingRemote editable />
      <GettingStartedBottom editable />
    </main>
  );
}
