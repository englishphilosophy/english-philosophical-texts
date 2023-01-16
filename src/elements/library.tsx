import React, { type FC } from "react";
import type { Author } from "../types/library.ts";
import * as misc from "./misc.tsx";

const Library: FC<{
  authors: Author[];
  order?: "published" | "birth" | "alphabetical";
  search?: string;
}> = ({ authors, order = "published", search }) => {
  if (search && search.length > 0) {
    authors = authors.filter((author) =>
      misc.fullname(author).match(misc.regexp(search))
    );
  }

  authors.sort((a, b) => a.id.localeCompare(b.id, "en"));

  switch (order) {
    case "published":
      authors.sort((a, b) => a.published - b.published);
      break;

    case "birth":
      authors.sort((a, b) => a.birth - b.birth);
      break;
  }

  return (
    <div id="library" className="library">
      {authors.length > 0 ? (
        authors.map((author) => <Author author={author} search={search} />)
      ) : (
        <p>No matching authors.</p>
      )}
    </div>
  );
};

export default Library;

const Author: FC<{ author: Author; search?: string }> = ({
  author,
  search,
}) => (
  <a className="author" href={misc.url(author)}>
    <h6>
      {misc.fullname(author, search)} ({author.birth}-{author.death})
    </h6>
    <div className="details">
      <div>Nationality: {author.nationality}</div>
      <div>Sex: ${author.sex}</div>
      <div>
        Texts in library: {author.texts.filter((x) => x.imported).length} /{" "}
        {author.texts.length}
      </div>
    </div>
  </a>
);
