import { Client } from '@elastic/elasticsearch'
import { parseSearchQuery, getTermSynonyms, type ParsedQuery } from './search-analyzer'

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
 * Build an intelligent Elasticsearch query based on parsed query analysis
 */
function buildIntelligentQuery(parsedQuery: ParsedQuery): any {
  const { subjectTerms, actionTerms, otherTerms, originalQuery, queryType } = parsedQuery
  
  const shouldClauses = []
  
  // 1. SUBJECT TERM BOOSTING (Highest Priority)
  if (subjectTerms.length > 0) {
    subjectTerms.forEach(subject => {
      const synonyms = getTermSynonyms(subject)
      
      // Exact phrase match in title (highest boost)
      shouldClauses.push({
        match_phrase: {
          title: {
            query: subject,
            boost: 15
          }
        }
      })
      
      // Subject in title with synonyms (high boost)
      shouldClauses.push({
        multi_match: {
          query: synonyms.join(' '),
          fields: ['title^10'],
          type: 'best_fields',
          operator: 'or'
        }
      })
      
      // Subject in content (medium-high boost)
      shouldClauses.push({
        multi_match: {
          query: synonyms.join(' '),
          fields: ['content^6', 'metaDescription^8'],
          type: 'best_fields',
          operator: 'or'
        }
      })
      
      // Exact subject phrase in content
      shouldClauses.push({
        match_phrase: {
          content: {
            query: subject,
            boost: 8
          }
        }
      })
    })
  }
  
  // 2. ACTION TERMS (Medium Priority)
  if (actionTerms.length > 0) {
    const actionQuery = actionTerms.join(' ')
    
    shouldClauses.push({
      multi_match: {
        query: actionQuery,
        fields: ['title^4', 'content^2', 'metaDescription^3'],
        type: 'best_fields',
        fuzziness: 'AUTO'
      }
    })
  }
  
  // 3. OTHER TERMS (Lower Priority)
  if (otherTerms.length > 0) {
    const otherQuery = otherTerms.join(' ')
    
    shouldClauses.push({
      multi_match: {
        query: otherQuery,
        fields: ['title^2', 'content^1', 'metaDescription^1.5'],
        type: 'best_fields',
        fuzziness: 'AUTO'
      }
    })
  }
  
  // 4. FALLBACK: Full query with standard boosting
  shouldClauses.push({
    multi_match: {
      query: originalQuery,
      fields: ['title^3', 'content^1', 'metaDescription^2'],
      type: 'best_fields',
      fuzziness: 'AUTO'
    }
  })
  
  // Adjust minimum_should_match based on query type
  let minimumShouldMatch = 1
  if (queryType === 'subject-focused' && subjectTerms.length > 0) {
    minimumShouldMatch = 2 // Require at least subject match + one other
  }
  
  return {
    bool: {
      should: shouldClauses,
      minimum_should_match: minimumShouldMatch
    }
  }
}

/**
 * Search documents using intelligent query analysis and subject boosting
 */
export async function searchDocuments(
  query: string,
  type?: 'article' | 'recipe' | 'all',
  limit = 12
): Promise<SearchResponse> {
  try {
    // Parse the query to understand intent and subjects
    const parsedQuery = parseSearchQuery(query)
    
    // Log query analysis for debugging
    console.log('Search Query Analysis:', {
      original: query,
      subjects: parsedQuery.subjectTerms,
      actions: parsedQuery.actionTerms,
      type: parsedQuery.queryType,
      primarySubject: parsedQuery.primarySubject
    })
    
    // Build intelligent query
    const intelligentQuery = buildIntelligentQuery(parsedQuery)
    
    // Build the search body
    const searchBody: any = {
      size: limit,
      query: intelligentQuery,
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
          },
          metaDescription: {
            pre_tags: ['<mark>'],
            post_tags: ['</mark>'],
            fragment_size: 100,
            number_of_fragments: 1
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
      searchBody.query = {
        bool: {
          must: [searchBody.query],
          filter: [
            { term: { type: type } }
          ]
        }
      }
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