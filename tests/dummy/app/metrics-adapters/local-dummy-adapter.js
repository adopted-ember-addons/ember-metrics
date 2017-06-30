import BaseAdapter from 'ember-metrics/metrics-adapters/base';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'LocalDummy';
  },

  init() {},

  trackEvent({ controller }) {
    if (controller) {
      controller.set('foo', 'bar');
    }
  },

  willDestroy() {}
});
