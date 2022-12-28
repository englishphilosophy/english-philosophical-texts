import { assert, assertEquals } from "testing";
import markit from "markit";

Deno.test({
  name: "index file matches directory structure",
  fn(): void {
    const index = JSON.parse(markit.compile("texts/index.mit", options));
    const authorPaths = Array.from(Deno.readDirSync("texts"))
      .filter((x) => x.isDirectory)
      .map((x) => `${x.name}/index.mit`);
    authorPaths.sort();
    assertEquals(
      authorPaths,
      index.texts.map((x: string) => x.replace(/\.json$/, ".mit"))
    );
  },
});

Deno.test({
  name: "author data is valid",
  fn(): void {
    Array.from(Deno.readDirSync("texts"))
      .filter((x) => x.isDirectory)
      .map((x) => `texts/${x.name}/index.mit`)
      .forEach((path) => {
        const author = JSON.parse(markit.compile(path, options));
        assertValidAuthor(path, author);
      });
  },
});

Deno.test({
  name: "text data is valid",
  fn(): void {
    Array.from(Deno.readDirSync("texts"))
      .filter((x) => x.isDirectory)
      .map((x) => `texts/${x.name}/index.mit`)
      .forEach((path) => {
        const author = JSON.parse(markit.compile(path, options));
        author.texts
          .map(
            (textPath: string) =>
              `${path.replace("index.mit", "")}${textPath.replace(
                ".json",
                ".mit"
              )}`
          )
          .map((fullPath: string) => [
            fullPath,
            JSON.parse(markit.compile(fullPath, options)),
          ])
          .forEach(([fullPath, text]: [string, any]) => {
            assertValidText(fullPath, text, author);
          });
      });
  },
});

const options = { format: "json", textFormat: "path" };

const assertValidAuthor = (path: string, data: any): void => {
  assert(typeof data.id === "string", `bad or missing author id (${path})`);

  assert(
    typeof data.forename === "string",
    `bad or missing forename (${data.id})`
  );

  assert(
    typeof data.surname === "string",
    `bad or missing surname (${data.id})`
  );

  assert(
    data.title === undefined || typeof data.title === "string",
    `bad title (${data.id})`
  );

  assert(
    typeof data.birth === "number",
    `bad or missing birth date isn't a number (${data.id})`
  );

  assert(
    typeof data.death === "number",
    `bad or missing death date isn't a number (${data.id})`
  );

  assert(
    typeof data.published === "number",
    `bad or missing published date (${data.id})`
  );

  assert(
    typeof data.nationality === "string",
    `bad or missing nationality (${data.id})`
  );

  assert(
    data.sex === "Male" || data.sex === "Female",
    `bad or missing sex (${data.id})`
  );

  assert(
    Array.isArray(data.texts) &&
      data.texts.length > 0 &&
      data.texts.every((textPath: any) => typeof textPath === "string"),
    `bad or missing texts (${data.id})`
  );
};

