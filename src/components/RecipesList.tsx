'use client'

import { useState, useCallback } from 'react'
import RecipeCard from './RecipeCard'
import { Recipe } from '@/types/contentful'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface RecipesListProps {
  initialRecipes: Recipe[]
  initialTotal: number
}

const RECIPES_PER_PAGE = 9

export default function RecipesList({ initialRecipes, initialTotal }: RecipesListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialRecipes.length < initialTotal)

  const loadMoreRecipes = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/recipes?skip=${recipes.length}&limit=${RECIPES_PER_PAGE}`)
      const data = await response.json()
      
      if (data.recipes && data.recipes.length > 0) {
        const newRecipes = [...recipes, ...data.recipes]
        setRecipes(newRecipes)
        setHasMore(newRecipes.length < data.total)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more recipes:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [recipes.length, isLoading, hasMore])

  useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMoreRecipes,
    threshold: 200
  })

  return (
    <div>
      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{recipes.length}</span> of <span className="font-medium">{initialTotal}</span> recipes
        </p>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.sys.id} recipe={recipe} />
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-4 py-2 border-2 border-brand-green text-brand-green bg-white rounded-lg font-semibold shadow-sm">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">Loading more recipes...</span>
          </div>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && recipes.length > 0 && (
        <div className="text-center mt-8 py-6">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-sm text-gray-600">All recipes loaded</span>
          </div>
        </div>
      )}
    </div>
  )
}