"use client";
import { DiscountReminder } from "@/components/store/product/discount-reminder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductVariant, TypeProduct } from "@/types/product";
import {
  IconHeadset,
  IconHeart,
  IconMinus,
  IconPlus,
  IconShield,
  IconShieldCheck,
  IconShoppingCart,
  IconTruck,
} from "@tabler/icons-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCartStore();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
    hasHydrated,
  } = useWishlistStore();

  const [product, setProduct] = useState<TypeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        // Simuler la récupération du produit par slug
        // Vous devrez créer une API route pour récupérer par slug
        const response = await fetch(`/api/produit/${slug}`);
        if (response.ok) {
          const productData = await response.json();
          setProduct(productData);
          if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
            setSelectedSize(productData.variants[0].taille || "");
            setSelectedColor(productData.variants[0].couleur || "");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      getProduct();
    }
  }, [slug]);

  const handleVariantChange = (size: string, color: string) => {
    if (product?.variants) {
      const variant = product.variants.find((v) => {
        // Si une taille est spécifiée, elle doit correspondre
        const sizeMatch = size ? v.taille === size : true;

        // Si une couleur est spécifiée (non vide), elle doit correspondre
        // Sinon, on accepte les variantes sans couleur (null ou undefined)
        const colorMatch = color
          ? v.couleur === color
          : (!v.couleur || v.couleur === null);

        return sizeMatch && colorMatch;
      });
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  };

  const getUniqueValues = (key: "taille" | "couleur") => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v[key]).filter(Boolean))];
  };

  const getVariantPrice = () => {
    if (selectedVariant?.prix) {
      return selectedVariant.prix;
    }
    return product?.prix || 0;
  };

  const getMaxQuantity = () => {
    if (selectedVariant) {
      return selectedVariant.quantity || 0;
    }
    return product?.quantity || 0;
  };

  const handleQuantityChange = (action: "increment" | "decrement") => {
    const maxQuantity = getMaxQuantity();

    if (action === "increment") {
      setQuantity((prev) => (prev < maxQuantity ? prev + 1 : prev));
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Produit retiré des favoris", {
        position: "top-center",
      });
    } else {
      addToWishlist(product);
      toast.success("Produit ajouté aux favoris", {
        position: "top-center",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[4/5] bg-stone-300 animate-pulse" />
            <div className="space-y-6 pt-4">
              <div className="h-4 bg-stone-300 rounded w-24 animate-pulse" />
              <div className="h-10 bg-stone-300 rounded w-3/4 animate-pulse" />
              <div className="h-8 bg-stone-300 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-stone-400 uppercase tracking-widest text-sm">Produit non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-purple-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Carousel d'images */}
          <div className="space-y-3">
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/5] relative bg-stone-200 overflow-hidden">
                      <Image
                        src={image}
                        alt={`${product.nom} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        quality={90}
                      />
                      {index === 0 && (
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
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3 border-stone-300 hover:border-stone-900 rounded-none" />
              <CarouselNext className="right-3 border-stone-300 hover:border-stone-900 rounded-none" />
            </Carousel>

            {/* Miniatures */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative bg-stone-200 overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <Image
                    src={image}
                    alt={`${product.nom} - Miniature ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6 lg:pt-4">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className="text-orange-500 text-xs font-bold tracking-[0.3em] uppercase block mb-2">
                    — {product.collections[0]?.collection.nom || "PRODUIT"}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black text-stone-900 uppercase leading-none">
                    {product.nom}
                  </h1>
                </div>
                {/* Wishlist */}
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  aria-label="Ajouter aux favoris"
                  className="ml-4 w-10 h-10 flex items-center justify-center border border-stone-300 hover:border-orange-500 hover:text-orange-500 text-stone-600 transition-all duration-300"
                >
                  <IconHeart
                    className={`h-5 w-5 ${
                      product && hasHydrated && isInWishlist(product.id)
                        ? "text-orange-500 fill-current"
                        : ""
                    }`}
                  />
                </button>
              </div>

              {/* Collections tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.collections.map((collection) => (
                  <span
                    key={collection.id}
                    className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider border border-stone-300 text-stone-500"
                  >
                    {collection.collection.nom}
                  </span>
                ))}
              </div>

              {/* Prix */}
              <div className="flex items-center gap-4">
                {product.prixReduit && product.prixReduit > 0 ? (
                  <>
                    <span className="text-3xl font-black text-orange-400">
                      {product.prixReduit.toFixed(2)}€
                    </span>
                    <span className="text-xl text-stone-400 line-through">
                      {product.prix.toFixed(2)}€
                    </span>
                    <span className="bg-orange-500 text-stone-900 px-2 py-0.5 text-xs font-black uppercase">
                      -{Math.round(((product.prix - product.prixReduit) / product.prix) * 100)}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-stone-900">
                    {getVariantPrice().toFixed(2)}€
                  </span>
                )}
              </div>
            </div>

            {/* Séparateur */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-0.5 bg-orange-500" />
              <div className="w-4 h-0.5 bg-yellow-400" />
              <div className="w-2 h-0.5 bg-purple-500" />
            </div>

            {/* Variantes */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-5">
                {/* Taille */}
                {getUniqueValues("taille").length > 0 && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-3">
                      Taille
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getUniqueValues("taille").map((taille) => (
                        <label key={taille} className="cursor-pointer">
                          <input
                            type="radio"
                            name="taille"
                            value={taille || ""}
                            checked={selectedSize === taille}
                            onChange={(e) => {
                              setSelectedSize(e.target.value);
                              handleVariantChange(e.target.value, selectedColor);
                            }}
                            className="sr-only"
                          />
                          <div
                            className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 border ${
                              selectedSize === taille
                                ? "bg-stone-900 text-white border-stone-900"
                                : "border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
                            }`}
                          >
                            {taille}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Couleur */}
                {getUniqueValues("couleur").length > 0 && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-3">
                      Couleur : <span className="font-normal normal-case text-stone-900">{selectedColor || "Sélectionnez"}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {getUniqueValues("couleur").map((couleur) => {
                        const variant = product.variants?.find((v) => v.couleur === couleur);
                        const isSelected = selectedColor === couleur;
                        return (
                          <label key={couleur} className="relative cursor-pointer group" title={couleur || undefined}>
                            <input
                              type="radio"
                              name="couleur"
                              value={couleur || ""}
                              checked={isSelected}
                              onChange={(e) => {
                                setSelectedColor(e.target.value);
                                handleVariantChange(selectedSize, e.target.value);
                              }}
                              className="sr-only"
                            />
                            <div className="relative">
                              <div
                                className={`w-10 h-10 p-0.5 transition-all duration-200 ${
                                  isSelected ? "ring-2 ring-stone-900 ring-offset-1" : "ring-1 ring-stone-300 group-hover:ring-stone-500"
                                }`}
                              >
                                <div
                                  className="w-full h-full"
                                  style={{ backgroundColor: variant?.couleurHex || "#ccc" }}
                                />
                              </div>
                              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <span className={`text-xs transition-all ${isSelected ? "text-stone-900 font-bold" : "text-stone-400 opacity-0 group-hover:opacity-100"}`}>
                                  {couleur}
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantité + stock */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-3">
                  Quantité
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-stone-300">
                    <button
                      type="button"
                      aria-label="Diminuer la quantité"
                      onClick={() => handleQuantityChange("decrement")}
                      disabled={quantity <= 1}
                      className="h-10 w-10 flex items-center justify-center border-r border-stone-300 text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
                    >
                      <IconMinus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-black px-4 min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Augmenter la quantité"
                      onClick={() => handleQuantityChange("increment")}
                      className="h-10 w-10 flex items-center justify-center border-l border-stone-300 text-stone-600 hover:text-stone-900 transition-colors"
                    >
                      <IconPlus className="h-3 w-3" />
                    </button>
                  </div>

                  {selectedVariant && (
                    selectedVariant.quantity > 0 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          En stock ({selectedVariant.quantity})
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        <span className="text-xs font-bold uppercase tracking-wider">Rupture</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Bouton panier */}
              <button
                type="button"
                className="w-full h-14 text-sm font-black uppercase tracking-widest bg-stone-900 hover:bg-stone-800 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
                disabled={getMaxQuantity() === 0}
                onClick={() => {
                  if (product) {
                    const maxQuantity = getMaxQuantity();
                    addItem({
                      productId: product.id!,
                      nom: product.nom,
                      prix: product.prix,
                      prixReduit: product.prixReduit && product.prixReduit > 0 ? product.prixReduit : undefined,
                      quantite: quantity,
                      image: product.images[0] || "/images/placeholder.jpg",
                      taille: selectedSize,
                      couleur: selectedColor,
                      variantId: selectedVariant?.id,
                      maxQuantity: maxQuantity,
                    });
                    toast.success("Produit ajouté au panier", { position: "top-center" });
                  }
                }}
              >
                <IconShoppingCart className="h-5 w-5" />
                {getMaxQuantity() === 0 ? "Rupture de stock" : "Ajouter au panier"}
              </button>
            </div>

            {/* Avantages */}
            <div className="grid grid-cols-3 gap-px bg-stone-200">
              <div className="bg-stone-100 p-4 flex flex-col items-center text-center gap-2">
                <IconTruck className="h-5 w-5 text-yellow-500" stroke={1.5} />
                <p className="text-xs font-black uppercase tracking-wide text-stone-900">Livraison rapide</p>
                <p className="text-xs text-stone-400">Sous 24-48h</p>
              </div>
              <div className="bg-stone-100 p-4 flex flex-col items-center text-center gap-2">
                <IconShieldCheck className="h-5 w-5 text-orange-500" stroke={1.5} />
                <p className="text-xs font-black uppercase tracking-wide text-stone-900">Qualité premium</p>
                <p className="text-xs text-stone-400">Sélectionné avec soin</p>
              </div>
              <div className="bg-stone-100 p-4 flex flex-col items-center text-center gap-2">
                <IconHeadset className="h-5 w-5 text-purple-500" stroke={1.5} />
                <p className="text-xs font-black uppercase tracking-wide text-stone-900">Support 7j/7</p>
                <p className="text-xs text-stone-400">Par chat & email</p>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border border-stone-200 p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-500 mb-3">
                  Description
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Rappel réductions */}
            <DiscountReminder />
          </div>
        </div>
      </div>
    </div>
  );
}
