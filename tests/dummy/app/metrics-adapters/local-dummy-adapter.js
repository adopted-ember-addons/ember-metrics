import Ember from 'ember';
import BaseAdapter from 'ember-metrics/metrics-adapters/base';

export default BaseAdapter.extend({
  application: Ember.inject.service(),

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
