import { ensureDir } from "$std/fs/mod.ts";
import { dirname } from "$std/path/mod.ts";
import markit from "markit";
import {
  tidyAuthor,
  tidyHtml,
  tidySearch,
  tidyText,
} from "../../src/build/tidy.ts";
import * as read from "../../src/tools/read.ts";
import type { Author, SourceText, TextStub } from "../../src/types/library.ts";

export default async (): Promise<void> => {
  console.log("Running Markit to get JSON with raw MIT content...");
  markit.run("texts", "cache/mit", textsConfig);

  console.log("Running Markit to get JSON with HTML content...");
  markit.run("texts", "cache/html", {
    ...textsConfig,
    jsonContentFormat: "html",
  });

  console.log("Running Markit to get JSON with TXT content...");
  markit.run("texts", "cache/search", {
    ...textsConfig,
    jsonContentFormat: "txt",
  });

  console.log("Running Markit on the main index file to get authors data...");
  markit.run("texts/index.mit", "cache", authorsConfig);

  console.log("Tidying Markit output...");
  const { texts: authors } = JSON.parse(await read.authors()) as {
    texts: Author[];
  };
  for (const author of authors) {
    processAuthor(author);
  }
  console.log("Markit output tidied.");
};

const textsConfig = {
  format: "json",
  textFormat: "stub",
  textStubProperties: [
    "id",
    "imported",
    "duplicate",
    "title",
    "breadcrumb",
    "published",
  ],
  maximumDepth: 1,
};

const authorsConfig = {
  format: "json",
  textFormat: "stub",
  textStubProperties: [
    // Markit doesn't support different stub properties at different
    // hierarchies, so here we have to include all properties for both authors
    // and texts - the `tidyTexts` function removes the extras
    "id",
    "forename",
    "surname",
    "title",
    "birth",
    "death",
    "published",
    "nationality",
    "sex",
    // additional properties for texts
    "imported",
    "duplicate",
    "breadcrumb",
  ],
  maximumDepth: 2,
};

const processAuthor = async (author: Author): Promise<void> => {
  // get rid of unwanted properties
  await Deno.writeTextFile(
    `cache/mit/${author.id.toLowerCase()}/index.json`,
    JSON.stringify(tidyAuthor(author))
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
