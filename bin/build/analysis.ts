import { dirname, ensureDir, markit } from '../../deps.ts'
import type { Author, Text } from '../types/library.ts'
import { isAuthor, isText } from '../types/library.ts'
import type { Analysis, LemmatizeResult } from '../types/analysis.ts'
import type { FlatLexicon } from '../types/lexicon.ts'
import * as read from '../read.ts'

export const buildBaseAnalyses = async (): Promise<void> => {
  const flatLexicon = JSON.parse(await read.flatLexicon()) as FlatLexicon

  console.log('Analysing texts...')
  await analyseData('index', flatLexicon)
  console.log('  base analysis complete.')
}

const analyseData = async (id: string, flatLexicon: FlatLexicon): Promise<void> => {
  // fetch the data (author or text)
  const dataRead = await read.text('mit', id)
  if (dataRead) {
    // parse the data
    const [dataPath, dataRaw] = dataRead
    const analysisPath = dataPath.replace('build/mit', 'build/analysis')
    const data = JSON.parse(dataRaw) as Author | Text
    // keep us informed
    if (data.id.includes('.')) {
      await Deno.stdout.write(new TextEncoder().encode('.'))
    } else if (id !== 'index') {
      await Deno.stdout.write(new TextEncoder().encode(`    ${data.id}`))
    }
    // analyse subtexts first
    for (const subText of data.texts) {
      if (id === 'index' || subText.id.split('.')[0] === data.id.split('.')[0]) { // skip over subtexts by different authors
        await analyseData(subText.id, flatLexicon)
      }
    }
    // now analyse this author/text (using the subAnalyses created first)
    const subAnalyses = (await Promise.all(data.texts
      .map(async (text) => await read.text('analysis', text.id))))
      .filter((x): x is [string, string] => x !== undefined)
      .map(x => JSON.parse(x[1]) as Analysis)
    const result = analyse(data, subAnalyses, flatLexicon)
    // save the result
    await ensureDir(dirname(analysisPath))
    await Deno.writeTextFile(analysisPath, JSON.stringify(result))
    // keep us informed
    if (id !== 'index' && !id.includes('.')) {
      await Deno.stdout.write(new TextEncoder().encode('done\n'))
    }
  }
}

export const analyse = (data: Author | Text, subAnalyses: Analysis[], flatLexicon: FlatLexicon): Analysis => {
  const imported = isAuthor(data) || data.imported
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
    marginCommentWordCount: 0,
    lemmas: [],
    numbers: [],
    names: [],
    foreignText: [],
    citations: [],
    marginComments: []
  }

  if (imported && isText(data)) {
    for (const block of data.blocks.filter(x => x.type !== 'title')) {
      let result
      try {
        result = lemmatize(block.content, flatLexicon)
      } catch (error) {
        console.log(`something wrong with ${data.id}, ${block.id}`)
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

      const marginCommentWordCount = result.marginComments
        .reduce((x: number, y: string) => x + y.split(' ').length, 0)
      analysis.marginCommentWordCount += marginCommentWordCount
      analysis.wordCount += marginCommentWordCount

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

  for (const subAnalysis of subAnalyses) {
    if (data.id === 'index' || (subAnalysis.id.split('.')[0] === data.id.split('.')[0])) { // don't count subtexts by different authors
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

  return analysis
}

export const lemmatize = (content: string, flatLexicon: FlatLexicon): LemmatizeResult => {
  content = content
    .replace(/\n/g, ' ') // replace actual line breaks with spaces
    .replace(/\/\//g, ' ') // replace Markit line breaks with spaces
    .replace(/—/g, ' ') // replace long dashes with spaces
    .replace(/\|/g, '') // remove page breaks
    .replace(/\[n.*?\]/g, '') // remove footnote references
    .replace(/£\d ?(.*?) ?£\d/g, '$1') // remove heading markup
    .replace(/_|\^/g, '') // remove italics and small-caps markup
    .replace(/{--.*?--}/g, '') // remove deletions
    .replace(/{\+\+(.*?)\+\+}/g, '$1') // remove insertion markup
    .replace(/{~~.*?->(.*?)~~}/g, '$1') // remove replacement markup

  const namesCheck = content.match(/=(.*?)=/g)
  const names = namesCheck ? namesCheck.map(x => x.slice(1, -1)) : []

  const foreignTextCheck = content.match(/\$(.*?)\$/g)
  const foreignText = foreignTextCheck ? foreignTextCheck.map(x => x.slice(1, -1)) : []

  const citationsCheck = content.match(/\[(.*?)\]/g)
  const citations = citationsCheck ? citationsCheck.map(x => x.slice(1, -1)) : []

  const marginCommentsCheck = content.match(/#(.*?)#/g)
  const marginComments = marginCommentsCheck ? marginCommentsCheck.map(x => x.slice(1, -1)) : []

  const numbers: string[] = []

  const strippedContent = content
    // remove names
    .replace(/\\\=/g, '&#61;')
    .replace(/\=.*?\=('s)?/g, '')
    .replace(/&#61;/g, '\\=')
    // remove foreign text
    .replace(/\\\$/g, '&#36;')
    .replace(/\$\$?.*?\$?\$/g, '')
    .replace(/&#36;/g, '\\$')
    // remove margin comments
    .replace(/\\#/g, '&#35;')
    .replace(/#.*?#/g, '')
    .replace(/&#35;/g, '\\#')
    // remove citations
    .replace(/\\\[/g, '&#91;').replace(/\\\]/g, '&#93;')
    .replace(/\[.*?\]/g, '')
    .replace(/&#91;/g, '\\[').replace(/&#93;/g, '\\]')
    // remove punctuation
    .replace(/(e\.g\.|i\.e\.|etc\.|&c\.)/g, '[$1]')
    .replace(/[";:(),.!?]/g, '')
    .replace(/\[eg\]/g, 'e.g.')
    .replace(/\[ie\]/g, 'i.e.')
    .replace(/\[etc\]/g, 'etc.')
    .replace(/\[&c\]/g, '&c.')

  const lemmas = markit.content(strippedContent.replace(/([^~\\])~([^~])/g, '$1&126;$2'), { format: 'txt' })
    .replace(/&126;/g, '~') // keep tildes (which combine two-word lemmas)
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
    .map(x => flatLexicon[x] || x) // map to lemmas

  return {
    names,
    foreignText,
    citations,
    marginComments,
    numbers,
    lemmas
  }
}
