"use client";

import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import Image from "next/image";

export default function Hero() {
  const { config, isLoading } = useHomePageConfig();

  if (isLoading) {
    return (
      <section className="relative">
        <div className="relative h-[90vh] overflow-hidden bg-zinc-900 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="relative h-[90vh] overflow-hidden bg-zinc-950">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={config.homepage_hero_image}
            alt="Collection streetwear"
            fill
            className="object-cover object-center opacity-60"
            priority
            quality={95}
          />
          {/* Gradient overlay streetwear */}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-6">
              {/* Tag */}
              <div className="inline-flex items-center gap-2">
                <span className="w-8 h-0.5 bg-[#493A2E]" />
                <span className="text-[#6B5848] text-xs font-bold tracking-[0.3em] uppercase">
                  {config.homepage_hero_subtitle}
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight uppercase tracking-tight">
                {config.homepage_hero_title}
              </h1>

            </div>
          </div>
        </div>

        {/* Side text decoration */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-10">
          <div className="w-0.5 h-20 bg-gradient-to-b from-transparent to-[#493A2E]" />
          <span className="text-zinc-500 text-xs font-bold tracking-[0.4em] uppercase [writing-mode:vertical-rl]">
            NEW COLLECTION
          </span>
        </div>
      </div>
    </section>
  );
}
