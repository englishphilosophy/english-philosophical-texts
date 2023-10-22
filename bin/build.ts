import { emptyDir } from "$std/fs/mod.ts";
import { buildBaseAnalyses } from "../src/build/analysis.ts";
import { buildLexicons } from "../src/build/lexicon.ts";
import { buildSentences } from "../src/build/sentences.ts";
import { buildTexts } from "../src/build/texts.ts";
import { buildTfIdfData } from "../src/build/tfidf.ts";
import { tidyTexts } from "../src/build/tidy.ts";
import { buildTopics } from "../src/build/topics.ts";
import { buildUnidentifiedWordLists } from "../src/build/unidentified.ts";

await emptyDir("build");
await emptyDir("tmp");

// lexicon.yml -> build/lexicon.json
// lexicon.yml -> build/lexicon-flat.json
// lexicon.yml -> build/lexicon-reduced.json
await buildLexicons();

// texts -> build/mit (using Markit)
// texts -> build/html (using Markit)
// texts -> build/search (using Markit)
// texts -> build/index.json (using Markit)
buildTexts();

// tidy authors and texts
await tidyTexts();

// build/search -> build/sentences
await buildSentences();

// build/texts -> build/analysis, build/lemmas
await buildBaseAnalyses();
await buildTfIdfData();

// build/analysis -> build/lemmas
await buildUnidentifiedWordLists();

// build/analysis -> build/topics
await buildTopics();
