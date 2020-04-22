import { Analysis } from './analysis.ts'

export class Topics {
  id: string
  topLemmas: string[]
  similarTexts: SimilarText[]
  
  constructor (analysis: Analysis) {
    this.id = analysis.id
    this.topLemmas = analysis.lemmas.slice(0, 30).map(x => x.label)
    this.similarTexts = []
  }
}

type SimilarText = {
  id: string
  similarity: number
}
