import * as read from "../tools/read.ts";
import { isQueryParams, runQuery } from "../tools/search.ts";
import type { Handler } from "../types/handler.ts";
import { idErrorResponse, okResponse, queryErrorResponse } from "./response.ts";

export const lexicon: Handler = async () => okResponse(await read.lexicon());

export const flatLexicon: Handler = async () =>
  okResponse(await read.flatLexicon());

export const reducedLexicon: Handler = async () =>
  okResponse(await read.reducedLexicon());

export const authors: Handler = async () => {
  const index = JSON.parse(await read.authors());
  return okResponse(index.texts);
};

export const mit: Handler = async ({ urlPatternResult }) => {
  const text = await read.text("mit", urlPatternResult.pathname.groups.id!);
  return text ? okResponse(text[1]) : idErrorResponse();
};

export const html: Handler = async ({ urlPatternResult }) => {
  const id = urlPatternResult.pathname.groups.id!;
  const html = await read.text("html", id);
  return html ? okResponse(html[1]) : idErrorResponse();
};

export const analysis: Handler = async ({ urlPatternResult }) => {
  const id = urlPatternResult.pathname.groups.id!;
  const analysis = await read.text("analysis", id);
  return analysis ? okResponse(analysis[1]) : idErrorResponse();
};

export const search: Handler = async ({ request }) => {
  // check for valid JSON in the request body
  let queryParams: unknown;
  try {
    queryParams = await request.json();
  } catch {
    return queryErrorResponse();
  }

  // check the JSON is in the correct format
  if (!isQueryParams(queryParams)) {
    return queryErrorResponse();
  }

  // run the search query and return the results
  const results = await runQuery(
    queryParams.ids,
    queryParams.query,
    queryParams.options
  );
  return okResponse(results);
};
