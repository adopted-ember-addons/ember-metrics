import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import { inject as service } from '@ember/service';

export default class LocalDummyAdapter extends BaseAdapter {
  static supportsFastBoot = true;

  @service application;

  toStringExtension() {
    return 'LocalDummy';
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    this.application.foo = 'bar';
  }

  trackEvent({ controller }) {
    if (controller) {
      controller.foo = 'bar';
    }
  }

  willDestroy() {}
}
