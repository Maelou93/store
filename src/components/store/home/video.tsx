"use client";

import { useHomePageConfig } from "@/hooks/useHomePageConfig";

export default function Video() {
  const { config, isLoading } = useHomePageConfig();

  if (isLoading) {
    return (
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="h-4 bg-stone-300 rounded w-24" />
              <div className="h-12 bg-stone-300 rounded w-3/4" />
              <div className="h-4 bg-stone-300 rounded" />
              <div className="h-4 bg-stone-300 rounded w-4/5" />
            </div>
            <div className="aspect-video bg-stone-300 rounded" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-stone-100 overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-[#493A2E] via-[#6B5848] to-[#88755C] mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text */}
          <div className="space-y-8">
            <div>
              <span className="text-[#6B5848] text-xs font-bold tracking-[0.3em] uppercase block mb-3">
                — IW STORE
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#6B5848] uppercase leading-none">
                {config.promo_section_title}
              </h2>
            </div>
            <p className="text-stone-500 text-base leading-relaxed border-l-2 border-[#493A2E] pl-4">
              {config.promo_section_description}
            </p>
            {/* Accent lines */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-0.5 bg-[#493A2E]" />
              <div className="w-4 h-0.5 bg-[#6B5848]" />
              <div className="w-2 h-0.5 bg-[#88755C]" />
            </div>
            {/* Stats row */}
            <div className="flex gap-8 pt-2">
              <div>
                <p className="text-[#6B5848] text-2xl font-black">100+</p>
                <p className="text-stone-400 text-xs uppercase tracking-wider">
                  PRODUITS
                </p>
              </div>
              <div className="w-px bg-stone-300" />
              <div>
                <p className="text-[#6B5848] text-2xl font-black">24h</p>
                <p className="text-stone-400 text-xs uppercase tracking-wider">
                  Livraison
                </p>
              </div>
              <div className="w-px bg-stone-300" />
              <div>
                <p className="text-[#6B5848] text-2xl font-black">7j/7</p>
                <p className="text-stone-400 text-xs uppercase tracking-wider">
                  Support
                </p>
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="flex justify-center">
            <div className="relative group w-full max-w-sm">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#493A2E] via-[#6B5848] to-[#88755C] opacity-20 group-hover:opacity-40 blur-sm transition-opacity duration-500" />
              {/* Corner accents */}
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[#493A2E] z-20" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[#6B5848] z-20" />
              {/* Label */}
              <div className="absolute top-3 left-3 z-20 bg-stone-900/80 px-2 py-1">
                <span className="text-white text-xs font-black uppercase tracking-widest">
                  ▶ WATCH
                </span>
              </div>
              <video
                src="/video/394df19dfa08d1f5c710dbb48801340b_1773120504.mp4"
                controls
                muted
                className="relative w-full border border-stone-300 group-hover:border-[#493A2E] transition-colors duration-500"
              >
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent mt-20" />
    </section>
  );
}
