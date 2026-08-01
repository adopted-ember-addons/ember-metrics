import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import { compact } from '../-private/utils/object-transforms.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';
import { injectFacebookPixel } from '../-private/vendor/snippets.ts';

export default class FacebookPixel extends BaseAdapter {
  toStringExtension() {
    return 'FacebookPixel';
  }

  install() {
    const { id, dataProcessingOptions } = this.config as {
      id?: unknown;
      dataProcessingOptions?: {
        method?: unknown;
        country?: unknown;
        state?: unknown;
      };
    };

    assert(
      `[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`,
      id,
    );

    // Captured as a boolean (rather than `if (window.fbq)`) so `window.fbq`
    // isn't narrowed to `undefined` for the injected calls below.
    const fbqAlreadyLoaded = Boolean(window.fbq);
    if (fbqAlreadyLoaded) {
      return;
    }

    injectFacebookPixel();

    if (dataProcessingOptions) {
      const { method, country, state } = dataProcessingOptions;
      window.fbq?.('dataProcessingOptions', method, country, state);
    }

    window.fbq?.('init', id);

    // Leave this call due to Facebook API docs
    // https://developers.facebook.com/docs/facebook-pixel/api-reference#setup
    this.trackEvent({ event: 'PageView' });
  }

  trackEvent(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;

    if (!event) {
      return;
    }
    delete compactedOptions.event;

    if (window.fbq) {
      window.fbq('track', event, compactedOptions);
    }
  }

  trackPage(options: AdapterOptions = {}) {
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
