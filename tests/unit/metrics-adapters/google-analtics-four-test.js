import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import GoogleAnalyticsFour from 'dcp-ember-metrics/metrics-adapters/google-analytics-four';

module('google-analytics-four adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.config = {
      id: 'G-XXX',
      options: {
        send_page_view: false,
      },
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

  test('#trackPage does not send any data by default', function (assert) {
    const adapter = new GoogleAnalyticsFour({
      id: 'G-XXX',
    });

    this.adapter = adapter;
    adapter.install();

    sinon.stub(window, 'dataLayer').value({ push() {} });

    const result = adapter.trackPage({
      page: 'https://example.com/my-overridden-page?id=1',
      title: 'my overridden page',
    });

    const expectedResult = undefined;

    assert.deepEqual(
      result,
      expectedResult,
      'response is undefined, becaus send_page_view ist true by default'
    );
  });
});
