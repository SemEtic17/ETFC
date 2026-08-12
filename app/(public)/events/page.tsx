import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Events & Tickets" };

const TIERS = [
  {
    name: "VVIP Ringside",
    price: "100,000 ETB",
    note: "Front-row cage-side · pick your exact seat",
    image: "/assets/ticket-vvip-ringside.jpg",
  },
  {
    name: "VVIP Premium",
    price: "50,000 ETB",
    note: "Premium ringside seating · pick your exact seat",
    image: "/assets/ticket-vvip-premium.jpg",
  },
  {
    name: "VVIP Normal",
    price: "30,000 ETB",
    note: "Close ringside view · auto-assigned best seats",
    image: "/assets/ticket-vvip-normal.jpg",
  },
  {
    name: "VIP",
    price: "20,000 ETB",
    note: "Reserved block · closer to the ring · priority entry",
    image: "/assets/ticket-vip.jpg",
  },
  {
    name: "Early Bird",
    price: "6,000 ETB",
    note: "General admission · auto-assigned · best price",
    image: "/assets/ticket-early-bird.jpg",
  },
];

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Events & Tickets</h1>
      <p className="mt-2 text-steel">
        Choose your seat — ADWA FIGHT NIGHT · Adwa 00 Museum · August 27
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="group overflow-hidden rounded-lg border border-surface bg-surface/40 transition-colors hover:border-electric"
          >
            <div className="overflow-hidden">
              <Image
                src={tier.image}
                alt={`${tier.name} ticket tier`}
                width={1200}
                height={1200}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold">{tier.name}</h2>
              <p className="mt-1 text-xl font-black text-warning">{tier.price}</p>
              <p className="mt-2 text-sm text-steel">{tier.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Pick your seat</h2>
          <p className="mt-3 text-steel">
            VVIP Ringside &amp; VVIP Premium allow exact seat selection. Select
            your block and seat on the interactive map.
          </p>
          <Image
            src="/assets/seatmap.png"
            alt="Adwa 00 Museum seat map"
            width={1280}
            height={853}
            className="mt-6 w-full rounded-lg border border-surface"
          />
        </div>
        <Image
          src="/assets/ticket-cta-get-tickets.jpg"
          alt="Get your ticket on M-Pesa"
          width={2160}
          height={2160}
          className="w-full rounded-lg border border-surface"
        />
      </div>
    </div>
  );
}
