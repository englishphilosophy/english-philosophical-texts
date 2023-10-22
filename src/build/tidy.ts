import { dirname } from "$std/path/mod.ts";
import { ensureDir } from "$std/fs/mod.ts";
import type {
  Author,
  Block,
  SourceText,
  Text,
  TextStub,
} from "../types/library.ts";
import * as read from "../serve/read.ts";

export const tidyTexts = async (): Promise<void> => {
  console.log("Tidying Markit output...");

  const { texts: authors } = JSON.parse(await read.authors()) as {
    texts: Author[];
  };
  for (const author of authors) {
    await processAuthor(author);
  }

  console.log("Markit output tidied.");
};

const processAuthor = async (author: Author): Promise<void> => {
  // get rid of unwanted properties
  await Deno.writeTextFile(
    `build/mit/${author.id.toLowerCase()}/index.json`,
    JSON.stringify({
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
    })
  );

  // tidy texts recursively
  for (let index = 0; index < author.texts.length; index += 1) {
    await processText(
      [author],
      null,
      null,
      author.texts[index],
      index,
      author.texts
    );
  }
};

const processText = async (
  ancestors: [Author, ...TextStub[]],
  higherPrev: TextStub | null,
  higherNext: TextStub | null,
  textStub: TextStub,
  index: number,
  textStubs: TextStub[]
): Promise<void> => {
  const prev = textStubs[index - 1] ?? higherPrev;
  const next = textStubs[index + 1] ?? higherNext;

  const mitRead = await read.text("mit", textStub.id);
  const htmlRead = await read.text("html", textStub.id);
  const searchRead = await read.text("search", textStub.id);

  if (mitRead && htmlRead && searchRead) {
    const text = JSON.parse(mitRead[1]) as SourceText;
    const html = JSON.parse(htmlRead[1]) as SourceText;
    const search = JSON.parse(searchRead[1]) as SourceText;

    await ensureDir(dirname(mitRead[0]));
    await ensureDir(dirname(htmlRead[0]));
    await ensureDir(dirname(searchRead[0]));

    await Deno.writeTextFile(
      mitRead[0],
      JSON.stringify(tidyText(text, ancestors, prev, next))
    );
    await Deno.writeTextFile(
      htmlRead[0],
      JSON.stringify(tidyHtml(html, ancestors, prev, next))
    );
    await Deno.writeTextFile(
      searchRead[0],
      JSON.stringify(tidySearch(search, ancestors, prev, next))
    );

    for (let index = 0; index < text.texts.length; index += 1) {
      await processText(
        [...ancestors, textStub],
        textStub,
        next,
        text.texts[index],
        index,
        text.texts
      );
    }
  }
};

export const tidyText = (
  {
    id,
    imported,
    duplicate,
    parent,
    title,
    breadcrumb,
    published,
    copytext,
    sourceDesc,
    sourceUrl,
    blocks,
    texts,
  }: SourceText,
  ancestors: [Author, ...TextStub[]],
  prev: TextStub | null,
  next: TextStub | null
): Text => ({
  // get rid of unwanted properties, and add ancestors, prev, and next
  id,
  imported: !!imported,
  duplicate,
  parent,
  title,
  breadcrumb,
  published,
  copytext,
  sourceDesc,
  sourceUrl,
  blocks,
  texts: texts.map(tidyTextStub),
  ancestors,
  prev: prev ?? undefined,
  next: next ?? undefined,
});

// get rid of unwanted properties
export const tidyTextStub = ({
  id,
  imported,
  duplicate,
  title,
  breadcrumb,
  published,
}: TextStub): TextStub => ({
  id,
  imported: !!imported,
  duplicate,
  title,
  breadcrumb,
  published,
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
