import { isPresent as emberIsPresent } from '@ember/utils';

type Options = Record<string, string>;

/**
 * Present config options
 * @param {Options} opts
 * @returns {Options}
 */
export function compact(opts: Options): Options {
  return includeKeys(opts, (key) => emberIsPresent(opts[key]));
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

export function isPresent(opts: Options): boolean {
  return Object.getOwnPropertyNames(opts).length > 0;
}

export default {
  compact,
  without,
  isPresent,
};
