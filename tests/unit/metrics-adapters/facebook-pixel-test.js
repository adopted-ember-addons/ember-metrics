import { later } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let config, fbq, subject, sandbox;

moduleFor('ember-metrics@metrics-adapter:facebook-pixel', 'facebook-pixel adapter', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
    config = {
      id: '1234567890'
    };

    subject = this.subject({ config });

    return waitForScripts();
  },

  afterEach() {
    sandbox.restore();
  }
});

function waitForScripts() {
  return new EmberPromise(resolve => {
    function init() {
      fbq = sandbox.stub(window, 'fbq').callsFake(() => {
        return true;
      });
      resolve();
    }

    (function wait() {
      // check for the generic script
      if (window.fbq.instance) {
        init();
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
