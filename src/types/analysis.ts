export type Analysis = {
  id: string;
  documentCount: number;
  importedDocumentCount: number;
  wordCount: number;
  lemmaWordCount: number;
  numberWordCount: number;
  nameWordCount: number;
  foreignWordCount: number;
  citationWordCount: number;
  marginCommentWordCount: number;
  lemmas: Lemma[];
  numbers: string[];
  names: string[];
  foreignText: string[];
  citations: string[];
  marginComments: string[];
};

export type Lemma = {
  label: string;
  frequency: number;
};

export type LemmatizeResult = {
  lemmas: string[];
  numbers: string[];
  names: string[];
  foreignText: string[];
  citations: string[];
  marginComments: string[];
};
