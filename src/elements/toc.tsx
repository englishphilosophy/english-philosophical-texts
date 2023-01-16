import React, { type FC } from "react";
import type { Author, Text } from "../types/library.ts";
import { Link, title } from "./misc.tsx";

const TOC: FC<{ text: Author | Text }> = ({ text }) => (
  <ul className="section-content toc">
    {text.texts.map((textStub) => (
      <li>{textStub.imported ? <Link data={textStub} /> : title(textStub)}</li>
    ))}
  </ul>
);

export default TOC;
