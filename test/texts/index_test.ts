import {
  assertEquals,
  markit
} from '../../deps_test.ts'

Deno.test({
  name: 'texts/index',
  fn() {
    const options = { format: 'json', textFormat: 'path' }
    const index = JSON.parse(markit.compile('texts/index.mit', options)) as any
    const authorPaths = Array.from(Deno.readDirSync('texts'))
      .filter(x => x.isDirectory)
      .map(x => `${x.name}/index.mit`)
    authorPaths.sort()
    assertEquals(authorPaths, index.texts.map((x: string) => x.replace(/\.json$/, '.mit')))
  }
})
