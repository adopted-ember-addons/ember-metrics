import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import { compact, without, hasOwnProperties } from '../-private/utils/object-transforms.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';
import { injectPendo } from '../-private/vendor/snippets.js';

class Pendo extends BaseAdapter {
  toStringExtension() {
    return 'Pendo';
  }
  install() {
    const {
      apiKey
    } = this.config;
    assert(`[ember-metrics] You must pass a valid \`apiKey\` to the ${this.toString()} adapter`, apiKey);
    injectPendo(apiKey);
    window.pendo.initialize(this.config);
  }
  identify(options = {}) {
    const compactedOptions = compact(options);
    window.pendo.identify(compactedOptions);
  }
  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const {
      event
    } = compactedOptions;
    const props = without(compactedOptions, 'event');
    if (hasOwnProperties(props)) {
      window.pendo.track(event, props);
    } else {
      window.pendo.track(event);
    }
  }
  trackPage(options = {}) {
    const event = {
      event: 'page viewed'
    };
    const mergedOptions = {
      ...event,
      ...options
    };
    this.trackEvent(mergedOptions);
  }
  uninstall() {
    removeFromDOM('script[src*="pendo.js"]');
    delete window.pendo;
  }
}

export { Pendo as default };
//# sourceMappingURL=pendo.js.map
