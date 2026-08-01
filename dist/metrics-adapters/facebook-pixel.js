import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import { compact } from '../-private/utils/object-transforms.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';
import { injectFacebookPixel } from '../-private/vendor/snippets.js';

class FacebookPixel extends BaseAdapter {
  toStringExtension() {
    return 'FacebookPixel';
  }
  install() {
    const {
      id,
      dataProcessingOptions
    } = this.config;
    assert(`[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`, id);

    // Captured as a boolean (rather than `if (window.fbq)`) so `window.fbq`
    // isn't narrowed to `undefined` for the injected calls below.
    const fbqAlreadyLoaded = Boolean(window.fbq);
    if (fbqAlreadyLoaded) {
      return;
    }
    injectFacebookPixel();
    if (dataProcessingOptions) {
      const {
        method,
        country,
        state
      } = dataProcessingOptions;
      window.fbq?.('dataProcessingOptions', method, country, state);
    }
    window.fbq?.('init', id);

    // Leave this call due to Facebook API docs
    // https://developers.facebook.com/docs/facebook-pixel/api-reference#setup
    this.trackEvent({
      event: 'PageView'
    });
  }
  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const {
      event
    } = compactedOptions;
    if (!event) {
      return;
    }
    delete compactedOptions.event;
    if (window.fbq) {
      window.fbq('track', event, compactedOptions);
    }
  }
  trackPage(options = {}) {
    if (window.fbq) {
      window.fbq('track', 'PageView', options);
    }
  }
  uninstall() {
    if (window.fbq) {
      removeFromDOM('script[src*="fbevents.js"]');
      delete window.fbq;
      delete window._fbq;
    }
  }
}

export { FacebookPixel as default };
//# sourceMappingURL=facebook-pixel.js.map
