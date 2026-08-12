import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/fighters", label: "Fighters" },
  { href: "/ppv", label: "PPV" },
  { href: "/store", label: "Store" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface bg-deep/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="ETFC logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="text-lg font-bold tracking-tight">
            ETFC<span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-steel transition-colors hover:bg-surface hover:text-pure"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-pure transition-opacity hover:opacity-90"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
