import React from "react"
import { Status } from "http"
import HttpError from "../http_error.ts"
import type { Handler } from "../types/handler.ts"
import { fileResponse, jsonResponse, htmlResponse } from "./response.ts"
import {
  HomePage,
  AuthorPage,
  TextPage,
  isResearchPageId,
  ResearchPage,
  AboutPage,
  isAboutPageId,
  CorpusPage,
  ErrorPage,
} from "./page.tsx"
import * as read from "./read.ts"

export const favicon: Handler = async () =>
  fileResponse(await Deno.readFile("./favicon.ico"), ".ico")

export const css: Handler = async () =>
  fileResponse(await Deno.readFile("./build/css/screen.css"), ".css")

export const javascript: Handler = async () =>
  fileResponse(await Deno.readFile("./build/js/app.js"), ".js")

export const home: Handler = async () =>
  htmlResponse(<HomePage authors={await read.authors()} />, Status.OK)

export const search: Handler = async ({ request }) => {
  const formData = await request.formData()
  return jsonResponse({ error: "Not yet implemented." }, Status.NotImplemented)
}

export const author: Handler = async ({ urlPatternResult }) => {
  const id = urlPatternResult.pathname.groups.id
  const author = await read.author(id)
  const analysis = await read.analysis(id)
  return author && analysis
    ? htmlResponse(<AuthorPage author={author} analysis={analysis} />, Status.OK)
    : error(new HttpError(Status.NotFound, "Author not found."))
}

export const text: Handler = async ({ urlPatternResult }) => {
  const id = urlPatternResult.pathname.groups.id
  const text = await read.text(id, "html")
  const analysis = await read.analysis(id)
  return text && analysis
    ? htmlResponse(<TextPage text={text} analysis={analysis} />, Status.OK)
    : error(new HttpError(Status.NotFound, "Text not found."))
}

export const research: Handler = ({ urlPatternResult }) => {
  // an empty ID maps to the empty string, so we do want || here instead of ??
  const id = urlPatternResult.pathname.groups.id || "research"
  return isResearchPageId(id)
    ? htmlResponse(<ResearchPage id={id} />, Status.OK)
    : error(new HttpError(Status.NotFound, "Page not found."))
}

export const about: Handler = async ({ urlPatternResult }) => {
  // an empty ID maps to the empty string, so we do want || here instead of ??
  const id = urlPatternResult.pathname.groups.id || "about"
  return id === "corpus"
    ? htmlResponse(<CorpusPage authors={await read.authors()} />, Status.OK)
    : isAboutPageId(id)
    ? htmlResponse(<AboutPage id={id} />, Status.OK)
    : error(new HttpError(Status.NotFound, "Page not found."))
}

export const error = (error: unknown): Response => {
  const httpError = error instanceof HttpError ? error : new HttpError(500, "Internal server error")
  console.error(httpError)
  console.log(httpError.stack)
  return htmlResponse(<ErrorPage error={httpError} />, httpError.status)
}
