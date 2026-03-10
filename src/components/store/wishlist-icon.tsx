"use client";

import { useWishlistStore } from "@/store/wishlist-store";
import { IconHeart } from "@tabler/icons-react";
import Link from "next/link";

export function WishlistIcon() {
  const { getItemsCount, hasHydrated } = useWishlistStore();
  const itemsCount = hasHydrated ? getItemsCount() : 0;

  return (
    <Link href="/wishlist">
      <div className="relative flex items-center justify-center w-10 h-10 hover:text-orange-500 text-stone-700 transition-all duration-300 cursor-pointer">
        <IconHeart className="h-5 w-5" stroke={1.5} />
        {hasHydrated && itemsCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center">
            {itemsCount > 9 ? "9+" : itemsCount}
          </span>
        )}
      </div>
    </Link>
  );
}
