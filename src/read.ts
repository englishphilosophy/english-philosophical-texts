export type TextType = "analysis" | "html" | "lemmas" | "mit" | "search";

export const lexicon = async (): Promise<string> =>
  await Deno.readTextFile("build/texts/lexicon.json");

export const flatLexicon = async (): Promise<string> =>
  await Deno.readTextFile("build/texts/lexicon-flat.json");

export const reducedLexicon = async (): Promise<string> =>
  await Deno.readTextFile("build/texts/lexicon-reduced.json");

export const authors = async (): Promise<string> =>
  await Deno.readTextFile("build/texts/index.json");

export const text = async (
  textType: TextType,
  id: string
): Promise<[string, string] | undefined> => {
  const sanitizedId = id.toLowerCase().replaceAll(".", "/");
  try {
    const path = `build/texts/${textType}/${sanitizedId}.json`;
    return [path, await Deno.readTextFile(path)];
  } catch {
    try {
      const path = `build/texts/${textType}/${sanitizedId}/index.json`;
      return [path, await Deno.readTextFile(path)];
    } catch {
      return undefined;
    }
  }
};
