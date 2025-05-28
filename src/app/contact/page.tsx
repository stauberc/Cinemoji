import Header from "../components/header"; //Luna
import Footer from "../components/footer";

export default function contact() {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8 text-center mt-20">
        <h1 className="text-2xl md:text-4xl">Kontakt</h1>
        <p className="text-base md:text-lg mx-4 md:mx-32 mb-6 md:mb-10">
          Angaben gemäß § 5 TMG:
          <br />
          Cinemoji – Ein Spiel vonCinemoji Entertainment
          <br />
          Tschinowitscherweg 7
          <br />
          9500 Villach
          <br />
          Österreich
        </p>
        <p className="text-base md:text-lg mx-4 md:mx-32 mb-6 md:mb-10">
          Kontakt
          <br />
          Email: kontakt@cinemoji.de
        </p>
        <p className="text-base md:text-lg mx-4 md:mx-32 mb-6 md:mb-10">
          Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
          <br />
          [...]
          <br />
          Tschinowitscherweg 7
          <br />
          9500 Villach
        </p>
        <p className="text-base md:text-lg mx-4 md:mx-32 mb-6 md:mb-10">
          Haftungsausschluss:
          <br />
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>
        <p className="text-base md:text-lg mx-4 md:mx-32 mb-6 md:mb-10">
          Urheberrecht:
          <br />
          Alle Inhalte, Texte und Grafiken auf dieser Webseite unterliegen dem Urheberrecht. Eine Vervielfältigung oder Verwendung ist ohne ausdrückliche Genehmigung nicht gestattet.
        </p>
      </div>
      <Footer />
    </div>
  );
}