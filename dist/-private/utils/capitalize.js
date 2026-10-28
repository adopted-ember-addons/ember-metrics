const CAPITALIZE_REGEXP = /(^|\/)([a-zÀ-ɏ])/g;

/**
 * Uppercase the first letter of the string, and any letter following a `/`.
 *
 * Drop-in replacement for `capitalize` from `@ember/string`, so we don't
 * pull that package in as a runtime/peer dependency just to title-case a
 * handful of event keys.
 *
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
function capitalize(str) {
  return str.replace(CAPITALIZE_REGEXP, match => match.toUpperCase());
}

export { capitalize as default };
//# sourceMappingURL=capitalize.js.map
