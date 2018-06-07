import $ from 'jquery';
import { assert } from '@ember/debug';
import { get } from '@ember/object';
import { assign } from '@ember/polyfills';
import canUseDOM from '../utils/can-use-dom';
import { compact } from '../utils/object-transforms';
import BaseAdapter from './base';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'Segment';
  },

  init() {
    const config = assign({}, get(this, 'config'));
    const segmentKey = config.key;

    assert(`[ember-metrics] You must pass a valid \`key\` to the ${this.toString()} adapter`, segmentKey);

    if (canUseDOM) {
      /* eslint-disable */
      (function(){var analytics=window.analytics=window.analytics||[];if(analytics.initialize){return}if(analytics.invoked){if(window.console&&console.error){console.error('Segment snippet included twice.')}return}analytics.invoked=true;analytics.methods=['trackSubmit','trackClick','trackLink','trackForm','pageview','identify','reset','group','track','ready','alias','debug','page','once','off','on'];analytics.factory=function(method){return function(){var args=Array.prototype.slice.call(arguments);args.unshift(method);analytics.push(args);return analytics}};for(var i=0;i<analytics.methods.length;i+=1){var key=analytics.methods[i];analytics[key]=analytics.factory(key)}analytics.load=function(key,options){var script=document.createElement('script');script.type='text/javascript';script.async=true;script.src=('https:'===document.location.protocol?'https://':'http://')+'cdn.segment.com/analytics.js/v1/'+key+'/analytics.min.js';var first=document.getElementsByTagName('script')[0];first.parentNode.insertBefore(script,first);analytics._loadOptions=options};analytics.SNIPPET_VERSION='4.1.0';analytics.load(segmentKey);analytics.page()})();
      /* eslint-enable */
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

  willDestroy() {
    if(canUseDOM) {
      $('script[src*="segment.com"]').remove();
      delete window.analytics;
    }
  }
});
