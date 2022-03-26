import { emptyDir } from '../deps.ts'
import { buildBaseAnalyses } from './build/analysis.ts'
import { buildLexicons } from './build/lexicon.ts'
import { buildSentences } from './build/sentences.ts'
import { buildTexts } from './build/texts.ts'
import { buildTfIdfData } from './build/tfidf.ts'
import { tidyTexts } from './build/tidy.ts'
import { buildTopics } from './build/topics.ts'
import { buildUnidentifiedWordLists } from './build/unidentified.ts'

await emptyDir('build')
await emptyDir('tmp')

// lexicon.yml -> build/lexicon.json
// lexicon.yml -> build/lexicon-flat.json
// lexicon.yml -> build/lexicon-reduced.json
await buildLexicons()

// texts -> build/mit (using Markit)
// texts -> build/html (using Markit)
// texts -> build/search (using Markit)
// texts -> build/index.json (using Markit)
buildTexts()

// tidy authors and texts
await tidyTexts()

// build/search -> build/sentences
await buildSentences()

// build/texts -> build/analysis, build/lemmas
await buildBaseAnalyses()
await buildTfIdfData()

// build/analysis -> build/lemmas
await buildUnidentifiedWordLists()

// build/analysis -> build/topics
await buildTopics()
