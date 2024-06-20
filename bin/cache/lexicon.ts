import { parse } from "$std/yaml/mod.ts";
import { getFlatLexicon, getReducedLexicon } from "../../src/build/lexicon.ts";
import type { Lexicon } from "../../src/types/lexicon.ts";

export default async (): Promise<void> => {
  const lexiconYaml = await Deno.readTextFile("texts/lexicon.yml");
  const lexicon = parse(lexiconYaml) as Lexicon;
  const flatLexicon = getFlatLexicon(lexicon);
  const reducedLexicon = getReducedLexicon(lexicon);
  await Deno.writeTextFile("cache/lexicon.json", JSON.stringify(lexicon));
  await Deno.writeTextFile(
    "cache/lexicon-flat.json",
    JSON.stringify(flatLexicon)
  );
  await Deno.writeTextFile(
    "cache/lexicon-reduced.json",
    JSON.stringify(reducedLexicon)
  );
};
