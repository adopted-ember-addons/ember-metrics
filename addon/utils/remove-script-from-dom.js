import canUseDOM from './can-use-dom';

export default function removeScriptFromDOM(script) {
  if (!canUseDOM) return;

  document.querySelectorAll(script).forEach(el => {
    el.parentElement.removeChild(el);
  });
}
