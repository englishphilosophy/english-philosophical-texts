import {
  dirname,
  ensureDirSync,
  existsSync,
  readJsonSync,
  writeFileStrSync
} from '../deps.ts'

import { Author, Text } from './types/library.ts'
import { Analysis } from './types/analysis.ts'

export function readAuthors (): Author[] {
  return (readJsonSync('build/index.json') as any).texts as Author[]
}

export function readText (id: string, base: string = 'texts'): Text {
  const filePath = path(id, base)
  if (!existsSync(filePath)) {
    throw new Error(`Failed to open text file for ${id}.`)
  }

  try {
    return readJsonSync(filePath) as Text
  } catch (error) {
    console.log(`Problem with ${filePath} file.`)
    throw error
  }
}

export function readAnalysis (id: string): Analysis {
  const filePath = path(id, 'analysis')
  if (!existsSync(filePath)) {
    throw new Error(`Failed to open text file for ${id}.`)
  }

  try {
    return readJsonSync(filePath) as Analysis
  } catch (error) {
    console.log(`Problem with ${filePath} file.`)
    throw error
  }
}

export function write (data: any, base: string): void {
  const filePath = path(data.id, base)
  ensureDirSync(dirname(filePath))
  writeFileStrSync(filePath, JSON.stringify(data))
}

export function writeText (id: string, base: string, text: string): void {
  const filePath = path(id, base)
  ensureDirSync(dirname(filePath))
  writeFileStrSync(filePath, text)
}

function path (id: string, base: string): string {
  const textsPath = `build/texts/${id.toLowerCase().replace(/\./g, '/')}.json`
  let path = `build/${base}/${id.toLowerCase().replace(/\./g, '/')}.json`
  if (!existsSync(textsPath)) path = path.replace(/\.json$/, '/index.json')
  return path
}
