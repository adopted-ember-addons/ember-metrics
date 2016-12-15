import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let config, fbq, subject;

moduleFor('ember-metrics@metrics-adapter:facebook-pixel', 'facebook-pixel adapter', {
  beforeEach() {
    config = {
      id: '1234567890'
    };

    subject = this.subject({ config });

    fbq = sinon.sandbox.stub(window, 'fbq', () => {
      return true;
    });
  },

  afterEach() {
    fbq.restore();
  }
});

test('#trackEvent calls `fbq.track` with the right arguments', function(assert) {
  subject.trackEvent({ event: 'Foo', opt1: 'bar', opt2: 'baz' });
  assert.ok(fbq.calledWith('track', 'Foo', { opt1: 'bar', opt2: 'baz' }), 'it sends the correct arguments and options');
});

test('#trackPage calls `fbq.track` with the right arguments', function(assert) {
  subject.trackPage({ page: '/my-page', title: 'My Title' });
  assert.ok(fbq.calledWith('track', 'PageView', { page: '/my-page', title: 'My Title' }), 'it sends the correct arguments and options');
});
