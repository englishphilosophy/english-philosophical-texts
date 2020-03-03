import fs from 'fs'
import YAML from 'yamljs'

const authors = fs.readdirSync('texts')
  .filter(x => x !== 'index.mit')
  .map(x => fs.readFileSync(`texts/${x}/index.mit`, 'utf8'))
  .map(x => YAML.parse(x))

const maleAuthors = authors.filter(x => x.sex === 'Male')
const maleProp = Math.round((maleAuthors.length / authors.length) * 100)
const femaleAuthors = authors.filter(x => x.sex === 'Female')
const femaleProp = Math.round((femaleAuthors.length / authors.length) * 100)

const texts = authors.reduce((x, y) => x + y.texts.length, 0)
const maleTexts = maleAuthors.reduce((x, y) => x + y.texts.length, 0)
const maleTextsProp = Math.round((maleTexts / texts) * 100)
const femaleTexts = femaleAuthors.reduce((x, y) => x + y.texts.length, 0)
const femaleTextsProp = Math.round((femaleTexts / texts) * 100)

console.log('----------------------------------------')
console.log(`Authors: ${authors.length}`)
console.log(`Male authors: ${maleAuthors.length} (${maleProp}%)`)
console.log(`Female authors: ${femaleAuthors.length} (${femaleProp}%)`)
console.log('----------------------------------------')
console.log(`Texts: ${texts}`)
console.log(`Male texts: ${maleTexts} (${maleTextsProp}%)`)
console.log(`Female texts: ${femaleTexts} (${femaleTextsProp}%)`)
console.log('----------------------------------------')
