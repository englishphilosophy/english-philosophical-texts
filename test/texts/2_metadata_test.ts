import {
  assertEquals,
  dirname,
  markit
} from '../../deps_test.ts'
import * as tools from './tools.ts'

Deno.test({
  name: 'texts/metadata',
  fn() {
    tools.testRecursively(testIDsRecursively)
  }
})

function testIDsRecursively(path: string, base?: string) {
  // check file exists and get parsed file contents
  const fullPath = base ? `${base}/${path}` : path
  const options = { format: 'json', textFormat: 'path' }
  const data = JSON.parse(markit.compile(`texts/${fullPath}`, options))

  // check ID matches path
  const trimPath = fullPath
    .replace(/\.mit$/, '')
    .replace(/\/index$/, '')
    .replace(/.*?\/.*?\/\.\.\/\.\.\//, '')
  const idPath = data.id.toLowerCase().replace(/\./g, '/')
  assertEquals(trimPath, idPath)

  // check metadata
  if (data.id.split('.').length === 1) {
    checkAuthorMetadata(data)
  } else {
    checkTextMetadata(data)
  }

  // test sub texts recursively
  const subPaths = data.texts.map((x: string) => x.replace(/\.json$/, '.mit'))
  for (const subPath of subPaths) {
    testIDsRecursively(subPath, dirname(fullPath))
  }
}

function checkAuthorMetadata (data: any): void {
  if (!data.forename || typeof data.forename !== 'string') {
    console.log(`${data.id}: Bad or missing forename.`)
  }
  if (!data.surname || typeof data.surname !== 'string') {
    console.log(`${data.id}: Bad or missing surname.`)
  }
  if (!data.author || typeof data.author !== 'string') {
    console.log(`${data.id}: Bad or missing author.`)
  }
  if (!data.birth || typeof data.birth !== 'number') {
    console.log(`${data.id}: Bad or missing birth date.`)
  }
  if (!data.death || typeof data.death !== 'number') {
    console.log(`${data.id}: Bad or missing death date.`)
  }
  if (!data.published || typeof data.published !== 'number') {
    console.log(`${data.id}: Bad or missing published date.`)
  }
  if (!data.nationality || typeof data.nationality !== 'string') {
    console.log(`${data.id}: Bad or missing nationality.`)
  }
  if (!data.sex || typeof data.sex !== 'string' || ['Male', 'Female'].indexOf(data.sex) === -1) {
    console.log(`${data.id}: Bad or missing sex.`)
  }
  if (!data.texts || !Array.isArray(data.texts) || data.texts.length === 0) {
    console.log(`${data.id}: Bad or missing texts.`)
  }
}

function checkTextMetadata (data: any): void {
  if (!data.title || typeof data.title !== 'string') {
    console.log(`${data.id}: Bad or missing title.`)
  }
  if (!data.breadcrumb || typeof data.breadcrumb !== 'string') {
    console.log(`${data.id}: Bad or missing breadcrumb.`)
  }
  if (!data.published || !Array.isArray(data.published)) {
    console.log(`${data.id}: Bad or missing publication dates.`)
  } else {
    for (const published of data.published) {
      if (typeof published !== 'number') {
        console.log(`${data.id}: Element of publication dates array is not a number.`)
      }
    }
  }
  if (data.imported) {
    if (!data.sourceDesc || typeof data.sourceDesc !== 'string') {
      console.log(`${data.id}: Bad or missing source description.`)
    }
  }
}
