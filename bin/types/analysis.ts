export interface Analysis {
  id: string
  documentCount: number
  importedDocumentCount: number
  wordCount: number
  lemmaWordCount: number
  numberWordCount: number
  nameWordCount: number
  foreignWordCount: number
  citationWordCount: number
  lemmas: Lemma[]
  numbers: string[]
  names: string[]
  foreignText: string[]
  citations: string[]
}
  
export type LemmatizeResult = {
  names: string[]
  foreignText: string[]
  citations: string[]
  numbers: string[]
  lemmas: string[]
}

export class Lemma {
  label: string
  frequency: number
  documentFrequency: number
  rawIdf: number
  idf: number
  tfidf: number

  constructor (label: string, frequency: number, documentFrequency: number) {
    this.label = label
    this.frequency = frequency
    this.documentFrequency = documentFrequency
    this.rawIdf = 0
    this.idf = 0
    this.tfidf = 0
  }
}

export type Lemmas = Record<string, string>
