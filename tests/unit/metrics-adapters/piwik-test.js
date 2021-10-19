import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import Piwik from 'ember-metrics/metrics-adapters/piwik';

let sandbox, config, adapter;

module('piwik adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    sandbox = sinon.createSandbox();
    config = {
      piwikUrl: '/assets',
      siteId: 42,
    };
    adapter = new Piwik(config);
  });

  hooks.afterEach(function () {
    sandbox.restore();
  });

  test('#identify calls piwik with the right arguments', function (assert) {
    const stub = sandbox.stub(window._paq, 'push').callsFake(() => {
      return true;
    });
    adapter.identify({
      userId: 123,
    });
    assert.ok(
      stub.calledWith(['setUserId', 123]),
      'it sends the correct arguments'
    );
  });

  test('#trackEvent calls piwik with the right arguments', function (assert) {
    const stub = sandbox.stub(window._paq, 'push').callsFake(() => {
      return true;
    });
    adapter.trackEvent({
      category: 'button',
      action: 'click',
      name: 'nav buttons',
      value: 4,
    });

    assert.ok(
      stub.calledWith(['trackEvent', 'button', 'click', 'nav buttons', 4]),
      'it sends the correct arguments'
    );
  });

  test('#trackPage calls piwik with the right arguments', function (assert) {
    const stub = sandbox.stub(window._paq, 'push').callsFake(() => {
      return true;
    });
    adapter.trackPage({
      page: '/my-overridden-page?id=1',
      title: 'my overridden page',
    });
    assert.ok(
      stub.calledWith(['setCustomUrl', '/my-overridden-page?id=1']),
      'it sends the correct arguments'
    );
    assert.ok(
      stub.calledWith(['trackPageView', 'my overridden page']),
      'it sends the correct arguments'
    );
  });
});
