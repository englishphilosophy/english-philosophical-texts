import { dirname, ensureDir } from '../../deps.ts'
import type { Author, Block, SourceText, Text, TextStub } from '../types/library.ts'
import * as read from '../read.ts'

export const tidyTexts = async (): Promise<void> => {
  console.log('Tidying Markit output...')

  const { texts: authors } = JSON.parse(await read.authors()) as { texts: Author[] }
  for (const author of authors) {
    await processAuthor(author)
  }

  console.log('Markit output tidied.')
}

const processAuthor = async (author: Author): Promise<void> => {
  for (let index = 0; index < author.texts.length; index += 1) {
    await processText([author], null, null, author.texts[index], index, author.texts)
  }
}

const processText = async (
  ancestors: [Author, ...TextStub[]],
  higherPrev: TextStub | null,
  higherNext: TextStub | null,
  textStub: TextStub,
  index: number,
  textStubs: TextStub[]
): Promise<void> => {
  const prev = textStubs[index - 1] ?? higherPrev
  const next = textStubs[index + 1] ?? higherNext

  const textRead = await read.text('texts', textStub.id)
  const htmlRead = await read.text('html', textStub.id)
  const searchRead = await read.text('search', textStub.id)

  if (textRead && htmlRead && searchRead) {
    const text = JSON.parse(textRead[1]) as SourceText
    const html = JSON.parse(htmlRead[1]) as SourceText
    const search = JSON.parse(searchRead[1]) as SourceText
  
    await ensureDir(dirname(textRead[0]))
    await ensureDir(dirname(htmlRead[0]))
    await ensureDir(dirname(searchRead[0]))

    await Deno.writeTextFile(textRead[0], JSON.stringify(tidyText(text, ancestors, prev, next)))
    await Deno.writeTextFile(htmlRead[0], JSON.stringify(tidyHtml(html, ancestors, prev, next)))
    await Deno.writeTextFile(searchRead[0], JSON.stringify(tidySearch(search, ancestors, prev, next)))

    for (let index = 0; index < text.texts.length; index += 1) {
      await processText([...ancestors, textStub], textStub, next, text.texts[index], index, text.texts)
    }
  }
}

export const tidyText = (text: SourceText, ancestors: [Author, ...TextStub[]], prev: TextStub | null, next: TextStub | null): Text => {
  if (prev && next) {
    return { ...text, ancestors, prev, next }
  }

  if (prev) {
    return { ...text, ancestors, prev }
  }

  if (next) {
    return { ...text, ancestors, next }
  }

  return { ...text, ancestors }
}

export const tidyHtml = (text: SourceText, ancestors: [Author, ...TextStub[]], prev: TextStub | null, next: TextStub | null): Text => ({
  ...tidyText(text, ancestors, prev, next),
  blocks: text.blocks.map(cleanHtml)
})

export const tidySearch = (text: SourceText, ancestors: [Author, ...TextStub[]], prev: TextStub | null, next: TextStub | null): Text => ({
  ...tidyText(text, ancestors, prev, next),
  blocks: text.blocks.map(cleanSearch)
})

export const cleanHtml = (block: Block): Block => ({
  ...block,
  content: block.content
    .replaceAll('`', '') // remove disambiguating `
})

export const cleanSearch = (block: Block): Block => ({
  ...block,
  content: block.content
    .replaceAll('`', '') // remove disambiguating `
    .replace(/\[n[0-9*]+\]/g, '') // remove note anchors
    .replace(/#.*?#/g, '') // remove margin comments
})
