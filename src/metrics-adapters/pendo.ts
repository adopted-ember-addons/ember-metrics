import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import {
  without,
  compact,
  hasOwnProperties,
} from '../-private/utils/object-transforms.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';
import { injectPendo } from '../-private/vendor/snippets.ts';

export default class Pendo extends BaseAdapter {
  toStringExtension() {
    return 'Pendo';
  }

  install() {
    const { apiKey } = this.config;

    assert(
      `[ember-metrics] You must pass a valid \`apiKey\` to the ${this.toString()} adapter`,
      apiKey,
    );

    injectPendo(apiKey);

    window.pendo.initialize(this.config);
  }

  identify(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);

    window.pendo.identify(compactedOptions);
  }

  trackEvent(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    const props = without(compactedOptions, 'event');

    if (hasOwnProperties(props)) {
      window.pendo.track(event, props);
    } else {
      window.pendo.track(event);
    }
  }

  trackPage(options: AdapterOptions = {}) {
    const event = { event: 'page viewed' };
    const mergedOptions = { ...event, ...options };

    this.trackEvent(mergedOptions);
  }

  uninstall() {
    removeFromDOM('script[src*="pendo.js"]');

    delete (window as Partial<Window>).pendo;
  }
}
