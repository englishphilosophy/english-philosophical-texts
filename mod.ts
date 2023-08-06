import type {
  Lexicon,
  FlatLexicon,
  ReducedLexicon,
} from "./src/types/lexicon.ts";
import type { Author, Text } from "./src/types/library.ts";
import type { Analysis, Lemma } from "./src/types/analysis.ts";
import type { QueryParams, SearchResult } from "./src/types/search.ts";

export type { Analysis, Lemma, LemmatizeResult } from "./src/types/analysis.ts";

export type {
  Lexicon,
  FlatLexicon,
  ReducedLexicon,
} from "./src/types/lexicon.ts";

export type {
  Data,
  Author,
  Block,
  SourceText,
  Text,
  TextStub,
} from "./src/types/library.ts";

export { isAuthor, isText, isTextStub, isBlock } from "./src/types/library.ts";

export type {
  Operator,
  Query,
  QueryParams,
  SearchOptions,
  SearchResult,
} from "./src/types/search.ts";

let base = "http://localhost:3001";

export const setBase = (newBase: string): void => {
  base = newBase;
};

export const lexicon = async (): Promise<Lexicon> => {
  const response = await fetch(`${base}/lexicon`);
  return await response.json();
};

export const flatLexicon = async (): Promise<FlatLexicon> => {
  const response = await fetch(`${base}/lexicon-flat`);
  return await response.json();
};

export const reducedLexicon = async (): Promise<ReducedLexicon> => {
  const response = await fetch(`${base}/lexicon-reduced`);
  return await response.json();
};

export const authors = async (): Promise<Author[]> => {
  const response = await fetch(`${base}/authors`);
  return await response.json();
};

export const author = async (id: string): Promise<Author | undefined> => {
  const response = await fetch(`${base}/authors`);
  const authors = (await response.json()) as Author[];
  return authors.find((author) => author.id.toLowerCase() === id.toLowerCase());
};

export const text = async (
  id: string,
  type: "html" | "mit" = "html"
): Promise<Text | undefined> => {
  try {
    const sanitizedId = id.toLowerCase().replaceAll(".", "/");
    const response = await fetch(`${base}/${type}/${sanitizedId}`);
    const result = await response.json();
    return result.error ? undefined : result;
  } catch {
    return undefined;
  }
};

export const analysis = async (id: string): Promise<Analysis | undefined> => {
  try {
    const sanitizedId = id.toLowerCase().replaceAll(".", "/");
    const response = await fetch(`${base}/analysis/${sanitizedId}`);
    const result = await response.json();
    return result.error ? undefined : result;
  } catch {
    return undefined;
  }
};

export const lemmas = async (id: string): Promise<Lemma[] | undefined> => {
  try {
    const sanitizedId = id.toLowerCase().replaceAll(".", "/");
    const response = await fetch(`${base}/lemmas/${sanitizedId}`);
    const result = await response.json();
    return result.error ? undefined : result;
  } catch {
    return undefined;
  }
};

export const search = async (
  queryParams: QueryParams
): Promise<SearchResult[]> => {
  const response = await fetch(`${base}/search`, {
    method: "POST",
    body: JSON.stringify(queryParams),
  });
  return await response.json();
};
