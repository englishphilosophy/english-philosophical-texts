import * as read from "../src/tools/read.ts";
import type { Author, TextStub } from "../src/types/library.ts";

const percent = (a: number, b: number) => `${Math.round((a / b) * 100)}%`;

const { texts: authors } = JSON.parse(await read.authors()) as {
  texts: Author[];
};

const men = authors.filter((x) => x.sex === "Male");
const women = authors.filter((x) => x.sex === "Female");
console.log(`Authors: ${authors.length}`);
console.log(
  `Male authors: ${men.length} (${percent(men.length, authors.length)})`
);
console.log(
  `Female authors: ${women.length} (${percent(women.length, authors.length)})`
);

console.log("");

const texts = authors.reduce(
  (acc: TextStub[], current) => [...acc, ...current.texts],
  []
);
const duplicatedTexts = texts.filter((x) => x.duplicate);
const totalTexts = texts.length - duplicatedTexts.length / 2;
console.log(`Texts: ${totalTexts}`);

const maleTexts = men.reduce(
  (acc: TextStub[], current) => [...acc, ...current.texts],
  []
);
const duplicatedMaleTexts = maleTexts.filter((x) => x.duplicate);
const totalMaleTexts = maleTexts.length - duplicatedMaleTexts.length / 2;
console.log(
  `Male authored texts: ${totalMaleTexts} (${percent(
    totalMaleTexts,
    totalTexts
  )})`
);

const femaleTexts = women.reduce(
  (acc: TextStub[], current) => [...acc, ...current.texts],
  []
);
const duplicatedFemaleTexts = femaleTexts.filter((x) => x.duplicate);
const totalFemaleTexts = femaleTexts.length - duplicatedFemaleTexts.length / 2;
console.log(
  `Female authored texts: ${totalFemaleTexts} (${percent(
    totalFemaleTexts,
    totalTexts
  )})`
);

const importedTexts = texts.filter((x) => x.imported);
const duplicatedImportedTexts = importedTexts.filter((x) => x.duplicate);
const totalImportedTexts =
  importedTexts.length - duplicatedImportedTexts.length / 2;
console.log(
  `Imported texts: ${totalImportedTexts} (${percent(
    totalImportedTexts,
    totalTexts
  )})`
);
