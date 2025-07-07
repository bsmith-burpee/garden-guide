/**
 * Search Query Analyzer
 * Parses search queries to extract subject terms (plants, tools) vs action terms (growing instructions)
 * for better search relevance and boosting
 */

// Comprehensive garden terms dictionary
export const GARDEN_TERMS = {
  // Vegetables
  vegetables: [
    'tomato', 'tomatoes', 'cherry tomato', 'beefsteak tomato', 'heirloom tomato',
    'pepper', 'peppers', 'bell pepper', 'hot pepper', 'jalapeño', 'chili',
    'cucumber', 'cucumbers', 'pickle', 'pickles',
    'lettuce', 'salad', 'spinach', 'arugula', 'kale', 'chard', 'collards',
    'carrot', 'carrots', 'radish', 'radishes', 'turnip', 'beet', 'beets',
    'onion', 'onions', 'garlic', 'shallot', 'leek', 'scallion', 'chive',
    'bean', 'beans', 'green bean', 'lima bean', 'pea', 'peas', 'snap pea',
    'corn', 'sweet corn', 'popcorn',
    'squash', 'zucchini', 'pumpkin', 'gourd', 'butternut', 'acorn squash',
    'broccoli', 'cauliflower', 'cabbage', 'brussels sprouts',
    'potato', 'potatoes', 'sweet potato', 'yam',
    'eggplant', 'aubergine',
    'okra', 'artichoke', 'asparagus', 'celery', 'fennel'
  ],

  // Herbs
  herbs: [
    'basil', 'oregano', 'thyme', 'rosemary', 'sage', 'parsley', 'cilantro', 'coriander',
    'mint', 'spearmint', 'peppermint', 'dill', 'chive', 'chives',
    'lavender', 'lemon balm', 'marjoram', 'tarragon', 'bay', 'bay leaf'
  ],

  // Flowers
  flowers: [
    'marigold', 'marigolds', 'sunflower', 'sunflowers', 'zinnia', 'zinnias',
    'cosmos', 'petunia', 'petunias', 'impatiens', 'begonia', 'begonias',
    'rose', 'roses', 'tulip', 'tulips', 'daffodil', 'daffodils', 'crocus',
    'lily', 'lilies', 'dahlia', 'dahlias', 'iris', 'peony', 'peonies',
    'carnation', 'carnations', 'chrysanthemum', 'mum', 'mums',
    'pansy', 'pansies', 'viola', 'violas', 'snapdragon', 'snapdragons',
    'calendula', 'nasturtium', 'nasturtiums', 'sweet pea', 'morning glory'
  ],

  // Perennials
  perennials: [
    'hosta', 'hostas', 'daylily', 'daylilies', 'black-eyed susan',
    'coneflower', 'echinacea', 'rudbeckia', 'sedum', 'astilbe',
    'coral bells', 'heuchera', 'lamb\'s ear', 'catmint', 'salvia'
  ],

  // Trees & Shrubs
  trees: [
    'apple', 'apples', 'pear', 'pears', 'cherry', 'cherries', 'peach', 'peaches',
    'plum', 'plums', 'fig', 'figs', 'citrus', 'lemon', 'lime', 'orange',
    'blueberry', 'blueberries', 'raspberry', 'raspberries', 'strawberry', 'strawberries',
    'grape', 'grapes', 'grapevine', 'blackberry', 'blackberries'
  ],

  // Garden tools & supplies
  tools: [
    'shovel', 'spade', 'rake', 'hoe', 'trowel', 'pruners', 'shears',
    'watering can', 'hose', 'sprinkler', 'fertilizer', 'compost', 'mulch',
    'seed', 'seeds', 'seedling', 'seedlings', 'transplant', 'transplants',
    'pot', 'pots', 'container', 'containers', 'planter', 'planters',
    'greenhouse', 'cold frame', 'trellis', 'stakes', 'cages'
  ]
}

// Action/instruction terms that are common but less specific
export const ACTION_TERMS = [
  'how', 'to', 'grow', 'plant', 'growing', 'planting', 'care', 'caring',
  'when', 'where', 'start', 'starting', 'guide', 'tips', 'help',
  'best', 'easy', 'simple', 'beginner', 'indoor', 'outdoor', 'container',
  'from', 'seed', 'seeds', 'water', 'watering', 'fertilize', 'fertilizing',
  'harvest', 'harvesting', 'prune', 'pruning', 'disease', 'pest', 'problem',
  'soil', 'sun', 'shade', 'light', 'spacing', 'depth', 'time', 'season'
]

// Common stop words to ignore
export const STOP_WORDS = [
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'my', 'your', 'i', 'you', 'can', 'do'
]

/**
 * Interface for parsed query results
 */
export interface ParsedQuery {
  subjectTerms: string[]
  actionTerms: string[]
  otherTerms: string[]
  originalQuery: string
  hasSubjects: boolean
  primarySubject?: string
  queryType: 'subject-focused' | 'action-focused' | 'general'
}

/**
 * Get all garden-related terms as a flat array
 */
export function getAllGardenTerms(): string[] {
  return Object.values(GARDEN_TERMS).flat()
}

/**
 * Check if a term is a garden subject (plant, tool, etc.)
 */
export function isGardenSubject(term: string): boolean {
  const lowerTerm = term.toLowerCase()
  return getAllGardenTerms().some(gardenTerm => 
    gardenTerm.toLowerCase().includes(lowerTerm) || 
    lowerTerm.includes(gardenTerm.toLowerCase())
  )
}

