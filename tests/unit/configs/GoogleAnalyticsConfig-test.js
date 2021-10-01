import { module, test } from 'qunit';
import { validateGoogleAnalyticsConfig } from '../../../configs/GoogleAnalyticsConfig';

module('Unit | Configurations | Google Analytics validations', function () {
  test('# A minimal valid configuration succeeds.', function (assert) {
    const baseConfig = {
      id: 'ga-id',
    };
    const expectedResult = {
      id: 'ga-id',
      debug: undefined,
      require: undefined,
      sendHitTask: undefined,
      trace: undefined,
      trackerName: undefined,
    };

    assert.deepEqual(validateGoogleAnalyticsConfig(baseConfig), expectedResult);
  });

  test('# A full valid configuration succeeds.', function (assert) {
    const baseConfig = {
      id: 'ga-id',
      debug: false,
      require: ['ecommerce'],
      sendHitTask: true,
      trace: false,
      trackerName: 'tracker-name',
    };
    const expectedResult = {
      id: 'ga-id',
      debug: false,
      require: ['ecommerce'],
      sendHitTask: true,
      trace: false,
      trackerName: 'tracker-name',
    };

    assert.deepEqual(validateGoogleAnalyticsConfig(baseConfig), expectedResult);
  });

  test('# An invalid configuration throws.', function (assert) {
    const baseConfig = {
      foo: 'ga-id',
    };

    assert.throws(
      () => validateGoogleAnalyticsConfig(baseConfig),
      new Error('[ember-metrics] Invalid string value for id.')
    );
  });
});
