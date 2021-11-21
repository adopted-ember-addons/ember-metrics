import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';

module('google-analytics adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.config = {
      id: 'UA-XXXX-Y',
      require: ['ecommerce'],
    };

    this.adapter = null;
  });

  hooks.afterEach(function () {
    this.adapter.uninstall();
  });

  test('#init calls ga create with a valid config', function (assert) {
    this.config.sendHitTask = false;
    this.config.debug = false;
    this.config.trace = false;
    this.config.sampleRate = 5;

    const adapter = new GoogleAnalytics(this.config);
    this.adapter = adapter;

    // We can't stub GA before it exists, and we really want to check that it is installed
    // correctly. Therefore let's set up a completely fake GA object so that we can stub
    // its setup, and assert upon it therein.
    sinon.stub(adapter, '_injectScript').callsFake(() => {});
    window.ga = function () {};

    const stub = sinon.stub(window, 'ga').callsFake(() => {
      return true;
    });

    adapter.install();

    assert
      .spy(stub)
      .calledWith(
        ['create', this.config.id, { sampleRate: 5 }],
        'it sends the correct config values'
      );
  });

  test('#init calls ga create with a valid config including trackerName', function (assert) {
    this.config.sendHitTask = false;
    this.config.debug = false;
    this.config.trace = false;
    this.config.sampleRate = 5;
    this.config.trackerName = 'myEngineTracker';

    const adapter = new GoogleAnalytics(this.config);
    this.adapter = adapter;

    // We can't stub GA before it exists, and we really want to check that it is installed
    // correctly. Therefore let's set up a completely fake GA object so that we can stub
    // its setup, and assert upon it therein.
    sinon.stub(adapter, '_injectScript').callsFake(() => {});
    window.ga = function () {};

    const stub = sinon.stub(window, 'ga').callsFake(() => {
      return true;
    });

    adapter.install();

    assert
      .spy(stub)
      .calledWith(
        ['create', this.config.id, { sampleRate: 5 }, 'myEngineTracker'],
        'it sends the correct config values'
      );

    assert.strictEqual(
      adapter.gaSendKey,
      'myEngineTracker.send',
      'ga has myEngineTracker trackerName set'
    );
  });

  test('#init calls ga for any plugins specified', function (assert) {
    const adapter = new GoogleAnalytics(this.config);
    this.adapter = adapter;

    // We can't stub GA before it exists, and we really want to check that it is installed
    // correctly. Therefore let's set up a completely fake GA object so that we can stub
    // its setup, and assert upon it therein.
    sinon.stub(adapter, '_injectScript').callsFake(() => {});
    window.ga = function () {};

    const stub = sinon.stub(window, 'ga').callsFake(() => {
      return true;
    });

    adapter.install();

    assert
      .spy(stub)
      .calledWith(['require', 'ecommerce'], 'it sends the correct arguments');
  });

  test('#identify calls ga with the right arguments', function (assert) {
    const adapter = new GoogleAnalytics(this.config);
    adapter.install();
    this.adapter = adapter;

    const stub = sinon.stub(window, 'ga').callsFake(() => {
      return true;
    });

    adapter.identify({ distinctId: 123 });

    assert
      .spy(stub)
      .calledWith(['set', 'userId', 123], 'it sends the correct arguments');
  });

  test('#trackEvent returns the correct response shape', function (assert) {
    const adapter = new GoogleAnalytics(this.config);
    adapter.install();
    this.adapter = adapter;

    sinon.stub(window, 'ga');

    const result = adapter.trackEvent({
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4,
      dimension1: true,
    });

    const expectedResult = {
      hitType: 'event',
      eventCategory: 'button',
      eventAction: 'click',
      eventLabel: 'nav buttons',
      eventValue: 4,
      dimension1: true,
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });

  test('#trackPage returns the correct response shape', function (assert) {
    const adapter = new GoogleAnalytics(this.config);
    adapter.install();
    this.adapter = adapter;

    sinon.stub(window, 'ga');

    const result = adapter.trackPage({
      page: '/my-overridden-page?id=1',
      title: 'my overridden page',
    });

    const expectedResult = {
      hitType: 'pageview',
      page: '/my-overridden-page?id=1',
      title: 'my overridden page',
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );

    assert.deepEqual(
      adapter.trackPage(),
      { hitType: 'pageview' },
      'it sends the correct response shape'
    );
  });

  test('#trackEvent with trackerName returns the correct response shape', function (assert) {
    const adapter = new GoogleAnalytics(this.config);
    adapter.install();
    this.adapter = adapter;

    sinon.stub(window, 'ga');

    const result = adapter.trackEvent({
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4,
      dimension1: true,
    });

    const expectedResult = {
      hitType: 'event',
      eventCategory: 'button',
      eventAction: 'click',
      eventLabel: 'nav buttons',
      eventValue: 4,
      dimension1: true,
    };

    assert.deepEqual(
      result,
      expectedResult,
      'it sends the correct response shape'
    );
  });
});