/**
 * Find the best matching garden term for a given term
 */
export function findBestGardenMatch(term: string): string | null {
  const lowerTerm = term.toLowerCase()
  
  // Exact match first
  const exactMatch = getAllGardenTerms().find(gardenTerm => 
    gardenTerm.toLowerCase() === lowerTerm
  )
  if (exactMatch) return exactMatch
  
  // Partial match (term contains garden term or vice versa)
  const partialMatch = getAllGardenTerms().find(gardenTerm => {
    const lowerGardenTerm = gardenTerm.toLowerCase()
    return lowerTerm.includes(lowerGardenTerm) || lowerGardenTerm.includes(lowerTerm)
  })
  
  return partialMatch || null
}

/**
 * Extract synonyms and variations for a garden term
 */
export function getTermSynonyms(term: string): string[] {
  const lowerTerm = term.toLowerCase()
  const synonyms = new Set<string>([term])
  
  // Add plural/singular variations
  if (lowerTerm.endsWith('s') && lowerTerm.length > 3) {
    synonyms.add(lowerTerm.slice(0, -1)) // Remove 's'
  } else {
    synonyms.add(lowerTerm + 's') // Add 's'
  }
  
  // Add specific synonyms
  const synonymMap: Record<string, string[]> = {
    'tomato': ['tomatoes', 'cherry tomato', 'beefsteak tomato', 'heirloom tomato'],
    'tomatoes': ['tomato', 'cherry tomatoes', 'beefsteak tomatoes'],
    'pepper': ['peppers', 'bell pepper', 'hot pepper', 'chili pepper'],
    'herb': ['herbs', 'herbal', 'aromatic'],
    'flower': ['flowers', 'bloom', 'blooms', 'flowering'],
    'vegetable': ['vegetables', 'veggie', 'veggies'],
    'plant': ['plants', 'planting', 'grow', 'growing'],
    'seed': ['seeds', 'seeding', 'sow', 'sowing'],
    'garden': ['gardening', 'yard', 'backyard']
  }
  
  if (synonymMap[lowerTerm]) {
    synonymMap[lowerTerm].forEach(synonym => synonyms.add(synonym))
  }
  
  return Array.from(synonyms)
}

/**
 * Parse a search query to extract subject and action terms
 */
export function parseSearchQuery(query: string): ParsedQuery {
  // Clean and tokenize the query
  const cleanQuery = query.toLowerCase().trim()
  const tokens = cleanQuery
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.includes(token))
  
  const subjectTerms: string[] = []
  const actionTerms: string[] = []
  const otherTerms: string[] = []
  
  // Analyze each token
  tokens.forEach(token => {
    if (isGardenSubject(token)) {
      const bestMatch = findBestGardenMatch(token)
      if (bestMatch && !subjectTerms.includes(bestMatch)) {
        subjectTerms.push(bestMatch)
      }
    } else if (ACTION_TERMS.includes(token)) {
      if (!actionTerms.includes(token)) {
        actionTerms.push(token)
      }
    } else {
      otherTerms.push(token)
    }
  })
  
  // Check for multi-word subjects (e.g., "cherry tomato", "sweet corn")
  const multiWordSubjects = getAllGardenTerms().filter(term => term.includes(' '))
  for (const multiWord of multiWordSubjects) {
    if (cleanQuery.includes(multiWord.toLowerCase())) {
      if (!subjectTerms.includes(multiWord)) {
        subjectTerms.push(multiWord)
      }
      // Remove individual words that are part of the multi-word term
      const words = multiWord.toLowerCase().split(' ')
      words.forEach(word => {
        const index = subjectTerms.indexOf(word)
        if (index > -1) subjectTerms.splice(index, 1)
      })
    }
  }
  
  // Determine primary subject and query type
  const hasSubjects = subjectTerms.length > 0
  const primarySubject = subjectTerms[0] // Most relevant subject
  
  let queryType: ParsedQuery['queryType'] = 'general'
  if (hasSubjects && subjectTerms.length >= actionTerms.length) {
    queryType = 'subject-focused'
  } else if (actionTerms.length > subjectTerms.length) {
    queryType = 'action-focused'
  }
  
  return {
    subjectTerms,
    actionTerms,
    otherTerms,
    originalQuery: query,
    hasSubjects,
    primarySubject,
    queryType
  }
}

/**
 * Generate search suggestions based on parsed query
 */
export function generateSearchSuggestions(parsedQuery: ParsedQuery): string[] {
  const suggestions: string[] = []
  
  if (parsedQuery.hasSubjects && parsedQuery.primarySubject) {
    const subject = parsedQuery.primarySubject
    suggestions.push(
      `How to grow ${subject}`,
      `${subject} care guide`,
      `When to plant ${subject}`,
      `${subject} problems`,
      `Harvesting ${subject}`
    )
  }
  
  return suggestions.slice(0, 5) // Limit to 5 suggestions
}

/**
 * Debug function to analyze query parsing
 */
export function debugQuery(query: string): void {
  const parsed = parseSearchQuery(query)
  console.log('Query Analysis for:', query)
  console.log('Subject terms:', parsed.subjectTerms)
  console.log('Action terms:', parsed.actionTerms)
  console.log('Other terms:', parsed.otherTerms)
  console.log('Query type:', parsed.queryType)
  console.log('Primary subject:', parsed.primarySubject)
  console.log('Suggestions:', generateSearchSuggestions(parsed))
}