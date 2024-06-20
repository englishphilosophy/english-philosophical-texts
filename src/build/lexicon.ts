import type { FlatLexicon, Lexicon, ReducedLexicon } from "../types/lexicon.ts";

export const getFlatLexicon = (lexicon: Lexicon): FlatLexicon => {
  const flatLexicon: FlatLexicon = {};
  for (const [lemma, words] of Object.entries(lexicon)) {
    flatLexicon[lemma] = lemma;
    for (const word of words) {
      flatLexicon[word] = lemma;
    }
  }
  return flatLexicon;
};

export const getReducedLexicon = (lexicon: Lexicon): ReducedLexicon => {
  const reducedLexicon: ReducedLexicon = [];
  for (const [lemma, words] of Object.entries(lexicon)) {
    reducedLexicon.push([lemma, ...words]);
  }
  return reducedLexicon;
};
