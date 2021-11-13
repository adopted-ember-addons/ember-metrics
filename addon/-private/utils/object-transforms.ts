import { isPresent } from '@ember/utils';

type Options = Record<string, string>;

/**
 * Present config options
 * @see {@link https://api.emberjs.com/ember/3.28/functions/@ember%2Futils/isPresent|isPresent}
 * @param {Options} opts
 * @returns {Options}
 */
export function compact(opts: Options): Options {
  return includeKeys(opts, (key) => isPresent(opts[key]));
}

/**
 * Config options without `excludedKeys`
 * @param {Options} opts
 * @param {string[]} excludedKeys
 * @returns {Options}
 */
export function without(opts: Options, excludedKeys: string[]): Options {
  return includeKeys(opts, (key) => !excludedKeys.includes(key));
}

/**
 * Config options with allowed keys
 * @param {Options} opts
 * @param {(key:string) => boolean} include
 * @returns {Options}
 */
function includeKeys(
  opts: Options,
  include: (key: string) => boolean
): Options {
  const newOpts: Options = {};

  for (const key in opts) {
    if (include(key)) newOpts[key] = opts[key];
  }

  return newOpts;
}

/**
 * Check if given object has any own properties
 * @param {Record<string,unknown>} obj
 * @returns {boolean}
 */
export function hasOwnProperties(obj: Record<string, unknown>): boolean {
  return Object.getOwnPropertyNames(obj).length > 0;
}

export default {
  compact,
  without,
  hasOwnProperties,
};
