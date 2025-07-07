#!/usr/bin/env node

/**
 * Sync script to index Contentful content into Elasticsearch
 * Run with: node scripts/sync-elasticsearch.js
 */

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('contentful')
const { Client } = require('@elastic/elasticsearch')

// Contentful client
const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
})

// Elasticsearch client
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY
  }
})

const INDEX_NAME = process.env.ELASTICSEARCH_INDEX

/**
 * Extract text content from Contentful rich text
 */
function extractTextFromRichText(richText) {
  if (!richText || !richText.content) return ''
  
  function extractText(nodes) {
    return nodes.map(node => {
      if (node.nodeType === 'text') {
        return node.value || ''
      }
      if (node.content) {
        return extractText(node.content)
      }
      return ''
    }).join(' ')
  }
  
  return extractText(richText.content).replace(/\s+/g, ' ').trim()
}

/**
 * Get image URL from Contentful asset
 */
function getImageUrl(asset) {
  if (!asset?.fields?.file?.url) return undefined
  
  let imageUrl = asset.fields.file.url
  if (imageUrl.startsWith('//')) {
    imageUrl = `https:${imageUrl}`
  }
  return imageUrl
}

/**
 * Transform Contentful article to search document
 */
function transformArticle(article) {
  const fields = article.fields
  const slug = fields.newSlug || fields.slug
  
  let content = ''
  if (fields.body) {
    content = extractTextFromRichText(fields.body)
  }
  
  // Add meta description to content for better search
  if (fields.metaDescription) {
    content = `${fields.metaDescription} ${content}`
  }
  
  return {
    id: article.sys.id,
    title: fields.title || '',
    content: content,
    type: 'article',
    slug: slug || '',
    publishedAt: fields.publishedAt || article.sys.createdAt,
    metaDescription: fields.metaDescription,
    imageUrl: fields.listImage ? getImageUrl(fields.listImage) : undefined
  }
}

/**
 * Transform Contentful recipe to search document
 */
function transformRecipe(recipe) {
  const fields = recipe.fields
  const slug = fields.newSlug || fields.slug
  
  let content = ''
  if (fields.body) {
    content = extractTextFromRichText(fields.body)
  }
  
  // Add ingredients to content for better search
  if (fields.recipeIngredients && fields.recipeIngredients.length > 0) {
    const ingredients = fields.recipeIngredients
      .map(ing => {
        if (ing.fields) {
          return `${ing.fields.amount || ''} ${ing.fields.ingredientName || ''}`.trim()
        }
        return ''
      })
      .filter(Boolean)
      .join(', ')
    
    content = `Ingredients: ${ingredients}. ${content}`
  }
  
  // Add instructions to content
  if (fields.instructions && fields.instructions.length > 0) {
    const instructions = fields.instructions.join(' ')
    content = `${content} Instructions: ${instructions}`
  }
  
  // Add meta description to content
  if (fields.metaDescription) {
    content = `${fields.metaDescription} ${content}`
  }
  
  return {
    id: recipe.sys.id,
    title: fields.title || '',
    content: content,
    type: 'recipe',
    slug: slug || '',
    publishedAt: fields.publishedAt || recipe.sys.createdAt,
    metaDescription: fields.metaDescription,
    imageUrl: fields.listImage ? getImageUrl(fields.listImage) : undefined
  }
}

/**
 * Fetch all articles from Contentful
 */
async function fetchAllArticles() {
  console.log('Fetching articles from Contentful...')
  
  const articles = []
  let skip = 0
  const limit = 100
  
  while (true) {
    try {
      const response = await contentfulClient.getEntries({
        content_type: 'article',
        limit,
        skip,
        include: 2,
        order: ['-fields.publishedAt']
      })
      
      if (response.items.length === 0) break
      
      articles.push(...response.items)
      console.log(`Fetched ${articles.length}/${response.total} articles`)
      
      if (articles.length >= response.total) break
      skip += limit
    } catch (error) {
      console.error('Error fetching articles:', error)
      break
    }
  }
  
  return articles
}

/**
 * Fetch all recipes from Contentful
 */
async function fetchAllRecipes() {
  console.log('Fetching recipes from Contentful...')
  
  const recipes = []
  let skip = 0
  const limit = 100
  
  while (true) {
    try {
      const response = await contentfulClient.getEntries({
        content_type: 'recipe',
        limit,
        skip,
        include: 3,
        order: ['-fields.publishedAt']
      })
      
      if (response.items.length === 0) break
      
      recipes.push(...response.items)
      console.log(`Fetched ${recipes.length}/${response.total} recipes`)
      
      if (recipes.length >= response.total) break
      skip += limit
    } catch (error) {
      console.error('Error fetching recipes:', error)
      break
    }
  }
  
  return recipes
}

