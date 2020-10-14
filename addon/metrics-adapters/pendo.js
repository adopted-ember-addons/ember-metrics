import BaseAdapter from './base';
import removeFromDOM from '../utils/remove-from-dom';
import { assert } from '@ember/debug';
import { without, compact, isPresent } from '../utils/object-transforms';

export default class Pendo extends BaseAdapter {
  toStringExtension() {
    return 'pendo';
  }

  init() {
    const { token } = this.config;

    assert(`[ember-metrics] You must pass a valid \`token\` to the ${this.toString()} adapter`, token);

    /* eslint-disable */
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=[];
    v=['initialize','identify','updateOptions','pageLoad'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src=`https://cdn.pendo.io/agent/static/${apiKey}/pendo.js`;
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
    /* eslint-enable */
  }

  identify(options = {}) {
    window.pendo.initialize(options);
  }

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    const props = without(compactedOptions, 'event');
    delete options.event;

    if (isPresent(props)) {
      window.pendo.track(event, options);
    }
  }

  willDestroy() {
    removeFromDOM('script[src*="pendo"]');

    delete window.pendo;
  }
}
