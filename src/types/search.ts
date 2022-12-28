import type { Block } from "./library.ts";

export type QueryParams = {
  ids: string[];
  query: Query;
  options: SearchOptions;
};

export type Query = string | ComplexQuery;

export type ComplexQuery = {
  query1: Query;
  query2: Query;
  operator: Operator;
};

export type Operator = "and" | "or" | "bot"; // 'bot' means 'but not': `x BOT y := x AND NOT y)

export type SearchOptions = {
  ignorePunctuation: boolean;
  wholeWords: boolean;
  variantSpellings: boolean;
};

export type SearchResult = {
  id: string;
  title: string;
  blocks: Block[];
  results: SearchResult[];
  total: number;
};