/**
 * Create index with mappings
 */
async function createIndex() {
  try {
    const indexExists = await esClient.indices.exists({ index: INDEX_NAME })
    
    if (indexExists) {
      console.log(`Index ${INDEX_NAME} already exists`)
      return
    }
    
    await esClient.indices.create({
      index: INDEX_NAME,
      body: {
        mappings: {
          properties: {
            id: { type: 'keyword' },
            title: { 
              type: 'text',
              analyzer: 'standard'
            },
            content: { 
              type: 'text',
              analyzer: 'standard'
            },
            type: { type: 'keyword' },
            slug: { type: 'keyword' },
            publishedAt: { type: 'date' },
            metaDescription: { 
              type: 'text',
              analyzer: 'standard'
            },
            imageUrl: { type: 'keyword' }
          }
        }
      }
    })
    
    console.log(`Created index: ${INDEX_NAME}`)
  } catch (error) {
    console.error('Error creating index:', error)
    throw error
  }
}

/**
 * Bulk index documents
 */
async function bulkIndex(documents) {
  if (documents.length === 0) return
  
  try {
    const body = documents.flatMap(doc => [
      { index: { _index: INDEX_NAME, _id: doc.id } },
      doc
    ])

    console.log(`Indexing ${documents.length} documents...`)
    
    const response = await esClient.bulk({
      body,
      timeout: '300s', // Extended timeout for semantic processing
      refresh: 'wait_for'
    })

    if (response.errors) {
      const errors = response.items?.filter(item => item.index?.error) || []
      console.error('Bulk indexing errors:', errors)
      throw new Error('Some documents failed to index')
    }

    console.log(`Successfully indexed ${documents.length} documents`)
  } catch (error) {
    console.error('Error bulk indexing:', error)
    throw error
  }
}

/**
 * Main sync function
 */
async function syncToElasticsearch() {
  try {
    console.log('Starting Elasticsearch sync...')
    
    // Test connection
    await esClient.ping()
    console.log('✅ Elasticsearch connection successful')
    
    // Create index
    await createIndex()
    
    // Fetch content from Contentful
    const [articles, recipes] = await Promise.all([
      fetchAllArticles(),
      fetchAllRecipes()
    ])
    
    console.log(`\nFound ${articles.length} articles and ${recipes.length} recipes`)
    
    // Transform content
    console.log('Transforming content...')
    const articleDocs = articles.map(transformArticle)
    const recipeDocs = recipes.map(transformRecipe)
    const allDocs = [...articleDocs, ...recipeDocs]
    
    console.log(`Transformed ${allDocs.length} documents for indexing`)
    
    // Clear existing content
    console.log('Clearing existing index...')
    try {
      await esClient.deleteByQuery({
        index: INDEX_NAME,
        body: {
          query: { match_all: {} }
        },
        refresh: true
      })
      console.log('✅ Cleared existing documents')
    } catch (error) {
      console.log('Index might be empty, continuing...')
    }
    
    // Index content in batches
    const batchSize = 50
    for (let i = 0; i < allDocs.length; i += batchSize) {
      const batch = allDocs.slice(i, i + batchSize)
      await bulkIndex(batch)
    }
    
    // Get final stats
    let docCount = allDocs.length
    try {
      const stats = await esClient.indices.stats({ index: INDEX_NAME })
      docCount = stats.indices[INDEX_NAME]?.total?.docs?.count || docCount
    } catch (error) {
      console.log('Note: Could not retrieve index stats (API version compatibility)')
    }
    
    console.log(`\n✅ Sync completed successfully!`)
    console.log(`📊 Total documents indexed: ${docCount}`)
    console.log(`   - Articles: ${articleDocs.length}`)
    console.log(`   - Recipes: ${recipeDocs.length}`)
    
  } catch (error) {
    console.error('❌ Sync failed:', error)
    process.exit(1)
  }
}

// Run the sync
if (require.main === module) {
  syncToElasticsearch()
    .then(() => {
      console.log('🎉 Sync process completed')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Sync process failed:', error)
      process.exit(1)
    })
}

module.exports = { syncToElasticsearch }