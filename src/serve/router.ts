import { routeErrorResponse } from "./response.ts";
import type { Handler } from "../types/handler.ts";
import {
  lexicon,
  flatLexicon,
  reducedLexicon,
  authors,
  mit,
  html,
  analysis,
  lemmas,
  search,
} from "./handlers.ts";

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
  ["/lemmas/:id+{.json}?", lemmas],
  ["/search", search],
];
