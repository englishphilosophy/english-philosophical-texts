// utilities
const doubleNs = [
  "ban",
  "begin",
  "fan",
  "grin",
  "plan",
  "run",
  "shun",
  "sin",
  "skin",
  "span",
  "spin",
  "win",
];

const doubleRs = [
  "abhor",
  "aver",
  "bar",
  "concur",
  "confer",
  "deter",
  "infer",
  "mar",
  "occur",
  "recur",
  "refer",
  "stir",
  "transfer",
];

const prepForEd = (word: string) =>
  word.endsWith("e")
    ? word.replace(/e$/, "")
    : word.endsWith("y")
    ? word.replace(/y$/, "i")
    : doubleNs.includes(word)
    ? word + "n"
    : doubleRs.includes(word)
    ? word + "r"
    : word.match(/[aeiou]t$/)
    ? word + "t"
    : word;

const prepForIng = (word: string) =>
  word.endsWith("ie")
    ? word.replace(/ie$/, "y")
    : word.endsWith("ee") || word === "be"
    ? word
    : doubleNs.includes(word)
    ? word + "n"
    : doubleRs.includes(word)
    ? word + "r"
    : word;

// apostrophe s
const t0 = (word: string) => word + "'s";

// plural noun or 3rd person verb
const t1 = (word: string) =>
  word.endsWith("s") || word.endsWith("ch") || word.endsWith("sh")
    ? word + "es"
    : word + "s";

// other verb forms
const t2 = (word: string) => prepForEd(word) + "ed";

const t3 = (word: string) => t2(word).replace(/ed$/, "'d");

const t4 = (word: string) => prepForIng(word) + "ing";

// nouns from verbs
const t5 = (word: string) => t4(word) + "s";

const t6 = (word: string) => word + "er";
const t7 = (word: string) =>t6(word) + "s";

const t8 = (word: string) =>
  word.endsWith("te")
    ? word.replace(/te$/, "tion")
    : word.endsWith("e")
    ? word + "ation"
    : word.endsWith("t")
    ? word + "ion"
    : word.endsWith("sh")
    ? word.replace(/sh$/, "tion")
    : word + "tion";
const t9 = (word: string) => t8(word) + "s";
