import { ensureDir } from "$std/fs/ensure_dir.ts";
import * as read from "../src/tools/read.ts";
import type { Analysis } from "../src/types.ts";
import type { TFIDFResult } from "../src/types/tf-idf.ts";

const calculateCloseness = (source: Analysis, target: TFIDFResult): number => {
  let result = 0;
  for (const lemma of source.lemmas) {
    const targetTfIdf = target.lemmas.find((l) => l.label = lemma.label)?.relativeTfIdf ?? 0;
    result += lemma.frequency * targetTfIdf;
  }
  return result;
};

const { sourceIds, targetIds } = JSON.parse(await Deno.readTextFile("similarity/hume.json"));

await ensureDir("similarity/hume");

type Result = {
  id: string;
  closeness: number;
}

for (const sourceId of sourceIds) {
  const results: Result[] = [];

  const readSourceResult = await read.text("analysis", sourceId);
  const sourceAnalysis = JSON.parse(readSourceResult![1]) as Analysis;
  const sourceTFIDF = JSON.parse(await Deno.readTextFile(`tfidf/hume/${sourceId}.json`)) as TFIDFResult;

  for (const targetId of targetIds) {
    const readTargetResult = await read.text("analysis", targetId);
    const targetAnalysis = JSON.parse(readTargetResult![1]) as Analysis;
    const targetTFIDF = JSON.parse(await Deno.readTextFile(`tfidf/hume/${targetId}.json`)) as TFIDFResult;

    const closeness = calculateCloseness(sourceAnalysis, targetTFIDF);
    results.push({ id: targetId, closeness });
  }

  results.sort((x, y) => y.closeness - x.closeness);
  await Deno.writeTextFile(`similarity/hume/${sourceId}.json`, JSON.stringify(results, null, 2));
}
