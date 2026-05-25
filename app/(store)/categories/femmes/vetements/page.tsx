import { ProductGrid } from "@/components/store/product-grid";
import { nodePrisma as prisma } from "@/lib/prisma/node-client";
import { Collection, TypeProduct } from "@/types/product";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 300;

async function getCollections(): Promise<Collection[]> {
  return prisma.collection.findMany({ orderBy: { nom: "asc" } });
}

async function getProducts(): Promise<TypeProduct[]> {
  return prisma.product.findMany({
    where: {
      AND: [
        { collections: { some: { collection: { slug: "femmes" } } } },
        { collections: { none: { collection: { slug: "chaussures" } } } },
      ],
    },
    include: {
      variants: true,
      collections: { include: { collection: true } },
    },
  });
}

export default async function Page() {
  const products = await getProducts();
  const collections = await getCollections();

  const filteredCollections = collections.filter(
    (c: Collection) =>
      c.slug !== "chaussures" &&
      c.slug !== "hommes" &&
      c.slug !== "femmes" &&
      c.slug !== "nouveautes" &&
      c.slug !== "accessoires"
  );

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <div className="bg-stone-100 pt-12 pb-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#6B5848] text-xs font-bold tracking-[0.3em] uppercase block mb-2">
            — FEMME
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#6B5848] uppercase leading-none">
            Vêtements femme
          </h1>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-stone-200 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/categories/femmes/vetements"
              className="px-4 py-1.5 text-xs font-black uppercase tracking-wider bg-stone-900 text-white"
            >
              Tout
            </Link>
            {filteredCollections.map((collection: Collection) => (
              <Link
                key={collection.id}
                href={`/categories/femmes/vetements/${collection.slug}`}
                className="px-4 py-1.5 text-xs font-black uppercase tracking-wider border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-[#6B5848] transition-colors"
              >
                {collection.nom}
              </Link>
            ))}
            <Link
              href="/categories/femmes/vetements/accessoires"
              className="px-4 py-1.5 text-xs font-black uppercase tracking-wider border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-[#6B5848] transition-colors"
            >
              Accessoires
            </Link>
            <Link
              href="/categories/femmes/vetements/nouveautes"
              className="px-4 py-1.5 text-xs font-black uppercase tracking-wider border border-[#493A2E] text-[#6B5848] hover:bg-[#493A2E] hover:text-white transition-colors"
            >
              Nouveautés
            </Link>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
