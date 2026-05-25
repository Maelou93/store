"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Category = {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText: string;
};

const accentColors = [
  "border-[#493A2E] group-hover:bg-[#493A2E]",
  "border-[#6B5848] group-hover:bg-[#6B5848]",
  "border-[#88755C] group-hover:bg-[#88755C]",
  "border-[#493A2E] group-hover:bg-[#493A2E]",
];

const tagColors = [
  "bg-[#493A2E] text-white",
  "bg-[#6B5848] text-white",
  "bg-[#88755C] text-white",
  "bg-[#493A2E] text-white",
];

const EXCLUDED_NAMES = ["vêtements homme", "vetements homme", "chaussures homme"];

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((data: { key: string; value: string }[]) => {
        const configMap: Record<string, string> = {};
        data.forEach((c) => { configMap[c.key] = c.value; });

        const result: Category[] = [];
        for (let i = 1; i <= 10; i++) {
          const raw = configMap[`category_${i}`];
          if (!raw) continue;
          try {
            const json = JSON.parse(raw);
            const title = json.nom || "";
            const image = json.image || "";
            const link = json.lien || "";
            if (!title || !image) continue;
            if (EXCLUDED_NAMES.includes(title.toLowerCase())) continue;
            result.push({ title, image, link, subtitle: "", buttonText: "Découvrir" });
          } catch {}
        }

        setCategories(result);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-stone-300 rounded w-32 mb-12"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-96 bg-stone-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[#6B5848] text-xs font-bold tracking-[0.3em] uppercase block mb-2">
              — DROP
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#6B5848] uppercase leading-none">
              Collections
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/${category.link}`}
              className="group relative overflow-hidden block"
            >
              <div className="relative h-72 md:h-96 overflow-hidden bg-stone-200">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                {/* Color accent tag */}
                <div className={`absolute top-4 right-4 z-20 w-3 h-8 ${tagColors[index % tagColors.length]}`} />

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h3 className="text-white text-xl font-black uppercase tracking-tight mb-1">
                    {category.title}
                  </h3>

                  <div className={`inline-flex items-center gap-2 border-b-2 px-3 py-2 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 ${accentColors[index % accentColors.length]}`}>
                    <span>{category.buttonText}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
