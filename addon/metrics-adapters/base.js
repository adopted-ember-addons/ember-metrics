/* jshint unused: false */
import Ember from 'ember';

const set = Ember.set;
const {
  Object: emberObject,
  assert,
  guidFor,
  typeOf,
  K
} = Ember;

function makeToString(ret) {
  return function() { return ret; };
}

export default emberObject.extend({
  init() {
    assert(`[ember-metrics] ${this.toString()} must implement the init hook!`);
  },

  toString() {
    const hasToStringExtension = typeOf(this.toStringExtension) === 'function';
    const extension = hasToStringExtension ? ':' + this.toStringExtension() : '';
    const ret = `ember-metrics@metrics-adapter:${extension}:${guidFor(this)}`;

    this.toString = makeToString(ret);
    return ret;
  },

  metrics: null,
  config: null,
  identify: K,
  trackEvent: K,
  trackPage: K,
  alias: K
});
