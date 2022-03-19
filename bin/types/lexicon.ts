// map of lemmas to their forms
export type Lexicon = Record<string, string[]>

// map of forms to their lemmas
export type FlatLexicon = Record<string, string>

// array of lemmas with all their forms
export type ReducedLexicon = string[][]
