"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type MenuItem = { titre: string; link: string } | { titre: string; link?: never; children: { titre: string; link: string }[] };

const menuItems: MenuItem[] = [
  {
    titre: "Vêtements",
    children: [
      { titre: "Tout voir", link: "/categories/femmes/vetements" },
      { titre: "Hauts/Tops", link: "/categories/femmes/vetements/hauts-top" },
      { titre: "Pantalons", link: "/categories/femmes/vetements/pantalons" },
      { titre: "Ensembles", link: "/categories/femmes/vetements/ensembles" },
      { titre: "Manteaux/Vestes", link: "/categories/femmes/vetements/manteaux-vestes" },
    ],
  },
  {
    titre: "Chaussures",
    children: [
      { titre: "Tout voir", link: "/categories/femmes/chaussures" },
      { titre: "Baskets", link: "/categories/femmes/chaussures/baskets" },
      { titre: "Sandales", link: "/categories/femmes/chaussures/sandales" },
      { titre: "Ballerines", link: "/categories/femmes/chaussures/ballerines" },
      { titre: "Talons", link: "/categories/femmes/chaussures/talons" },
      { titre: "Mocassins", link: "/categories/femmes/chaussures/mocassins" },
    ],
  },
  {
    titre: "Sacs",
    link: "/categories/femmes/sacs",
  },
  {
    titre: "Accessoires",
    link: "/categories/femmes/accessoires",
  },
  {
    titre: "Nouveautés",
    link: "/categories/femmes/nouveautes",
  },
];

export function NavMenu() {
  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList>
        {menuItems.map((menu) =>
          "children" in menu ? (
            <NavigationMenuItem key={menu.titre}>
              <NavigationMenuTrigger className="text-sm font-medium text-[#6B5848]">
                {menu.titre.toUpperCase()}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col w-44 p-2">
                  {menu.children.map((child) => (
                    <li key={child.titre}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={child.link}
                          className="block px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#6B5848] hover:bg-stone-100 rounded transition-colors"
                        >
                          {child.titre}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={menu.titre}>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} text-[#6B5848]`}
              >
                <Link href={menu.link}>{menu.titre.toUpperCase()}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
