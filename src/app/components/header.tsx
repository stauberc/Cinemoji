import Link from 'next/link'; //Luna

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-[var(--green)] text-[var(--foreground)]  z-50">
      <Link href="/" className="text-2xl font-bold">CINEMOJI </Link>

      <nav>
        <ul className="flex gap-4">
          <li>
            <Link href="/game" className="hover:text-white">Game</Link>
          </li>
          <li>
            <Link href="/session-history-page" className="hover:text-white">Spielverlauf</Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-white">Kontakte</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}