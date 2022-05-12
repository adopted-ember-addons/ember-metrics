import emberObject from '@ember/object';
import { assert, deprecate } from '@ember/debug';
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

  constructor(config, owner) {
    super(...arguments);
    setOwner(this, owner);
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

  get() {
    deprecate(
      'Metrics Adapters must not use EmberObject methods as they will be implemented as native classes in the next major release',
      false,
      {
        id: 'ember-metrics-issue-287',
        for: 'ember-metrics',
        url: 'https://github.com/adopted-ember-addons/ember-metrics/issues/287',
        since: '1.4.0',
        until: '2.0.0',
      }
    );
    super.get(...arguments);
  }

  set() {
    deprecate(
      'Metrics Adapters must not use EmberObject methods as they will be implemented as native classes in the next major release',
      false,
      {
        id: 'ember-metrics.issue-287',
        for: 'ember-metrics',
        url: 'https://github.com/adopted-ember-addons/ember-metrics/issues/287',
        since: '1.4.0',
        until: '2.0.0',
      }
    );
    super.set(...arguments);
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
