import { Status } from "http"
import HttpError from "../http_error.ts"
import type { Handler } from "../types/handler.ts"
import * as handler from "./handler.tsx"

const handlers: Array<[string, Handler]> = [
  ["/favicon.ico", handler.favicon],
  ["/js/app.js", handler.javascript],
  ["/", handler.home],
  ["/search", handler.search],
  ["/texts/:id", handler.author],
  ["/texts/:id+", handler.text],
  ["/research{/:id}?", handler.research],
  ["/about{/:id}?", handler.about],
]

export default (request: Request): Response | Promise<Response> => {
  const url = new URL(request.url)

  for (const [pathname, handler] of handlers) {
    const urlPattern = new URLPattern({ pathname })
    const urlPatternResult = urlPattern.exec(url)
    if (urlPatternResult) {
      return handler({ urlPatternResult, request })
    }
  }

  return handler.error(new HttpError(Status.NotFound, "Page not found."))
}
