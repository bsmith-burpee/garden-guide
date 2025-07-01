import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-brand-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.svg"
                alt="Burpee Logo"
                width={40}
                height={40}
                className="h-10 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-white/80 mb-4 max-w-md">
              Trusted by gardeners since 1876, Burpee provides expert guidance, quality seeds, 
              and innovative solutions to help your garden thrive.
            </p>
            <p className="text-white/60 text-sm">
              © 2025 W. Atlee Burpee & Co. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 font-reckless">Explore</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  Garden Articles
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-white transition-colors">
                  Garden Recipes
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Seeds & Plants
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4 font-reckless">Categories</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link href="/articles?category=vegetables" className="hover:text-white transition-colors">
                  Vegetables
                </Link>
              </li>
              <li>
                <Link href="/articles?category=fruits" className="hover:text-white transition-colors">
                  Fruits
                </Link>
              </li>
              <li>
                <Link href="/articles?category=flowers" className="hover:text-white transition-colors">
                  Flowers
                </Link>
              </li>
              <li>
                <Link href="/articles?category=herbs" className="hover:text-white transition-colors">
                  Herbs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            Growing together since 1876
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-white/60 hover:text-white text-sm transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}