import { module, test } from 'qunit';
import { validatePiwikConfig } from '../../../configs/PiwikConfig';

module('Unit | Configurations | Piwik validations', function () {
  test('# A valid configuration succeeds.', function (assert) {
    const baseConfig = {
      piwikUrl: 'https://example.com/',
      siteId: 1,
    };
    const expectedResult = {
      piwikUrl: 'https://example.com/',
      siteId: 1,
    };

    assert.deepEqual(validatePiwikConfig(baseConfig), expectedResult);
  });

  test('# An invalid configuration throws.', function (assert) {
    const baseConfig = {
      piwikUrl: 1,
      siteId: 1,
    };

    assert.throws(
      () => validatePiwikConfig(baseConfig),
      new Error('[ember-metrics] Invalid string value for piwikUrl.')
    );
  });
});
