import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import { compact, without, hasOwnProperties } from '../-private/utils/object-transforms.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';
import { injectAmplitude } from '../-private/vendor/snippets.js';

class AmplitudeMetricsAdapter extends BaseAdapter {
  _identity;
  toStringExtension() {
    return 'Amplitude';
  }
  install() {
    const {
      apiKey,
      options
    } = this.config;
    assert(`[ember-metrics] You must pass a valid \`apiKey\` to the ${this.toString()} adapter`, apiKey);
    injectAmplitude();
    window.amplitude.getInstance().init(apiKey, null, options || {});
  }
  identify(options = {}) {
    const compactedOptions = compact(options);
    const {
      distinctId
    } = compactedOptions;
    const props = without(compactedOptions, 'distinctId');
    if (!this._identity) {
      this._identity = new window.amplitude.Identify();
    }
    const identity = this._identity;
    assert(`[ember-metrics] [${this.toString()}] It appears you did not pass a distictId param to "identify". You will need to do so in order for the session to be tagged to a specific user.`, distinctId);
    if (distinctId) {
      window.amplitude.getInstance().setUserId(distinctId);
    }
    for (const k in props) {
      identity.set(k, props[k]);
    }
    window.amplitude.getInstance().identify(identity);
  }
  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const {
      event
    } = compactedOptions;
    const props = without(compactedOptions, 'event');
    if (hasOwnProperties(props)) {
      window.amplitude.getInstance().logEvent(event, props);
    } else {
      window.amplitude.getInstance().logEvent(event);
    }
  }
  trackPage(options = {}) {
    const eventOpt = {
      event: 'Page View'
    };
    const withEvent = {
      ...eventOpt,
      ...options
    };
    this.trackEvent(withEvent);
  }
  optOut() {
    window.amplitude.getInstance().setOptOut(true);
  }
  optIn() {
    window.amplitude.getInstance().setOptOut(false);
  }
  uninstall() {
    removeFromDOM('script[src*="amplitude"]');
  }
}

export { AmplitudeMetricsAdapter as default };
//# sourceMappingURL=amplitude.js.map
