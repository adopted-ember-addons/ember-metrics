/**
 * Remove scripts defined by selectors from DOM.
 *
 * @param selectors One or more DOM selectors to match against.
 */
function removeFromDOM(selectors) {
  document.querySelectorAll(selectors).forEach(el => {
    el.parentElement?.removeChild(el);
  });
}

export { removeFromDOM as default };
//# sourceMappingURL=remove-from-dom.js.map
