import type { Analysis } from "../types/analysis.ts";
import type { FlatLexicon } from "../types/lexicon.ts";

export const unidentifiedWords = (
  analysis: Analysis,
  flatLexicon: FlatLexicon
): string =>
  analysis.lemmas
    .map((x) => x.label)
    .filter((x) => flatLexicon[x] === undefined)
    .join("\n");
