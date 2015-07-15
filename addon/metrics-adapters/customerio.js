import Ember from 'ember';
import canUseDOM from '../utils/can-use-dom';
import objectTransforms from '../utils/object-transforms';
import BaseAdapter from './base';

const get = Ember.get;
const { assert, $ } = Ember;
const { isPresent } = objectTransforms;

export default BaseAdapter.extend({
  toStringExtension() {
    return 'customerio';
  },

  init() {
    const config = get(this, 'config');
    const { siteid } = config;

    assert(`[ember-metrics] You must pass a valid \`siteid\` to the ${this.toString()} adapter`, siteid);

    if (canUseDOM) {
      /* jshint ignore:start */
      window._cio = window._cio || [];

      (function() {
        var a,b,c;a=function(f){return function(){window._cio.push([f].
        concat(Array.prototype.slice.call(arguments,0)))}};b=["identify",
        "track"];for(c=0;c<b.length;c++){window._cio[b[c]]=a(b[c])};
        var t = document.createElement('script'),
            s = document.getElementsByTagName('script')[0];
        t.async = true;
        t.id    = 'cio-tracker';
        t.setAttribute('data-site-id', siteid);
        t.src = 'https://assets.customer.io/assets/track.js';
        s.parentNode.insertBefore(t, s);
      })();
      /* jshint ignore:end */
    }
  },

  identify(options = {}) {
    assert('You have sent in an empty object for identifying your user', isPresent(options));

    window._cio.identify(options);
  },

  trackEvent(options = {}) {
    let { name } = options;

    delete options.name;

    assert('You must provide a name for your event', name);

    window._cio.track(name, options);
  },

  willDestroy() {
    $('script[src*="customer.io"]').remove();
    delete window._cio;
  }
});
