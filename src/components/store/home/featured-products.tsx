"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useImageError } from "@/hooks/use-image-error";
import { TypeProduct } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeaturedProducts() {
  const [api, setApi] = useState<CarouselApi>();
  const [products, setProducts] = useState<TypeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleImageError, isImageFailed } = useImageError();

  const collection = "nouveautes";

  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/produits/collection/${collection}`);
        if (response.ok) {
          const featuredProducts = await response.json();
          setProducts(featuredProducts);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getFeaturedProducts();
  }, [collection]);

  if (isLoading) {
    return (
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 bg-stone-300 rounded w-40 mb-12 animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-stone-300 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-500">Aucun produit disponible pour le moment.</p>
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
            <span className="text-yellow-400 text-xs font-bold tracking-[0.3em] uppercase block mb-2">
              — FRESH
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-stone-900 uppercase leading-none">
              Nouveautés
            </h2>
          </div>
          {/* Nav controls */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              className="w-10 h-10 border border-stone-300 hover:border-yellow-400 hover:text-yellow-400 text-stone-500 transition-all duration-300 flex items-center justify-center"
              aria-label="Précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              className="w-10 h-10 border border-stone-300 hover:border-yellow-400 hover:text-yellow-400 text-stone-500 transition-all duration-300 flex items-center justify-center"
              aria-label="Suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{ align: "start", loop: true }}
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {products
              .filter((product: TypeProduct) => product.actif === true)
              .map((product: TypeProduct) => (
                <CarouselItem
                  key={product.id}
                  className="pl-3 md:pl-4 basis-1/2 lg:basis-1/4"
                >
                  <Link href={`/produits/${product.slug}`} className="block group">
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-200 mb-3">
                      {product.images && product.images.length > 0 && product.images[0] && !isImageFailed(product.images[0]) ? (
                        <Image
                          src={product.images[0]}
                          alt={product.nom}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          quality={75}
                          onError={() => handleImageError(product.images[0])}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-300">
                          <span className="text-stone-500 text-sm">
                            {product.images[0] && isImageFailed(product.images[0]) ? "Image non disponible" : "Aucune image"}
                          </span>
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-stone-100/0 group-hover:bg-stone-100/20 transition-colors duration-300" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                        {product.prixReduit && product.prixReduit > 0 && (
                          <span className="bg-orange-500 text-stone-900 px-2 py-0.5 text-xs font-black uppercase">
                            PROMO
                          </span>
                        )}
                        {product.collections?.some((pc) => pc.collection.nom.toLowerCase() === "nouveautés") && (
                          <span className="bg-yellow-400 text-zinc-900 px-2 py-0.5 text-xs font-black uppercase">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Bottom accent bar on hover */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="text-stone-900 text-sm font-bold uppercase tracking-wide truncate group-hover:text-yellow-400 transition-colors duration-300">
                        {product.nom}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {product.prixReduit && product.prixReduit > 0 ? (
                          <>
                            <span className="text-orange-400 font-black text-base">
                              {product.prixReduit.toFixed(2)}€
                            </span>
                            <span className="text-stone-500 line-through text-sm">
                              {product.prix.toFixed(2)}€
                            </span>
                          </>
                        ) : (
                          <span className="text-stone-900 font-bold text-base">
                            {product.prix.toFixed(2)}€
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
