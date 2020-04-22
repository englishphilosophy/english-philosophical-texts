import { Text, Document } from './text.ts'

export class Analysis {
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
  
  constructor (text: Text) {
    this.id = text.id
    this.documentCount = (text instanceof Document) ? 1 : 0
    this.importedDocumentCount = (text instanceof Document && text.imported) ? 1 : 0
    this.wordCount = 0
    this.lemmaWordCount = 0
    this.numberWordCount = 0
    this.nameWordCount = 0
    this.foreignWordCount = 0
    this.citationWordCount = 0
    this.lemmas = []
    this.numbers = []
    this.names = []
    this.foreignText = []
    this.citations = []
  }
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
