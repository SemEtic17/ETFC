export default function Footer() {
  return (
    <footer className="border-t border-surface bg-deep">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-steel">
            © {new Date().getFullYear()} ETFC — Ethiopian Fighting Championship
          </p>
          <p className="text-sm text-steel">
            ADWA FIGHT NIGHT · Adwa 00 Museum · Tickets on M-Pesa
          </p>
        </div>
      </div>
    </footer>
  );
}
