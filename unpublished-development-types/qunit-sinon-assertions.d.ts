/**
 * Types for the `qunit-sinon-assertions` addon, which ships no types of its
 * own. It registers a fluent `assert.spy(...)` API on QUnit's `Assert`.
 *
 * Dev-only: this lives in `unpublished-development-types` and is not shipped.
 *
 * NOTE: this file is intentionally script-mode (no top-level `import`/`export`)
 * so that `declare module 'qunit-sinon-assertions'` is an *ambient* module
 * declaration (providing types for the untyped package) rather than a module
 * *augmentation*, and so that `interface Assert` merges into the global one.
 */

/**
 * The fluent assertion object returned by `assert.spy(spy)`. Mirrors the
 * methods provided by qunit-sinon-assertions' `SinonAssertions` class.
 */
interface SinonAssertions {
  called(message?: string | number, extra?: string): SinonAssertions;
  calledTimes(count: number, message?: string): SinonAssertions;
  calledOnce(message?: string): SinonAssertions;
  calledTwice(message?: string): SinonAssertions;
  notCalled(message?: string): SinonAssertions;
  calledWith(args: unknown[], message?: string): SinonAssertions;
  calledWithExactly(args: unknown[], message?: string): SinonAssertions;
  notCalledWith(args: unknown[], message?: string): SinonAssertions;
  notCalledWithExactly(args: unknown[], message?: string): SinonAssertions;
  returnedWith(value: unknown, message?: string): SinonAssertions;
  didNotReturnWith(value: unknown, message?: string): SinonAssertions;
  threw(message?: string): SinonAssertions;
  threwWith(exception: unknown, message?: string): SinonAssertions;
  lastCalledWith(args: unknown[], message?: string): SinonAssertions;
  lastCalledWithExactly(args: unknown[], message?: string): SinonAssertions;
  lastReturnedWith(value: unknown, message?: string): SinonAssertions;
  lastNotCalledWith(args: unknown[], message?: string): SinonAssertions;
  lastNotCalledWithExactly(args: unknown[], message?: string): SinonAssertions;
  lastDidNotReturnWith(value: unknown, message?: string): SinonAssertions;
}

interface Assert {
  spy(spyOrValue: unknown): SinonAssertions;
}

declare module 'qunit-sinon-assertions' {
  export default function setupSinonAssert(assert: Assert): void;
}
