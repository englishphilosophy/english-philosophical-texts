import { authorContent, textContent } from "../elements/reader.ts";
import * as read from "../server/read.ts";
import search from "./search.js";

export default async function init() {
  const authorMenus = Array.from(
    document.querySelectorAll(".section-menu[data-author]")
  );
  const textMenus = Array.from(
    document.querySelectorAll(".section-menu[data-text]")
  );

  if (authorMenus.length > 0) {
    const author = await read.author(authorMenus[0].dataset.author);
    const analysis = await read.analysis(authorMenus[0].dataset.author);

    authorMenus.forEach((select) => {
      select.addEventListener("change", () => {
        select.nextElementSibling.outerHTML = authorContent(
          author,
          analysis,
          select.value
        ).outerHTML;
        search(); // initialise search functionality
      });
      select.removeAttribute("disabled");
    });
  }

  if (textMenus.length > 0) {
    const text = await read.text(textMenus[0].dataset.text);
    const analysis = await read.analysis(textMenus[0].dataset.text);

    textMenus.forEach((select) => {
      select.addEventListener("change", () => {
        select.nextElementSibling.outerHTML = textContent(
          text,
          analysis,
          select.value
        ).outerHTML;
        search(); // initialise search functionality
      });
      select.removeAttribute("disabled");
    });
  }
}
