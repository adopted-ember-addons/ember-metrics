import Ember from 'ember';
import BaseAdapter from 'ember-metrics/metrics-adapters/base';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'LocalDummy';
  },

  init() {},
  willDestroy() {}
});
