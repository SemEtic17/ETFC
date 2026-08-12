import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-deep text-pure">
      <header className="border-b border-surface">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <span className="font-bold">
            ETFC <span className="text-primary">Admin</span>
          </span>
          <Link href="/" className="text-sm text-steel transition-colors hover:text-pure">
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
