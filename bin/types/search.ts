import type { Block } from './library.ts'

export type Query = string | ComplexQuery

export type ComplexQuery = {
  query1: Query
  query2: Query
  operator: Operator
}

export type Operator = 'and' | 'or' | 'bot' // 'bot' means 'but not': `x BOT y := x AND NOT y)

export type SearchOptions = {
  ignorePunctuation: boolean
  wholeWords: boolean
  variantSpellings: boolean
}

export type Result = {
  id: string
  title: string
  blocks: Block[]
  results: Result[]
  total: number
}
