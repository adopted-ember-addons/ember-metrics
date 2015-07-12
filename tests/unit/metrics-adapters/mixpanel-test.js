import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;

moduleFor('ember-metrics@metrics-adapter:mixpanel', 'mixpanel adapter', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
    config = {
      token: 'meowmeows'
    };
  },
  afterEach() {
    sandbox.restore();
  }
});

test('#identify calls `mixpanel.identify` with the right arguments', function(assert) {
  var adapter = this.subject({ config });
  const stub = sandbox.stub(window.mixpanel, 'identify', () => {
    return true;
  });
  adapter.identify({
    distinctId: 123,
    foo: 'bar',
    cookie: 'chocolate chip'
  });
  adapter.identify({
    distinctId: 123
  });
  assert.ok(stub.firstCall.calledWith(123, { cookie: 'chocolate chip', foo: 'bar' }), 'it sends the correct arguments and options');
  assert.ok(stub.secondCall.calledWith(123), 'it sends the correct arguments');
});

test('#trackEvent calls `mixpanel.track` with the right arguments', function(assert) {
  var adapter = this.subject({ config });
  const stub = sandbox.stub(window.mixpanel, 'track', () => {
    return true;
  });
  adapter.trackEvent({
    event: 'Video played',
    videoLength: 213,
    id: 'hY7gQr0'
  });
  adapter.trackEvent({
    event: 'Ate a cookie'
  });
  assert.ok(stub.firstCall.calledWith('Video played', { videoLength: 213, id: 'hY7gQr0' }), 'it sends the correct arguments and options');
  assert.ok(stub.secondCall.calledWith('Ate a cookie'), 'it sends the correct arguments');
});

test('#alias calls `mixpanel.alias` with the right arguments', function(assert) {
  var adapter = this.subject({ config });
  const stub = sandbox.stub(window.mixpanel, 'alias', () => {
    return true;
  });
  adapter.alias({
    alias: 'user@example.com',
    original: 123
  });
  adapter.alias({
    alias: 'foo@bar.com'
  });
  assert.ok(stub.firstCall.calledWith('user@example.com', 123), 'it sends the correct arguments and options');
  assert.ok(stub.secondCall.calledWith('foo@bar.com'), 'it sends the correct arguments');
});
