import {
  markit
} from '../../deps.ts'

import { Author, Text } from '../types/library.ts'
import { write } from '../file.ts'
import recurse from './recurse.ts'

export default function search (): void {
  console.log('Building searchable text...')
  recurse(buildSearch)
  console.log('Searchable text created.')
}

function buildSearch(data: Author|Text): void {
  for (const key of Object.keys(data)) {
    switch (key) {
      case 'blocks':
        for (const block of (data as Text).blocks) {
          try {
            block.content = markit.content(block.content, { format: 'txt' })
          } catch (error) {
            console.log(`Problem with ${block.id}.`)
            throw error
          }
        }
        break
      case 'texts':
        for (const stub of data.texts) {
          buildSearch(stub)
        }
        case 'title': // fallthrough
      case 'sourceDesc':
        if ((data as any)[key]) {
          try {
            (data as any)[key] = markit.content((data as any)[key], { format: 'txt' })
          } catch (error) {
            console.log(`Problem with ${data.id} metadata.`)
            throw error
          }
        }
        break
    }
  }

  write(data, 'search')
}
