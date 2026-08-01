import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import { compact, without } from '../-private/utils/object-transforms.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';
import { injectIntercom } from '../-private/vendor/snippets.ts';

export default class Intercom extends BaseAdapter {
  booted = false;

  toStringExtension() {
    return 'Intercom';
  }

  install() {
    const { appId } = this.config;

    assert(
      `[ember-metrics] You must pass a valid \`appId\` to the ${this.toString()} adapter`,
      appId,
    );

    injectIntercom(appId);
  }

  identify(options: AdapterOptions = {}) {
    const { appId } = this.config;
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    const props = without(compactedOptions, 'distinctId');

    props.app_id = appId;
    if (distinctId) {
      props.user_id = distinctId;
    }

    assert(
      `[ember-metrics] You must pass \`distinctId\` or \`email\` to \`identify()\` when using the ${this.toString()} adapter`,
      props.email || props.user_id,
    );

    const method = this.booted ? 'update' : 'boot';

    window.Intercom(method, props);
    this.booted = true;
  }

  trackEvent(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { event = 'unspecified-event' } = compactedOptions;
    const props = without(compactedOptions, 'event');

    window.Intercom('trackEvent', event, props);
  }

  trackPage(options: AdapterOptions = {}) {
    const event = { event: 'page viewed' };
    const mergedOptions = { ...event, ...options };

    this.trackEvent(mergedOptions);
  }

  uninstall() {
    removeFromDOM('script[src*="intercom"]');

    delete (window as Partial<Window>).Intercom;
  }
}
