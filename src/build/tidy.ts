import type {
  Author,
  Block,
  SourceText,
  Text,
  TextStub,
} from "../types/library.ts";

export const tidyAuthor = (author: Author): Author => ({
  id: author.id,
  forename: author.forename,
  surname: author.surname,
  title: author.title,
  birth: author.birth,
  death: author.death,
  published: author.published,
  nationality: author.nationality,
  sex: author.sex,
  texts: author.texts.map(tidyTextStub),
});

export const tidyText = (
  sourceText: SourceText,
  ancestors: [Author, ...TextStub[]],
  prev: TextStub | null,
  next: TextStub | null
): Text => ({
  // get rid of unwanted properties, and add ancestors, prev, and next
  id: sourceText.id,
  imported: !!sourceText.imported,
  duplicate: sourceText.duplicate,
  parent: sourceText.parent,
  title: sourceText.title,
  breadcrumb: sourceText.breadcrumb,
  published: sourceText.published,
  copytext: sourceText.copytext,
  sourceDesc: sourceText.sourceDesc,
  sourceUrl: sourceText.sourceUrl,
  blocks: sourceText.blocks,
  texts: sourceText.texts.map(tidyTextStub),
  ancestors,
  prev: prev ?? undefined,
  next: next ?? undefined,
});

// get rid of unwanted properties
export const tidyTextStub = (textStub: TextStub): TextStub => ({
  id: textStub.id,
  imported: !!textStub.imported,
  duplicate: textStub.duplicate,
  title: textStub.title,
  breadcrumb: textStub.breadcrumb,
  published: textStub.published,
});

export const tidyHtml = (
  text: SourceText,
  ancestors: [Author, ...TextStub[]],
  prev: TextStub | null,
  next: TextStub | null
): Text => ({
  ...tidyText(text, ancestors, prev, next),
  blocks: text.blocks.map(cleanHtml),
});

export const tidySearch = (
  text: SourceText,
  ancestors: [Author, ...TextStub[]],
  prev: TextStub | null,
  next: TextStub | null
): Text => ({
  ...tidyText(text, ancestors, prev, next),
  blocks: text.blocks.map(cleanSearch),
});

export const cleanHtml = (block: Block): Block => ({
  ...block,
  content: block.content.replaceAll("`", ""), // remove disambiguating `
});

export const cleanSearch = (block: Block): Block => ({
  ...block,
  content: block.content
    .replaceAll("`", "") // remove disambiguating `
    .replace(/\[n[0-9*]+\]/g, "") // remove note anchors
    .replace(/#.*?#/g, ""), // remove margin comments
});
