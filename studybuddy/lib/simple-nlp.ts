// A simplified NLP implementation without external dependencies

// Basic tokenization function
export function tokenize(text: string): string[] {
  // Remove punctuation and split by whitespace
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0)
}

// Common English stop words
const STOP_WORDS = [
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "he",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "that",
  "the",
  "to",
  "was",
  "were",
  "will",
  "with",
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "this",
  "these",
  "those",
]

// Remove stop words
export function removeStopwords(tokens: string[]): string[] {
  return tokens.filter((token) => !STOP_WORDS.includes(token))
}

// Simple stemming function
export function stem(word: string): string {
  // Very basic stemming rules
  if (word.endsWith("ing")) return word.slice(0, -3)
  if (word.endsWith("ed")) return word.slice(0, -2)
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1)
  if (word.endsWith("ly")) return word.slice(0, -2)
  if (word.endsWith("ment")) return word.slice(0, -4)
  return word
}

// Named entity patterns
const ENTITY_PATTERNS: Record<string, RegExp[]> = {
  person: [/\b(Mr|Mrs|Ms|Dr|Prof)\.\s[A-Z][a-z]+\b/, /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/],
  place: [
    /\b(North|South|East|West)\s[A-Z][a-z]+\b/,
    /\b[A-Z][a-z]+\s(City|Town|Village|River|Mountain|Ocean|Sea|Lake)\b/,
    /\b(New York|Los Angeles|Chicago|Houston|Paris|London|Tokyo|Berlin|Rome)\b/,
  ],
  organization: [
    /\b[A-Z][a-z]*\s(University|College|School|Institute|Corporation|Inc|Company|Co|Ltd)\b/,
    /\b(Google|Microsoft|Apple|Amazon|Facebook|Twitter)\b/,
  ],
  date: [
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2}(st|nd|rd|th)?(,\s\d{4})?\b/,
    /\b\d{1,2}(st|nd|rd|th)?\s(January|February|March|April|May|June|July|August|September|October|November|December)(,\s\d{4})?\b/,
    /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/,
    /\b\d{4}\b/,
  ],
}

// Extract entities
export function extractEntities(text: string): Array<{ text: string; type: string }> {
  const entities: Array<{ text: string; type: string }> = []

  // Check each entity type
  Object.entries(ENTITY_PATTERNS).forEach(([type, patterns]) => {
    patterns.forEach((pattern) => {
      const matches = text.match(new RegExp(pattern, "g"))
      if (matches) {
        matches.forEach((match) => {
          entities.push({ text: match, type })
        })
      }
    })
  })

  return entities
}

// Main processing function
export async function processText(text: string) {
  try {
    // 1. Tokenization
    const tokens = tokenize(text)

    // 2. Stop Words Removal
    const withoutStopwords = removeStopwords(tokens)

    // 3. Stemming
    const stemmed = withoutStopwords.map((word) => stem(word))

    // 4. Named Entity Recognition
    const entities = extractEntities(text)

    return {
      tokens,
      withoutStopwords,
      stemmed,
      entities,
    }
  } catch (error) {
    console.error("Error in NLP processing:", error)
    // Return fallback data
    return {
      tokens: [],
      withoutStopwords: [],
      stemmed: [],
      entities: [],
    }
  }
}
