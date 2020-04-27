import texts from './build/texts.ts'
import search from './build/search.ts'
import analysis from './build/analysis.ts'
// import topics from './build/topics.ts'
import sentences from './build/sentences.ts'
import html from './build/html.ts'

// texts -> build/texts (using Markit)
texts()

// build/texts -> build/html
html()

// build/texts -> build/search
search()

// build/search -> build/sentences
//sentences()

// build/texts -> build/analysis
//analysis()

// build/analysis -> build/topics
// topics()
