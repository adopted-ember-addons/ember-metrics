import BaseAdapter from './base';
import { assert } from '@ember/debug';
import { without, compact, isPresent } from '../utils/object-transforms';
import removeFromDOM from '../utils/remove-from-dom';

export default class Pendo extends BaseAdapter {
  toStringExtension() {
    return 'Pendo';
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    const { apiKey } = this.config;

    assert(
      `[ember-metrics] You must pass a valid \`apiKey\` to the ${this.toString()} adapter`,
      apiKey
    );

    this._injectScript(apiKey);

    window.pendo.initialize(this.config);
  }

  /* eslint-disable */
  // prettier-ignore
  _injectScript(apiKey) {
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=[];
      v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){
          o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
          y=e.createElement(n);y.async=!0;y.src=`https://cdn.pendo.io/agent/static/${apiKey}/pendo.js`;
          z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);
      })(window,document,'script','pendo');
  }
  /* eslint-enable */

  identify(options = {}) {
    const compactedOptions = compact(options);

    window.pendo.identify(compactedOptions);
  }

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    const props = without(compactedOptions, 'event');

    if (isPresent(props)) {
      window.pendo.track(event, props);
    } else {
      window.pendo.track(event);
    }
  }

  trackPage(options = {}) {
    const event = { event: 'page viewed' };
    const mergedOptions = { ...event, ...options };

    this.trackEvent(mergedOptions);
  }

  willDestroy() {
    removeFromDOM('script[src*="pendo.js"]');

    delete window.pendo;
  }
}
