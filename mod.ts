import "https://deno.land/std@0.194.0/dotenv/load.ts";
import type {
  Lexicon,
  FlatLexicon,
  ReducedLexicon,
} from "./src/types/lexicon.ts";
import type { Author, Text } from "./src/types/library.ts";
import type { Analysis, Lemma } from "./src/types/analysis.ts";
import type { QueryParams, SearchResult } from "./src/types/search.ts";

const baseUrl = "https://ept.deno.dev";

export const lexicon = async (): Promise<Lexicon> => {
  const response = await fetch(`${baseUrl}/lexicon`);
  return await response.json();
};

export const flatLexicon = async (): Promise<FlatLexicon> => {
  const response = await fetch(`${baseUrl}/lexicon-flat`);
  return await response.json();
};

export const reducedLexicon = async (): Promise<ReducedLexicon> => {
  const response = await fetch(`${baseUrl}/lexicon-reduced`);
  return await response.json();
};

export const authors = async (): Promise<Author[]> => {
  const response = await fetch(`${baseUrl}/authors`);
  return await response.json();
};

export const author = async (id: string): Promise<Author | undefined> => {
  const response = await fetch(`${baseUrl}/authors`);
  const authors = (await response.json()) as Author[];
  return authors.find((author) => author.id.toLowerCase() === id.toLowerCase());
};

export const text = async (
  id: string,
  type: "html" | "mit" = "html"
): Promise<Text | undefined> => {
  try {
    const sanitizedId = id.toLowerCase().replaceAll(".", "/");
    const response = await fetch(`${baseUrl}/${type}/${sanitizedId}`);
    const result = await response.json();
    return result.error ? undefined : result;
  } catch {
    return undefined;
  }
};

export const analysis = async (id: string): Promise<Analysis | undefined> => {
  try {
    const sanitizedId = id.toLowerCase().replaceAll(".", "/");
    const response = await fetch(`${baseUrl}/analysis/${sanitizedId}`);
    const result = await response.json();
    return result.error ? undefined : result;
  } catch {
    return undefined;
  }
};

export const lemmas = async (id: string): Promise<Lemma[] | undefined> => {
  try {
    const sanitizedId = id.toLowerCase().replaceAll(".", "/");
    const response = await fetch(`${baseUrl}/lemmas/${sanitizedId}`);
    const result = await response.json();
    return result.error ? undefined : result;
  } catch {
    return undefined;
  }
};

export const search = async (
  queryParams: QueryParams
): Promise<SearchResult[]> => {
  const response = await fetch(`${baseUrl}/search`, {
    method: "POST",
    body: JSON.stringify(queryParams),
  });
  return await response.json();
};
