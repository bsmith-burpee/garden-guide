export const metadata = {
  title: 'Garden Products | Burpee Garden Guide',
  description: 'Discover quality seeds, plants, and garden supplies from Burpee - trusted by gardeners since 1876.',
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-medium text-gray-900 mb-4 font-reckless">Seeds & Garden Products</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Quality seeds, plants, and garden supplies to help your garden thrive. 
            Trusted by gardeners since 1876.
          </p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white rounded-lg shadow-md p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-medium text-gray-900 mb-4 font-reckless">Product Catalog Coming Soon</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're working on bringing you our complete catalog of premium seeds, plants, and garden supplies. 
            In the meantime, explore our expert articles and recipes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/articles"
              className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-green/90 transition-colors"
            >
              Read Garden Articles
            </a>
            <a
              href="/recipes"
              className="border-2 border-brand-green text-brand-green px-8 py-3 rounded-lg font-semibold hover:bg-brand-green hover:text-white transition-colors"
            >
              Try Garden Recipes
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}