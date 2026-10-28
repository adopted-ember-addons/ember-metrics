import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import {
  without,
  compact,
  hasOwnProperties,
} from '../-private/utils/object-transforms.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';
import { injectMixpanel } from '../-private/vendor/snippets.ts';

export default class Mixpanel extends BaseAdapter {
  toStringExtension() {
    return 'Mixpanel';
  }

  install() {
    const config: Record<string, unknown> = {
      batch_requests: true,
      ...this.config,
    };
    const { token } = config;
    delete config.token;

    assert(
      `[ember-metrics] You must pass a valid \`token\` to the ${this.toString()} adapter`,
      token,
    );

    this._injectScript();
    window.mixpanel.init(token, config);
  }

  // Thin wrapper around the vendor snippet so tests can stub script injection.
  _injectScript() {
    injectMixpanel();
  }

  identify(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    const props = without(compactedOptions, 'distinctId');

    if (hasOwnProperties(props)) {
      window.mixpanel.identify(distinctId);
      window.mixpanel.people.set(props);
    } else {
      window.mixpanel.identify(distinctId);
    }
  }

  trackEvent(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    const props = without(compactedOptions, 'event');

    if (hasOwnProperties(props)) {
      window.mixpanel.track(event, props);
    } else {
      window.mixpanel.track(event);
    }
  }

  trackPage(options: AdapterOptions = {}) {
    const event = { event: 'page viewed' };
    const mergedOptions = { ...event, ...options };

    this.trackEvent(mergedOptions);
  }

  alias(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { alias, original } = compactedOptions;

    if (original) {
      window.mixpanel.alias(alias, original);
    } else {
      window.mixpanel.alias(alias);
    }
  }

  uninstall() {
    removeFromDOM('script[src*="mixpanel"]');

    delete (window as Partial<Window>).mixpanel;
  }
}
