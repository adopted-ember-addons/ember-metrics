import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;

moduleFor('ember-metrics@metrics-adapter:piwik', 'piwik adapter', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
    config = {
      piwikUrl: "http://my-cool-url.com",
      siteId: 42
    };
  },
  afterEach() {
    sandbox.restore();
  }
});

test('#identify calls piwik with the right arguments', function(assert) {
  const adapter = this.subject({ config });
  const stub = sandbox.stub(window._paq, 'push', () => {
    return true;
  });
  adapter.identify({
    userId: 123
  });
  assert.ok(stub.calledWith(['setUserId', 123]), 'it sends the correct arguments');
});

test('#trackEvent calls piwik with the right arguments', function(assert) {
  const adapter = this.subject({ config });
  const stub = sandbox.stub(window._paq, 'push', () => {
    return true;
  });
  adapter.trackEvent({
    category: 'button',
    action: 'click',
    name: 'nav buttons',
    value: 4
  });

  assert.ok(stub.calledWith(['trackEvent', 'button', 'click', 'nav buttons', 4]), 'it sends the correct arguments');
});

test('#trackPage calls piwik with the right arguments', function(assert) {
  const adapter = this.subject({ config });
  const stub = sandbox.stub(window._paq, 'push', () => {
    return true;
  });
  adapter.trackPage({
    page: '/my-overridden-page?id=1',
    title: 'my overridden page'
  });
  assert.ok(stub.calledWith(['setCustomUrl', '/my-overridden-page?id=1']), 'it sends the correct arguments');
  assert.ok(stub.calledWith(['trackPageView', 'my overridden page']), 'it sends the correct arguments');
});
