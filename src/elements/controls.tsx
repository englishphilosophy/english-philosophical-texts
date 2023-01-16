import React, { type FC } from "react";

const Controls: FC = () => (
  <div className="controls">
    <input
      type="text"
      placeholder="Search authors"
      aria-label="Search"
      data-action="filter-authors"
    />
    <select aria-label="Order" data-action="order-authors">
      <option value="published">chronological (first publication)</option>
      <option value="birth">chronological (birth)</option>
      <option value="alphabetical">alphabetical</option>
    </select>
  </div>
);

export default Controls;
