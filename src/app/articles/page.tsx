import { getArticles } from '@/lib/contentful'
import ArticlesList from '@/components/ArticlesList'

export const metadata = {
  title: 'Garden Articles | Burpee Garden Guide',
  description: 'Explore expert gardening articles, tips, and guides from Burpee - your trusted gardening resource since 1876.',
}

export default async function ArticlesPage() {
  const { articles: initialArticles, total: totalCount } = await getArticles(9)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-medium text-gray-900 mb-4 font-reckless">Garden Articles</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover expert advice, tips, and guides to help your garden thrive. 
              From planting basics to advanced techniques, we've got you covered.
            </p>
            <div className="mt-6 flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-green text-white">
                {totalCount} articles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-brand-green mb-4 font-geograph">Browse by Topic</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">All Topics</span>
                  <span className="ml-2 text-xs text-gray-400">({totalCount})</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span>Vegetable Growing</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span>Flower Gardening</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span>Garden Planning</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span>Pest & Disease</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span>Soil & Composting</span>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="flex-1">
            <ArticlesList 
              initialArticles={initialArticles} 
              initialTotal={totalCount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}