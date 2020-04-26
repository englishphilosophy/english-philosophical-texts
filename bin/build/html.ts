import {
  markit
} from '../../deps.ts'

import { Author, Text } from '../types/library.ts'
import { write } from '../file.ts'
import recurse from './recurse.ts'

export default function html (): void {
  console.log('Building HTML...')
  recurse(buildHtml)
  console.log('HTML created.')
}

function buildHtml (data: Author|Text): void {
  if ((data as Text).blocks) {
    for (const block of (data as Text).blocks) {
      try {
        block.content = markit.content(block.content, { format: 'html' })
      } catch (error) {
        console.log(`Problem with ${block.id}.`)
        throw error
      }
    }
  }

  write(data, 'html')
}
