import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Fighters" };

const FIGHTERS = [
  { name: "Sedo", image: "/assets/fighter-sedo.jpg" },
  { name: "Johnny", image: "/assets/fighter-johnny.jpg" },
  { name: "Tyson", image: "/assets/fighter-tyson.png" },
  { name: "Robel", image: "/assets/fighter-robel.png" },
  { name: "Zahara", image: "/assets/fighter-zahara.png" },
  { name: "Rebik Sani", image: "/assets/fighter-rebik-sani.png" },
  { name: "Sky Okony", image: "/assets/fighter-sky-okony.png" },
  { name: "Biniyam", image: "/assets/fighter-biniyam.png" },
  { name: "Abrhamalem", image: "/assets/fighter-abrhamalem.png" },
  { name: "Desalegn", image: "/assets/fighter-desalegn.png" },
  { name: "Esubalew", image: "/assets/fighter-esubalew.png" },
  { name: "Frezer", image: "/assets/fighter-frezer.png" },
  { name: "Surafel Cheri", image: "/assets/fighter-surafel-cheri.png" },
  { name: "Coach Kal", image: "/assets/fighter-coach-kal.png" },
  { name: "Abenezer", image: "/assets/fighter-abenezer.png" },
  { name: "Yabsira", image: "/assets/fighter-yabsira.png" },
  { name: "Habtamu", image: "/assets/fighter-habtamu.png" },
  { name: "Boyka", image: "/assets/fighter-boyka.png" },
  { name: "Endris", image: "/assets/fighter-endris.png" },
];

export default function FightersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">The Fighters</h1>
      <p className="mt-2 text-steel">
        MMA · Boxing · Muay Thai — meet the ADWA FIGHT NIGHT card.
      </p>

      <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
        {FIGHTERS.map((fighter) => (
          <div key={fighter.name} className="group">
            <div className="overflow-hidden rounded-md border border-surface bg-surface/40">
              <Image
                src={fighter.image}
                alt={`${fighter.name} — fighter portrait`}
                width={300}
                height={300}
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 truncate text-center text-sm font-semibold">
              {fighter.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
