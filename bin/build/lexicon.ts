import { parseYaml } from '../../deps.ts'
import type { Lexicon, FlatLexicon, ReducedLexicon } from '../types/lexicon.ts'

export const buildLexicons = async (): Promise<void> => {
  const yaml = await Deno.readTextFile('lexicon.yml')
  const lexicon = parseYaml(yaml) as Lexicon

  await Deno.writeTextFile('build/lexicon.json', JSON.stringify(lexicon))
  await Deno.writeTextFile('build/lexicon-flat.json', JSON.stringify(getFlatLexicon(lexicon)))
  await Deno.writeTextFile('build/lexicon-reduced.json', JSON.stringify(getReducedLexicon(lexicon)))
}

export const getFlatLexicon = (lexicon: Lexicon): FlatLexicon => {
  const flatLexicon: FlatLexicon = {}
  for (const [lemma, words] of Object.entries(lexicon)) {
    flatLexicon[lemma] = lemma
    for (const word of words) {
      flatLexicon[word] = lemma
    }
  }
  return flatLexicon
}

export const getReducedLexicon = (lexicon: Lexicon): ReducedLexicon => {
  const reducedLexicon: ReducedLexicon = []
  for (const [lemma, words] of Object.entries(lexicon)) {
    reducedLexicon.push([lemma, ...words])
  }
  return reducedLexicon
}
