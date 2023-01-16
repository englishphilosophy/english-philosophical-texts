import React, { type FC } from "react";
import type { Result } from "../types/result.ts";
import Blocks from "./blocks.tsx";

export const Search: FC<{ id: string }> = ({ id }) => (
  <div className="section-content search">
    <form className="search-form">
      <input type="hidden" name="id" value={id} />
      <Query id={1} label="For paragraphs that contain:" />
      <Query id={2} label="But not:" />
      <div className="group">
        <label className="label">Options:</label>
        <div className="inputs checkboxes">
          <label>
            <input type="checkbox" name="ignorePunctuation" checked={true} />
            Ignore Punctuation
          </label>
          <label>
            <input type="checkbox" name="wholeWords" checked={true} />
            Match Whole Words
          </label>
          <label>
            <input type="checkbox" name="variantSpellings" checked={true} />
            Match Variant Spellings
          </label>
        </div>
      </div>
      <div className="group buttons">
        <button type="submit">Search</button>
      </div>
    </form>
    <div className="results hidden"></div>
  </div>
);

export const Results: FC<{ result?: Result }> = ({ result }) => (
  <div className="results">
    {result ? (
      <ResultDisplay result={result} />
    ) : (
      "No paragraphs matched your search criteria."
    )}
  </div>
);

const Query: FC<{ id: number; label: string }> = ({ id, label }) => (
  <div className="group">
    <label className="label" htmlFor={`query${id}1`}>
      {label}
    </label>
    <div className="inputs">
      <input
        type="text"
        name={`query${id}1`}
        id={`query${id}1`}
        aria-label={`Query ${id} first term`}
        required={id === 1}
      />
      <select name={`query${id}op`} aria-label={`Query ${id} operator`}>
        <option value="and">AND</option>
        <option value="or">OR</option>
      </select>
      <input
        type="text"
        name={`query${id}2`}
        aria-label={`Query ${id} second term`}
      />
    </div>
  </div>
);

const ResultDisplay: FC<{ result: Result }> = ({ result }) => (
  <div className="result">
    <h4 className="title">{result.title}</h4>
    <p
      className="total"
      onClick={(event) =>
        (event.currentTarget as any).nextElementSibling.classList.toggle("active")
      }
    >
      {result.total} matching paragraphs
    </p>
    {result.blocks.length > 0 ? (
      <div className="results">
        <Blocks blocks={result.blocks} />
      </div>
    ) : null}
    {result.results.length > 0 ? (
      <div className="results">
        {result.results.map((result) => (
          <ResultDisplay result={result} />
        ))}
      </div>
    ) : null}
  </div>
);
