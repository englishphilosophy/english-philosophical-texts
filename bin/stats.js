/**
 * Calculate some basic statistics and log them to the console.
 */
import fs from 'fs'
import YAML from 'yamljs'

// function for getting YAML data from the texts directory
function fetch (path) {
  const fileContents = fs.readFileSync(`texts/${path}`, 'utf8')
  const yamlCheck = fileContents.match(/^---\n((.|\n)*?)\n---\n/)
  return YAML.parse(yamlCheck[1])
}

// get all authors and texts
const authors = fs.readdirSync('texts')
  .filter(x => x !== 'index.mit')
  .map(x => fetch(`${x}/index.mit`))
const texts = authors
  .reduce((x, y) => x.concat(y.texts.map(x => fetch(`${y.id.toLowerCase()}/${x}`))), [])

// get some basic author figures
const maleAuthors = authors.filter(x => x.sex === 'Male')
const maleProp = Math.round((maleAuthors.length / authors.length) * 100)
const femaleAuthors = authors.filter(x => x.sex === 'Female')
const femaleProp = Math.round((femaleAuthors.length / authors.length) * 100)

// get some basic text figures
const textsTotal = authors.reduce((x, y) => x + y.texts.length, 0)
const maleTextsTotal = maleAuthors.reduce((x, y) => x + y.texts.length, 0)
const maleTextsProp = Math.round((maleTextsTotal / textsTotal) * 100)
const femaleTextsTotal = femaleAuthors.reduce((x, y) => x + y.texts.length, 0)
const femaleTextsProp = Math.round((femaleTextsTotal / textsTotal) * 100)

// get some additional text figures
const importableTexts = texts.filter(x => x.sourceUrl)
const importableTextsProp = Math.round((importableTexts.length / textsTotal) * 100)
const importedTexts = texts.filter(x => x.imported)
const importedTextsProp = Math.round((importedTexts.length / textsTotal) * 100)

// log the data to the console
console.log('----------------------------------')
console.log(` Authors:             ${authors.length}`)
console.log(` Male authors:        ${maleAuthors.length}    (${maleProp}%)`)
console.log(` Female authors:      ${femaleAuthors.length}    (${femaleProp}%)`)
console.log('----------------------------------')
console.log(` Texts:              ${textsTotal}`)
console.log(` Male texts:         ${maleTextsTotal}    (${maleTextsProp}%)`)
console.log(` Female texts:        ${femaleTextsTotal}    (${femaleTextsProp}%)`)
console.log(` Importable texts:   ${importableTexts.length}    (${importableTextsProp}%)`)
console.log(` Imported texts:      ${importedTexts.length}    (${importedTextsProp}%)`)
console.log('----------------------------------')
