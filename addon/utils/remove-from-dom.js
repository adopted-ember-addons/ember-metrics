export default function removeFromDOM(script) {
  document.querySelectorAll(script).forEach(el => {
    el.parentElement.removeChild(el);
  });
}
