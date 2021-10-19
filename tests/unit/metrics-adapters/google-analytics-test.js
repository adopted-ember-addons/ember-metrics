import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';

let sandbox, config;

module('google-analytics adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    sandbox = sinon.createSandbox();
    config = {
      id: 'UA-XXXX-Y',
      require: ['ecommerce'],
    };
  });

  hooks.afterEach(function () {
    sandbox.restore();
  });

  test('#init calls ga create with a valid config', function (assert) {
    config.sendHitTask = false;
    config.debug = false;
    config.trace = false;
    config.sampleRate = 5;

    const adapter = new GoogleAnalytics(config);
    const stub = sandbox.stub(window, 'ga').callsFake(() => {
      return true;
    });
    adapter.init();

    assert.ok(
      stub.calledWith('create', config.id, {
        sampleRate: 5,
      }),
      'it sends the correct config values'
    );
  });

  test('#init calls ga create with a valid config including trackerName', function (assert) {
    config.sendHitTask = false;
    config.debug = false;
    config.trace = false;
    config.sampleRate = 5;
    config.trackerName = 'myEngineTracker';

    const adapter = new GoogleAnalytics(config);
    const stub = sandbox.stub(window, 'ga').callsFake(() => {
      return true;
    });
    adapter.init();

    assert.ok(
      stub.calledWith(
        'create',
        config.id,
        {
          sampleRate: 5,
        },
        'myEngineTracker'
      ),
      'it sends the correct config values'
    );
    assert.equal(
      adapter.gaSendKey,
      'myEngineTracker.send',
      'ga has myEngineTracker trackerName set'
    );
  });

  test('#init calls ga for any plugins specified', function (assert) {
    const adapter = new GoogleAnalytics(config);
    const stub = sandbox.stub(window, 'ga').callsFake(() => {
      return true;
    });
    adapter.init();
    assert.ok(
      stub.calledWith('require', 'ecommerce'),
      'it sends the correct arguments'
    );
  });

  test('#identify calls ga with the right arguments', function (assert) {
    const adapter = new GoogleAnalytics(config);
    const stub = sandbox.stub(window, 'ga').callsFake(() => {
      return true;
    });
    adapter.identify({
      distinctId: 123,
    });
    assert.ok(
      stub.calledWith('set', 'userId', 123),
      'it sends the correct arguments'
    );
  });

  test('#trackEvent returns the correct response shape', function (assert) {
    const adapter = new GoogleAnalytics(config);
    sandbox.stub(window, 'ga');
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
    const adapter = new GoogleAnalytics(config);
    sandbox.stub(window, 'ga');

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
    const adapter = new GoogleAnalytics(config);
    sandbox.stub(window, 'ga');
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
