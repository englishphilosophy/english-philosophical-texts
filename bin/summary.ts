import { Author, Text } from './types/library.ts'
import { readAuthors } from './file.ts'

function percentOld(x: (Author|Text)[], y: (Author|Text)[]): string {
  const xDuplicated = x.filter(x => (x as Text).duplicate)
  const yDuplicated = y.filter(y => (y as Text).duplicate)
  const xLength = x.length - (xDuplicated.length / 2)
  const yLength = y.length - (yDuplicated.length / 2)
  return `${Math.round(xLength / yLength * 100)}%`
}

function percent (a: number, b: number): string {
  return `${Math.round(a / b * 100)}%`
}

const authors = readAuthors()
const men = authors.filter(x => x.sex === 'Male')
const women = authors.filter(x => x.sex === 'Female')
console.log(`Authors: ${authors.length}`)
console.log(`Male authors: ${men.length} (${percent(men.length, authors.length)})`)
console.log(`Female authors: ${women.length} (${percent(women.length, authors.length)})`)

console.log('')

const texts = authors.reduce((sofar: Text[], current) => sofar.concat(current.texts), [])
const duplicatedTexts = texts.filter(x => x.duplicate)
const totalTexts = texts.length - (duplicatedTexts.length / 2)
console.log(`Texts: ${totalTexts}`)

const maleTexts = men.reduce((sofar: Text[], current) => sofar.concat(current.texts), [])
const duplicatedMaleTexts = maleTexts.filter(x => x.duplicate)
const totalMaleTexts = maleTexts.length - (duplicatedMaleTexts.length / 2)
console.log(`Male authored texts: ${totalMaleTexts} (${percent(totalMaleTexts, totalTexts)})`)

const femaleTexts = women.reduce((sofar: Text[], current) => sofar.concat(current.texts), [])
const duplicatedFemaleTexts = femaleTexts.filter(x => x.duplicate)
const totalFemaleTexts = femaleTexts.length - (duplicatedFemaleTexts.length / 2)
console.log(`Female authored texts: ${totalFemaleTexts} (${percent(totalFemaleTexts, totalTexts)})`)

const transcribedTexts = texts.filter(x => x.sourceUrl || x.id.split('.')[0] === 'Hume')
const duplicatedTranscribedTexts = transcribedTexts.filter(x => x.duplicate)
const totalTranscribedTexts = transcribedTexts.length - (duplicatedTranscribedTexts.length / 2)
console.log(`Transcribed texts: ${totalTranscribedTexts} (${percent(totalTranscribedTexts, totalTexts)})`)

/*
const femaleTranscribedTexts = femaleTexts.filter(x => x.sourceUrl)
const htoTexts = transcribedTexts.filter(x => x.id.split('.')[0] === 'Hume')
const ollTexts = transcribedTexts.filter(x => x.sourceUrl && x.sourceUrl.match(/https?:\/\/oll.libertyfund.org/))
const tcpTexts = transcribedTexts.filter(x => x.sourceUrl && x.sourceUrl.match(/https?:\/\/quod.lib.umich.edu/))
const importedTexts = texts.filter(x => x.imported)
*/
