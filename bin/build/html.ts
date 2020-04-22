import { Index, Author, Stub, Collection, Document } from '../types/text.ts'
import { readText, write } from '../file.ts'

export default function html (): void {
  console.log('Building HTML...')
  buildHtmlRecursively('index')
  console.log('HTML created.')
}

function buildHtmlRecursively(id: string): void {
  const text = readText(id)

  if (text instanceof Index || text instanceof Author || text instanceof Collection) {
    text.texts.forEach((subText: Author|Stub) => {
      buildHtmlRecursively(subText.id)
    })
  }

  if (text instanceof Document || text instanceof Collection) {
    text.blocks.forEach(x => {
      x.content = formatHtml(x.content)
    })
  }

  write(text, 'html')
}

function formatHtml (content: string): string {
  return `<p>${content}</p>`
}
