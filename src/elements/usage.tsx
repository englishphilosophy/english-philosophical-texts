import React, { type FC } from "react";
import type { Analysis, Lemma } from "../types/analysis.ts";

export const Summary: FC<{ analysis: Analysis }> = ({ analysis }) => {
  const isAuthor = analysis.id.split(".").length === 1;
  const titleText = isAuthor
    ? "The collected works of this author contain:"
    : "This text contains:";
  return (
    <div className="section-content usage">
      <Warning />
      <p>{titleText}</p>
      <ul>
        <li>
          {analysis.wordCount} words and {analysis.lemmaWordCount} lexemes
        </li>
        <li>
          {analysis.names.length} references to named people (totalling
          {analysis.nameWordCount} words)
        </li>
        <li>
          {analysis.citations.length} citations (totalling
          {analysis.citationWordCount} words)
        </li>
        <li>
          {analysis.foreignText.length} instances of foreign text (totalling
          {analysis.foreignWordCount} words)
        </li>
      </ul>
    </div>
  );
};

export const Names: FC<{ analysis: Analysis }> = ({ analysis }) => (
  <div className="section-content usage">
    <Warning />
    {analysis.names.length > 0 ? (
      <ul>
        {analysis.names.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    ) : (
      <p>No named people.</p>
    )}
  </div>
);

export const Citations: FC<{ analysis: Analysis }> = ({ analysis }) => (
  <div className="section-content usage">
    <Warning />
    {analysis.citations.length > 0 ? (
      <ul>
        {analysis.citations.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    ) : (
      <p>No citations.</p>
    )}
  </div>
);

export const ForeignText: FC<{ analysis: Analysis }> = ({ analysis }) => (
  <div className="section-content usage">
    <Warning />
    {analysis.foreignText.length > 0 ? (
      <ul>
        {analysis.foreignText.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    ) : (
      <p>No foreign text.</p>
    )}
  </div>
);

export const Lemmas: FC<{ analysis: Analysis }> = ({ analysis }) => (
  <div className="section-content usage">
    <Warning />
    <table>
      <thead>
        <th>Lemma</th>
        <th>Raw frequency</th>
        <th>TF-IDF</th>
      </thead>
      <tbody>
        {analysis.lemmas.map((lemma) => (
          <tr>
            <td>{lemma.label}</td>
            <td>{lemma.frequency.toString(10)}</td>
            <td>{lemma.relativeTfIdf.toString(10).slice(0, 10)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Warning: FC = () => (
  <p className="warning">
    These data are provisional. Their accuracy depends on software that is still
    being developed, and manual markup that is still being inputted and checked.
  </p>
);
