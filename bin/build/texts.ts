import {
  markit
} from '../../deps.ts'

export default function texts(): void {
  // get JSON for each text from Markit
  console.log('Running Markit on all texts.')
  markit.run('texts', 'build/texts', textsConfig)
  
  // create record of authors
  console.log('Running Markit on the main index file to get authors data.')
  markit.run('texts/index.mit', 'build', authorsConfig)
}

const textsConfig = {
  format: 'json',
  textFormat: 'stub',
  textStubProperties: [
    'imported',
    'id',
    'title',
    'breadcrumb',
    'published',
    'sourceDesc',
    'sourceUrl'
  ],
  maximumDepth: 1
}

const authorsConfig = {
  format: 'json',
  textFormat: 'stub',
  textStubProperties: [
    'imported',
    'id',
    'forename',
    'surname',
    'title',
    'birth',
    'death',
    'published',
    'nationality',
    'sex'
  ],
  maximumDepth: 2
}
