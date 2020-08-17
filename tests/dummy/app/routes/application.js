import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default class ApplicationRoute extends Route {
  @inject metrics;

  setupController(controller) {
    super.setupController(...arguments);

    this.metrics.trackEvent({ controller });
  }
}
