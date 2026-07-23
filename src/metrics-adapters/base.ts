import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';

/**
 * Configuration passed to an adapter's constructor. Each adapter reads its own
 * provider-specific keys, so it stays intentionally loose.
 */
export type AdapterConfig = Record<string, unknown>;

/**
 * Options forwarded to an adapter method (merged with the service `context`).
 */
export type AdapterOptions = Record<string, unknown>;

function makeToString(ret: string): () => string {
  return () => ret;
}

export default class BaseAdapter {
  static supportsFastBoot = false;

  metrics: unknown = null;
  config: AdapterConfig;

  constructor(config: AdapterConfig = {}) {
    this.config = config;
  }

  /**
   * Overridden by subclasses to give the adapter a human-readable name in
   * assertions and `toString()`.
   */
  toStringExtension(): string {
    return '';
  }

  install(): void {
    assert(
      `[ember-metrics] ${this.toString()} must implement the install hook!`,
    );
  }

  uninstall(): void {
    assert(
      `[ember-metrics] ${this.toString()} must implement the uninstall hook!`,
    );
  }

  toString(): string {
    const ext = this.toStringExtension();
    const extension = ext ? ':' + ext : '';
    const ret = `ember-metrics@metrics-adapter:${extension}:${guidFor(this)}`;

    this.toString = makeToString(ret);
    return ret;
  }

  identify(_options?: AdapterOptions): void {}
  trackEvent(_options?: AdapterOptions): void {}
  trackPage(_options?: AdapterOptions): void {}
  alias(_options?: AdapterOptions): void {}
}
