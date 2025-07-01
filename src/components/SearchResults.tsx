'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/utils/imageUtils'

interface SearchResult {
  sys: {
    id: string
    contentType: {
      sys: {
        id: string
      }
    }
    updatedAt: string
  }
  fields: {
    title: string
    slug?: string
    newSlug?: string
    body?: any
    featuredImage?: any
    imageAlt?: string
    metaDescription?: string
  }
  contentType: string
}

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  isLoading: boolean
  total: number
}

export default function SearchResults({ results, query, isLoading, total }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center px-6 py-3 text-brand-green">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching...
        </div>
      </div>
    )
  }

  if (!query || query.trim().length < 2) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2 font-reckless">Search Articles & Recipes</h3>
        <p className="text-gray-500">Enter at least 2 characters to start searching through our content.</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2 font-reckless">No results found</h3>
        <p className="text-gray-500">
          We couldn't find anything matching "<span className="font-medium">{query}</span>". 
          Try different keywords or browse our articles and recipes.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/articles"
            className="bg-brand-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-green/90 transition-colors"
          >
            Browse Articles
          </Link>
          <Link 
            href="/recipes"
            className="border-2 border-brand-green text-brand-green px-6 py-2 rounded-lg font-semibold hover:bg-brand-green hover:text-white transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Results summary */}
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-2 font-reckless">
          Search Results
        </h2>
        <p className="text-gray-600">
          Found {total} result{total !== 1 ? 's' : ''} for "<span className="font-medium">{query}</span>"
        </p>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => {
          const slug = result.fields.newSlug || result.fields.slug
          const href = result.contentType === 'article' ? `/articles/${slug}` : `/recipes/${slug}`
          const imageUrl = result.fields.featuredImage ? getImageUrl(result.fields.featuredImage) : null
          const contentType = result.contentType === 'article' ? 'Article' : 'Recipe'
          
          // Extract plain text from rich text body for excerpt
          let excerpt = result.fields.metaDescription || ''
          if (!excerpt && result.fields.body && result.fields.body.content) {
            const textNodes = result.fields.body.content
              .filter((node: any) => node.nodeType === 'paragraph')
              .slice(0, 2)
              .map((node: any) => 
                node.content
                  ?.filter((content: any) => content.nodeType === 'text')
                  .map((content: any) => content.value)
                  .join('')
              )
              .filter(Boolean)
              .join(' ')
            
            excerpt = textNodes.substring(0, 150) + (textNodes.length > 150 ? '...' : '')
          }

          return (
            <Link key={result.sys.id} href={href} className="group">
              <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={result.fields.imageAlt || result.fields.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      result.contentType === 'article' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {contentType}
                    </span>
                    <time className="text-xs text-gray-500">
                      {new Date(result.sys.updatedAt).toLocaleDateString()}
                    </time>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 font-geograph group-hover:text-brand-green transition-colors">
                    {result.fields.title}
                  </h3>
                  
                  {excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </div>
  )
}