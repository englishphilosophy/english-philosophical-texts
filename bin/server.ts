import { ContentType, HttpError, Server, Status, headers } from '../deps.ts'
import * as read from './read.ts'
// import { parseQuery, runQuery } from './server/search.ts'

const route = {
  lexicon: new URLPattern({ pathname: '/lexicon{.json}?' }),
  flatLexicon: new URLPattern({ pathname: '/lexicon-flat{.json}?' }),
  reducedLexicon: new URLPattern({ pathname: '/lexicon-reduced{.json}?' }),
  authors: new URLPattern({ pathname: '/authors{.json}?' }),
  text: new URLPattern({ pathname: '/text/:id+{.json}?' }),
  html: new URLPattern({ pathname: '/html/:id+{.json}?' }),
  analysis: new URLPattern({ pathname: '/analysis/:id+{.json}?' }),
  lemmas: new URLPattern({ pathname: '/lemmas/:id+{.json}?' }),
  search: new URLPattern({ pathname: '/search' })
} as const

const responseInit = {
  ok: { status: 200, headers: headers(ContentType.JSON) },
  notFound: { status: Status.NotFound, headers: headers(ContentType.JSON) },
  badRequest: { status: Status.BadRequest, headers: headers(ContentType.JSON) }
} as const

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url)

  const lexiconMatch = route.lexicon.exec(url)
  if (lexiconMatch) {
    return new Response(await read.lexicon(), responseInit.ok)
  }

  const flatLexiconMatch = route.flatLexicon.exec(url)
  if (flatLexiconMatch) {
    return new Response(await read.flatLexicon(), responseInit.ok)
  }

  const reducedLexiconMatch = route.reducedLexicon.exec(url)
  if (reducedLexiconMatch) {
    return new Response(await read.reducedLexicon(), responseInit.ok)
  }

  const authorsMatch = route.authors.exec(url)
  if (authorsMatch) {
    return new Response(await read.authors(), responseInit.ok)
  }

  const textMatch = route.text.exec(url)
  if (textMatch) {
    const text = await read.text('texts', textMatch.pathname.groups.id)
    return text
      ? new Response(text[1], responseInit.ok)
      : new Response('{"error":"Page not found."}', responseInit.notFound)
  }

  const htmlMatch = route.html.exec(url)
  if (htmlMatch) {
    const html = await read.text('html', htmlMatch.pathname.groups.id)
    return html
      ? new Response(html[1], responseInit.ok)
      : new Response('{"error":"Page not found."}', responseInit.notFound)
  }

  const analysisMatch = route.analysis.exec(url)
  if (analysisMatch) {
    const analysis = await read.text('analysis', analysisMatch.pathname.groups.id)
    return analysis
      ? new Response(analysis[1], responseInit.ok)
      : new Response('{"error":"Page not found."}', responseInit.notFound)
  }

  const lemmasMatch = route.lemmas.exec(url)
  if (lemmasMatch) {
    const lemmas = await read.text('lemmas', lemmasMatch.pathname.groups.id)
    return lemmas
      ? new Response(lemmas[1], responseInit.ok)
      : new Response('{"error":"Page not found."}', responseInit.notFound)
  }

  const searchMatch = route.search.exec(url)
  if (searchMatch) {
    if (request.method === 'POST') {
      //const query = parseQuery(request.formData())
      //return new Response(JSON.stringify(runQuery(query)), responseInit.ok)
      return new Response('{"error":"Not yet implemented."', responseInit.badRequest)
    }

    return new Response('{"error":"Page not found."}', responseInit.notFound)
  }

  return new Response('{"error":"Page not found."}', responseInit.notFound)
}

const onError = (error: unknown): Response => {
  const httpError = error instanceof HttpError ? error : new HttpError(500, 'Internal server error.')
  console.error(error)
  return new Response(`{"error":"${httpError.message}"`, { status: httpError.status, headers: headers(ContentType.JSON) })
}

const app = new Server({ port: 3001, handler, onError })
app.listenAndServe()
