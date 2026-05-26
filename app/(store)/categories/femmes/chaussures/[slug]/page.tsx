import { ProductGrid } from "@/components/store/product-grid";
import { nodePrisma as prisma } from "@/lib/prisma/node-client";
import { TypeProduct } from "@/types/product";

export const dynamic = "force-dynamic";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const [currentCollection, products] = await Promise.all([
    prisma.collection.findUnique({ where: { slug: params.slug } }),
    prisma.product.findMany({
      where: {
        AND: [
          { collections: { some: { collection: { slug: "femmes" } } } },
          { collections: { some: { collection: { slug: "chaussures" } } } },
          { collections: { some: { collection: { slug: params.slug } } } },
        ],
        actif: true,
      },
      include: {
        variants: true,
        collections: { include: { collection: true } },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="bg-stone-100 pt-12 pb-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#6B5848] text-xs font-bold tracking-[0.3em] uppercase block mb-2">
            — CHAUSSURES FEMME
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#6B5848] uppercase leading-none">
            {currentCollection?.nom || params.slug.replace("-", " ")}
          </h1>
          {currentCollection?.description && (
            <p className="text-stone-500 text-sm mt-3 max-w-xl">
              {currentCollection.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
