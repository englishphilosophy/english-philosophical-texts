import {
  readJsonSync
} from '../deps.ts'
import { Index, Stub } from './types/text.ts'
import { readAnalysis, readText } from './file.ts'

const index = readText('index') as Index

function percent(x: any[], y: any[]): string {
  return `${Math.round(x.length / y.length * 100)}%`
}

const authors = index.texts
const men = authors.filter(x => x.sex === 'Male')
const women = authors.filter(x => x.sex === 'Female')

console.log(`Authors: ${authors.length}`)
console.log(`Male authors: ${men.length} (${percent(men, authors)})`)
console.log(`Female authors: ${women.length} (${percent(women, authors)})`)
console.log('')

const texts = authors.reduce((sofar: Stub[], current) => sofar.concat(current.texts), [])
const maleTexts = men.reduce((sofar: Stub[], current) => sofar.concat(current.texts), [])
const femaleTexts = women.reduce((sofar: Stub[], current) => sofar.concat(current.texts), [])
const transcribedTexts = texts.filter(x => x.sourceUrl || x.id.split('.')[0] === 'Hume')
const htoTexts = transcribedTexts.filter(x => x.id.split('.')[0] === 'Hume')
const ollTexts = transcribedTexts.filter(x => x.sourceUrl && x.sourceUrl.match(/https?:\/\/oll.libertyfund.org/))
const tcpTexts = transcribedTexts.filter(x => x.sourceUrl && x.sourceUrl.match(/https?:\/\/quod.lib.umich.edu/))
const importedTexts = texts.filter(x => x.imported)

console.log(`Texts: ${texts.length}`)
console.log(`Male authored texts: ${maleTexts.length} (${percent(maleTexts, texts)})`)
console.log(`Female authored texts: ${femaleTexts.length} (${percent(femaleTexts, texts)})`)
console.log(`Transcribed texts: ${transcribedTexts.length} (${percent(transcribedTexts, texts)})`)
console.log(`HTO texts: ${htoTexts.length} (${percent(htoTexts, texts)})`)
console.log(`OLL texts: ${ollTexts.length} (${percent(ollTexts, texts)})`)
console.log(`TCP texts: ${tcpTexts.length} (${percent(tcpTexts, texts)})`)
console.log(`Imported texts: ${importedTexts.length} (${percent(importedTexts, texts)})`)
