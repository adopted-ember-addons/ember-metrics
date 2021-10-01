import emberObject from '@ember/object';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { typeOf } from '@ember/utils';
import classic from 'ember-classic-decorator';

function makeToString(ret) {
  return () => ret;
}

@classic
export default class BaseAdapter extends emberObject {
  static supportsFastBoot = false;

  SCRIPT_DATA_ATTRIBUTE = 'data-ember-metrics';

  metrics = null;

  config = null;

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
