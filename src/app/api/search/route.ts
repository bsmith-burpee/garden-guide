import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
})

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

    const searchPromises = []
    
    // Search articles if type is 'article' or 'all'
    if (!contentType || contentType === 'all' || contentType === 'article') {
      searchPromises.push(
        client.getEntries({
          content_type: 'article',
          query: query.trim(),
          limit: contentType === 'article' ? limit : Math.floor(limit / 2),
          order: ['-sys.updatedAt'], // Most recently updated first
        })
      )
    }

    // Search recipes if type is 'recipe' or 'all'
    if (!contentType || contentType === 'all' || contentType === 'recipe') {
      searchPromises.push(
        client.getEntries({
          content_type: 'recipe',
          query: query.trim(),
          limit: contentType === 'recipe' ? limit : Math.floor(limit / 2),
          order: ['-sys.updatedAt'], // Most recently updated first
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

    return NextResponse.json({
      results: allResults,
      total: totalResults,
      query: query.trim(),
      type: contentType || 'all'
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { 
        error: 'Search failed',
        results: [],
        total: 0,
        query: ''
      },
      { status: 500 }
    )
  }
}