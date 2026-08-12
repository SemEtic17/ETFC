import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Store" };

const PRODUCTS = [
  {
    name: "Black Full Set",
    category: "Sets",
    price: "19,999 ETB",
    was: "25,000",
    image: "/assets/merch-black-full-set.png",
  },
  {
    name: "Blue Full Set",
    category: "Sets",
    price: "19,999 ETB",
    was: "25,000",
    image: "/assets/merch-blue-full-set.png",
  },
  {
    name: "Hoodie + Tee + Shorts Set",
    category: "Sets",
    price: "14,999 ETB",
    was: "18,000",
    image: "/assets/merch-hoodie-tee-shorts-set.png",
  },
  {
    name: "Blue Fight Tee",
    category: "Apparel",
    price: "2,499 ETB",
    was: "3,500",
    image: "/assets/merch-blue-fight-tee.png",
  },
  {
    name: "White Sweater",
    category: "Outerwear",
    price: "4,999 ETB",
    was: "6,500",
    image: "/assets/merch-white-sweater.png",
  },
  {
    name: "Open Sleeve Jacket",
    category: "Outerwear",
    price: "6,499 ETB",
    was: "8,500",
    image: "/assets/merch-open-sleeve-jacket.png",
  },
  {
    name: "Fight Shorts",
    category: "Apparel",
    price: "2,499 ETB",
    was: "3,500",
    image: "/assets/merch-fight-shorts.png",
  },
  {
    name: "ETFC Boxing Gloves",
    category: "Gear",
    price: "7,999 ETB",
    was: "10,000",
    image: "/assets/merch-boxing-gloves.png",
  },
  {
    name: "Fight Night Gloves (Heavy)",
    category: "Gear",
    price: "9,499 ETB",
    was: "12,000",
    image: "/assets/merch-fight-night-gloves-heavy.png",
  },
  {
    name: "ETFC Bracelet",
    category: "Accessories",
    price: "1,799 ETB",
    was: "2,500",
    image: "/assets/merch-bracelet.png",
  },
];

export default function StorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">
        Fight Night 2026 Collection
      </h1>
      <p className="mt-2 text-steel">
        Limited edition ETFC gear — while stock lasts.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRODUCTS.map((product) => (
          <div
            key={product.name}
            className="group overflow-hidden rounded-lg border border-surface bg-surface/40 transition-colors hover:border-electric"
          >
            <div className="overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={1254}
                height={1254}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-electric">
                {product.category}
              </p>
              <h2 className="mt-1 font-bold">{product.name}</h2>
              <p className="mt-2 text-lg font-black text-warning">
                {product.price}{" "}
                <span className="text-sm font-normal text-steel line-through">
                  {product.was} ETB
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
