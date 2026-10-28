import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import { compact, without } from '../-private/utils/object-transforms.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';
import { injectIntercom } from '../-private/vendor/snippets.js';

class Intercom extends BaseAdapter {
  booted = false;
  toStringExtension() {
    return 'Intercom';
  }
  install() {
    const {
      appId
    } = this.config;
    assert(`[ember-metrics] You must pass a valid \`appId\` to the ${this.toString()} adapter`, appId);
    injectIntercom(appId);
  }
  identify(options = {}) {
    const {
      appId
    } = this.config;
    const compactedOptions = compact(options);
    const {
      distinctId
    } = compactedOptions;
    const props = without(compactedOptions, 'distinctId');
    props.app_id = appId;
    if (distinctId) {
      props.user_id = distinctId;
    }
    assert(`[ember-metrics] You must pass \`distinctId\` or \`email\` to \`identify()\` when using the ${this.toString()} adapter`, props.email || props.user_id);
    const method = this.booted ? 'update' : 'boot';
    window.Intercom(method, props);
    this.booted = true;
  }
  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const {
      event = 'unspecified-event'
    } = compactedOptions;
    const props = without(compactedOptions, 'event');
    window.Intercom('trackEvent', event, props);
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
    removeFromDOM('script[src*="intercom"]');
    delete window.Intercom;
  }
}

export { Intercom as default };
//# sourceMappingURL=intercom.js.map
