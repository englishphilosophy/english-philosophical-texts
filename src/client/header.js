export default function init() {
  const button = document.querySelector("header button");
  const menu = document.querySelector("header nav");
  if (button && menu) {
    button.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
  }
}
