import { ensureDir } from "$std/fs/mod.ts";
import { dirname } from "$std/path/mod.ts";
import { analyse } from "../../src/build/analysis.ts";
import * as read from "../../src/tools/read.ts";
import type { Analysis } from "../../src/types/analysis.ts";
import type { FlatLexicon } from "../../src/types/lexicon.ts";
import type { Author, Text } from "../../src/types/library.ts";

export default async (): Promise<void> => {
  const flatLexicon = JSON.parse(await read.flatLexicon()) as FlatLexicon;

  console.log("Analysing texts...");
  await analyseData("index", flatLexicon);
  console.log("  base analysis complete.");
};

const analyseData = async (
  id: string,
  flatLexicon: FlatLexicon
): Promise<void> => {
  // fetch the data (author or text)
  const dataRead = await read.text("mit", id);
  if (dataRead) {
    // parse the data
    const [dataPath, dataRaw] = dataRead;
    const analysisPath = dataPath.replace("cache/mit", "cache/analysis");
    const data = JSON.parse(dataRaw) as Author | Text;
    // keep us informed
    if (data.id.includes(".")) {
      await Deno.stdout.write(new TextEncoder().encode("."));
    } else if (id !== "index") {
      await Deno.stdout.write(new TextEncoder().encode(`    ${data.id}`));
    }
    // analyse subtexts first
    for (const subText of data.texts) {
      if (
        id === "index" ||
        subText.id.split(".")[0] === data.id.split(".")[0]
      ) {
        // skip over subtexts by different authors
        await analyseData(subText.id, flatLexicon);
      }
    }
    // now analyse this author/text (using the subAnalyses created first)
    const subAnalyses = (
      await Promise.all(
        data.texts.map(async (text) => await read.text("analysis", text.id))
      )
    )
      .filter((x): x is [string, string] => x !== undefined)
      .map((x) => JSON.parse(x[1]) as Analysis);
    const result = analyse(data, subAnalyses, flatLexicon);
    // save the result
    await ensureDir(dirname(analysisPath));
    await Deno.writeTextFile(analysisPath, JSON.stringify(result));
    // keep us informed
    if (id !== "index" && !id.includes(".")) {
      await Deno.stdout.write(new TextEncoder().encode("done\n"));
    }
  }
};
