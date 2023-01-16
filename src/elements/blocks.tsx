import React, { type FC } from "react";
import type { Block } from "../types/library.ts";
import { Link } from "./misc.tsx";

const Blocks: FC<{ blocks: Block[] }> = ({ blocks }) => (
  <div className="section-content blocks">
    {blocks.map((block) => (
      <div className="block" id={block.id.split(".").pop()}>
        <div className="id">
          <Link data={block} />
        </div>
        <div className="content">
          {block.speaker ? (
            <>
              <i>{block.speaker}</i>.{" "}
            </>
          ) : null}
          <span dangerouslySetInnerHTML={{ __html: block.content }}></span>
        </div>
      </div>
    ))}
  </div>
);

export default Blocks;
