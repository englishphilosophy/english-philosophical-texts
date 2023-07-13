import * as read from "./read.ts";
import { okResponse, idErrorResponse, queryErrorResponse } from "./response.ts";
import { isQueryParams, runQuery } from "./search.ts";

export type HandlerArgs = {
  urlPatternResult: URLPatternResult;
  request: Request;
};

export type Handler = (args: HandlerArgs) => Response | Promise<Response>;

export const lexicon = async () => okResponse(await read.lexicon());

export const flatLexicon = async () => okResponse(await read.flatLexicon());

export const reducedLexicon = async () =>
  okResponse(await read.reducedLexicon());

export const authors = async () => okResponse(await read.authors());

export const mit = async ({ urlPatternResult }: HandlerArgs) => {
  const text = await read.text("mit", urlPatternResult.pathname.groups.id!);
  return text ? okResponse(text[1]) : idErrorResponse();
};

export const html = async ({ urlPatternResult }: HandlerArgs) => {
  const id = urlPatternResult.pathname.groups.id!;
  const html = await read.text("html", id);
  return html ? okResponse(html[1]) : idErrorResponse();
};

export const analysis = async ({ urlPatternResult }: HandlerArgs) => {
  const id = urlPatternResult.pathname.groups.id!;
  const analysis = await read.text("analysis", id);
  return analysis ? okResponse(analysis[1]) : idErrorResponse();
};

export const lemmas = async ({ urlPatternResult }: HandlerArgs) => {
  const id = urlPatternResult.pathname.groups.id!;
  const lemmas = await read.text("lemmas", id);
  return lemmas ? okResponse(lemmas[1]) : idErrorResponse();
};

export const search = async ({ request }: HandlerArgs) => {
  // check for valid JSON in the request body
  let queryParams: string;
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
