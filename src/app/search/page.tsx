'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchInput from '@/components/SearchInput'
import SearchResults from '@/components/SearchResults'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialType = searchParams.get('type') || 'all'

  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState(initialQuery)
  const [contentType, setContentType] = useState(initialType)

  const performSearch = useCallback(async (searchQuery: string, type: string = 'all') => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([])
      setTotal(0)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    
    try {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        type: type,
        limit: '12'
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      setResults(data.results || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Search when query changes (debounced through SearchInput)
  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery)
    performSearch(searchQuery, contentType)
  }, [contentType, performSearch])

  // Search when content type filter changes
  const handleTypeChange = useCallback((type: string) => {
    setContentType(type)
    if (query && query.trim().length >= 2) {
      performSearch(query, type)
    }
  }, [query, performSearch])

  // Perform initial search if there's a query in the URL
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length >= 2) {
      performSearch(initialQuery, initialType)
    }
  }, [initialQuery, initialType, performSearch])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-6 font-reckless">Search</h1>
          
          {/* Search Input */}
          <div className="mb-6">
            <SearchInput
              defaultValue={initialQuery}
              onSearch={handleSearch}
              showButton={false}
              className="w-full"
            />
          </div>

          {/* Content Type Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTypeChange('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                contentType === 'all'
                  ? 'bg-brand-green text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Content
            </button>
            <button
              onClick={() => handleTypeChange('article')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                contentType === 'article'
                  ? 'bg-brand-green text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Articles Only
            </button>
            <button
              onClick={() => handleTypeChange('recipe')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                contentType === 'recipe'
                  ? 'bg-brand-green text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Recipes Only
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchResults
          results={results}
          query={query}
          isLoading={isLoading}
          total={total}
        />
      </div>
    </div>
  )
}

function SearchPageLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-6 font-reckless">Search</h1>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg mb-6"></div>
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
              <div className="h-8 w-28 bg-gray-200 rounded-lg"></div>
              <div className="h-8 w-26 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center px-6 py-3 text-brand-green">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading search...
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  )
}