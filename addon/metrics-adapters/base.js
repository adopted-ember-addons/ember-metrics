import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { typeOf } from '@ember/utils';

function makeToString(ret) {
  return () => ret;
}

export default class BaseAdapter {
  static supportsFastBoot = false;

  metrics = null;
  config = null;

  constructor(config) {
    this.config = config;
  }

  install() {
    assert(
      `[ember-metrics] ${this.toString()} must implement the install hook!`
    );
  }

  uninstall() {
    assert(
      `[ember-metrics] ${this.toString()} must implement the uninstall hook!`
    );
  }

  toString() {
    const hasToStringExtension = typeOf(this.toStringExtension) === 'function';
    const extension = hasToStringExtension
      ? ':' + this.toStringExtension()
      : '';
    const ret = `ember-metrics@metrics-adapter:${extension}:${guidFor(this)}`;

    this.toString = makeToString(ret);
    return ret;
  }

  identify() {}
  trackEvent() {}
  trackPage() {}
  alias() {}
}
