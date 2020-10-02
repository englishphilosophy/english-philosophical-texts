/*

import type { Index, Author, Stub, Collection, Document } from '../types/text.ts'
import type { Analysis } from '../types/analysis.ts'
import type { Topics } from '../types/topics.ts'
import { readText, readAnalysis, write } from '../file.ts'

export default function (): void {
  console.log('Computing topic similarity data...')
  const index = readText('index') as Index
  for (const author of index.texts) {
    addTopicsRecursively(author.id, index.texts)
  }
}

function addTopicsRecursively (id: string, authors: Author[]): void {
  const text = readText(id) as Author|Stub

  if (text instanceof Author || (text instanceof Collection && text.imported)) {
    for (const stub of text.texts) {
      addTopicsRecursively(stub.id, authors)
    }
  }

  const analysis = readAnalysis(id)
  const topics = new Topics(analysis)

  if (text instanceof Author || text.imported) {
    for (const author of authors) {
      addSimilarityRecursively(author.id, analysis, topics)
    }
    
    topics.similarTexts.sort((x, y) => y.similarity - x.similarity)
  }

  write(topics, 'topics')
}

function addSimilarityRecursively (id: string, analysis: Analysis, topics: Topics): void {
  if (topics.id === id) return
  // if (id.split('.').length > 3) return

  const text = readText(id) as Author|Collection|Document

  if (text instanceof Author || (text instanceof Collection && text.imported)) {
    for (const stub of text.texts.filter(x => x.imported)) {
      if ((text.id === 'index') || (stub.id.split('.')[0] === text.id.split('.')[0])) {
        addSimilarityRecursively(stub.id, analysis, topics)
      }
    }
  }

  if (text instanceof Author || text.imported) {
    const otherAnalysis = readAnalysis(id)
    const similarity = otherAnalysis.lemmas.reduce((sofar, current) => {
      const baseLemma = analysis.lemmas.find(x => x.label === current.label)
      const tfidf = baseLemma ? baseLemma.tfidf : 0
      return sofar + ((current.frequency / otherAnalysis.wordCount) * tfidf)
    }, 0)
    if (similarity > 0) topics.similarTexts.push({ id, similarity })
  }
}

*/