import BaseAdapter from 'ember-metrics/metrics-adapters/base';

export default class LocalDummyAdapter extends BaseAdapter {
  static supportsFastBoot = true;
  foo = null;

  toStringExtension() {
    return 'LocalDummy';
  }

  install() {
    this.foo = 'bar';
  }

  trackEvent({ controller }) {
    if (controller) {
      controller.foo = 'bar';
    }
  }

  uninstall() {}
}
