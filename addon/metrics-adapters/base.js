import emberObject from '@ember/object';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { typeOf } from '@ember/utils';
import { setOwner } from '@ember/application';

function makeToString(ret) {
  return () => ret;
}

export default class BaseAdapter extends emberObject {
  static supportsFastBoot = false;

  metrics = null;

  config = null;

  constructor(config, metrics, owner) {
    super(...arguments);
    setOwner(this, owner);
    this.metrics = metrics;
    this.config = config;
    this.init();
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    assert(`[ember-metrics] ${this.toString()} must implement the init hook!`);
  }

  willDestroy() {
    assert(
      `[ember-metrics] ${this.toString()} must implement the willDestroy hook!`
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
