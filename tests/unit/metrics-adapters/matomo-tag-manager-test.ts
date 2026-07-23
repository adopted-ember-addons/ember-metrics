import { module, test } from 'qunit';
import type { TestContext } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import MatomoTagManager from '#src/metrics-adapters/matomo-tag-manager.js';

interface MatomoContext extends TestContext {
  adapter: MatomoTagManager;
}

module('matomo-tag-manager adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (this: MatomoContext) {
    const config = {
      matomoUrl: 'matomo.my.example.net',
      containerId: 'abcd123',
    };

    this.adapter = new MatomoTagManager(config);
    this.adapter.install();
  });

  hooks.afterEach(function (this: MatomoContext) {
    this.adapter.uninstall();
  });

  test('#identify calls MatomoTagManager with the right arguments', function (this: MatomoContext, assert) {
    const stub = sinon.stub(window._mtm, 'push');

    this.adapter.identify({ userId: 123 });

    assert
      .spy(stub)
      .calledWith([['setUserId', 123]], 'it sends the correct arguments');
  });

  test('#trackEvent calls MatomoTagManager with the right arguments', function (this: MatomoContext, assert) {
    const stub = sinon.stub(window._mtm, 'push');

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

  test('#trackPage calls MatomoTagManager with the right arguments', function (this: MatomoContext, assert) {
    const stub = sinon.stub(window._mtm, 'push');

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
