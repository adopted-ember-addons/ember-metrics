export default function removeScriptFromDOM(script) {
  document.querySelectorAll(script).forEach(el => {
    el.parentElement.removeChild(el);
  });
}
