import { results } from "../elements/search.ts";

export default () => {
  if (searchForm) {
    searchForm.addEventListener("submit", search);
  }
};

const searchForm = document.querySelector(".search-form");
const id = searchForm.querySelector('[name="id"]');
const query11 = searchForm.querySelector('[name="query11"]');
const query1op = searchForm.querySelector('[name="query1op"]');
const query12 = searchForm.querySelector('[name="query12"]');
const query21 = searchForm.querySelector('[name="query21"]');
const query2op = searchForm.querySelector('[name="query2op"]');
const query22 = searchForm.querySelector('[name="query22"]');
const ignorePunctuation = searchForm.querySelector(
  '[name="ignorePunctuation"]'
);
const wholeWords = searchForm.querySelector('[name="wholeWords"]');
const variantSpellings = searchForm.querySelector('[name="variantSpellings"]');

const search = async (event) => {
  event.preventDefault();

  const searchParams = {
    id: id.value,
    query: buildQuery(
      query11.value,
      query12.value,
      query1op.value,
      query21.value,
      query22.value,
      query2op.value
    ),
    options: {
      ignorePunctuation: ignorePunctuation.value,
      wholeWords: wholeWords.value,
      variantSpellings: variantSpellings.value,
    },
  };

  const response = await fetch("https://ept.deno.dev/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchParams),
  });

  if (response.ok) {
    const json = await response.json();
    const resultsDiv = searchForm.nextElementSibling;
    resultsDiv.innerHTML = results(json[0]).innerHTML;
    resultsDiv.classList.remove("hidden");
    resultsDiv.querySelector(".results").classList.add("active"); // activate first sub results
  }
};

const buildQuery = (query11, query12, query1op, query21, query22, query2op) => {
  const query1 = buildSubQuery(query11, query12, query1op);
  const query2 = buildSubQuery(query21, query22, query2op);
  return buildSubQuery(query1, query2, "bot");
};

const buildSubQuery = (query1, query2, operator) => {
  return query2 ? { query1, query2, operator } : query1;
};
