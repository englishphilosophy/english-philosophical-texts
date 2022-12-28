export type { Analysis, LemmatizeResult, Lemma } from "./bin/types/analysis.ts";

export type {
  Lexicon,
  FlatLexicon,
  ReducedLexicon,
} from "./bin/types/lexicon.ts";

export type {
  Author,
  Block,
  Data,
  Text,
  TextStub,
} from "./bin/types/library.ts";

export { isAuthor, isBlock, isText, isTextStub } from "./bin/types/library.ts";

export type {
  ComplexQuery,
  Operator,
  Query,
  SearchOptions,
  SearchResult,
} from "./bin/types/search.ts";
