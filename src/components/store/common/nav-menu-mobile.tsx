"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IconMenuDeep, IconSquareX } from "@tabler/icons-react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SubItem = { titre: string; link: string };
type MenuItem =
  | { titre: string; link: string; children?: never }
  | { titre: string; link: string; children: SubItem[] };

const menuItems: MenuItem[] = [
  {
    titre: "Vêtements",
    link: "/categories/femmes/vetements",
    children: [
      { titre: "Tout voir", link: "/categories/femmes/vetements" },
      { titre: "Hauts/Tops", link: "/categories/femmes/vetements/hauts-top" },
      { titre: "Pantalons", link: "/categories/femmes/vetements/pantalons" },
      { titre: "Ensembles", link: "/categories/femmes/vetements/ensembles" },
      { titre: "Manteaux/Vestes", link: "/categories/femmes/vetements/manteaux-vestes" },
      { titre: "Jupes", link: "/categories/femmes/vetements/jupes" },
      { titre: "Robes", link: "/categories/femmes/vetements/robes" },
      { titre: "Maillots de bain", link: "/categories/femmes/vetements/maillot-de-bain" },
    ],
  },
  {
    titre: "Chaussures",
    link: "/categories/femmes/chaussures",
    children: [
      { titre: "Tout voir", link: "/categories/femmes/chaussures" },
      { titre: "Baskets", link: "/categories/femmes/chaussures/baskets" },
      { titre: "Sandales", link: "/categories/femmes/chaussures/sandales" },
      { titre: "Ballerines", link: "/categories/femmes/chaussures/ballerines" },
      { titre: "Talons", link: "/categories/femmes/chaussures/talons" },
      { titre: "Mocassins", link: "/categories/femmes/chaussures/mocassins" },
      { titre: "Mules", link: "/categories/femmes/chaussures/mules" },
    ],
  },
  { titre: "Sacs", link: "/categories/femmes/sacs" },
  { titre: "Accessoires", link: "/categories/femmes/accessoires" },
  { titre: "Nouveautés", link: "/categories/femmes/nouveautes" },
];

export const NavBarMobile = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<MenuItem | null>(null);
  const handleClose = () => {
    setOpenMenu(false);
    setActiveSubMenu(null);
  };

  const openSubMenu = (menu: MenuItem) => {
    setActiveSubMenu(menu);
  };

  const closeSubMenu = () => {
    setActiveSubMenu(null);
  };

  return (
    <Drawer
      direction="right"
      open={openMenu}
      onOpenChange={(open) => {
        setOpenMenu(open);
        if (!open) setActiveSubMenu(null);
      }}
    >
      <DrawerTrigger asChild>
        <button type="button" className="p-2" aria-label="Menu">
          <IconMenuDeep className="h-6 w-6" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-full sm:max-w-md sm:ml-auto right-0 top-0 bottom-0 fixed z-50 sm:rounded-l-lg data-[vaul-drawer-direction=right]:w-full sm:data-[vaul-drawer-direction=right]:w-auto overflow-hidden">
        <DrawerHeader>
          <DrawerTitle className="flex items-center justify-between">
            <span />
            <DrawerClose asChild>
              <IconSquareX className="h-8 w-8" />
            </DrawerClose>
          </DrawerTitle>
        </DrawerHeader>

        {/* Conteneur glissant */}
        <div className="relative flex-1 overflow-hidden h-full">
          {/* Panel principal */}
          <div
            className={`absolute inset-0 px-4 pb-6 flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out ${
              activeSubMenu ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="border-b border-gray-200 pb-3 mb-4" onClick={handleClose}>
              <Link href="/" className="text-lg font-semibold text-[#6B5848] hover:text-[#493A2E]">
                Accueil
              </Link>
            </div>

            <ul className="space-y-1 flex-1">
              {menuItems.map((menu) => (
                <li key={menu.titre}>
                  {menu.children ? (
                    <button
                      type="button"
                      onClick={() => openSubMenu(menu)}
                      className="w-full flex items-center justify-between py-3 font-semibold text-[#6B5848] uppercase tracking-wide hover:text-[#493A2E]"
                    >
                      {menu.titre}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <div onClick={handleClose}>
                      <Link
                        href={menu.link}
                        className="block py-3 font-semibold text-[#6B5848] uppercase tracking-wide hover:text-[#493A2E]"
                      >
                        {menu.titre}
                      </Link>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-3 mt-auto" onClick={handleClose}>
              <Link href="/wishlist" className="text-lg font-semibold text-[#6B5848] hover:text-[#493A2E]">
                Mes favoris
              </Link>
            </div>
          </div>

          {/* Panel sous-menu */}
          <div
            className={`absolute inset-0 px-4 pb-6 flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out ${
              activeSubMenu ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <button
              type="button"
              onClick={closeSubMenu}
              className="flex items-center gap-2 text-[#6B5848] font-semibold mb-6 py-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour
            </button>

            {activeSubMenu && (
              <>
                <h2 className="text-lg font-black text-[#6B5848] uppercase tracking-wide mb-4">
                  {activeSubMenu.titre}
                </h2>
                <ul className="space-y-1">
                  {activeSubMenu.children?.map((child) => (
                    <li key={child.titre} onClick={handleClose}>
                      <Link
                        href={child.link}
                        className="block py-3 text-[#6B5848] uppercase tracking-wide hover:text-[#493A2E] border-b border-gray-100"
                      >
                        {child.titre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
