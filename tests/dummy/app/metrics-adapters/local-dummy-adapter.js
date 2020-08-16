import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import { inject } from '@ember/service';

export default class LocalDummyAdapter extends BaseAdapter {
  static supportsFastBoot = true;

  @inject application;

  toStringExtension() {
    return 'LocalDummy';
  }

  init() {
    this.set('application.foo', 'bar');
  }

  trackEvent({ controller }) {
    if (controller) {
      controller.set('foo', 'bar');
    }
  }

  willDestroy() {}
}
