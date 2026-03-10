"use client";

import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import { ArrowRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type Category = {
  title: string;
  subtitle: string;
  image: StaticImageData | string;
  link: string;
  buttonText: string;
  featured?: boolean;
};

const accentColors = [
  "border-orange-500 group-hover:bg-orange-500",
  "border-yellow-400 group-hover:bg-yellow-400",
  "border-purple-500 group-hover:bg-purple-500",
  "border-cyan-400 group-hover:bg-cyan-400",
];

const tagColors = [
  "bg-orange-500",
  "bg-yellow-400 text-zinc-900",
  "bg-purple-500",
  "bg-cyan-400 text-zinc-900",
];

export default function CategoriesSection() {
  const { config, isLoading } = useHomePageConfig();

  const categories = useMemo<Category[]>(() => {
    const newCategories: Category[] = [];

    const categoryData = [
      {
        title: config.category_1_name,
        subtitle: config.category_1_subtitle,
        buttonText: config.category_1_button_text,
        link: config.category_1_link,
        image: config.category_1_image,
      },
      {
        title: config.category_2_name,
        subtitle: config.category_2_subtitle,
        buttonText: config.category_2_button_text,
        link: config.category_2_link,
        image: config.category_2_image,
      },
      {
        title: config.category_3_name,
        subtitle: config.category_3_subtitle,
        buttonText: config.category_3_button_text,
        link: config.category_3_link,
        image: config.category_3_image,
      },
      {
        title: config.category_4_name,
        subtitle: config.category_4_subtitle,
        buttonText: config.category_4_button_text,
        link: config.category_4_link,
        image: config.category_4_image,
      },
    ];

    categoryData.forEach((category, index) => {
      if (category.title && !category.title.toLowerCase().includes("vêtements homme") && !category.title.toLowerCase().includes("vetements homme")) {
        newCategories.push({
          title: category.title,
          subtitle: category.subtitle || "",
          buttonText: category.buttonText || "Explorer",
          link: category.link || "",
          image: category.image || "",
          featured: index === 0,
        });
      }
    });

    return newCategories;
  }, [config]);

  if (isLoading) {
    return (
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-zinc-800 rounded w-32 mb-12"></div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 bg-zinc-800 rounded"></div>
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
            <span className="text-orange-500 text-xs font-bold tracking-[0.3em] uppercase block mb-2">
              — DROP
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 uppercase leading-none">
              Collections
            </h2>
          </div>
          <p className="hidden md:block text-stone-500 text-sm max-w-xs text-right">
            {config.categories_section_description}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/${category.link}`}
              className={`group relative overflow-hidden block ${index === 0 ? "col-span-2 lg:col-span-1 row-span-1" : ""}`}
            >
              {/* Image */}
              <div className="relative h-72 md:h-96 overflow-hidden bg-stone-200">
                <Image
                  src={typeof category.image === "string" ? category.image : category.image}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                {/* Featured badge */}
                {category.featured && (
                  <div className={`absolute top-4 left-4 z-20 px-3 py-1 text-xs font-black uppercase tracking-wider text-stone-900 ${tagColors[0]}`}>
                    POPULAIRE
                  </div>
                )}

                {/* Color accent tag */}
                <div className={`absolute top-4 right-4 z-20 w-3 h-8 ${tagColors[index % tagColors.length]}`} />

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h3 className="text-white text-xl font-black uppercase tracking-tight mb-1">
                    {category.title}
                  </h3>
                  <p className="text-stone-300 text-xs mb-4">{category.subtitle}</p>
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
