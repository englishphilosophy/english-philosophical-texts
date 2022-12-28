import markit from "markit";

export const buildTexts = (): void => {
  // get JSON with raw MIT content for each text from Markit
  console.log("Running Markit to get JSON with raw MIT content...");
  markit.run("texts", "build/mit", textsConfig);

  // get JSON with HTML content for each text from Markit
  console.log("Running Markit to get JSON with HTML content...");
  markit.run("texts", "build/html", {
    ...textsConfig,
    jsonContentFormat: "html",
  });

  // get JSON with plain TXT content for each text from Markit
  console.log("Running Markit to get JSON with TXT content...");
  markit.run("texts", "build/search", {
    ...textsConfig,
    jsonContentFormat: "txt",
  });

  // create record of authors
  console.log("Running Markit on the main index file to get authors data...");
  markit.run("texts/index.mit", "build", authorsConfig);
};

const textsConfig = {
  format: "json",
  textFormat: "stub",
  textStubProperties: [
    "id",
    "imported",
    "duplicate",
    "title",
    "breadcrumb",
    "published",
  ],
  maximumDepth: 1,
};

const authorsConfig = {
  format: "json",
  textFormat: "stub",
  textStubProperties: [
    // Markit doesn't support different stub properties at different
    // hierarchies, so here we have to include all properties for both authors
    // and texts - the `tidyTexts` function removes the extras
    "id",
    "forename",
    "surname",
    "title",
    "birth",
    "death",
    "published",
    "nationality",
    "sex",
    // additional properties for texts
    "imported",
    "duplicate",
    "breadcrumb",
  ],
  maximumDepth: 2,
};
