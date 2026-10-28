type Options = Record<string, unknown>;
/**
 * Present config options
 * @see {@link https://api.emberjs.com/ember/3.28/functions/@ember%2Futils/isPresent|isPresent}
 * @param {Options} opts
 * @returns {Options}
 */
export declare function compact(opts: Options): Options;
/**
 * Config options without `excludedKeys`
 * @param {Options} opts
 * @param {string|string[]} excludedKeys
 * @returns {Options}
 */
export declare function without(opts: Options, excludedKeys: string | string[]): Options;
/**
 * Check if given object has any own properties
 * @param {Record<string,unknown>} obj
 * @returns {boolean}
 */
export declare function hasOwnProperties(obj: Record<string, unknown>): boolean;
declare const _default: {
    compact: typeof compact;
    without: typeof without;
    hasOwnProperties: typeof hasOwnProperties;
};
export default _default;
//# sourceMappingURL=object-transforms.d.ts.map