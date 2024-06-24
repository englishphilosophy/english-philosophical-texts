import { Analysis } from "../types.ts";
import type { TFIDFResult } from "../types/tf-idf.ts";

export const calculateTfIdf = (
  document: Analysis,
  corpus: Analysis[]
): TFIDFResult => {
  const result: TFIDFResult = {
    id: document.id,
    lemmas: [],
  };

  for (const lemma of document.lemmas) {
    const df = corpus.filter((document) =>
      document.lemmas.some((l) => l.label === lemma.label)
    ).length;
    const idf = Math.log(corpus.length / df);
    const relativeTfIdf = (lemma.frequency / document.wordCount) * idf;
    const absoluteTfIdf = lemma.frequency * idf;

    result.lemmas.push({
      label: lemma.label,
      relativeTfIdf,
      absoluteTfIdf,
    });
  }

  result.lemmas.sort((x, y) => y.absoluteTfIdf - x.absoluteTfIdf);

  return result;
};
