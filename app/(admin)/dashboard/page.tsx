import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

const STATS = [
  { label: "Events", value: "1" },
  { label: "Fighters", value: "22" },
  { label: "Merch Items", value: "11" },
  { label: "Tickets Sold", value: "—" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-steel">
        Protected admin area — wired to MongoDB through <code>lib/db.ts</code>.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-surface bg-surface/40 p-6"
          >
            <p className="text-sm text-steel">{stat.label}</p>
            <p className="mt-2 text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
