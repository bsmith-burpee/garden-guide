import { NextRequest, NextResponse } from 'next/server'
import { getRecipes } from '@/lib/contentful'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skip = parseInt(searchParams.get('skip') || '0')
    const limit = parseInt(searchParams.get('limit') || '12')

    const { recipes, total } = await getRecipes(limit, skip)

    return NextResponse.json({
      recipes,
      total,
      hasMore: skip + recipes.length < total
    })
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}