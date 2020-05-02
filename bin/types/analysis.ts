export type Analysis = {
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

export type Lemma = {
  label: string
  frequency: number
  documentFrequency: number
  idf: number
  absoluteTfIdf: number
  relativeTfIdf: number
}

export type Lemmas = Record<string, string>
