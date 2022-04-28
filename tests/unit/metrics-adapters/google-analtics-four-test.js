import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import GoogleAnalyticsFour from 'ember-metrics/metrics-adapters/google-analytics-four';

module('google-analytics-four adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.config = {
      id: 'G-XXX',
    };
  });

  hooks.afterEach(function () {
    this.adapter.uninstall();
  });

  test('#trackEvent returns the correct response shape', function (assert) {
    const adapter = new GoogleAnalyticsFour(this.config);
    this.adapter = adapter;
    adapter.install();

    sinon.stub(window, 'dataLayer').value({ push() {} });

    const result = adapter.trackEvent({
      event: 'event_name',
      property_name: 'property name',
    });

    const expectedResult = {
      0: 'event',
      1: 'event_name',
      2: {
        property_name: 'property name',
      },
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });

  test('#trackPage returns the correct response shape', function (assert) {
    const adapter = new GoogleAnalyticsFour(this.config);
    this.adapter = adapter;
    adapter.install();

    sinon.stub(window, 'dataLayer').value({ push() {} });

    const result = adapter.trackPage({
      page: 'https://example.com/my-overridden-page?id=1',
      title: 'my overridden page',
    });

    const expectedResult = {
      0: 'event',
      1: 'page_view',
      2: {
        page_location: 'https://example.com/my-overridden-page?id=1',
        page_title: 'my overridden page',
      },
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });
});
