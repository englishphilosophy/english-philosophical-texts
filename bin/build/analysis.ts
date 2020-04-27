import {
  markit,
  parseYaml,
  readFileStrSync
} from '../../deps.ts'

import { Author, Text } from '../types/library.ts'
import { Analysis, Lemmas, Lemma, LemmatizeResult } from '../types/analysis.ts'
import { readAnalysis, write } from '../file.ts'
import recurse from './recurse.ts'

export default function analysis (): void {
  console.log('Loading map of lemmas from lexicon.yml...')
  const lemmas = getLemmas()

  console.log('Lexicon OK. Starting analysis of texts...')
  recurse(analyse, lemmas)

  console.log('Base analysis complete. Adding TF-IDF data...')
  recurse(addTfIdf, readAnalysis('index'))
}

function getLemmas (): Lemmas {
  const lemmas: Lemmas = {}

  let lexicon: any
  try {
    lexicon = parseYaml(readFileStrSync('lexicon.yml'))
  } catch (error) {
    throw new Error(`Failed to open or parse lexicon file.`)
  }

  for (const lemma of Object.keys(lexicon)) {
    if (!Array.isArray(lexicon[lemma])) {
      throw new Error(`Lexicon entry for '${lemma} is not an array.`)
    }
    for (const word of lexicon[lemma]) {
      if (typeof word === 'string') {
        lemmas[word] = lemma
      } else {
        throw new Error(`Lexicon entry for '${lemma} does not contain only strings.`)
      }
    }
  }

  return lemmas
}

function analyse (data: Author|Text, lemmas: Lemmas): void {
  const imported = (data as Author).sex || (data as Text).imported
  const analysis: Analysis = {
    id: data.id,
    documentCount: (data.texts.length === 0) ? 1 : 0,
    importedDocumentCount: ((data.texts.length === 0) && imported) ? 1 : 0,
    wordCount: 0,
    lemmaWordCount: 0,
    numberWordCount: 0,
    nameWordCount: 0,
    foreignWordCount: 0,
    citationWordCount: 0,
    lemmas: [],
    numbers: [],
    names: [],
    foreignText: [],
    citations: []
  }

  if (imported && (data as Text).blocks) {
    for (const block of (data as Text).blocks) {
      let result
      try {
        result = lemmatize(block.content, lemmas)
      } catch (error) {
        console.log(`something wrong with ${data.id}, ${block.id}`)
        console.log(block)
        throw error
      }

      const lemmaWordCount = result.lemmas.length
      analysis.lemmaWordCount += lemmaWordCount
      analysis.wordCount += lemmaWordCount

      const numbersWordCount = result.numbers.length
      analysis.numberWordCount += numbersWordCount
      analysis.wordCount += numbersWordCount

      const nameWordCount = result.names
        .reduce((x: number, y: string) => x + y.split(' ').length, 0)
      analysis.nameWordCount += nameWordCount
      analysis.wordCount += nameWordCount

      const foreignWordCount = result.foreignText
        .reduce((x: number, y: string) => x + y.split(' ').length, 0)
      analysis.foreignWordCount += foreignWordCount
      analysis.wordCount += foreignWordCount

      const citationWordCount = result.citations
        .reduce((x: number, y: string) => x + y.split(' ').length, 0)
      analysis.citationWordCount += citationWordCount
      analysis.wordCount += citationWordCount

      analysis.numbers = analysis.numbers.concat(result.numbers)
      analysis.names = analysis.names.concat(result.names)
      analysis.foreignText = analysis.foreignText.concat(result.foreignText)
      analysis.citations = analysis.citations.concat(result.citations)
      for (const lemma of result.lemmas) {
        const existing = analysis.lemmas.find(x => x.label === lemma)
        if (existing) {
          existing.frequency += 1
        } else if (data.texts.length) {
          analysis.lemmas.push(new Lemma(lemma, 1, 0)) // 0 document frequency
        } else {
          analysis.lemmas.push(new Lemma(lemma, 1, 1)) // 1 document frequency
        }
      }
    }
  }

  for (const stub of data.texts) {
    const subAnalysis = readAnalysis(stub.id)
    analysis.documentCount += subAnalysis.documentCount
    analysis.importedDocumentCount += subAnalysis.importedDocumentCount

    analysis.wordCount += subAnalysis.wordCount
    analysis.lemmaWordCount += subAnalysis.lemmaWordCount
    analysis.numberWordCount += subAnalysis.numberWordCount
    analysis.nameWordCount += subAnalysis.nameWordCount
    analysis.foreignWordCount += subAnalysis.foreignWordCount
    analysis.citationWordCount += subAnalysis.citationWordCount

    analysis.numbers.push(...subAnalysis.numbers)
    analysis.names.push(...subAnalysis.names)
    analysis.foreignText.push(...subAnalysis.foreignText)
    analysis.citations.push(...subAnalysis.citations)
    for (const lemma of subAnalysis.lemmas) {
      const existing = analysis.lemmas.find(x => x.label === lemma.label)
      if (existing) {
        existing.frequency += lemma.frequency
        existing.documentFrequency += lemma.documentFrequency
      } else {
        analysis.lemmas.push(Object.assign({}, lemma))
      }
    }
  }

  analysis.numbers.sort()
  analysis.names.sort()
  analysis.citations.sort()
  analysis.foreignText.sort()
  analysis.lemmas.sort((x, y) => x.label.localeCompare(y.label))
  analysis.lemmas.sort((x, y) => y.frequency - x.frequency)

  write(analysis, 'analysis')
}

