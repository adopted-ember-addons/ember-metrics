import { module, test } from 'qunit';
import type { TestContext } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import Piwik from '#src/metrics-adapters/piwik.js';

interface PiwikContext extends TestContext {
  adapter: Piwik;
}

module('piwik adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (this: PiwikContext) {
    const config = {
      piwikUrl: '/assets',
      siteId: 42,
    };

    this.adapter = new Piwik(config);
    this.adapter.install();
  });

  hooks.afterEach(function (this: PiwikContext) {
    this.adapter.uninstall();
  });

  test('#identify calls piwik with the right arguments', function (this: PiwikContext, assert) {
    const stub = sinon.stub(window._paq, 'push');

    this.adapter.identify({ userId: 123 });

    assert
      .spy(stub)
      .calledWith([['setUserId', 123]], 'it sends the correct arguments');
  });

  test('#trackEvent calls piwik with the right arguments', function (this: PiwikContext, assert) {
    const stub = sinon.stub(window._paq, 'push');

    this.adapter.trackEvent({
      category: 'button',
      action: 'click',
      name: 'nav buttons',
      value: 4,
    });

    assert
      .spy(stub)
      .calledWith(
        [['trackEvent', 'button', 'click', 'nav buttons', 4]],
        'it sends the correct arguments',
      );
  });

  test('#trackPage calls piwik with the right arguments', function (this: PiwikContext, assert) {
    const stub = sinon.stub(window._paq, 'push');

    this.adapter.trackPage({
      page: '/my-overridden-page?id=1',
      title: 'my overridden page',
    });

    assert
      .spy(stub)
      .calledWith(
        [['setCustomUrl', '/my-overridden-page?id=1']],
        'it sends the correct arguments',
      );

    assert
      .spy(stub)
      .calledWith(
        [['trackPageView', 'my overridden page']],
        'it sends the correct arguments',
      );
  });
});
