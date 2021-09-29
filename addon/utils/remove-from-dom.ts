/**
 * Remove scripts defined by selectors from DOM.
 *
 * @param selectors One or more DOM selectors to match against.
 */
export default function removeFromDOM(selectors: string): void {
  document.querySelectorAll(selectors).forEach((el: Element) => {
    el.parentElement?.removeChild(el);
  });
}
