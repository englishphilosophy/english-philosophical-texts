import {
  dirname,
  markit
} from '../../deps_test.ts'
import * as tools from './tools.ts'

Deno.test({
  name: 'texts/notes',
  fn() {
    tools.testRecursively(testNotesRecursively)
  }
})

function testNotesRecursively(path: string, base?: string) {
  // check file exists and get parsed file contents
  const fullPath = base ? `${base}/${path}` : path
  const options = { format: 'json', textFormat: 'path' }
  const data = JSON.parse(markit.compile(`texts/${fullPath}`, options)) as any

  // if text is not imported (and is not an author), skip it
  if (!data.imported && data.id.split('.').length !== 1) return

  // if text has sub texts, skip it
  if (data.texts.length > 0) return

  // otherwise...
  const notes = data.blocks
    .filter((x: any) => x.type === 'note')
    .filter((x: any) => x.subId.split('.').length === 1)

  // extract all note references
  const noteReferences = data.blocks.reduce((sofar: string[], current: any) => {
    const refs = current.content.match(/\[n(\*|\d+)a?\]/g) || []
    return sofar.concat(refs)
  }, [])

  // normalize special cases
  switch (data.id) {
    case 'Astell.LLG.5':
      noteReferences.pop() // there are two references to note 1
      break

    case 'Hume.THN.3.2.3':
      // move n71a to the end
      const n71 = notes.shift()
      const n71a = notes.shift()
      notes.unshift(n71)
      notes.push(n71a)
      break

    case 'Butler.S.1':
      // move n6a to the end
      const n6 = notes.shift()
      const n6a = notes.shift()
      notes.unshift(n6)
      notes.push(n6a)
      break

    case 'Butler.AR.Diss.2':
      // move n212a to the end
      const n212 = notes.shift()
      const n212a = notes.shift()
      notes.unshift(n212)
      notes.push(n212a)
      break
  }

  // check the number of referenes and the number of notes match
  if (noteReferences.length !== notes.length) {
    console.log(`${data.id}: Numbers of references and notes don't match (${noteReferences.length} != ${notes.length}).`)
    return
  }

  // check the references match the note IDs
  for (let index in noteReferences) {
    if (noteReferences[index] !== `[${notes[index].subId}]`) {
      console.log(`${data.id}: Note references don't match (${noteReferences[index]} != [${notes[index].subId}]).`)
      return
    }
  }

  // test sub texts recursively
  const subPaths = data.texts.map((x: string) => x.replace(/\.json$/, '.mit'))
  for (const subPath of subPaths) {
    testNotesRecursively(subPath, dirname(fullPath))
  }
}
