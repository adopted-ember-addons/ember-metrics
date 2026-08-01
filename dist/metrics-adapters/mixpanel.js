import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import { compact, without, hasOwnProperties } from '../-private/utils/object-transforms.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';
import { injectMixpanel } from '../-private/vendor/snippets.js';

class Mixpanel extends BaseAdapter {
  toStringExtension() {
    return 'Mixpanel';
  }
  install() {
    const config = {
      batch_requests: true,
      ...this.config
    };
    const {
      token
    } = config;
    delete config.token;
    assert(`[ember-metrics] You must pass a valid \`token\` to the ${this.toString()} adapter`, token);
    this._injectScript();
    window.mixpanel.init(token, config);
  }

  // Thin wrapper around the vendor snippet so tests can stub script injection.
  _injectScript() {
    injectMixpanel();
  }
  identify(options = {}) {
    const compactedOptions = compact(options);
    const {
      distinctId
    } = compactedOptions;
    const props = without(compactedOptions, 'distinctId');
    if (hasOwnProperties(props)) {
      window.mixpanel.identify(distinctId);
      window.mixpanel.people.set(props);
    } else {
      window.mixpanel.identify(distinctId);
    }
  }
  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const {
      event
    } = compactedOptions;
    const props = without(compactedOptions, 'event');
    if (hasOwnProperties(props)) {
      window.mixpanel.track(event, props);
    } else {
      window.mixpanel.track(event);
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
  alias(options = {}) {
    const compactedOptions = compact(options);
    const {
      alias,
      original
    } = compactedOptions;
    if (original) {
      window.mixpanel.alias(alias, original);
    } else {
      window.mixpanel.alias(alias);
    }
  }
  uninstall() {
    removeFromDOM('script[src*="mixpanel"]');
    delete window.mixpanel;
  }
}

export { Mixpanel as default };
//# sourceMappingURL=mixpanel.js.map
