import { dirname, ensureDir } from '../../deps.ts'
import type { Author, Text } from '../types/library.ts'
import type { Analysis } from '../types/analysis.ts'
import * as read from '../read.ts'

export const buildTfIdfData = async (): Promise<void> => {
  // fetch the index analysis
  const analysisRead = await read.text('analysis', 'index')
  if (!analysisRead) {
    console.log('  index analysis not available - exiting.')
    return
  }

  // add TF-IDF data
  const indexAnalysis = JSON.parse(analysisRead[1]) as Analysis
  console.log('Adding TF-IDF data...')
  await addTfIdfData('index', indexAnalysis)
  console.log('  TF-IDF data added.')
}

const addTfIdfData = async (id: string, indexAnalysis: Analysis): Promise<void> => {
  // fetch the data (author or text)
  const dataRead = await read.text('mit', id)
  // fetch the analysis
  const analysisRead = await read.text('analysis', id)
  if (dataRead && analysisRead) {
    // parse the data
    const data = JSON.parse(dataRead[1]) as Author | Text
    // keep us informed
    if (data.id.includes('.')) {
      await Deno.stdout.write(new TextEncoder().encode('.'))
    } else if (id !== 'index') {
      await Deno.stdout.write(new TextEncoder().encode(`    ${data.id}`))
    }
    // add TF-IDF data to subtexts
    for (const subText of data.texts) {
      if (id === 'index' || subText.id.split('.')[0] === id.split('.')[0]) { // skip over subtexts by different authors
        await addTfIdfData(subText.id, indexAnalysis)
      }
    }
    // add TF-IDF data to this author/text (unless its the main index)
    if (id !== 'index') {
      const [path, analysisRaw] = analysisRead
      const analysis = JSON.parse(analysisRaw) as Analysis
      const result = addTfIdf(analysis, indexAnalysis)
      await ensureDir(dirname(path))
      await Deno.writeTextFile(path, JSON.stringify(result))
      // keep us informed
      if (!data.id.includes('.')) {
        await Deno.stdout.write(new TextEncoder().encode('done\n'))
      }
    }
  }
}

export const addTfIdf = (analysis: Analysis, indexAnalysis: Analysis): Analysis => {
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
  return analysis
}
