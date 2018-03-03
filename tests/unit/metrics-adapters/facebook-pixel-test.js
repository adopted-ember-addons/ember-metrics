import { later } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let config, fbq, subject;

moduleFor('ember-metrics@metrics-adapter:facebook-pixel', 'facebook-pixel adapter', {
  beforeEach() {
    config = {
      id: '1234567890'
    };

    subject = this.subject({ config });

    return waitForScripts();
  },

  afterEach() {
    fbq.restore();
  }
});

function waitForScripts() {
  return new EmberPromise(resolve => {
    function init() {
      fbq = sinon.spy(window, 'fbq');
      resolve();
    }

    (function wait() {
      // check for the generic script
      if (window.fbq.instance) {
        // now check for the custom script
        // it may have already loaded and
        // registering a listener will never fire
        if (window.fbq.instance.configsLoaded[config.id]) {
          init();
        } else {
          // not ready, so use the event system
          // (`fbq.once` would be better but has a bug)
          window.fbq.on('configLoaded', name => {
            if (name === config.id) {
              init();
            }
          });
        }
      } else {
        // generic script hasn't run yet
        later(wait, 10);
      }
    })();
  });
}

test('#trackEvent calls `fbq.track` with the right arguments', function(assert) {
  subject.trackEvent({ event: 'Search', opt1: 'bar', opt2: 'baz' });
  assert.ok(fbq.calledWith('track', 'Search', { opt1: 'bar', opt2: 'baz' }), 'it sends the correct arguments and options');
});

test('#trackPage calls `fbq.track` with the right arguments', function(assert) {
  subject.trackPage({ page: '/my-page', title: 'My Title' });
  assert.ok(fbq.calledWith('track', 'PageView', { page: '/my-page', title: 'My Title' }), 'it sends the correct arguments and options');
});
