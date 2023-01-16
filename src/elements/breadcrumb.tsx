import React, { type FC } from "react";
import type { Author, Text, TextStub } from "../types/library.ts";
import * as misc from "./misc.tsx";

const Breadcrumb: FC<{
  ancestors: [Author, ...TextStub[]];
  prev?: TextStub;
  next?: TextStub;
}> = ({ ancestors, prev, next }) => (
  <nav className="breadcrumb">
    <div className="trail">
      {ancestors.map((data) => (
        <div className="crumb">
          <a href={misc.url(data)}>{(data as Text).breadcrumb || data.id}</a>
        </div>
      ))}
    </div>
    <div className="context">
      <div className="prev">
        {prev ? <a href={misc.url(prev)}>&lt; {prev.breadcrumb}</a> : null}
      </div>
      <div className="next">
        {next ? <a href={misc.url(next)}>{next.breadcrumb} &gt;</a> : null}
      </div>
    </div>
  </nav>
);

export default Breadcrumb;
