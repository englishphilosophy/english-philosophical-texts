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
  if ((data as Text).blocks) {
    for (const block of (data as Text).blocks) {
      try {
        block.content = markit.content(block.content, { format: 'txt' })
      } catch (error) {
        console.log(`Problem with ${block.id}.`)
        throw error
      }
    }
  }

  write(data, 'search')
}
