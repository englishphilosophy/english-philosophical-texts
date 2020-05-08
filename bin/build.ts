import texts from './build/texts.ts'
import analysis from './build/analysis.ts'
// import topics from './build/topics.ts'
import sentences from './build/sentences.ts'

// texts -> build/texts (using Markit)
// texts -> build/html (using Markit)
// texts -> build/search (using Markit)
// texts -> build/index.json (using Markit)
texts()

// build/search -> build/sentences
sentences()

// build/texts -> build/analysis
analysis()

// build/analysis -> build/topics
// topics()
