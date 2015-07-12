import Ember from 'ember';
import BaseAdapter from './base';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'Mixpanel';
  },

  init: Ember.K
});
