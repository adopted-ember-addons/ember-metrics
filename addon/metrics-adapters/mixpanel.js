import Ember from 'ember';
import canUseDOM from '../utils/can-use-dom';
import objectTransforms from '../utils/object-transforms';
import BaseAdapter from './base';

const {
  assert,
  $,
  get,
} = Ember;
const {
  without,
  compact,
  isPresent
} = objectTransforms;
const assign = Ember.assign || Ember.merge;

export default BaseAdapter.extend({
  toStringExtension() {
    return 'Mixpanel';
  },

  init() {
    const config = get(this, 'config');
    const { token } = config;

    assert(`[ember-metrics] You must pass a valid \`token\` to the ${this.toString()} adapter`, token);

    if (canUseDOM) {
      /* jshint ignore:start */
      (function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
      for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
      mixpanel.init(token);
      /* jshint ignore:end */
    }
  },

  identify(options = {}) {
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    const props = without(compactedOptions, 'distinctId');

    if (isPresent(props)) {
      window.mixpanel.identify(distinctId);
      window.mixpanel.people.set(props);
    } else {
      window.mixpanel.identify(distinctId);
    }
  },

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    const props = without(compactedOptions, 'event');

    if (isPresent(props)) {
      window.mixpanel.track(event, props);
    } else {
      window.mixpanel.track(event);
    }
  },

  trackPage(options = {}) {
    const event = { event: 'page viewed' };
    const mergedOptions = assign(event, options);

    this.trackEvent(mergedOptions);
  },

  alias(options = {}) {
    const compactedOptions = compact(options);
    const { alias, original } = compactedOptions;

    if (original) {
      window.mixpanel.alias(alias, original);
    } else {
      window.mixpanel.alias(alias);
    }
  },

  willDestroy() {
    $('script[src*="mixpanel"]').remove();
    delete window.mixpanel;
  }
});
