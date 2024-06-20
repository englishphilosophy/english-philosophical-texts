import { emptyDir } from "$std/fs/mod.ts";
import buildAnalysisCache from "./cache/analysis.ts";
import buildLexiconCache from "./cache/lexicon.ts";
import buildTextsCache from "./cache/texts.ts";
import buildUnidentifiedWordListsCache from "./cache/unidentified.ts";

await emptyDir("cache");
await buildLexiconCache();
await buildTextsCache();
await buildAnalysisCache();
await buildUnidentifiedWordListsCache();
