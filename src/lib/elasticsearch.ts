import { Client } from '@elastic/elasticsearch'

// Create Elasticsearch client
const client = new Client({
  node: process.env.ELASTICSEARCH_URL!,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY!
  }
})

const INDEX_NAME = process.env.ELASTICSEARCH_INDEX!

// Document interface for our indexed content
export interface SearchDocument {
  id: string
  title: string
  content: string
  type: 'article' | 'recipe'
  slug: string
  publishedAt: string
  metaDescription?: string
  imageUrl?: string
}

// Search results interface
export interface SearchResult {
  id: string
  title: string
  content: string
  type: 'article' | 'recipe'
  slug: string
  publishedAt: string
  metaDescription?: string
  imageUrl?: string
  score?: number
  highlight?: {
    title?: string[]
    content?: string[]
  }
}

// Search response interface
export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  type: string
}

/**
 * Test Elasticsearch connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await client.ping()
    console.log('Elasticsearch connection successful')
    return true
  } catch (error) {
    console.error('Elasticsearch connection failed:', error)
    return false
  }
}

/**
 * Create index with proper mappings if it doesn't exist
 */
export async function createIndex(): Promise<void> {
  try {
    const indexExists = await client.indices.exists({ index: INDEX_NAME })
    
    if (!indexExists) {
      await client.indices.create({
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
      console.log(`Created Elasticsearch index: ${INDEX_NAME}`)
    }
  } catch (error) {
    console.error('Error creating Elasticsearch index:', error)
    throw error
  }
}

/**
 * Index a single document
 */
export async function indexDocument(doc: SearchDocument): Promise<void> {
  try {
    await client.index({
      index: INDEX_NAME,
      id: doc.id,
      body: doc,
      timeout: '60s' // Increased timeout for semantic processing
    })
  } catch (error) {
    console.error('Error indexing document:', error)
    throw error
  }
}

/**
 * Index multiple documents using bulk API
 */
export async function bulkIndexDocuments(docs: SearchDocument[]): Promise<void> {
  try {
    const body = docs.flatMap(doc => [
      { index: { _index: INDEX_NAME, _id: doc.id } },
      doc
    ])

    const response = await client.bulk({
      body,
      timeout: '300s', // Extended timeout for semantic processing
      refresh: 'wait_for'
    })

    if (response.errors) {
      console.error('Bulk indexing errors:', response.items?.filter(item => item.index?.error))
      throw new Error('Some documents failed to index')
    }

    console.log(`Successfully indexed ${docs.length} documents`)
  } catch (error) {
    console.error('Error bulk indexing documents:', error)
    throw error
  }
}

/**
 * Search documents using semantic search
 */
export async function searchDocuments(
  query: string,
  type?: 'article' | 'recipe' | 'all',
  limit = 12
): Promise<SearchResponse> {
  try {
    // Build the search query
    const searchBody: any = {
      size: limit,
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: query,
                fields: ['title^3', 'content^1', 'metaDescription^2'],
                type: 'best_fields',
                fuzziness: 'AUTO'
              }
            }
          ],
          minimum_should_match: 1
        }
      },
      highlight: {
        fields: {
          title: {
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            fragment_size: 150,
            number_of_fragments: 1
          },
          content: {
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            fragment_size: 150,
            number_of_fragments: 2
          }
        }
      },
      sort: [
        '_score',
        { publishedAt: { order: 'desc' } }
      ]
    }

    // Add type filter if specified
    if (type && type !== 'all') {
      searchBody.query.bool.filter = [
        { term: { type: type } }
      ]
    }

    const response = await client.search({
      index: INDEX_NAME,
      body: searchBody
    })

    const results: SearchResult[] = response.hits.hits.map((hit: any) => ({
      ...hit._source,
      score: hit._score,
      highlight: hit.highlight
    }))

    return {
      results,
      total: response.hits.total?.value || 0,
      query,
      type: type || 'all'
    }
  } catch (error) {
    console.error('Error searching documents:', error)
    throw error
  }
}

/**
 * Delete all documents from the index
 */
export async function clearIndex(): Promise<void> {
  try {
    await client.deleteByQuery({
      index: INDEX_NAME,
      body: {
        query: {
          match_all: {}
        }
      },
      refresh: true
    })
    console.log(`Cleared all documents from index: ${INDEX_NAME}`)
  } catch (error) {
    console.error('Error clearing index:', error)
    throw error
  }
}

/**
 * Get index statistics
 */
export async function getIndexStats(): Promise<any> {
  try {
    const response = await client.indices.stats({ index: INDEX_NAME })
    return response
  } catch (error) {
    console.error('Error getting index stats:', error)
    throw error
  }
}

export { client }