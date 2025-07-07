import { NextRequest, NextResponse } from 'next/server'
import { searchDocuments } from '@/lib/elasticsearch'
import { createClient } from 'contentful'

// Fallback Contentful client for error scenarios
const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
})

/**
 * Fallback to Contentful search if Elasticsearch fails
 */
async function fallbackToContentfulSearch(query: string, contentType: string, limit: number) {
  console.log('Falling back to Contentful search')
  
  const searchPromises = []
  
  // Search articles if type is 'article' or 'all'
  if (!contentType || contentType === 'all' || contentType === 'article') {
    searchPromises.push(
      contentfulClient.getEntries({
        content_type: 'article',
        query: query.trim(),
        limit: contentType === 'article' ? limit : Math.floor(limit / 2),
        order: ['-sys.updatedAt'],
      })
    )
  }

  // Search recipes if type is 'recipe' or 'all'
  if (!contentType || contentType === 'all' || contentType === 'recipe') {
    searchPromises.push(
      contentfulClient.getEntries({
        content_type: 'recipe',
        query: query.trim(),
        limit: contentType === 'recipe' ? limit : Math.floor(limit / 2),
        order: ['-sys.updatedAt'],
      })
    )
  }

  const searchResults = await Promise.all(searchPromises)
  
  let allResults: any[] = []
  let totalResults = 0

  searchResults.forEach(result => {
    if (result && result.items) {
      allResults = allResults.concat(result.items.map(item => ({
        ...item,
        contentType: item.sys.contentType.sys.id
      })))
      totalResults += result.total
    }
  })

  // Sort combined results by relevance (updated date for now)
  allResults.sort((a, b) => 
    new Date(b.sys.updatedAt).getTime() - new Date(a.sys.updatedAt).getTime()
  )

  // Limit results if searching all types
  if (!contentType || contentType === 'all') {
    allResults = allResults.slice(0, limit)
  }

  return {
    results: allResults,
    total: totalResults,
    query: query.trim(),
    type: contentType || 'all'
  }
}

/**
 * Transform Elasticsearch results to match expected format
 */
function transformElasticsearchResults(esResults: any[]) {
  return esResults.map(result => {
    // Create a structure that matches what the frontend expects
    const transformedResult = {
      sys: {
        id: result.id,
        contentType: {
          sys: {
            id: result.type
          }
        },
        createdAt: result.publishedAt,
        updatedAt: result.publishedAt
      },
      fields: {
        title: result.title,
        slug: result.slug,
        newSlug: result.slug, // Use the same slug for both
        metaDescription: result.metaDescription,
        publishedAt: result.publishedAt
      },
      contentType: result.type,
      _score: result.score,
      _highlight: result.highlight
    }

    // Add listImage if available
    if (result.imageUrl) {
      transformedResult.fields.listImage = {
        fields: {
          file: {
            url: result.imageUrl
          }
        }
      }
    }

    return transformedResult
  })
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const contentType = searchParams.get('type') // 'article', 'recipe', or 'all'
    const limit = parseInt(searchParams.get('limit') || '12')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: query || ''
      })
    }

    try {
      // Try Elasticsearch search first
      const esResponse = await searchDocuments(
        query.trim(),
        contentType as 'article' | 'recipe' | 'all',
        limit
      )

      // Transform results to match expected format
      const transformedResults = transformElasticsearchResults(esResponse.results)

      return NextResponse.json({
        results: transformedResults,
        total: esResponse.total,
        query: esResponse.query,
        type: esResponse.type,
        source: 'elasticsearch'
      })

    } catch (elasticsearchError) {
      console.error('Elasticsearch search failed:', elasticsearchError)
      
      // Fallback to Contentful search
      const fallbackResults = await fallbackToContentfulSearch(query, contentType || 'all', limit)
      
      return NextResponse.json({
        ...fallbackResults,
        source: 'contentful_fallback'
      })
    }

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { 
        error: 'Search failed',
        results: [],
        total: 0,
        query: '',
        source: 'error'
      },
      { status: 500 }
    )
  }
}