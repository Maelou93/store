import { IconHeadset, IconShieldCheck, IconTruck } from "@tabler/icons-react";

export default function CustomerExperience() {
  const features = [
    {
      icon: <IconShieldCheck className="h-8 w-8" stroke={1.5} />,
      title: "Qualité Premium",
      description: "Produits soigneusement sélectionnés pour leur qualité",
      color: "text-[#6B5848]",
      accent: "bg-[#493A2E]",
    },
    {
      icon: <IconTruck className="h-8 w-8" stroke={1.5} />,
      title: "Livraison Rapide",
      description: "Expédition sous 24-48h partout en France",
      color: "text-[#6B5848]",
      accent: "bg-[#6B5848]",
    },
    {
      icon: <IconHeadset className="h-8 w-8" stroke={1.5} />,
      title: "Support Client",
      description: "Assistance 7j/7 par chat et email",
      color: "text-[#88755C]",
      accent: "bg-[#88755C]",
    },
  ];

  return (
    <section className="bg-white py-16">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#493A2E] via-[#6B5848] to-[#88755C] mb-16" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-[#6B5848] text-xs font-bold tracking-[0.3em] uppercase block mb-2">
            — POURQUOI NOUS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#6B5848] uppercase leading-none">
            Notre engagement
          </h2>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 flex flex-col gap-5 group hover:bg-stone-50 transition-colors duration-300"
            >
              {/* Accent line + icon */}
              <div className="flex items-center gap-4">
                <div className={`w-1 h-10 ${feature.accent}`} />
                <div className={feature.color}>{feature.icon}</div>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-[#6B5848] text-base font-black uppercase tracking-wider mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom accent on hover */}
              <div className={`h-0.5 w-0 group-hover:w-full ${feature.accent} transition-all duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
