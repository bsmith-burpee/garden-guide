import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/types/contentful'
import { getImageUrl } from '@/utils/imageUtils'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { title, listImage, listImageAlt, slug, newSlug, metaDescription, recipeIngredients } = recipe.fields
  const recipeSlug = newSlug || slug
  
  const imageUrl = listImage ? getImageUrl(listImage) : ''
  const ingredientCount = recipeIngredients?.length || 0
  
  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-brand-green group">
      <Link href={`/recipes/${recipeSlug}`} className="block">
        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={listImageAlt || title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-faded-green text-brand-green">
              Recipe
            </span>
            {ingredientCount > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                {ingredientCount} ingredients
              </div>
            )}
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-3 font-geograph group-hover:text-brand-green transition-colors leading-tight">
            {title}
          </h3>
          {metaDescription && (
            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
              {metaDescription}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}