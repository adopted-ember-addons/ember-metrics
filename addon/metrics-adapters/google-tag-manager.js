import Ember from 'ember';
import canUseDOM from '../utils/can-use-dom';
import objectTransforms from '../utils/object-transforms';
import BaseAdapter from './base';

const {
  assert,
  get,
  set,
  $,
  getWithDefault,
  String: { capitalize }
} = Ember;
const assign = Ember.assign || Ember.merge;
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
    const { id } = config;
    const dataLayer = getWithDefault(config,'dataLayer', 'dataLayer');

    assert(`[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`, id);

    set(this, 'dataLayer', dataLayer);

    if (canUseDOM) {
      /* jshint ignore:start */
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script',get(this, 'dataLayer'),id);
      /* jshint ignore:end */
    }
  },

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const dataLayer = get(this, 'dataLayer');
    const gtmEvent = {'event': compactedOptions['event']};

    delete compactedOptions['event'];

    for (let key in compactedOptions) {
      const capitalizedKey = capitalize(key);
      gtmEvent[`event${capitalizedKey}`] = compactedOptions[key];
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
    $('script[src*="gtm.js"]').remove();
    delete window.dataLayer;
  }
});
