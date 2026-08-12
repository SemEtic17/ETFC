"use client";
export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20 sm:px-6">
      <div className="rounded-lg border border-surface bg-surface/40 p-8">
        <h1 className="text-2xl font-black tracking-tight">Admin Sign In</h1>
        <p className="mt-2 text-sm text-steel">
          Authentication is not wired up yet. The <code>/dashboard</code> route is
          protected by <code>middleware.ts</code> — hook up Auth.js (or your
          preferred provider) and set the <code>etfc_session</code> cookie next.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            className="w-full rounded-md border border-surface bg-deep px-3 py-2 text-sm outline-none transition-colors focus:border-electric"
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            autoComplete="current-password"
            className="w-full rounded-md border border-surface bg-deep px-3 py-2 text-sm outline-none transition-colors focus:border-electric"
          />
          <button
            type="submit"
            disabled
            className="w-full cursor-not-allowed rounded-md bg-primary py-2.5 font-semibold text-pure opacity-50"
          >
            Sign in — coming soon
          </button>
        </form>
      </div>
    </div>
  );
}
