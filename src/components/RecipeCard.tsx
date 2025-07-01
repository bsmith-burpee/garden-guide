import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/types/contentful'
import { getImageUrl } from '@/utils/imageUtils'

interface RecipeCardProps {
  recipe: Recipe
  size?: 'small' | 'medium' | 'large'
}

export default function RecipeCard({ recipe, size = 'medium' }: RecipeCardProps) {
  const { title, listImage, listImageAlt, slug, newSlug, metaDescription, recipeIngredients } = recipe.fields
  const recipeSlug = newSlug || slug
  
  const imageUrl = listImage ? getImageUrl(listImage) : ''
  const ingredientCount = recipeIngredients?.length || 0
  
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg'
  }
  
  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${sizeClasses[size]}`}>
      <Link href={`/recipes/${recipeSlug}`}>
        {imageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={listImageAlt || title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 font-geograph">
            {title}
          </h3>
          {metaDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {metaDescription}
            </p>
          )}
          {ingredientCount > 0 && (
            <div className="flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              {ingredientCount} ingredients
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}