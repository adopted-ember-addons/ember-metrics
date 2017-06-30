import Ember from 'ember';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),

  setupController(controller) {
    this.get('metrics').trackEvent({ controller });
  }
});
