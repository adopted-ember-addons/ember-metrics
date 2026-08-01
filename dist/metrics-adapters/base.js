import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';

/**
 * Configuration passed to an adapter's constructor. Each adapter reads its own
 * provider-specific keys, so it stays intentionally loose.
 */

/**
 * Options forwarded to an adapter method (merged with the service `context`).
 */

function makeToString(ret) {
  return () => ret;
}
class BaseAdapter {
  static supportsFastBoot = false;
  metrics = null;
  config;
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Overridden by subclasses to give the adapter a human-readable name in
   * assertions and `toString()`.
   */
  toStringExtension() {
    return '';
  }
  install() {
    assert(`[ember-metrics] ${this.toString()} must implement the install hook!`);
  }
  uninstall() {
    assert(`[ember-metrics] ${this.toString()} must implement the uninstall hook!`);
  }
  toString() {
    const ext = this.toStringExtension();
    const extension = ext ? ':' + ext : '';
    const ret = `ember-metrics@metrics-adapter:${extension}:${guidFor(this)}`;
    this.toString = makeToString(ret);
    return ret;
  }
  identify(_options) {}
  trackEvent(_options) {}
  trackPage(_options) {}
  alias(_options) {}
}

export { BaseAdapter as default };
//# sourceMappingURL=base.js.map
