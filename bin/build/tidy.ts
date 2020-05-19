import { Author, Text } from '../types/library.ts'
import { readText, write } from '../file.ts'
import recurse from './recurse.ts'

export default function analysis (): void {
  console.log('Tidying Markit output...')
  recurse(tidy)
  console.log('Markit output tidied.')
}

function tidy (data: Author|Text, isAuthor: boolean): void {
  if (!isAuthor) {
    const html = readText(data.id, 'html')
    for (const block of html.blocks) {
      block.content = block.content
        .replace(/`/g, '') // remove disambiguating `
    }
    write(html, 'html')

    const search = readText(data.id, 'search')
    for (const block of search.blocks) {
      block.content = block.content
        .replace(/`/g, '') // remove disambiguating `
        .replace(/\[n[0-9*]+\]/g, '') // remove note anchors
        .replace(/#.*?#/g, '') // remove margin comments
    }
    write(search, 'search')
  }
}
