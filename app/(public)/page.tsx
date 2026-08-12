import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import FadeIn from "@/components/FadeIn";

const SECTIONS = [
  {
    href: "/events",
    title: "Events",
    desc: "Choose your seat — VVIP ringside to early bird. Only a few seats left.",
  },
  {
    href: "/fighters",
    title: "Fighters",
    desc: "MMA, Boxing & Muay Thai. Meet the full ADWA FIGHT NIGHT card.",
  },
  {
    href: "/ppv",
    title: "PPV",
    desc: "Watch every bout live from anywhere on earth.",
  },
  {
    href: "/store",
    title: "Store",
    desc: "Shop the Fight Night 2026 Collection — limited edition.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((section, i) => (
            <FadeIn key={section.href} delay={i * 0.08}>
              <Link
                href={section.href}
                className="group block rounded-lg border border-surface bg-surface/40 p-6 transition-colors hover:border-electric"
              >
                <h2 className="text-xl font-bold transition-colors group-hover:text-electric">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm text-steel">{section.desc}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
