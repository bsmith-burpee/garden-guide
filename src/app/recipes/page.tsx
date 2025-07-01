import { getRecipes } from '@/lib/contentful'
import RecipesList from '@/components/RecipesList'

export const metadata = {
  title: 'Garden Recipes | Burpee Garden Guide',
  description: 'Discover delicious recipes using fresh ingredients from your garden. From harvest to table with Burpee.',
}

export default async function RecipesPage() {
  const { recipes: initialRecipes, total: totalCount } = await getRecipes(9)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-medium text-gray-900 mb-4 font-reckless">Garden-to-Table Recipes</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Transform your garden harvest into delicious meals. Explore recipes that celebrate 
              the fresh flavors of homegrown ingredients.
            </p>
            <div className="mt-6 flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-faded-green text-brand-green">
                {totalCount} recipes
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
              <h3 className="text-lg font-semibold text-brand-green mb-4 font-geograph">Recipe Categories</h3>
              <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-600">All Recipes</span>
                    <span className="ml-2 text-xs text-gray-400">({totalCount})</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>Salads & Sides</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>Main Dishes</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>Soups & Stews</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>Preserving & Canning</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>Desserts</span>
                  </div>
                </div>
            </div>
          </div>

          {/* Recipes Grid */}
          <div className="flex-1">
            <RecipesList 
              initialRecipes={initialRecipes} 
              initialTotal={totalCount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}