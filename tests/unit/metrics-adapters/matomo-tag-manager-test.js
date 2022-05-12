import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import MatomoTagManager from 'ember-metrics/metrics-adapters/matomo-tag-manager';

module('matomo-tag-manager adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    const config = {
      matomoUrl: 'matomo.my.example.net',
      containerId: 'abcd123',
    };

    this.adapter = new MatomoTagManager(config);
  });

  test('#identify calls MatomoTagManager with the right arguments', function (assert) {
    const stub = sinon.stub(window._mtm, 'push').callsFake(() => {
      return true;
    });

    this.adapter.identify({ userId: 123 });

    assert
      .spy(stub)
      .calledWith([['setUserId', 123]], 'it sends the correct arguments');
  });

  test('#trackEvent calls MatomoTagManager with the right arguments', function (assert) {
    const stub = sinon.stub(window._mtm, 'push').callsFake(() => {
      return true;
    });

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
        'it sends the correct arguments'
      );
  });

  test('#trackPage calls MatomoTagManager with the right arguments', function (assert) {
    const stub = sinon.stub(window._mtm, 'push').callsFake(() => {
      return true;
    });

    this.adapter.trackPage({
      page: '/my-overridden-page?id=1',
      title: 'my overridden page',
    });

    assert
      .spy(stub)
      .calledWith(
        [['setCustomUrl', '/my-overridden-page?id=1']],
        'it sends the correct arguments'
      );

    assert
      .spy(stub)
      .calledWith(
        [['trackPageView', 'my overridden page']],
        'it sends the correct arguments'
      );
  });
});
