import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';
import { compact } from '../-private/utils/object-transforms.js';
import { injectSegment } from '../-private/vendor/snippets.js';

class Segment extends BaseAdapter {
  toStringExtension() {
    return 'Segment';
  }
  install() {
    const config = {
      ...this.config
    };
    const segmentKey = config.key;
    const proxyDomain = config.proxyDomain || 'https://cdn.segment.com';
    assert(`[ember-metrics] You must pass a valid \`key\` to the ${this.toString()} adapter`, segmentKey);
    injectSegment(proxyDomain, segmentKey);
  }
  alias(options = {}) {
    const compactedOptions = compact(options);
    const {
      alias,
      original
    } = compactedOptions;
    if (original) {
      window.analytics.alias(alias, original);
    } else {
      window.analytics.alias(alias);
    }
  }
  identify(options = {}) {
    const compactedOptions = compact(options);
    const {
      distinctId
    } = compactedOptions;
    delete compactedOptions.distinctId;
    window.analytics.identify(distinctId, compactedOptions);
  }
  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const {
      event
    } = compactedOptions;
    delete compactedOptions.event;
    window.analytics.track(event, compactedOptions);
  }
  trackPage(options = {}) {
    const compactedOptions = compact(options);
    const {
      page
    } = compactedOptions;
    delete compactedOptions.page;
    window.analytics.page(page, compactedOptions);
  }
  uninstall() {
    removeFromDOM('script[src*="segment.com"]');
    delete window.analytics;
  }
}

export { Segment as default };
//# sourceMappingURL=segment.js.map
