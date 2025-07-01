import { NextRequest, NextResponse } from 'next/server'
import { getArticles } from '@/lib/contentful'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const limit = parseInt(searchParams.get('limit') || '12')

    const { articles, total } = await getArticles(limit, skip)

    return NextResponse.json({
      articles,
      total,
      hasMore: skip + articles.length < total
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}