import { assert } from '@ember/debug';
import { capitalize } from '@ember/string';
import { compact } from 'ember-metrics/-private/utils/object-transforms';
import removeFromDOM from 'ember-metrics/-private/utils/remove-from-dom';
import BaseAdapter from './base';

export default class GoogleTagManager extends BaseAdapter {
  dataLayer = 'dataLayer';

  toStringExtension() {
    return 'GoogleTagManager';
  }

  install() {
    const { id, dataLayer, envParams } = this.config;
    const envParamsString = envParams ? `&${envParams}` : '';

    assert(
      `[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`,
      id
    );

    this.dataLayer = dataLayer || 'dataLayer';

    this._injectScript(id, envParamsString);
  }

  // prettier-ignore
  _injectScript(id, envParamsString) {
    (function(w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl + envParamsString;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', this.dataLayer, id);
  }

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const dataLayer = this.dataLayer;
    const gtmEvent = { event: compactedOptions['event'] };

    delete compactedOptions['event'];

    for (let key in compactedOptions) {
      const capitalizedKey = capitalize(key);
      gtmEvent[`event${capitalizedKey}`] = compactedOptions[key];
    }

    window[dataLayer].push(gtmEvent);

    return gtmEvent;
  }

  trackPage(options = {}) {
    const compactedOptions = compact(options);
    const dataLayer = this.dataLayer;
    const sendEvent = {
      event: compactedOptions['event'] || 'pageview',
    };

    const pageEvent = { ...sendEvent, ...compactedOptions };

    window[dataLayer].push(pageEvent);

    return pageEvent;
  }

  uninstall() {
    removeFromDOM('script[src*="gtm.js"]');

    delete window.dataLayer;
  }
}
