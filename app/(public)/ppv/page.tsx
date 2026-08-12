import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "PPV" };

export default function PpvPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Pay-Per-View</h1>
      <p className="mt-2 text-steel">
        Every bout, live from ringside — on any device.
      </p>

      <div className="mt-10 max-w-lg">
        <div className="overflow-hidden rounded-lg border border-surface">
          <Image
            src="/assets/video-thumbnail-press-conference.jpg"
            alt="LIVE press conference — Sedo vs Johnny"
            width={686}
            height={386}
            className="w-full object-cover"
          />
        </div>
        <h2 className="mt-4 text-xl font-bold">Press Conference — Sedo vs Johnny</h2>
        <p className="mt-2 text-sm text-steel">
          PPV packages and live broadcast details are coming soon.
        </p>
      </div>
    </div>
  );
}
