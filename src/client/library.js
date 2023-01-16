import library from "../elements/library.ts";
import * as read from "../server/read.ts";

export default async function init() {
  const searchInput = document.querySelector('[data-action="filter-authors"]');
  const orderSelect = document.querySelector('[data-action="order-authors"]');
  const libraryDiv = document.getElementById("library");

  const update = (authors) => {
    libraryDiv.innerHTML = library(
      authors,
      searchInput.value,
      orderSelect.value
    ).innerHTML;
  };

  if (searchInput && orderSelect && libraryDiv) {
    const authors = await read.authors();
    update(authors);

    searchInput.addEventListener("keyup", update);
    orderSelect.addEventListener("change", update);
    update();
  }
}
