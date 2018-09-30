import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  metrics: inject(),

  setupController(controller) {
    this.get('metrics').trackEvent({ controller });
  }
});
