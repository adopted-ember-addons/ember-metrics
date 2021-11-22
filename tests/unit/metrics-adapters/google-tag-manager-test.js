import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import GoogleTagManager from 'ember-metrics/metrics-adapters/google-tag-manager';

module('google-tag-manager adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.config = {
      id: 'GTM-XXXX',
    };
  });

  hooks.afterEach(function () {
    this.adapter.uninstall();
  });

  test('#trackEvent returns the correct response shape', function (assert) {
    const adapter = new GoogleTagManager(this.config);
    this.adapter = adapter;
    adapter.install();

    sinon.stub(window, 'dataLayer').value({ push() {} });

    const result = adapter.trackEvent({
      event: 'click-button',
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4,
    });

    const expectedResult = {
      event: 'click-button',
      eventCategory: 'button',
      eventAction: 'click',
      eventLabel: 'nav buttons',
      eventValue: 4,
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });

  test('#trackPage returns the correct response shape', function (assert) {
    const adapter = new GoogleTagManager(this.config);
    this.adapter = adapter;
    adapter.install();

    sinon.stub(window, 'dataLayer').value({ push() {} });

    const result = adapter.trackPage({
      url: '/my-overridden-page?id=1',
      title: 'my overridden page',
    });

    const expectedResult = {
      event: 'pageview',
      url: '/my-overridden-page?id=1',
      title: 'my overridden page',
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });

  test('#trackPage accepts a custom dataLayer name', function (assert) {
    const customConfig = this.config;
    customConfig['dataLayer'] = 'customDataLayer';

    const adapter = new GoogleTagManager(this.config);
    this.adapter = adapter;
    adapter.install();

    sinon.stub(window, 'customDataLayer').value({ push() {} });

    const result = adapter.trackPage({
      url: '/my-overridden-page?id=1',
      title: 'my overridden page',
    });

    const expectedResult = {
      event: 'pageview',
      url: '/my-overridden-page?id=1',
      title: 'my overridden page',
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });

  test('#trackPage accepts custom `keyNames` and returns the correct response shape', function (assert) {
    const adapter = new GoogleTagManager(this.config);
    this.adapter = adapter;
    adapter.install();

    sinon.stub(window, 'dataLayer').value({ push() {} });

    const result = adapter.trackPage({
      event: 'VirtualPageView',
      VirtualPageUrl: '/my-overridden-page?id=1',
      VirtualTitle: 'my overridden page',
    });

    const expectedResult = {
      event: 'VirtualPageView',
      VirtualPageUrl: '/my-overridden-page?id=1',
      VirtualTitle: 'my overridden page',
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });
});
