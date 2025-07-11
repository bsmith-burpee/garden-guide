import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Burpee Garden Guide"
              width={64}
              height={64}
              className="h-16 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/articles" 
              className="text-gray-900 hover:text-brand-green font-medium transition-colors text-lg"
            >
              Garden Articles
            </Link>
            <Link 
              href="/recipes" 
              className="text-gray-900 hover:text-brand-green font-medium transition-colors text-lg"
            >
              Garden Recipes
            </Link>
            <Link 
              href="/products" 
              className="text-gray-900 hover:text-brand-green font-medium transition-colors text-lg"
            >
              Shop Products
            </Link>
            <Link 
              href="/search" 
              className="text-gray-900 hover:text-brand-green font-medium transition-colors flex items-center text-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Link>
          </nav>

          {/* Mobile search and menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Link 
              href="/search"
              className="p-2 rounded-md text-gray-700 hover:text-brand-green"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <button className="p-2 rounded-md text-gray-700 hover:text-brand-green">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}