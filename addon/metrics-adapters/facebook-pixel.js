import { compact } from 'dcp-ember-metrics/-private/utils/object-transforms';
import removeFromDOM from 'dcp-ember-metrics/-private/utils/remove-from-dom';
import BaseAdapter from './base';
import { assert } from '@ember/debug';

export default class FacebookPixel extends BaseAdapter {
  toStringExtension() {
    return 'FacebookPixel';
  }

  install() {
    const { id, dataProcessingOptions } = this.config;

    assert(
      `[dcp-ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`,
      id
    );

    if (window.fbq) {
      return;
    }

    this._injectScript();

    if (dataProcessingOptions) {
      const { method, country, state } = dataProcessingOptions;
      window.fbq('dataProcessingOptions', method, country, state);
    }

    window.fbq('init', id);

    // Leave this call due to Facebook API docs
    // https://developers.facebook.com/docs/facebook-pixel/api-reference#setup
    this.trackEvent({ event: 'PageView' });
  }

  /* eslint-disable */
  // prettier-ignore
  _injectScript() {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
  }
  /* eslint-enable */

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;

    if (!event) {
      return;
    }
    delete compactedOptions.event;

    if (window.fbq) {
      window.fbq('track', event, compactedOptions);
    }
  }

  trackPage(options = {}) {
    if (window.fbq) {
      window.fbq('track', 'PageView', options);
    }
  }

  uninstall() {
    if (window.fbq) {
      removeFromDOM('script[src*="fbevents.js"]');

      delete window.fbq;
      delete window._fbq;
    }
  }
}
