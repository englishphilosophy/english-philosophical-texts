// BUG: with ignorePuncuation OFF and wholeWords ON, search does not match
// queries with punctuation in the right place

import type { ReducedLexicon } from '../types/lexicon.ts'
import type { Block, Text } from '../types/library.ts'
import type { Query, Result, SearchOptions } from '../types/search.ts'
import * as read from '../read.ts'

/** Generates a search query object from form parameters. */
export const parseQuery = (query1: Query | null, query2: Query | null, operator: string | null): Query | null => {
  if (query1 === null || query2 === null) {
    return query1
  }

  if (operator !== 'and' && operator !== 'or' && operator !== 'bot') {
    return null
  }

  return { query1, query2, operator }
}

/** Gets blocks from the texts with the given IDs that match the search query.
 * 
 * The `author` argument should not be given explicitly; it is used internally
 * by the recursion to filter out subtexts by a different author from the author
 * of the text being searched.
 */
export const runQuery = async (ids: string[], query: Query, options: SearchOptions, author: string|null = null): Promise<Result[]> => {
  const lexicon: ReducedLexicon = options.variantSpellings ? JSON.parse(await read.reducedLexicon()) : {}

  const results: Result[] = []
  for (const id of ids) {
    const textRead = await read.text('search', id)
    if (textRead) {
      const text = JSON.parse(textRead[1]) as Text
      const isAuthor = (text.id.split('.').length === 1)
      const isDifferentAuthor = author && (text.id.indexOf(author) !== 0)
      if ((text.imported || isAuthor) && !isDifferentAuthor) {
        results.push(await matches(text, query, options, lexicon))
      }
    }
  }

  return results.filter(result => result.total > 0)
}

/** Gets search matches from a text (recursively calling runQuery on sub-texts). */
const matches = async (text: Text, query: Query, options: SearchOptions, lexicon: ReducedLexicon): Promise<Result> => {
  // initialise the result object
  const result: Result = {
    id: text.id,
    title: text.title,
    blocks: [],
    results: [],
    total: 0 // this total includes matches in sub texts
  }

  // either search subtexts recursively for matches
  if (text.texts.length > 0) {
    result.results = await runQuery(text.texts.map(x => x.id), query, options, text.id.split('.')[0])
    for (const subResult of result.results) {
      result.total += subResult.total
    }
  }

  // or search the paragraphs and notes of this text
  for (const block of text.blocks) {
    if (hit(block.content, query, options, lexicon)) {
      result.blocks.push(matchedBlock(block, query, options, lexicon))
    }
  }
  result.total += result.blocks.length

  // return the result
  return result
}

/** Creates a matched block for display, with search matches highlighted. */
const matchedBlock = (block: Block, query: Query, options: SearchOptions, lexicon: ReducedLexicon): Block => {
  return { ...block, content: block.content.replace(regex(query, options, lexicon), '<mark>$1</mark>') }
}

/** Determines whether some content contains a match for a search query. */
const hit = (content: string, query: Query, options: SearchOptions, lexicon: ReducedLexicon): boolean => {
  // match string queries directly
  if (typeof query === 'string') {
    return (content.match(regex(query, options, lexicon)) !== null)
  }

  // otherwise break down the query recursively
  switch (query.operator) {
    case 'and':
      return hit(content, query.query1, options, lexicon) && hit(content, query.query2, options, lexicon)

    case 'or':
      return hit(content, query.query1, options, lexicon) || hit(content, query.query2, options, lexicon)

    case 'bot': // "but not"
      return hit(content, query.query1, options, lexicon) && !hit(content, query.query2, options, lexicon)
  }
}

/** Creates a regular expression from a search query. */
const regex = (query: Query, options: SearchOptions, lexicon: ReducedLexicon): RegExp => {
  return new RegExp(`(${regexString(query, options, lexicon)})`, 'gi')
}

/** Creates the string for a regular expression from the search query. */
const regexString = (query: Query, options: SearchOptions, lexicon: ReducedLexicon): string => {
  if (typeof query === 'string') {
    if (options.ignorePunctuation) {
      query = query.replace(/[.,:;?!()]/g, '')
    }

    let words = query.split(' ')

    if (options.variantSpellings) {
      words = words.map((word) => {
        const group = lexicon.find(x => x.includes(word))
        return group ? `(${group.join('|')})` : word
      })
    }

    if (options.wholeWords) {
      words = words.map(word => `\\b${word}\\b`)
    }

    if (options.ignorePunctuation) {
      words = words.map(word => `\\(?${word}[.,;?!)]?`)
    }

    return words.join(' ')
  }

  switch (query.operator) {
    case 'and': // fallthrough
    case 'or':
      return `${regexString(query.query1, options, lexicon)}|${regexString(query.query2, options, lexicon)}`

    case 'bot': // "but not"
      return regexString(query.query1, options, lexicon)
  }
}
