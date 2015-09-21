import Ember from 'ember';
import LinkComponent from 'ember-metrics/ext/link';

const { isBlank } = Ember;

export function initialize() {
  if (isBlank(Ember.LinkComponent)) {
    Ember.LinkView = Ember.LinkComponent;
    return;
  }

  Ember.LinkComponent = LinkComponent;
}

export default {
  name: 'metrics-link',
  initialize
};
