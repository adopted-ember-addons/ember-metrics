import { assign } from '@ember/polyfills';
import { assert } from '@ember/debug';
import { getWithDefault, set, get } from '@ember/object';
import { capitalize } from '@ember/string';
import objectTransforms from '../utils/object-transforms';
import removeFromDOM from '../utils/remove-from-dom';
import BaseAdapter from './base';

const {
  compact
} = objectTransforms;

export default BaseAdapter.extend({
  dataLayer: 'dataLayer',

  toStringExtension() {
    return 'GoogleTagManager';
  },

  init() {
    const config = get(this, 'config');
    const { id, envParams } = config;
    const dataLayer = getWithDefault(config, 'dataLayer', 'dataLayer');
    const envParamsString = envParams ? `&${envParams}`: '';

    assert(`[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`, id);

    set(this, 'dataLayer', dataLayer);

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
    })(window, document, 'script', get(this, 'dataLayer'), id);
  },

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const dataLayer = get(this, 'dataLayer');
    const gtmEvent = {'event': compactedOptions['event']};
    const eventKeys = ['category', 'action', 'label', 'value'];

    delete compactedOptions['event'];

    for (let key in compactedOptions) {
      if (eventKeys.includes(key)) {
        const capitalizedKey = capitalize(key);
        gtmEvent[`event${capitalizedKey}`] = compactedOptions[key];
      } else {
        gtmEvent[key] = compactedOptions[key];
      }
    }

    window[dataLayer].push(gtmEvent);

    return gtmEvent;
  },

  trackPage(options = {}) {
    const compactedOptions = compact(options);
    const dataLayer = get(this, 'dataLayer');
    const sendEvent = {
      event: compactedOptions['event'] || 'pageview'
    };

    const pageEvent = assign(sendEvent, compactedOptions);

    window[dataLayer].push(pageEvent);

    return pageEvent;
  },

  willDestroy() {
    removeFromDOM('script[src*="gtm.js"]');

    delete window.dataLayer;
  }
});
