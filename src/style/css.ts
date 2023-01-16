import * as fonts from "../style/fonts.ts";

import base from "./css/base.ts";
import layout from "./css/layout.ts";
import about from "./css/about.ts";
import blocks from "./css/blocks.ts";
import breadcrumb from "./css/breadcrumb.ts";
import controls from "./css/controls.ts";
import info from "./css/info.ts";
import library from "./css/library.ts";
import reader from "./css/reader.ts";
import search from "./css/search.ts";
import toc from "./css/toc.ts";
import usage from "./css/usage.ts";

export default `
${fonts.GFSDidot}
${fonts.IMFell}
${fonts.IMFellItalic}
${fonts.IMFellSC}
${base}
${layout}
${controls}
${library}
${reader}
${about}
${blocks}
${breadcrumb}
${info}
${search}
${toc}
${usage}
`
  .replace(/\n/g, "")
  .replace(/\s\s+/g, " ");
