'use client'

import { useState, useCallback } from 'react'
import RecipeCard from './RecipeCard'
import { Recipe } from '@/types/contentful'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface RecipesListProps {
  initialRecipes: Recipe[]
  initialTotal: number
}

const RECIPES_PER_PAGE = 12

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.sys.id} recipe={recipe} />
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 text-brand-green">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading more recipes...
          </div>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && recipes.length > 0 && (
        <div className="text-center mt-12 py-8">
          <p className="text-gray-500">You've reached the end of our recipes!</p>
          <p className="text-sm text-gray-400 mt-2">
            Showing {recipes.length} of {initialTotal} recipes
          </p>
        </div>
      )}
    </>
  )
}