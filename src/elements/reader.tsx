import React, { PropsWithChildren, type FC } from "react";
import type { Analysis } from "../types/analysis.ts";
import type { Author, Text } from "../types/library.ts";
import type { AuthorSection, TextSection } from "../types/section.ts";
import Blocks from "./blocks.tsx";
import TOC from "./toc.tsx";
import { Search } from "./search.tsx";
import { AuthorSummary, TextSummary } from "./about.tsx";
import { Summary, Names, Citations, ForeignText, Lemmas } from "./usage.tsx";

export const TextDisplay: FC<{ text: Text; analysis: Analysis }> = ({
  text,
  analysis,
}) => (
  <div className="reader">
    <Section>
      <TextContent section="title" text={text} analysis={analysis} />
    </Section>
    <Section>
      <TextSelect section="content" text={text} />
      <TextContent section="content" text={text} analysis={analysis} />
    </Section>
  </div>
);

export const TextContent: FC<{
  section: TextSection;
  text: Text;
  analysis: Analysis;
}> = ({ section, text, analysis }) => {
  switch (section) {
    case "title":
      return <Blocks blocks={text.blocks.slice(0, 1)} />;

    case "content":
      return text.texts.length ? (
        <TOC text={text} />
      ) : (
        <Blocks blocks={text.blocks.slice(1)} />
      );

    case "search":
      return <Search id={text.id} />;

    case "summary":
      return <Summary analysis={analysis} />;

    case "names":
      return <Names analysis={analysis} />;

    case "citations":
      return <Citations analysis={analysis} />;

    case "foreign":
      return <ForeignText analysis={analysis} />;

    case "lemmas":
      return <Lemmas analysis={analysis} />;

    case "about":
      return <TextSummary text={text} />;
  }
};

export const AuthorDisplay: FC<{ author: Author; analysis: Analysis }> = ({
  author,
  analysis,
}) => (
  <div className="reader">
    <Section>
      <AuthorContent section="about" author={author} analysis={analysis} />
    </Section>
    <Section>
      <AuthorSelect section="works" author={author} />
      <AuthorContent section="works" author={author} analysis={analysis} />
    </Section>
  </div>
);

export const AuthorContent: FC<{
  section: AuthorSection;
  author: Author;
  analysis: Analysis;
}> = ({ author, analysis, section }) => {
  switch (section) {
    case "about":
      return <AuthorSummary author={author} />;

    case "works":
      return <TOC text={author} />;

    case "search":
      return <Search id={author.id} />;

    case "summary":
      return <Summary analysis={analysis} />;

    case "names":
      return <Names analysis={analysis} />;

    case "citations":
      return <Citations analysis={analysis} />;

    case "foreign":
      return <ForeignText analysis={analysis} />;

    case "lemmas":
      return <Lemmas analysis={analysis} />;
  }
};

const Section: FC<PropsWithChildren> = ({ children }) => (
  <div className="section-wrapper">
    <div className="section">{children}</div>
  </div>
);

const TextSelect: FC<{ section: TextSection; text: Text }> = ({
  section,
  text,
}) => (
  <select
    className="section-menu"
    disabled={true}
    data-text={text.id}
    aria-label="Area"
  >
    <optgroup label="Text">
      <option value="content" selected={section === "content"}>
        {text.texts.length > 0 ? "Table of Contents" : "Text"}
      </option>
      <option value="search" selected={section === "search"}>
        Search
      </option>
    </optgroup>
    <optgroup label="Analysis">
      <option value="summary" selected={section === "summary"}>
        Word usage summary
      </option>
      <option value="names" selected={section === "names"}>
        Names
      </option>
      <option value="citations" selected={section === "citations"}>
        Citations
      </option>
      <option value="foreign" selected={section === "foreign"}>
        Foreign text
      </option>
      <option value="lemmas" selected={section === "lemmas"}>
        Lemmas
      </option>
    </optgroup>
    <optgroup label="About">
      <option value="about" selected={section === "about"}>
        About
      </option>
    </optgroup>
  </select>
);

const AuthorSelect: FC<{ section: AuthorSection; author: Author }> = ({
  section,
  author,
}) => (
  <select
    className="section-menu"
    disabled={true}
    data-author={author.id}
    aria-label="Area"
  >
    <optgroup label="Author">
      <option value="works" selected={section === "works"}>
        Works
      </option>
      <option value="search" selected={section === "search"}>
        Search
      </option>
    </optgroup>
    <optgroup label="Analysis">
      <option value="summary" selected={section === "summary"}>
        Word usage summary
      </option>
      <option value="names" selected={section === "names"}>
        Names
      </option>
      <option value="citations" selected={section === "citations"}>
        Citations
      </option>
      <option value="foreign" selected={section === "foreign"}>
        Foreign text
      </option>
      <option value="lemmas" selected={section === "lemmas"}>
        Lemmas
      </option>
    </optgroup>
  </select>
);
