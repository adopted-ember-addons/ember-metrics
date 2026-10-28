import { assert, deprecate } from '@ember/debug';
import BaseAdapter from './base.js';
import { compact } from '../-private/utils/object-transforms.js';
import capitalize from '../-private/utils/capitalize.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';
import { injectGoogleTagManager } from '../-private/vendor/snippets.js';

class GoogleTagManager extends BaseAdapter {
  dataLayer = 'dataLayer';
  toStringExtension() {
    return 'GoogleTagManager';
  }
  install() {
    const {
      id,
      dataLayer,
      envParams
    } = this.config;
    const envParamsString = envParams ? `&${envParams}` : '';
    assert(`[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`, id);
    this.dataLayer = dataLayer || 'dataLayer';
    injectGoogleTagManager(this.dataLayer, id, envParamsString);
  }
  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const dataLayer = this.dataLayer;
    const gtmEvent = {
      event: compactedOptions['event']
    };
    deprecate('Future versions of the GoogleTagManagerAdapter will no longer prefix top-level dataLayer keys with `event`. If you wish to retain this behaviour you will need to override the adapter and prefix the keys yourself.', false, {
      id: 'ember-metrics.issue-438',
      for: 'ember-metrics',
      since: {
        available: '2.0.0',
        enabled: '2.0.0'
      },
      until: '3.0.0'
    });
    delete compactedOptions['event'];
    for (const key in compactedOptions) {
      const capitalizedKey = capitalize(key);
      gtmEvent[`event${capitalizedKey}`] = compactedOptions[key];
    }
    window[dataLayer]?.push(gtmEvent);
    return gtmEvent;
  }
  trackPage(options = {}) {
    const compactedOptions = compact(options);
    const dataLayer = this.dataLayer;
    const sendEvent = {
      event: compactedOptions['event'] || 'pageview'
    };
    const pageEvent = {
      ...sendEvent,
      ...compactedOptions
    };
    window[dataLayer]?.push(pageEvent);
    return pageEvent;
  }
  uninstall() {
    removeFromDOM('script[src*="gtm.js"]');
    delete window.dataLayer;
  }
}

export { GoogleTagManager as default };
//# sourceMappingURL=google-tag-manager.js.map
