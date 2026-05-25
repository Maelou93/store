import { ProductGrid } from "@/components/store/product-grid";
import { nodePrisma as prisma } from "@/lib/prisma/node-client";
import { TypeProduct } from "@/types/product";

export const dynamic = "force-dynamic";
export const revalidate = 300;

async function getProducts(): Promise<TypeProduct[]> {
  return prisma.product.findMany({
    where: {
      AND: [
        { collections: { some: { collection: { slug: "femmes" } } } },
        { collections: { some: { collection: { slug: "chaussures" } } } },
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

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <div className="bg-stone-100 pt-12 pb-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-amber-700 text-xs font-bold tracking-[0.3em] uppercase block mb-2">
            — FEMME
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 uppercase leading-none">
            Chaussures femme
          </h1>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