const assertValidText = (path: string, data: any, parentData: any): void => {
  const trimPath = path
    .replace(/^texts\//, "")
    .replace(/\.mit$/, "")
    .replace(/\/index$/, "")
    .replace(/.*?\/.*?\/\.\.\/\.\.\//, "");
  const idPath = data.id.toLowerCase().replace(/\./g, "/");
  assertEquals(
    trimPath,
    idPath,
    `text id and path don't match (${trimPath} / ${idPath})`
  );

  assertValidTextMetadata({ ...parentData, ...data });
  assert(Array.isArray(data.blocks), `blocks is not an array (${data.id})`);
  assertValidBlocks(data);
  assertValidNotes(data);

  data.texts
    .map(
      (textPath: string) =>
        `${path.replace("index.mit", "")}${textPath.replace(".json", ".mit")}`
    )
    .map((fullPath: string) => [
      fullPath,
      JSON.parse(markit.compile(fullPath, options)),
    ])
    .forEach(([fullPath, text]: [string, any]) => {
      assertValidText(fullPath, text, data);
    });
};

const assertValidTextMetadata = (data: any): void => {
  assert(
    data.imported === undefined ||
      data.imported === true ||
      data.imported === false,
    `bad imported flag (${data.id})`
  );

  assert(
    data.duplicate === undefined || typeof data.duplicate === "string",
    `bad duplicate value (${data.id})`
  );

  assert(typeof data.title === "string", `bad or missing title (${data.id})`);

  assert(
    typeof data.breadcrumb === "string",
    `bad or missing breadcrumb (${data.id})`
  );

  assert(
    Array.isArray(data.published) &&
      data.published.length > 0 &&
      data.published.every((published: any) => typeof published === "number"),
    `bad or missing published dates (${data.id})`
  );

  if (data.imported) {
    assert(
      Array.isArray(data.copytext) &&
        data.copytext.length > 0 &&
        data.copytext.every((copytext: any) => typeof copytext === "number"),
      `bad or missing copytext data (${data.id})`
    );

    assert(
      data.sourceUrl === undefined || typeof data.sourceUrl == "string",
      `source URL is not a string (${data.id})`
    );

    assert(
      typeof data.sourceDesc == "string",
      `bad or missing source description (${data.id})`
    );
  }
};

const assertValidBlocks = (data: any): void => {
  if (!data.imported) return;

  assert(data.blocks.length > 0, `imported text has no blocks ${data.id}`);
  assert(
    data.blocks[0].type === "title",
    `first block is not a title (${data.id})`
  );

  if (data.texts.length > 0) return;

  const paragraphs = data.blocks.filter((x: any) => x.type === "paragraph");
  assert(paragraphs.length > 0, `imported text has no paragraphs (${data.id})`);

  let counter = 1;
  let romanNumerals = false;
  for (const index in paragraphs) {
    if (romanNumerals !== isNaN(paragraphs[index].subId)) {
      counter = 1;
    }
    romanNumerals = isNaN(paragraphs[index].subId);
    assert(
      idIndex(paragraphs[index].subId) === counter,
      `non-sequential paragraph id (${paragraphs[index].id ?? data.id})`
    );
    counter += 1;
  }
};

const assertValidNotes = (data: any): void => {
  // if text isn't imported, skip it
  if (!data.imported) return;

  // if text has sub texts, skip it
  if (data.texts.length > 0) return;

  const notes = data.blocks
    .filter((x: any) => x.type === "note")
    .filter((x: any) => x.subId.split(".").length === 1);

  // extract all note references
  const noteReferences = data.blocks.reduce(
    (accumulator: string[], current: any) => {
      const refs = current.content.match(/\[n(\*|\d+)a?\]/g) || [];
      return accumulator.concat(refs);
    },
    []
  );

  // normalize special cases
  switch (data.id) {
    case "Astell.LLG.5":
      noteReferences.pop(); // there are two references to note 1
      break;

    case "Hume.THN.3.2.3": {
      // move n71a to the end
      const n71 = notes.shift();
      const n71a = notes.shift();
      notes.unshift(n71);
      notes.push(n71a);
      break;
    }

    case "Butler.S.1": {
      // move n6a to the end
      const n6 = notes.shift();
      const n6a = notes.shift();
      notes.unshift(n6);
      notes.push(n6a);
      break;
    }

    case "Butler.AR.Diss.2": {
      // move n212a to the end
      const n212 = notes.shift();
      const n212a = notes.shift();
      notes.unshift(n212);
      notes.push(n212a);
      break;
    }
  }

  assert(
    noteReferences.length === notes.length,
    `numbers of references and notes don't match (${data.id})`
  );

  noteReferences.forEach((noteReference: string, index: number) => {
    assert(
      noteReference === `[${notes[index].subId}]`,
      `note references don't match (${data.id})`
    );
  });
};

export const idIndex = (id: string): number =>
  rn.includes(id) ? rn.indexOf(id) + 1 : parseInt(id);

const rn = [
  "i",
  "ii",
  "iii",
  "iv",
  "v",
  "vi",
  "vii",
  "viii",
  "ix",
  "x",
  "xi",
  "xii",
  "xiii",
  "xiv",
  "xv",
  "xvi",
  "xvii",
  "xviii",
  "xix",
  "xx",
];
