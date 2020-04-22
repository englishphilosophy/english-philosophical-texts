import {
  parseYaml,
  readFileStrSync
} from '../../deps.ts'
import { Index, Author, Collection, Document, Stub } from '../types/text.ts'
import { Analysis, Lemmas, Lemma, LemmatizeResult } from '../types/analysis.ts'
import { readText, readAnalysis, write } from '../file.ts'

export default function analysis (): void {
  console.log('Loading map of lemmas from lexicon.yml...')
  const lemmas = getLemmas()
  console.log('Lexicon OK. Starting analysis of texts...')
  analyseRecursively('index', lemmas)
  console.log('Base analysis complete. Adding TF-IDF data...')
  const indexAnalysis = readAnalysis('index')
  const index = readText('index') as Index
  index.texts.forEach((text: Author) => {
    addTfIdfRecursively(text.id, indexAnalysis)
  })
}

function getLemmas (): Lemmas {
  const lemmas: Lemmas = {}

  let lexicon: any
  try {
    lexicon = parseYaml(readFileStrSync('lexicon.yml'))
  } catch (error) {
    throw new Error(`Failed to open or parse lexicon file.`)
  }

  Object.keys(lexicon).forEach((lemma: any) => {
    if (!Array.isArray(lexicon[lemma])) {
      throw new Error(`Lexicon entry for '${lemma} is not an array.`)
    }
    lexicon[lemma].forEach((word: any) => {
      if (typeof word === 'string') {
        lemmas[word] = lemma
      } else {
        throw new Error(`Lexicon entry for '${lemma} does not contain only strings.`)
      }
    })
  })

  return lemmas
}

function analyseRecursively (id: string, lemmas: Lemmas): void {
  const text = readText(id)

  const analysis = new Analysis(text)

  if (text instanceof Document || text instanceof Collection) {
    if (text.imported) {
      text.blocks.forEach((block) => {
        let result
        try {
          result = lemmatize(block.content, lemmas)
        } catch (error) {
          console.log(`something wrong with ${text.id}, ${block.id}`)
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
        result.lemmas.forEach((lemma) => {
          const existing = analysis.lemmas.find(x => x.label === lemma)
          if (existing) {
            existing.frequency += 1
          } else if (text instanceof Collection) {
            analysis.lemmas.push(new Lemma(lemma, 1, 0)) // 0 document frequency
          } else {
            analysis.lemmas.push(new Lemma(lemma, 1, 1)) // 1 document frequency
          }
        })
      })
    }
  }

  if (text instanceof Index || text instanceof Author || text instanceof Collection) {
    text.texts.forEach((sub: Author|Stub) => {
      if ((text.id === 'index') || (sub.id.split('.')[0] === text.id.split('.')[0])) {
        analyseRecursively(sub.id, lemmas)
        const subAnalysis = readAnalysis(sub.id)
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
        subAnalysis.lemmas.forEach((lemma) => {
          const existing = analysis.lemmas.find(x => x.label === lemma.label)
          if (existing) {
            existing.frequency += lemma.frequency
            existing.documentFrequency += lemma.documentFrequency
          } else {
            analysis.lemmas.push(Object.assign({}, lemma))
          }
        })
      }
    })
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
    .replace(/\/\//g, ' ') // replace line breaks with spaces
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

  const lemmas = content
    .replace(/\=.*?\=/g, '') // remove names
    .replace(/\$\$?.*?\$?\$/g, '') // remove foreign text
    .replace(/\[.*?\]/g, '') // remove citations
    .replace(/[";:(),.!?]/g, '') // remove punctuation
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

function addTfIdfRecursively (id: string, indexAnalysis: Analysis): void {
  const text = readText(id)

  if (text instanceof Author || text instanceof Collection) {
    text.texts.forEach((sub: Author|Stub) => {
      if ((text.id === 'index') || (sub.id.split('.')[0] === text.id.split('.')[0])) {
        addTfIdfRecursively(sub.id, indexAnalysis)
      }
    })
  }

  const analysis = readAnalysis(id)
  analysis.lemmas.forEach((lemma: Lemma) => {
    const indexLemma = indexAnalysis.lemmas.find(x => x.label === lemma.label)
    const df = indexLemma ? indexLemma.documentFrequency : 0
    const rawIdf = df - lemma.documentFrequency + 1
    const totalDocuments = indexAnalysis.importedDocumentCount - analysis.importedDocumentCount
    const idf = Math.log(totalDocuments / rawIdf)
    const tf = (lemma.frequency / analysis.wordCount)
    lemma.rawIdf = rawIdf
    lemma.idf = idf
    lemma.tfidf = tf * idf
  })

  analysis.lemmas.sort((x, y) => y.tfidf - x.tfidf)
  write(analysis, 'analysis')
}
