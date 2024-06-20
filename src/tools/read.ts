export type TextType = "analysis" | "html" | "mit" | "search";

export const lexicon = async (): Promise<string> =>
  await Deno.readTextFile("cache/lexicon.json");

export const flatLexicon = async (): Promise<string> =>
  await Deno.readTextFile("cache/lexicon-flat.json");

export const reducedLexicon = async (): Promise<string> =>
  await Deno.readTextFile("cache/lexicon-reduced.json");

export const authors = async (): Promise<string> =>
  await Deno.readTextFile("cache/index.json");

export const text = async (
  textType: TextType,
  id: string
): Promise<[string, string] | undefined> => {
  const sanitizedId = id.toLowerCase().replaceAll(".", "/");
  try {
    const path = `cache/${textType}/${sanitizedId}.json`;
    return [path, await Deno.readTextFile(path)];
  } catch {
    try {
      const path = `cache/${textType}/${sanitizedId}/index.json`;
      return [path, await Deno.readTextFile(path)];
    } catch {
      return undefined;
    }
  }
};
