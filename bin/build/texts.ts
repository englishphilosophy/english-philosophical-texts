import {
  markit
} from '../../deps.ts'

export default function texts(): void {
  // get JSON with raw MIT content for each text from Markit
  console.log('Running Markit to get JSON with raw MIT content...')
  markit.run('texts', 'build/texts', textsConfig)

  // get JSON with HTML content for each text from Markit
  console.log('Running Markit to get JSON with HTML content...')
  markit.run('texts', 'build/html', Object.assign(textsConfig, { jsonContentFormat: 'html' }))

  // get JSON with plain TXT content for each text from Markit
  console.log('Running Markit to get JSON with TXT content...')
  markit.run('texts', 'build/search', Object.assign(textsConfig, { jsonContentFormat: 'txt' }))

  // create record of authors
  console.log('Running Markit on the main index file to get authors data...')
  markit.run('texts/index.mit', 'build', authorsConfig)
}

const textsConfig = {
  format: 'json',
  textFormat: 'stub',
  textStubProperties: [
    'imported',
    'id',
    'duplicate',
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
    'id',
    'forename',
    'surname',
    'title',
    'birth',
    'death',
    'published',
    'nationality',
    'sex',
    'imported',
    'duplicate',
    'sourceDesc',
    'sourceUrl'
  ],
  maximumDepth: 2
}
