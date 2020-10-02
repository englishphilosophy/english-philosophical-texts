import type { Author, Text } from '../types/library.ts'
import { readAuthors, readText } from '../file.ts'

type Action = (data: Author|Text, isAuthor: boolean, globalArg?: any) => void

export default function recurse (doSomething: Action, globalArg?: any): void {
  const authors = readAuthors()
  for (const author of authors) {
    for (const text of author.texts) {
      doSomethingRecursively(text.id, doSomething, globalArg)
    }
    doSomething(author, true, globalArg)
  }
}

function doSomethingRecursively (id: string, doSomething: Action, globalArg?: any): void {
  const text = readText(id)
  for (const subtext of text.texts) {
    if ((subtext.id.split('.')[0] === id.split('.')[0])) { // skip over subtexts by different authors
      doSomethingRecursively(subtext.id, doSomething, globalArg)
    }
  }
  doSomething(text, false, globalArg)
}
