export default function init() {
  const selectMenu = document.querySelector("select.submenu");

  if (selectMenu) {
    selectMenu.addEventListener("change", () => {
      window.location.pathname = selectMenu.value;
    });
    selectMenu.removeAttribute("disabled");
  }
}
