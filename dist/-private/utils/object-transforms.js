import { isPresent } from '@ember/utils';

/**
 * Present config options
 * @see {@link https://api.emberjs.com/ember/3.28/functions/@ember%2Futils/isPresent|isPresent}
 * @param {Options} opts
 * @returns {Options}
 */
function compact(opts) {
  return includeKeys(opts, key => isPresent(opts[key]));
}

/**
 * Config options without `excludedKeys`
 * @param {Options} opts
 * @param {string|string[]} excludedKeys
 * @returns {Options}
 */
function without(opts, excludedKeys) {
  return includeKeys(opts, key => !excludedKeys.includes(key));
}

/**
 * Config options with allowed keys
 * @param {Options} opts
 * @param {(key:string) => boolean} include
 * @returns {Options}
 */
function includeKeys(opts, include) {
  const newOpts = {};
  for (const [key, value] of Object.entries(opts)) {
    if (include(key)) newOpts[key] = value;
  }
  return newOpts;
}

/**
 * Check if given object has any own properties
 * @param {Record<string,unknown>} obj
 * @returns {boolean}
 */
function hasOwnProperties(obj) {
  return Object.getOwnPropertyNames(obj).length > 0;
}
var objectTransforms = {
  compact,
  without,
  hasOwnProperties
};

export { compact, objectTransforms as default, hasOwnProperties, without };
//# sourceMappingURL=object-transforms.js.map
