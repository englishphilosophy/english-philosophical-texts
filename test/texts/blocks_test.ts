import {
  dirname,
  markit
} from '../../deps_test.ts'
import * as tools from './tools.ts'

Deno.test({
  name: 'texts/blocks',
  fn() {
    tools.testRecursively(testBlocksRecursively)
  }
})

function testBlocksRecursively(path: string, base?: string) {
  // check file exists and get parsed file contents
  const fullPath = base ? `${base}/${path}` : path
  const options = { format: 'json', textFormat: 'path' }
  const data = JSON.parse(markit.compile(`texts/${fullPath}`, options)) as any

  // if text is not imported (and is not an author), skip it
  if (!data.imported && data.id.split('.').length === 1) return

  // check for at least one block
  if (data.blocks.length === 0) {
    console.log(`${data.id}: No blocks.`)
    return
  }

  // check first block is a title
  if (data.blocks[0].type !== 'title') {
    console.log(`${data.id}: First block is not a title block.`)
    return
  }

  // for texts with subtexts, that's all we need
  if (data.texts.length > 0) return

  // otherwise...
  const paragraphs = data.blocks.filter((x: any) => x.type === 'paragraph')

  // check for paragraphs
  if (paragraphs.length === 0) {
    console.log(`${data.id}: No paragraphs.`)
    return
  }

  // check paragraph numbers are sequential
  let counter = 1
  let roman = false
  for (let index in paragraphs) {
    if (roman !== isNaN(paragraphs[index].subId)) {
      counter = 1
    }
    roman = isNaN(paragraphs[index].subId)

    if (tools.idIndex(paragraphs[index].subId) !== counter) {
      console.log(`${paragraphs[index].id || data.id}: Non-sequential paragraph ID.`)
      return
    }
    counter += 1
  }

  // test sub texts recursively
  const subPaths = data.texts.map((x: string) => x.replace(/\.json$/, '.mit'))
  for (const subPath of subPaths) {
    testBlocksRecursively(subPath, dirname(fullPath))
  }
}
