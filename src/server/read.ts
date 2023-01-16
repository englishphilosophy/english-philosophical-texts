import { Analysis } from "../types/analysis.ts"
import { FlatLexicon, Lexicon, ReducedLexicon } from "../types/lexicon.ts"
import { Author, Text } from "../types/library.ts"

export const lexicon = (): Promise<Lexicon> => fetchData("lexicon") as Promise<Lexicon>

export const flatLexicon = (): Promise<FlatLexicon> =>
  fetchData("lexicon-flat") as Promise<FlatLexicon>

export const reducedLexicon = (): Promise<ReducedLexicon> =>
  fetchData("lexicon-reduced") as Promise<ReducedLexicon>

export const authors = async (): Promise<Author[]> =>
  ((await fetchData("index")) as { texts: Author[] }).texts

export const author = async (id: string): Promise<Author | undefined> => {
  const sanitizedId = id.toLowerCase().replaceAll(".", "")
  try {
    return (await fetchData(`html/${sanitizedId}`)) as Author
  } catch {
    return undefined
  }
}

export const text = async (
  id: string,
  type: "html" | "mit" = "html"
): Promise<Text | undefined> => {
  try {
    return (await fetchData(`${type}/${id.toLowerCase().replaceAll(".", "/")}`)) as Text
  } catch {
    return undefined
  }
}

export const analysis = async (id: string): Promise<Analysis | undefined> => {
  try {
    return (await fetchData(`analysis/${id.toLowerCase().replaceAll(".", "/")}`)) as Analysis
  } catch {
    return undefined
  }
}

const fetchData = async (path: string): Promise<unknown> => {
  try {
    const json = await Deno.readTextFile(`./build/texts/${path}.json`)
    return JSON.parse(json)
  } catch {
    const json = await Deno.readTextFile(`./build/texts/${path}/index.json`)
    return JSON.parse(json)
  }
}
