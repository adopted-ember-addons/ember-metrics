import { assert, deprecate } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import { compact } from '../-private/utils/object-transforms.ts';
import capitalize from '../-private/utils/capitalize.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';
import { injectGoogleTagManager } from '../-private/vendor/snippets.ts';

export default class GoogleTagManager extends BaseAdapter {
  dataLayer = 'dataLayer';

  toStringExtension() {
    return 'GoogleTagManager';
  }

  install() {
    const { id, dataLayer, envParams } = this.config as {
      id?: unknown;
      dataLayer?: string;
      envParams?: string;
    };
    const envParamsString = envParams ? `&${envParams}` : '';

    assert(
      `[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`,
      id,
    );

    this.dataLayer = dataLayer || 'dataLayer';

    injectGoogleTagManager(this.dataLayer, id, envParamsString);
  }

  trackEvent(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const dataLayer = this.dataLayer;
    const gtmEvent: Record<string, unknown> = {
      event: compactedOptions['event'],
    };

    deprecate(
      'Future versions of the GoogleTagManagerAdapter will no longer prefix top-level dataLayer keys with `event`. If you wish to retain this behaviour you will need to override the adapter and prefix the keys yourself.',
      false,
      {
        id: 'ember-metrics.issue-438',
        for: 'ember-metrics',
        since: { available: '2.0.0', enabled: '2.0.0' },
        until: '3.0.0',
      },
    );

    delete compactedOptions['event'];

    for (const key in compactedOptions) {
      const capitalizedKey = capitalize(key);
      gtmEvent[`event${capitalizedKey}`] = compactedOptions[key];
    }

    (window as unknown as Record<string, unknown[]>)[dataLayer]?.push(gtmEvent);

    return gtmEvent;
  }

  trackPage(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const dataLayer = this.dataLayer;
    const sendEvent = {
      event: compactedOptions['event'] || 'pageview',
    };

    const pageEvent = { ...sendEvent, ...compactedOptions };

    (window as unknown as Record<string, unknown[]>)[dataLayer]?.push(
      pageEvent,
    );

    return pageEvent;
  }

  uninstall() {
    removeFromDOM('script[src*="gtm.js"]');

    delete (window as Partial<Window>).dataLayer;
  }
}
