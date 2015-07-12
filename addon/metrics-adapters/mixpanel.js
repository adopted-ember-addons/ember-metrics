import Ember from 'ember';
import canUseDOM from '../utils/can-use-dom';
import objectTransforms from '../utils/object-transforms';
import BaseAdapter from './base';

const get = Ember.get;
const {
  assert,
  $
} = Ember;
const {
  without,
  compact,
  isPresent
} = objectTransforms;

export default BaseAdapter.extend({
  toStringExtension() {
    return 'Mixpanel';
  },

  init() {
    const config = get(this, 'config');
    const {
      token
    } = config;

    assert('[ember-metrics@google-analytics] You must pass a valid `token` to the Mixpanel adapter', token);

    if (canUseDOM) {
      /* jshint ignore:start */
      (function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
      for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=f.getElementsByTagName("script")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);
      mixpanel.init(token);
      /* jshint ignore:end */
    }
  },

  identify(options = {}) {
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    const props = without(compactedOptions, 'distinctId');

    if (isPresent(props)) {
      window.mixpanel.identify(distinctId, props);
    } else {
      window.mixpanel.identify(distinctId);
    }
  },

  trackEvent(options ={}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    const props = without(compactedOptions, 'event');

    if (isPresent(props)) {
      window.mixpanel.track(event, props);
    } else {
      window.mixpanel.track(event);
    }
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
