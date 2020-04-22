import {
  green,
  readFileStrSync,
  writeFileStrSync
} from '../../deps.ts'
import markit from '../../../markit/src/run.ts'
import { Index, Author, Collection, Stub } from '../types/text.ts'
import { path, readText, write } from '../file.ts'

export default function texts(): void {
  // get JSON for each text from Markit
  console.log('Running Markit on all texts.')
  markit('texts', 'build/texts', textsConfig)
  
  // overwrite index file with slightly different Markit config
  console.log('Re-running Markit on the main index file.')
  markit('texts/index.mit', 'build/texts', libraryConfig)

  // read and write everything recursively (to put it in the desired format)
  console.log('Formatting texts output by Markit...')
  formatRecursively('index')
  console.log(green(`${log.length} files formatted.`))

  // check the logs match the markit logs
  const markitLog = readFileStrSync('markit.log')
  const formatLog = log.sort().join('\n').replace(/build\/(.*?)\.json/g, '$1.mit')
  if (markitLog === formatLog) {
    Deno.removeSync('markit.log')
    console.log('Markit log file matches formatting logs. Deleted Markit log file.')
  } else {
    writeFileStrSync('format.log', formatLog)
    console.log('Markit log file does not match formatting logs. Saved format log file for checking.')
  }
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
    'author',
    'sourceUrl',
    'sourceDesc'
  ],
  maximumDepth: 1,
  createLogFile: true
}

const libraryConfig = {
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
    'sex',
    'breadcrumb',
    'sourceUrl',
    'sourceDesc'
  ],
  maximumDepth: 2
}

const log: string[] = []

function formatRecursively (id: string): void {
  const data = readText(id)
  if ((data as Index|Author|Collection).texts) {
    (data as Index|Author|Collection).texts.forEach((x: Author|Stub) => {
      if (data.id === 'index' || data.id.split('.')[0] === x.id.split('.')[0]) {
        formatRecursively(x.id)
      }
    })
  }
  write(data, 'texts')
  log.push(path(id, 'texts'))
}