function lemmatize (content: string, lemmasRecord: Lemmas): LemmatizeResult {
  content = content
    .replace(/\n/g, ' ') // replace actual line breaks with spaces
    .replace(/\/\//g, ' ') // replace Markit line breaks with spaces
    .replace(/—/g, ' ') // replace dashes with spaces
    .replace(/\|/g, '') // remove page breaks
    .replace(/\[n.*?\]/g, '') // remove footnote references
    .replace(/£\d ?(.*?) ?£\d/g, '$1') // remove heading markup
    .replace(/_|\^|#/g, '') // remove italics, small-caps, and comments markup
    .replace(/{--.*?--}/g, '') // remove deletions
    .replace(/{\+\+(.*?)\+\+}/g, '$1') // remove insertion markup
    .replace(/{~~.*?->(.*?)~~}/g, '$1') // remove replacement markup

  const namesCheck = content.match(/=(.*?)=/g)
  const names = namesCheck ? namesCheck.map(x => x.slice(1, -1)) : []

  const foreignTextCheck = content.match(/\$(.*?)\$/g)
  const foreignText = foreignTextCheck ? foreignTextCheck.map(x => x.slice(1, -1)) : []

  const citationsCheck = content.match(/\[(.*?)\]/g)
  const citations = citationsCheck ? citationsCheck.map(x => x.slice(1, -1)) : []

  const numbers: string[] = []

  const strippedContent = content
    .replace(/\=.*?\=/g, '') // remove names
    .replace(/\$\$?.*?\$?\$/g, '') // remove foreign text
    .replace(/\[.*?\]/g, '') // remove citations
    .replace(/[";:(),.!?]/g, '') // remove punctuation

  const lemmas = markit.content(strippedContent, { format: 'txt' })
    .toLowerCase() // put in lower case
    .split(' ') // split into words
    .filter(x => x.length > 0) // get rid of empties
    .filter(x => { // get rid of numbers, and put them in the numbers array
      if (isNaN(parseInt(x))) {
        return true
      } else {
        numbers.push(x)
        return false
      }
    })
    .map(x => lemmasRecord[x] || x) // map to lemmas

  return {
    names,
    foreignText,
    citations,
    numbers,
    lemmas
  }
}

function addTfIdf (data: Author|Text, indexAnalysis: Analysis): void {
  const analysis = readAnalysis(data.id)
  for (const lemma of analysis.lemmas) {
    const indexLemma = indexAnalysis.lemmas.find(x => x.label === lemma.label)
    const df = indexLemma ? indexLemma.documentFrequency : 0
    const rawIdf = df - lemma.documentFrequency + 1
    const totalDocuments = indexAnalysis.importedDocumentCount - analysis.importedDocumentCount
    const idf = Math.log(totalDocuments / rawIdf)
    const tf = (lemma.frequency / analysis.wordCount)
    lemma.rawIdf = rawIdf
    lemma.idf = idf
    lemma.tfidf = tf * idf
  }

  analysis.lemmas.sort((x, y) => y.tfidf - x.tfidf)
  write(analysis, 'analysis')
}
