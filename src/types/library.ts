export type Data = Author | Block | Text | TextStub;

export const isAuthor = (data: Data): data is Author => "forename" in data;

export const isText = (data: Data): data is Text => "blocks" in data;

export const isTextStub = (data: Data): data is TextStub =>
  "breadcrumb" in data;

export const isBlock = (data: Data): data is Block => "content" in data;

export type Author = {
  id: string;
  forename: string;
  surname: string;
  title?: string;
  birth: number;
  death: number;
  published: number;
  nationality: string;
  sex: "Male" | "Female";
  texts: TextStub[];
};

export type TextStub = {
  id: string;
  imported: boolean;
  duplicate?: boolean;
  title: string;
  breadcrumb: string;
  published: number[];
};

export type SourceText = {
  id: string;
  imported: boolean;
  duplicate?: string;
  parent?: string;
  title: string;
  breadcrumb: string;
  published: number[];
  copytext: number[];
  sourceDesc: string;
  sourceUrl: string;
  blocks: Block[];
  texts: TextStub[];
};

export type Text = SourceText & {
  ancestors: [Author, ...TextStub[]];
  prev?: TextStub;
  next?: TextStub;
};

export type Block = {
  id: string;
  author?: string;
  type: string;
  pages?: string;
  speaker?: string;
  content: string;
};
