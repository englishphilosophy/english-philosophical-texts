import {
  assert,
  assertEquals,
  dirname,
  existsSync,
  markit
} from '../../deps_test.ts'
import * as tools from './tools.ts'

Deno.test({
  name: 'texts/ids',
  fn() {
    tools.testRecursively(testIDsRecursively)
  }
})

function testIDsRecursively(path: string, base?: string) {
  // check file exists and get parsed file contents
  const fullPath = base ? `${base}/${path}` : path
  assert(existsSync(`texts/${fullPath}`))
  const options = { format: 'json', textFormat: 'path' }
  const data = JSON.parse(markit.compile(`texts/${fullPath}`, options)) as any

  // check ID matches path
  const trimPath = fullPath
    .replace(/\.mit$/, '')
    .replace(/\/index$/, '')
    .replace(/.*?\/.*?\/\.\.\/\.\.\//, '')
  const idPath = data.id.toLowerCase().replace(/\./g, '/')
  assertEquals(trimPath, idPath)

  // test sub texts recursively
  const subPaths = data.texts.map((x: string) => x.replace(/\.json$/, '.mit'))
  for (const subPath of subPaths) {
    testIDsRecursively(subPath, dirname(fullPath))
  }
}
