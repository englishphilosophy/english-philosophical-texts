import {
  markit,
  parseYaml,
  readFileStrSync
} from '../../deps.ts'

import { Author, Text } from '../types/library.ts'
import { Analysis, Lemmas, Lemma, LemmatizeResult } from '../types/analysis.ts'
import { readAnalysis, readText, write } from '../file.ts'
import recurse from './recurse.ts'

export default function analysis (): void {
  console.log('Loading map of lemmas from lexicon.yml...')
  const lemmas = getLemmas()

  console.log('Lexicon OK. Starting analysis of texts...')
  recurse(analyse, lemmas)
  analyse(readText('index'), true, lemmas)

  console.log('Base analysis complete. Adding TF-IDF data...')
  recurse(addTfIdf, readAnalysis('index'))
  console.log('TF-IDF data added.')
}

function getLemmas (): Lemmas {
  const lemmas: Lemmas = {}
  const lexicon: any = parseYaml(readFileStrSync('lexicon.yml'))

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

function analyse (data: Author|Text, isAuthor: boolean, lemmas: Lemmas): void {
  const imported = isAuthor || (data as Text).imported
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
          analysis.lemmas.push({
            label: lemma,
            frequency: 1,
            documentFrequency: 0,
            idf: 0,
            absoluteTfIdf: 0,
            relativeTfIdf: 0
          })
        } else {
          analysis.lemmas.push({
            label: lemma,
            frequency: 1,
            documentFrequency: 1,
            idf: 0,
            absoluteTfIdf: 0,
            relativeTfIdf: 0
          })
        }
      }
    }
  }

  for (const stub of data.texts) {
    if (data.id === 'index' || (stub.id.split('.')[0] === data.id.split('.')[0])) { // don't count subtexts by different authors
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
    .replace(/—/g, ' ') // replace long dashes with spaces
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

function addTfIdf (data: Author|Text, isAuthor: boolean, indexAnalysis: Analysis): void {
  const analysis = readAnalysis(data.id)
  for (const lemma of analysis.lemmas) {
    const indexLemma = indexAnalysis.lemmas.find(x => x.label === lemma.label)
    const df = indexLemma ? indexLemma.documentFrequency : 0
    const rawIdf = df - lemma.documentFrequency + 1
    const totalDocuments = indexAnalysis.importedDocumentCount - analysis.importedDocumentCount
    const idf = Math.log(totalDocuments / rawIdf)
    lemma.idf = idf
    lemma.relativeTfIdf = (lemma.frequency / analysis.wordCount) * idf
    lemma.absoluteTfIdf = lemma.frequency * idf
  }

  analysis.lemmas.sort((x, y) => y.absoluteTfIdf - x.absoluteTfIdf)
  write(analysis, 'analysis')
}
