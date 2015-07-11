import Ember from 'ember';
import LinkComponent from 'ember-metrics/ext/link';

export function initialize() {
  Ember.LinkComponent = LinkComponent;
}

export default {
  name: 'metrics-link',
  initialize
};
