import { dissertationTable, emplTable } from "../content/data.ts";

export default function init() {
  const emplSelect = document.querySelector('[data-table="empl-similarity"]');
  const dissertationSelect = document.querySelector(
    '[data-table="dissertation-similarity"]'
  );
  if (emplSelect && dissertationSelect) {
    const emplTableHTML = emplSelect.nextElementSibling;
    const dissertationTableHTML = dissertationSelect.nextElementSibling;
    emplSelect.addEventListener("change", () => {
      emplTableHTML.innerHTML = emplTable(parseInt(emplSelect.value)).innerHTML;
    });
    dissertationSelect.addEventListener("change", () => {
      dissertationTableHTML.innerHTML = dissertationTable(
        parseInt(dissertationSelect.value)
      ).innerHTML;
    });
  }
}
