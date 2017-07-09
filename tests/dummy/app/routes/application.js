import Ember from 'ember';

const { Route, inject: { service }, get } = Ember

export default Route.extend({
  metrics: service(),

  setupController(controller) {
    get(this, 'metrics').trackEvent({ controller });
  }
});
