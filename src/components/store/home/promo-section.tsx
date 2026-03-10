"use client";

import { useHomePageConfig } from "@/hooks/useHomePageConfig";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PromoSection() {
  const { config, isLoading } = useHomePageConfig();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!config.selectedDiscount || !config.selectedDiscount.expiresAt) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const endDate = new Date(config.selectedDiscount.expiresAt);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config.selectedDiscount]);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (isLoading || !config.promo_discount_enabled || !config.selectedDiscount || isExpired) {
    return null;
  }

  const timeBlocks = [
    { value: timeLeft.days, label: "JOURS" },
    { value: timeLeft.hours, label: "HRS" },
    { value: timeLeft.minutes, label: "MIN" },
    { value: timeLeft.seconds, label: "SEC" },
  ];

  return (
    <section className="py-4 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          {/* BG image */}
          <div className="absolute inset-0">
            <Image
              src={config.promo_section_image}
              alt="Promo background"
              fill
              className="object-cover opacity-20"
              quality={90}
            />
            <div className="absolute inset-0 bg-stone-100/80" />
          </div>

          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-purple-500" />

          <div className="relative px-8 md:px-16 py-12 flex flex-col items-center text-center gap-8">
            {/* Label */}
            <span className="text-orange-500 text-xs font-black tracking-[0.4em] uppercase">
              — OFFRE LIMITÉE
            </span>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 uppercase leading-tight max-w-lg">
              {config.promo_discount_text}
            </h2>

            {/* Timer */}
            <div className="flex gap-3 md:gap-4">
              {timeBlocks.map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="bg-white border border-stone-300 w-16 md:w-20 h-16 md:h-20 flex items-center justify-center">
                    <span className="text-stone-900 text-2xl md:text-3xl font-black tabular-nums">
                      {value.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-stone-500 text-xs font-bold mt-1 tracking-widest">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Code */}
            {config.selectedDiscount.code && (
              <div className="flex flex-col items-center gap-3">
                <span className="text-stone-500 text-sm uppercase tracking-wider">
                  Ton code :
                </span>
                <div className="border-2 border-yellow-400 px-8 py-3">
                  <span className="text-yellow-400 font-black text-2xl tracking-[0.3em] uppercase font-mono">
                    {config.selectedDiscount.code}
                  </span>
                </div>
                <span className="text-stone-500 text-xs">
                  Minimum d&apos;achat de {config.selectedDiscount.minAmount}€
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
