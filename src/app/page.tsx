import Link from 'next/link'
import Image from 'next/image'
import ArticleCard from '@/components/ArticleCard'
import RecipeCard from '@/components/RecipeCard'
import { getFeaturedArticles, getFeaturedRecipes } from '@/lib/contentful'

export default async function Home() {
  const [featuredArticles, featuredRecipes] = await Promise.all([
    getFeaturedArticles(4),
    getFeaturedRecipes(3)
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/heros/gg_web_hero.png"
            alt="Burpee Garden Guide Hero"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-medium mb-6 font-reckless text-white drop-shadow-lg">
              Welcome to Burpee Garden Guide
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
              Discover expert gardening advice, delicious garden-to-table recipes, 
              and quality seeds trusted by gardeners since 1876.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/articles"
                className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors shadow-lg"
              >
                Explore Articles
              </Link>
              <Link 
                href="/recipes"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors shadow-lg"
              >
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-medium text-gray-900 font-reckless">Latest Garden Articles</h2>
            <Link 
              href="/articles"
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              View all articles
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.sys.id} article={article} size="small" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-medium text-gray-900 font-reckless">Garden-to-Table Recipes</h2>
            <Link 
              href="/recipes"
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              View all recipes
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.sys.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-faded-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-medium text-gray-900 mb-4 font-reckless">
            Start Your Garden Journey Today
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join millions of gardeners who trust Burpee for quality seeds, expert advice, and innovative solutions.
          </p>
          <Link 
            href="/products"
            className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-green/90 transition-colors inline-block"
          >
            Shop Seeds & Plants
          </Link>
        </div>
      </section>
    </div>
  )
}
