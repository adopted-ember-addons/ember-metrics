import Ember from 'ember';
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
  return new Ember.RSVP.Promise(resolve => {
    (function wait() {
      // check for the generic script
      // easiest check to prevent race condition
      if (window.fbq.version > '2.0') {
        // now check for the custom script
        // `fbq.on` is now ready (`fbq.once` would be better but has a bug)
        window.fbq.on('configLoaded', name => {
          if (name === config.id) {
            fbq = sinon.spy(window, 'fbq');
            resolve();
          }
        });
      } else {
        Ember.run.later(wait, 10);
      }
    })();
  });
}

test('#trackEvent calls `fbq.track` with the right arguments', function(assert) {
  subject.trackEvent({ event: 'Foo', opt1: 'bar', opt2: 'baz' });
  assert.ok(fbq.calledWith('track', 'Foo', { opt1: 'bar', opt2: 'baz' }), 'it sends the correct arguments and options');
});

test('#trackPage calls `fbq.track` with the right arguments', function(assert) {
  subject.trackPage({ page: '/my-page', title: 'My Title' });
  assert.ok(fbq.calledWith('track', 'PageView', { page: '/my-page', title: 'My Title' }), 'it sends the correct arguments and options');
});
