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
  for (const key of Object.keys(data)) {
    switch (key) {
      case 'blocks':
        for (const block of (data as Text).blocks) {
          try {
            block.content = markit.content(block.content, { format: 'html' })
          } catch (error) {
            console.log(`Problem with ${block.id}.`)
            throw error
          }
        }
        break
      case 'texts':
        for (const stub of data.texts) {
          buildHtml(stub)
        }
      case 'title': // fallthrough
      case 'sourceDesc':
        if ((data as any)[key]) {
          try {
            (data as any)[key] = markit.content((data as any)[key], { format: 'html' })
          } catch (error) {
            console.log(`Problem with ${data.id} metadata.`)
            throw error
          }
        }
        break
    }
  }

  write(data, 'html')
}
