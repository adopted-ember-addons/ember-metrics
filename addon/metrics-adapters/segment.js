import Ember from 'ember';
import canUseDOM from '../utils/can-use-dom';
import { compact } from '../utils/object-transforms';
import BaseAdapter from './base';

const {
  $,
  assert,
  copy,
  get
} = Ember;

export default BaseAdapter.extend({
  toStringExtension() {
    return 'Segment';
  },

  init() {
    const config = copy(get(this, 'config'));
    const segmentKey = config.key;

    assert(`[ember-metrics] You must pass a valid \`key\` to the ${this.toString()} adapter`, segmentKey);

    if (canUseDOM) {
      /* jshint ignore:start */
      window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";}
      /* jshint ignore:end */
      window.analytics.load(segmentKey);
    }
  },

  alias(options = {}) {
    const compactedOptions = compact(options);
    const { alias, original } = compactedOptions;

    if (original && canUseDOM) {
      window.analytics.alias(alias, original);
    } else if (canUseDOM){
      window.analytics.alias(alias);
    }
  },

  identify(options = {}) {
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    delete compactedOptions.distinctId;
    if(canUseDOM) {
      window.analytics.identify(distinctId, compactedOptions);
    }
  },

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    delete compactedOptions.event;

    if(canUseDOM) {
      window.analytics.track(event, compactedOptions);
    }
  },

  trackPage(options = {}) {
    const compactedOptions = compact(options);
    const { page } = compactedOptions;
    delete compactedOptions.page;

    if(canUseDOM) {
      window.analytics.page(page, compactedOptions);
    }
  },

  reset() {
    if(canUseDOM) {
      window.analytics.reset();
    }
  },

  willDestroy() {
    if(canUseDOM) {
      $('script[src*="segment.com"]').remove();
      delete window.analytics;
    }
  }
});
