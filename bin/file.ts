import {
  dirname,
  ensureDirSync,
  existsSync,
  readJsonSync,
  writeFileStrSync
} from '../deps.ts'
import { Text, Index, Author, Collection, Document } from './types/text.ts'
import { Analysis } from './types/analysis.ts'

export function path (id: string, base: string): string {
  const textsPath = `build/texts/${id.toLowerCase().replace(/\./g, '/')}.json`
  let path = `build/${base}/${id.toLowerCase().replace(/\./g, '/')}.json`
  if (!existsSync(textsPath)) path = path.replace(/\.json$/, '/index.json')
  return path
}

export function readText (id: string): Text {
  const filePath = path(id, 'texts')
  if (!existsSync(filePath)) {
    throw new Error(`Failed to open text file for ${id}.`)
  }
  try {
    const data: any = readJsonSync(filePath)
    if (id === 'index') {
      return new Index(data)
    }
    if (id.indexOf('.') === -1) {
      return new Author(data)
    }
    return (data.texts && data.texts.length > 0)
      ? new Collection(data)
      : new Document(data)
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
  writeFileStrSync(filePath, JSON.stringify(data, null, 2))
}
