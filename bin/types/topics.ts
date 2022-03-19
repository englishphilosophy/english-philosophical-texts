import type { Analysis } from './analysis.ts'

export type Topics = {
  id: string
  topLemmas: string[]
  similarTexts: SimilarText[]
}

type SimilarText = {
  id: string
  similarity: number
}

export const topicsFromAnalysis = (analysis: Analysis): Topics => ({
  id: analysis.id,
  topLemmas: analysis.lemmas.slice(0, 30).map(x => x.label),
  similarTexts: []
})
