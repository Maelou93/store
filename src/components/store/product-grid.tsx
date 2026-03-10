import { TypeProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductGridProps {
  products: TypeProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const activeProducts = products.filter((product) => product.actif === true);

  if (activeProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400 uppercase tracking-widest text-sm">
          Aucun produit trouvé dans cette catégorie.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {activeProducts.map((product: TypeProduct) => (
        <Link key={product.id} href={`/produits/${product.slug}`} className="block group">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-stone-200 mb-3">
            {product.images && product.images.length > 0 && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.nom}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={75}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-300">
                <span className="text-stone-500 text-sm">Aucune image</span>
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
              {product.collections?.some(
                (pc) => pc.collection.nom.toLowerCase() === "nouveautés"
              ) && (
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
            <h3 className="text-stone-900 text-sm font-bold uppercase tracking-wide truncate group-hover:text-yellow-500 transition-colors duration-300">
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
      ))}
    </div>
  );
}
