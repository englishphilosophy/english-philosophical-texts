import { dirname } from "path";
import { ensureDir } from "fs";
import type { Author, Text } from "../types/library.ts";
import type { Analysis } from "../types/analysis.ts";
import type { FlatLexicon } from "../types/lexicon.ts";
import * as read from "../read.ts";

export const buildUnidentifiedWordLists = async (): Promise<void> => {
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
      .replace("build/analysis", "tmp/lemmas")
      .replace(".json", ".txt");
    await ensureDir(dirname(path));
    await Deno.writeTextFile(path, result);
    // keep us informed
    if (id !== "index" && !id.includes(".")) {
      await Deno.stdout.write(new TextEncoder().encode("done.\n"));
    }
  }
};

export const unidentifiedWords = (
  analysis: Analysis,
  flatLexicon: FlatLexicon
): string =>
  analysis.lemmas
    .map((x) => x.label)
    .filter((x) => flatLexicon[x] === undefined)
    .join("\n");
