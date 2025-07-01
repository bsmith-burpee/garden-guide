'use client'

import { useState, useCallback } from 'react'
import ArticleCard from './ArticleCard'
import { Article } from '@/types/contentful'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface ArticlesListProps {
  initialArticles: Article[]
  initialTotal: number
}

const ARTICLES_PER_PAGE = 9

export default function ArticlesList({ initialArticles, initialTotal }: ArticlesListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialArticles.length < initialTotal)
  

  const loadMoreArticles = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/articles?skip=${articles.length}&limit=${ARTICLES_PER_PAGE}`)
      const data = await response.json()
      
      if (data.articles && data.articles.length > 0) {
        const newArticles = [...articles, ...data.articles]
        setArticles(newArticles)
        setHasMore(newArticles.length < data.total)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more articles:', error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [articles.length, isLoading, hasMore])

  useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMoreArticles,
    threshold: 200
  })

  return (
    <div>
      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{articles.length}</span> of <span className="font-medium">{initialTotal}</span> articles
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.sys.id} article={article} />
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
            <span className="text-sm">Loading more articles...</span>
          </div>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && articles.length > 0 && (
        <div className="text-center mt-8 py-6">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-sm text-gray-600">All articles loaded</span>
          </div>
        </div>
      )}
    </div>
  )
}