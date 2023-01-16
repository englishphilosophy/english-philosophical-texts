import React, { type FC } from "react";
import type { Author, Text } from "../types/library.ts";
import * as misc from "./misc.tsx";

export const AuthorSummary: FC<{ author: Author }> = ({ author }) => (
  <div className="section-content about">
    <h2>
      {misc.fullname(author)} ({author.birth}-{author.death})
    </h2>
    <h4>
      {author.nationality}, {author.sex}
    </h4>
  </div>
);

export const TextSummary: FC<{ text: Text }> = ({ text }) => (
  <div className="section-content about">
    <p>{text.sourceDesc}</p>
    <h4>First published</h4>
    <p>{text.published.map((x) => x.toString(10)).join(", ")}</p>
    <h4>Copytext</h4>
    <p>{text.copytext.map((x) => x.toString(10)).join(", ")}</p>
    {text.sourceUrl ? (
      <>
        <h4>Source</h4>
        <p>
          <a href={text.sourceUrl}>{text.sourceUrl}</a>
        </p>
      </>
    ) : null}
  </div>
);
