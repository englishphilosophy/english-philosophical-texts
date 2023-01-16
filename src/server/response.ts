import { renderToString } from "react_dom_server"
import { Status } from "http"
import { contentType } from "media_types"

export const htmlResponse = (html: JSX.Element, status: Status = Status.OK): Response =>
  new Response(renderToString(html), responseInit(contentType(".html"), status))

export const jsonResponse = (
  object: Record<string, unknown>,
  status: Status = Status.OK
): Response => new Response(JSON.stringify(object), responseInit(contentType(".json"), status))

export const fileResponse = (file: Uint8Array, ext: string): Response =>
  new Response(file, responseInit(contentType(ext) ?? "application/octet-stream", Status.OK))

export const redirectResponse = (path: string): Response =>
  new Response(null, redirectResponseInit(path))

const responseInit = (contentType: string, status: Status): ResponseInit => {
  const headers = new Headers(headersInit(contentType))
  return { headers, status }
}

const redirectResponseInit = (url: string): ResponseInit => {
  const headers = new Headers()
  headers.append("location", url)
  return { headers, status: Status.Found }
}

const headersInit = (contentType: string): HeadersInit => ({
  "content-type": contentType,
  date: new Date().toUTCString(),
})
