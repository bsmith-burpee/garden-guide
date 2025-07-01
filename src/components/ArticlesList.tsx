'use client'

import { useState, useCallback } from 'react'
import ArticleCard from './ArticleCard'
import { Article } from '@/types/contentful'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface ArticlesListProps {
  initialArticles: Article[]
  initialTotal: number
}

const ARTICLES_PER_PAGE = 12

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.sys.id} article={article} />
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
            Loading more articles...
          </div>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && articles.length > 0 && (
        <div className="text-center mt-12 py-8">
          <p className="text-gray-500">You've reached the end of our articles!</p>
          <p className="text-sm text-gray-400 mt-2">
            Showing {articles.length} of {initialTotal} articles
          </p>
        </div>
      )}
    </>
  )
}