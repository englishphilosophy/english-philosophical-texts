export type TextType = 'analysis' | 'html' | 'lemmas' | 'search' | 'texts'

export const lexicon = async (): Promise<string> => await Deno.readTextFile('build/lexicon.json')

export const flatLexicon = async (): Promise<string> => await Deno.readTextFile('build/lexicon-flat.json')

export const reducedLexicon = async (): Promise<string> => await Deno.readTextFile('build/lexicon-reduced.json')

export const authors = async (): Promise<string> => await Deno.readTextFile('build/index.json')

export const text = async (textType: TextType, id: string): Promise<[string, string] | undefined> => {
  const sanitizedId = id.toLowerCase().replaceAll('.', '/')
  try {
    const path = `build/${textType}/${sanitizedId}.json`
    return [path, await Deno.readTextFile(path)]
  } catch {
    try {
      const path = `build/${textType}/${sanitizedId}/index.json`
      return [path, await Deno.readTextFile(path)]
    } catch {
      return undefined
    }
  }
}

export const ancestors = async (textType: TextType, id: string): Promise<string> => {
  const ancestorIds = id.split('.').map((_, index, array) => array.slice(0, index + 1).join('.'))
  const ancestorTexts = await Promise.all(ancestorIds.map(async (id) => await text(textType, id)))
  return `[${ancestorTexts.filter(x => x !== undefined).join(',')}]`
}
