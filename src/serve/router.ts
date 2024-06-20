import type { Handler } from "../types/handler.ts";
import {
  analysis,
  authors,
  flatLexicon,
  html,
  lexicon,
  mit,
  reducedLexicon,
  search,
} from "./handlers.ts";
import { routeErrorResponse } from "./response.ts";

export default (request: Request): Response | Promise<Response> => {
  const url = new URL(request.url);

  for (const [pathname, handler] of handlers) {
    const urlPattern = new URLPattern({ pathname });
    const urlPatternResult = urlPattern.exec(url);
    if (urlPatternResult) {
      return handler({ urlPatternResult, request });
    }
  }

  return routeErrorResponse();
};

const handlers: Array<[string, Handler]> = [
  ["/", authors],
  ["/index{.json}?", authors],
  ["/authors{.json}?", authors],
  ["/lexicon{.json}?", lexicon],
  ["/lexicon-flat{.json}?", flatLexicon],
  ["/lexicon-reduced{.json}?", reducedLexicon],
  ["/mit/:id+{.json}?", mit],
  ["/html/:id+{.json}?", html],
  ["/analysis/:id+{.json}?", analysis],
  ["/search", search],
];
