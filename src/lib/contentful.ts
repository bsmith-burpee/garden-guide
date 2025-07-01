import { createClient } from 'contentful'
import { Article, Recipe, Product, ContentfulEntry } from '@/types/contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
})

export async function getArticles(limit = 10, skip = 0): Promise<{ articles: Article[], total: number }> {
  const response = await client.getEntries<Article['fields']>({
    content_type: 'article',
    limit,
    skip,
    order: ['-fields.publishedAt'],
    include: 2,
  })
  
  return {
    articles: response.items as Article[],
    total: response.total
  }
}

export async function getArticlesSimple(limit = 10, skip = 0): Promise<Article[]> {
  const response = await client.getEntries<Article['fields']>({
    content_type: 'article',
    limit,
    skip,
    order: ['-fields.publishedAt'],
    include: 2,
  })
  
  return response.items as Article[]
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const response = await client.getEntries<Article['fields']>({
    content_type: 'article',
    'fields.slug': slug,
    include: 2,
    limit: 1,
  })
  
  if (response.items.length === 0) {
    // Try with newSlug field
    const newSlugResponse = await client.getEntries<Article['fields']>({
      content_type: 'article',
      'fields.newSlug': slug,
      include: 2,
      limit: 1,
    })
    
    return newSlugResponse.items.length > 0 ? (newSlugResponse.items[0] as Article) : null
  }
  
  return response.items[0] as Article
}

export async function getFeaturedArticles(limit = 4): Promise<Article[]> {
  return getArticlesSimple(limit, 0)
}

export async function getRecipes(limit = 10, skip = 0): Promise<{ recipes: Recipe[], total: number }> {
  const response = await client.getEntries<Recipe['fields']>({
    content_type: 'recipe',
    limit,
    skip,
    order: ['-fields.publishedAt'],
    include: 3,
  })
  
  return {
    recipes: response.items as Recipe[],
    total: response.total
  }
}

export async function getRecipesSimple(limit = 10, skip = 0): Promise<Recipe[]> {
  const response = await client.getEntries<Recipe['fields']>({
    content_type: 'recipe',
    limit,
    skip,
    order: ['-fields.publishedAt'],
    include: 3,
  })
  
  return response.items as Recipe[]
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const response = await client.getEntries<Recipe['fields']>({
    content_type: 'recipe',
    'fields.slug': slug,
    include: 3,
    limit: 1,
  })
  
  if (response.items.length === 0) {
    // Try with newSlug field
    const newSlugResponse = await client.getEntries<Recipe['fields']>({
      content_type: 'recipe',
      'fields.newSlug': slug,
      include: 3,
      limit: 1,
    })
    
    return newSlugResponse.items.length > 0 ? (newSlugResponse.items[0] as Recipe) : null
  }
  
  return response.items[0] as Recipe
}

export async function getFeaturedRecipes(limit = 3): Promise<Recipe[]> {
  return getRecipesSimple(limit, 0)
}

export async function getProducts(limit = 10, skip = 0): Promise<Product[]> {
  const response = await client.getEntries<Product['fields']>({
    content_type: 'product',
    limit,
    skip,
    include: 2,
  })
  
  return response.items as Product[]
}

export async function searchContent(query: string, contentTypes: string[] = ['article', 'recipe']): Promise<ContentfulEntry[]> {
  const response = await client.getEntries({
    query,
    content_type: contentTypes.join(','),
    include: 2,
    limit: 20,
  })
  
  return response.items as ContentfulEntry[]
}

export function getImageUrl(asset: any, width?: number, height?: number): string {
  if (!asset?.fields?.file?.url) {
    return ''
  }
  
  let imageUrl = asset.fields.file.url
  
  // Ensure URL has protocol
  if (imageUrl.startsWith('//')) {
    imageUrl = `https:${imageUrl}`
  }
  
  // Don't add Contentful transformations when using Next.js Image component
  // Next.js will handle the optimization
  return imageUrl
}