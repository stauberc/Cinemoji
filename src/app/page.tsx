import Link from "next/link";
import './globals.css';

// Luna

export default function LandingPage() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8 text-center">
        <h1 className="text-2xl md:text-4xl">Cinemoji</h1>
        <p className="text-base md:text-lg mx-4 md:mx-32 mb-6 md:mb-10">Stell dein Filmwissen auf die Probe! Bei Cinemoji musst du bekannte Filme allein anhand von clever kombinierten Emojis erraten. Ob Klassiker oder Blockbuster – erkennst du sie alle? Einfach, witzig und perfekt für zwischendurch!</p>
        <Link href="/game" className="bg-[var(--green)] hover:bg-[var(--darkgreen)] text-[var(--foreground)] font-bold py-3 px-6 md:py-5 md:px-10 rounded-full text-base md:text-lg">
          Jetzt spielen!
        </Link>
      </div>

      <div className="flex flex-col min-h-screen bg-[var(--grey)] text-[var(--foreground)] p-4 md:p-8">
        <h2 className="text-xl md:text-2xl mb-2">Game Rules</h2>
        <p className="font-semibold text-base md:text-lg">Ziel des Spiels:</p>
        <p className="text-sm md:text-base mb-2">Errate den Filmtitel – nur anhand einer Reihe von Emojis! Keine Hinweise, keine Kategorien. Nur dein Emoji-Instinkt und dein Filmwissen zählen.</p>
        <p className="font-semibold text-base md:text-lg mt-2">So funktionierts:</p>
        <ol className="list-decimal ml-4 md:ml-6 mb-4">
          <li>Ein Emoji-Rätsel erscheint.
            <p className="ml-4 md:ml-10 mb-3 md:mb-5 text-sm md:text-base">Jedes Rätsel steht für einen bekannten Film – dargestellt nur mit Emojis. </p>
          </li>
          <li>Du gibst deinen Tipp ein.
            <p className="ml-4 md:ml-10 mb-3 md:mb-5 text-sm md:text-base"> Denk nach, tippe den Filmtitel ein und bestätige deine Antwort. </p>
          </li>
          <li>Richtig oder falsch?
            <p className="ml-4 md:ml-10 mb-3 md:mb-5 text-sm md:text-base">Bei einer richtigen Antwort geht’s direkt weiter zum nächsten Rätsel. </p>
            <p className="ml-4 md:ml-10 mb-3 md:mb-5 text-sm md:text-base">Bei einer falschen Antwort kannst du es nochmal versuchen – oder auflösen lassen.   </p>
          </li>
          <li>Ziel: So viele Filme wie möglich erkennen!
            <p className="ml-4 md:ml-10 mb-3 md:mb-5 text-sm md:text-base">Fordere dich selbst heraus und knacke dein persönliches Highscore!</p>
          </li>
        </ol>
        <p className="font-semibold text-base md:text-lg mt-2">Tipps</p>
        <ul className="list-none ml-0 pl-0 space-y-2 text-sm md:text-base">
          <li>Achte auf Reihenfolge und Kombination der Emojis.</li>
          <li>Manche Rätsel sind wörtlich, andere eher kreativ gedacht.</li>
          <li>Kein Stress – Cinemoji ist zum Spaß da!</li>
        </ul>
      </div>
    </div>
  );
}