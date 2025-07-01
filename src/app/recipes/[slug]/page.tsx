import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getRecipeBySlug, getFeaturedRecipes } from '@/lib/contentful'
import { getImageUrl } from '@/utils/imageUtils'
import RichTextRenderer from '@/components/RichTextRenderer'
import RecipeCard from '@/components/RecipeCard'

interface RecipePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)

  if (!recipe) {
    return {
      title: 'Recipe Not Found | Burpee Garden Guide'
    }
  }

  return {
    title: recipe.fields.metaTitle || `${recipe.fields.title} | Burpee Garden Guide`,
    description: recipe.fields.metaDescription || `Try this delicious ${recipe.fields.title} recipe using fresh garden ingredients.`,
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  const [recipe, relatedRecipes] = await Promise.all([
    getRecipeBySlug(slug),
    getFeaturedRecipes(3)
  ])

  if (!recipe) {
    notFound()
  }

  const { title, body, featuredImage, imageAlt, recipeIngredients, instructions } = recipe.fields
  const featuredImageUrl = featuredImage ? getImageUrl(featuredImage) : null

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="mb-4">
            <Link
              href="/recipes"
              className="text-brand-green hover:text-brand-green/80 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Recipes
            </Link>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4 font-reckless">
            {title}
          </h1>
          
          {recipeIngredients && recipeIngredients.length > 0 && (
            <div className="flex items-center text-green-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              {recipeIngredients.length} ingredients
            </div>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {featuredImageUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={featuredImageUrl}
              alt={imageAlt || title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Recipe Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients Sidebar */}
          <div className="lg:col-span-1">
            {recipeIngredients && recipeIngredients.length > 0 && (
              <div className="bg-faded-green rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-medium text-gray-900 mb-4 font-reckless">Ingredients</h2>
                <ul className="space-y-2">
                  {recipeIngredients.map((ingredient: any, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-brand-green mr-2">•</span>
                      <span className="text-gray-900">
                        {ingredient.fields?.amount && (
                          <span className="font-medium text-gray-900">{ingredient.fields.amount} </span>
                        )}
                        <span className="text-gray-900">{ingredient.fields?.ingredientName}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recipe Content */}
          <div className="lg:col-span-2">
            {body && (
              <div className="mb-8">
                <RichTextRenderer document={body} />
              </div>
            )}

            {/* Instructions */}
            {instructions && instructions.length > 0 && (
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4 font-reckless">Instructions</h2>
                <ol className="space-y-4">
                  {instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-brand-green text-white text-sm font-bold rounded-full flex items-center justify-center mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <section className="bg-faded-green py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-medium text-gray-900 mb-8 font-reckless">More Garden Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedRecipes
                .filter(relatedRecipe => relatedRecipe.sys.id !== recipe.sys.id)
                .slice(0, 3)
                .map((relatedRecipe) => (
                  <RecipeCard key={relatedRecipe.sys.id} recipe={relatedRecipe} />
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}