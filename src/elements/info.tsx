import React, { type PropsWithChildren, type FC } from "react";
import type { PageDetails } from "../types/page_details.ts";

const Info: FC<PropsWithChildren<{ pageId: string; pages: PageDetails[] }>> = ({
  pageId,
  pages,
  children,
}) => (
  <div className="info">
    <select disabled={true} className="submenu" aria-label="Page">
      {pages.map((page) => (
        <option selected={page.id === pageId} value={page.url}>
          {page.title}
        </option>
      ))}
    </select>
    {children}
    <nav className="submenu">
      <div>
        {pages.map((page) => (
          <a className={page.id === pageId ? "active" : ""} href={page.url}>
            {page.title}
          </a>
        ))}
      </div>
    </nav>
  </div>
);

export default Info;
