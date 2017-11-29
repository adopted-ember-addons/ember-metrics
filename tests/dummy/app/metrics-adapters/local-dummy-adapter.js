import { inject as service } from '@ember/service';
import BaseAdapter from 'ember-metrics/metrics-adapters/base';

export default BaseAdapter.extend({
  application: service(),

  toStringExtension() {
    return 'LocalDummy';
  },

  init() {
    this.set('application.foo', 'bar');
  },

  trackEvent({ controller }) {
    if (controller) {
      controller.set('foo', 'bar');
    }
  },

  willDestroy() {}
});
