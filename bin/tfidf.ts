import { ensureDir } from "$std/fs/ensure_dir.ts";
import * as read from "../src/tools/read.ts";
import { calculateTfIdf } from "../src/tools/tf-idf.ts";
import { Analysis } from "../src/types.ts";

const ids = JSON.parse(await Deno.readTextFile("tfidf/hume.json"));

const texts: Analysis[] = [];
for (const id of ids) {
  const result = await read.text("analysis", id);
  if (result !== undefined) {
    texts.push(JSON.parse(result[1]));
  } else {
    console.warn(`unknown text id ${id}`);
  }
}

await ensureDir("tfidf/hume");

for (const text of texts) {
  const result = calculateTfIdf(text, texts);
  await Deno.writeTextFile(`tfidf/hume/${text.id}.json`, JSON.stringify(result, null, 2));
}
