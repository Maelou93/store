import Image from "next/image";
import Link from "next/link";
import Logo from "../../../../public/images/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="lg:col-span-1">
            <Link href="/">
              <Image src={Logo} alt="" className="w-36 h-auto" />
            </Link>
            <div className="flex space-x-4 mt-10">
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Facebook</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Twitter</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Instagram</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </Link>
            </div>
          </div>

          {/* Vêtements */}
          <div>
            <h4 className="text-lg font-semibold text-[#6B5848] mb-4">VÊTEMENTS</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/categories/femmes/vetements" className="hover:text-[#6B5848]">Tout voir</Link></li>
              <li><Link href="/categories/femmes/vetements/hauts-top" className="hover:text-[#6B5848]">Hauts/Tops</Link></li>
              <li><Link href="/categories/femmes/vetements/pantalons" className="hover:text-[#6B5848]">Pantalons</Link></li>
              <li><Link href="/categories/femmes/vetements/ensembles" className="hover:text-[#6B5848]">Ensembles</Link></li>
              <li><Link href="/categories/femmes/vetements/manteaux-vestes" className="hover:text-[#6B5848]">Manteaux/Vestes</Link></li>
            </ul>
          </div>

          {/* Chaussures */}
          <div>
            <h4 className="text-lg font-semibold text-[#6B5848] mb-4">CHAUSSURES</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/categories/femmes/chaussures" className="hover:text-[#6B5848]">Tout voir</Link></li>
              <li><Link href="/categories/femmes/chaussures/baskets" className="hover:text-[#6B5848]">Baskets</Link></li>
              <li><Link href="/categories/femmes/chaussures/sandales" className="hover:text-[#6B5848]">Sandales</Link></li>
              <li><Link href="/categories/femmes/chaussures/ballerines" className="hover:text-[#6B5848]">Ballerines</Link></li>
              <li><Link href="/categories/femmes/chaussures/talons" className="hover:text-[#6B5848]">Talons</Link></li>
              <li><Link href="/categories/femmes/chaussures/mocassins" className="hover:text-[#6B5848]">Mocassins</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-lg font-semibold text-[#6B5848] mb-4">COLLECTIONS</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/categories/femmes/sacs" className="hover:text-[#6B5848]">Sacs</Link></li>
              <li><Link href="/categories/femmes/accessoires" className="hover:text-[#6B5848]">Accessoires</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <p className="text-center text-sm text-gray-500"></p>
        </div>
      </div>
    </footer>
  );
}
