import { ensureDir } from "$std/fs/mod.ts";
import { dirname } from "$std/path/mod.ts";
import { unidentifiedWords } from "../../src/build/unidentified.ts";
import * as read from "../../src/tools/read.ts";
import type { Analysis } from "../../src/types/analysis.ts";
import type { FlatLexicon } from "../../src/types/lexicon.ts";
import type { Author, Text } from "../../src/types/library.ts";

export default async (): Promise<void> => {
  const flatLexicon = JSON.parse(await read.flatLexicon()) as FlatLexicon;

  console.log("Generating lists of unidentified words...");
  await generateUnidentifiedWordLists("index", flatLexicon);
  console.log("  lists of unidentified words created.");
};

const generateUnidentifiedWordLists = async (
  id: string,
  flatLexicon: FlatLexicon
): Promise<void> => {
  // fetch the data (author or text)
  const dataRead = await read.text("mit", id);
  // fetch the analysis
  const analysisRead = await read.text("analysis", id);
  if (dataRead && analysisRead) {
    // parse the data
    const data = JSON.parse(dataRead[1]) as Author | Text;
    // keep us informed
    if (data.id.includes(".")) {
      await Deno.stdout.write(new TextEncoder().encode("."));
    } else if (id !== "index") {
      await Deno.stdout.write(new TextEncoder().encode(`    ${data.id}`));
    }
    // generate word lists for subtexts
    for (const subText of data.texts) {
      if (id === "index" || subText.id.split(".")[0] === id.split(".")[0]) {
        // skip over subtexts by different authors
        await generateUnidentifiedWordLists(subText.id, flatLexicon);
      }
    }
    // generate word list for this author/text
    const [analysisPath, analysisRaw] = analysisRead;
    const analysis = JSON.parse(analysisRaw) as Analysis;
    const result = unidentifiedWords(analysis, flatLexicon);
    const path = analysisPath
      .replace("cache/analysis", "cache/lemmas")
      .replace(".json", ".txt");
    await ensureDir(dirname(path));
    await Deno.writeTextFile(path, result);
    // keep us informed
    if (id !== "index" && !id.includes(".")) {
      await Deno.stdout.write(new TextEncoder().encode("done.\n"));
    }
  }
};
