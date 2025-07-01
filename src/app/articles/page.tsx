import { getArticles } from '@/lib/contentful'
import ArticlesList from '@/components/ArticlesList'

export const metadata = {
  title: 'Garden Articles | Burpee Garden Guide',
  description: 'Explore expert gardening articles, tips, and guides from Burpee - your trusted gardening resource since 1876.',
}

export default async function ArticlesPage() {
  const { articles: initialArticles, total: totalCount } = await getArticles(12)

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-medium text-gray-900 mb-4 font-reckless">Garden Articles</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Discover expert advice, tips, and guides to help your garden thrive. 
            From planting basics to advanced techniques, we've got you covered.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {totalCount} articles available
          </p>
        </div>
      </div>

      {/* Articles Grid with Infinite Scroll */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ArticlesList 
          initialArticles={initialArticles} 
          initialTotal={totalCount}
        />
      </div>
    </div>
  )
}