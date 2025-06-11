import Link from "next/link";
//Luna

export default function Footer() { 
  return (
    <footer className="bg-[var(--green)] text-[var(--text1)] py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <div className="text-center md:text-left">
          <p className="font-semibold">© {new Date().getFullYear()} Cinemoji</p>
          <p>All rights reserved.</p>
        </div>

        <div className="flex gap-6">
          <Link href="" target="_blank" className="hover:text-black transition">LinkedIn</Link>
          <Link href="" target="_blank" className="hover:text-black transition"> Facebook </Link>
          <Link href="" target="_blank" className="hover:text-black transition"> Instagram </Link>
        </div>
      </div>
    </footer>
  );
}
