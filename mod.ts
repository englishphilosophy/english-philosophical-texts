export type {
  Analysis,
  LemmatizeResult,
  Lemma
} from './bin/types/analysis.ts'

export type {
  Lexicon,
  FlatLexicon,
  ReducedLexicon
} from './bin/types/lexicon.ts'

export type {
  Author,
  Block,
  Text,
  TextStub
} from './bin/types/library.ts'

export {
  isAuthor,
  isText,
} from './bin/types/library.ts'

export type {
  ComplexQuery,
  Operator,
  Query,
  SearchOptions,
  Result
} from './bin/types/search.ts'
