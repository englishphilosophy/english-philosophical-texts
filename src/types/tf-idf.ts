export type TFIDFResult = {
  id: string;
  lemmas: LemmaWithTFIDF[];
};

export type LemmaWithTFIDF = {
  label: string;
  relativeTfIdf: number;
  absoluteTfIdf: number;
};
