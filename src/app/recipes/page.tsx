import { getRecipes } from '@/lib/contentful'
import RecipesList from '@/components/RecipesList'

export const metadata = {
  title: 'Garden Recipes | Burpee Garden Guide',
  description: 'Discover delicious recipes using fresh ingredients from your garden. From harvest to table with Burpee.',
}

export default async function RecipesPage() {
  const { recipes: initialRecipes, total: totalCount } = await getRecipes(12)

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-medium text-gray-900 mb-4 font-reckless">Garden-to-Table Recipes</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Transform your garden harvest into delicious meals. Explore recipes that celebrate 
            the fresh flavors of homegrown ingredients.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {totalCount} recipes available
          </p>
        </div>
      </div>

      {/* Recipes Grid with Infinite Scroll */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RecipesList 
          initialRecipes={initialRecipes} 
          initialTotal={totalCount}
        />
      </div>
    </div>
  )
}