import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';
import { compact } from '../-private/utils/object-transforms.ts';
import { injectSegment } from '../-private/vendor/snippets.ts';

export default class Segment extends BaseAdapter {
  toStringExtension() {
    return 'Segment';
  }

  install() {
    const config = { ...this.config } as {
      key?: string;
      proxyDomain?: string;
    };
    const segmentKey = config.key;
    const proxyDomain = config.proxyDomain || 'https://cdn.segment.com';

    assert(
      `[ember-metrics] You must pass a valid \`key\` to the ${this.toString()} adapter`,
      segmentKey,
    );

    injectSegment(proxyDomain, segmentKey);
  }

  alias(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { alias, original } = compactedOptions;

    if (original) {
      window.analytics.alias(alias, original);
    } else {
      window.analytics.alias(alias);
    }
  }

  identify(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    delete compactedOptions.distinctId;

    window.analytics.identify(distinctId, compactedOptions);
  }

  trackEvent(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    delete compactedOptions.event;

    window.analytics.track(event, compactedOptions);
  }

  trackPage(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { page } = compactedOptions;
    delete compactedOptions.page;

    window.analytics.page(page, compactedOptions);
  }

  uninstall() {
    removeFromDOM('script[src*="segment.com"]');

    delete (window as Partial<Window>).analytics;
  }
}
