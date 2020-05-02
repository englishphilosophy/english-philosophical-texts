import { Author, Text } from './types/library.ts'
import { readAuthors } from './file.ts'

function percent(x: (Author|Text)[], y: (Author|Text)[]): string {
  const xDuplicated = x.filter(x => (x as Text).duplicate)
  const yDuplicated = y.filter(y => (y as Text).duplicate)
  const xLength = x.length - (xDuplicated.length / 2)
  const yLength = y.length - (yDuplicated.length / 2)
  return `${Math.round(xLength / yLength * 100)}%`
}

const authors = readAuthors()
const men = authors.filter(x => x.sex === 'Male')
const women = authors.filter(x => x.sex === 'Female')

console.log(`Authors: ${authors.length}`)
console.log(`Male authors: ${men.length} (${percent(men, authors)})`)
console.log(`Female authors: ${women.length} (${percent(women, authors)})`)
console.log('')

const texts = authors.reduce((sofar: Text[], current) => sofar.concat(current.texts), [])
const duplicatedTexts = texts.filter(x => x.duplicate)
const maleTexts = men.reduce((sofar: Text[], current) => sofar.concat(current.texts), [])
const femaleTexts = women.reduce((sofar: Text[], current) => sofar.concat(current.texts), [])
const transcribedTexts = texts.filter(x => x.sourceUrl || x.id.split('.')[0] === 'Hume')
const htoTexts = transcribedTexts.filter(x => x.id.split('.')[0] === 'Hume')
const ollTexts = transcribedTexts.filter(x => x.sourceUrl && x.sourceUrl.match(/https?:\/\/oll.libertyfund.org/))
const tcpTexts = transcribedTexts.filter(x => x.sourceUrl && x.sourceUrl.match(/https?:\/\/quod.lib.umich.edu/))
const importedTexts = texts.filter(x => x.imported)

console.log(`Texts: ${texts.length} (${duplicatedTexts.length / 2} duplicates)`)
console.log(`Male authored texts: ${maleTexts.length} (${percent(maleTexts, texts)})`)
console.log(`Female authored texts: ${femaleTexts.length} (${percent(femaleTexts, texts)})`)
console.log(`Transcribed texts: ${transcribedTexts.length} (${percent(transcribedTexts, texts)})`)
console.log(`HTO texts: ${htoTexts.length} (${percent(htoTexts, texts)})`)
console.log(`OLL texts: ${ollTexts.length} (${percent(ollTexts, texts)})`)
console.log(`TCP texts: ${tcpTexts.length} (${percent(tcpTexts, texts)})`)
console.log(`Imported texts: ${importedTexts.length} (${percent(importedTexts, texts)})`)
