type TestFunction = (path: string, base?: string) => void

export const testRecursively = (testFunction: TestFunction): void => {
  const authorPaths = Array.from(Deno.readDirSync('texts'))
    .filter(x => x.isDirectory)
    .map(x => `${x.name}/index.mit`)

  for (const authorPath of authorPaths) {
    testFunction(authorPath)
  }
}

export const idIndex = (id: string): number => rn.includes(id) ? rn.indexOf(id) + 1 : parseInt(id)

const rn = [
  'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x',
  'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'
]
