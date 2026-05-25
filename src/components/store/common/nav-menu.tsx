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
    titre: "Manteaux/Vestes",
    link: "/categories/femmes/vetements/manteaux-vestes",
  },
  {
    titre: "Hauts/Top",
    link: "/categories/femmes/vetements/hauts-top",
  },
  {
    titre: "Pantalons",
    link: "/categories/femmes/vetements/pantalons",
  },
  {
    titre: "Ensembles",
    link: "/categories/femmes/vetements/ensembles",
  },
  {
    titre: "Chaussures",
    children: [
      { titre: "Chaussures femme", link: "/categories/femmes/chaussures" },
      { titre: "Accessoires", link: "/categories/femmes/vetements/accessoires" },
    ],
  },
  {
    titre: "Sacs",
    link: "/categories/femmes/vetements/sacs",
  },
  {
    titre: "Accessoires",
    link: "/categories/femmes/vetements/accessoires",
  },
];

export function NavMenu() {
  return (
    <NavigationMenu viewport={false} className="z-50">
      <NavigationMenuList>
        {menuItems.map((menu) =>
          "children" in menu ? (
            <NavigationMenuItem key={menu.titre}>
              <NavigationMenuTrigger className="text-sm font-medium">
                {menu.titre.toUpperCase()}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col w-44 p-2">
                  {menu.children.map((child) => (
                    <li key={child.titre}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={child.link}
                          className="block px-3 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-stone-100 rounded transition-colors"
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
                className={navigationMenuTriggerStyle()}
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
