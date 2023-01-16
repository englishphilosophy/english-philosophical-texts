import React, { type FC } from "react"
import HttpError from "../http_error.ts"
import { Analysis } from "../types/analysis.ts"
import { Author, Text } from "../types/library.ts"
import Page from "../style/page.tsx"
import Controls from "../elements/controls.tsx"
import Library from "../elements/library.tsx"
import { AuthorDisplay, TextDisplay } from "../elements/reader.tsx"
import Breadcrumb from "../elements/breadcrumb.tsx"
import {
  About,
  Corpus,
  Principles,
  Permissions,
  Contact,
  Support,
  aboutPages,
  aboutTitles,
} from "../content/about.tsx"
import {
  Research,
  Similarity,
  Topics,
  researchTitles,
  researchPages,
} from "../content/research.tsx"
import Info from "../elements/info.tsx"

export const HomePage: FC<{ authors: Author[] }> = ({ authors }) => (
  <Page section="Texts" bodyClass="home" nav={<Controls />}>
    <Library authors={authors} />
  </Page>
)

export const AuthorPage: FC<{ author: Author; analysis: Analysis }> = ({ author, analysis }) => (
  <Page section="Texts" nav={<Breadcrumb ancestors={[author]} />}>
    <AuthorDisplay author={author} analysis={analysis} />
  </Page>
)

export const TextPage: FC<{ text: Text; analysis: Analysis }> = ({ text, analysis }) => (
  <Page
    section="Texts"
    nav={<Breadcrumb ancestors={text.ancestors} prev={text.prev} next={text.next} />}
  >
    <TextDisplay text={text} analysis={analysis} />
  </Page>
)

const researchPageIds = ["research", "similarity", "topics"] as const

export type ResearchPageId = typeof researchPageIds[number]

export const isResearchPageId = (id: string): id is ResearchPageId =>
  researchPageIds.includes(id as ResearchPageId)

export const ResearchPage: FC<{ id?: ResearchPageId }> = ({ id = "research" }) => (
  <Page
    section="Research"
    nav={
      <hgroup>
        <h1>Research: {researchTitles[id]}</h1>
      </hgroup>
    }
  >
    <Info pageId={id} pages={researchPages}>
      {id === "research" ? <Research /> : id === "similarity" ? <Similarity /> : <Topics />}
    </Info>
  </Page>
)

const aboutPageIds = ["about", "principles", "permissions", "contact", "support"] as const

export type AboutPageId = typeof aboutPageIds[number]

export const isAboutPageId = (id: string): id is AboutPageId =>
  aboutPageIds.includes(id as AboutPageId)

export const AboutPage: FC<{ id?: AboutPageId }> = ({ id = "about" }) => (
  <Page
    section="About"
    nav={
      <hgroup>
        <h1>About: {aboutTitles[id]}</h1>
      </hgroup>
    }
  >
    <Info pageId={id} pages={aboutPages}>
      {id === "about" ? (
        <About />
      ) : id === "contact" ? (
        <Contact />
      ) : id === "permissions" ? (
        <Permissions />
      ) : id === "principles" ? (
        <Principles />
      ) : id === "support" ? (
        <Support />
      ) : null}
    </Info>
  </Page>
)

export const CorpusPage: FC<{ authors: Author[] }> = ({ authors }) => (
  <Page
    section="About"
    nav={
      <hgroup>
        <h1>About {aboutTitles.corpus}</h1>
      </hgroup>
    }
  >
    <Info pageId="corpus" pages={aboutPages}>
      <Corpus authors={authors} />
    </Info>
  </Page>
)

export const ErrorPage: FC<{ error: HttpError }> = ({ error }) => (
  <Page section="Error">
    <h1>{error.status} Error</h1>
    <p>{error.message}</p>
  </Page>
)
