import BaseAdapter from '#src/metrics-adapters/base.ts';

import type { AdapterOptions } from '#src/metrics-adapters/base.ts';

/**
 * A tiny hand-written adapter, mirroring the old dummy app's `LocalDummyAdapter`.
 * Instead of talking to a real analytics provider, `trackEvent` writes to the
 * controller passed in `options`, so the demo can show data flowing through the
 * `metrics` service and out to an adapter.
 */
export default class LocalDummyAdapter extends BaseAdapter {
  static override supportsFastBoot = true;

  toStringExtension() {
    return 'LocalDummy';
  }

  install() {}

  trackEvent(options: AdapterOptions = {}) {
    const { controller } = options as { controller?: { foo?: string } };

    if (controller) {
      controller.foo = 'bar';
    }
  }

  uninstall() {}
}
