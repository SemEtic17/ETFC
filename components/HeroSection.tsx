"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const HeroOrb = dynamic(() => import("@/components/three/HeroOrb"), {
  ssr: false,
  loading: () => null,
});

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <HeroOrb />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Ethiopian Fighting Championship
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            ADWA <span className="text-primary">FIGHT</span> NIGHT
          </h1>
          <p className="mt-6 max-w-xl text-lg text-steel">
            MMA · Boxing · Muay Thai — live from the Adwa 00 Museum. Pick your
            seat, meet the fighters, and grab the 2026 collection.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="rounded-md bg-primary px-6 py-3 font-semibold text-pure transition hover:opacity-90"
            >
              Get Tickets
            </Link>
            <Link
              href="/store"
              className="rounded-md border border-surface bg-surface/50 px-6 py-3 font-semibold text-pure transition hover:border-electric hover:text-electric"
            >
              Shop Merch
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Image
            src="/assets/matchup-main-event-sedo-vs-johnny.jpg"
            alt="Sedo vs Johnny — MMA Main Event"
            width={992}
            height={1040}
            priority
            sizes="(max-width: 768px) 90vw, 448px"
            className="mx-auto w-full max-w-md rounded-lg border border-surface shadow-2xl shadow-primary/20"
          />
        </motion.div>
      </div>
    </section>
  );
}
