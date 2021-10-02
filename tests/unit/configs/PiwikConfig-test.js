import { module, test } from 'qunit';
import { validatePiwikConfig } from '../../../configs/PiwikConfig';

module('Unit | Configurations | Piwik validations', function () {
  test('# A valid configuration succeeds.', function (assert) {
    const baseConfig = {
      piwikUrl: 'https://www.example.com/',
      siteId: 1,
    };
    const expectedResult = {
      piwikUrl: 'https://www.example.com/',
      siteId: 1,
    };

    assert.deepEqual(validatePiwikConfig(baseConfig), expectedResult);
  });

  test('# A configuration that is invalid by type throws.', function (assert) {
    const baseConfig = {
      piwikUrl: 1,
      siteId: 1,
    };

    assert.throws(
      () => validatePiwikConfig(baseConfig),
      new Error('[ember-metrics] Invalid string value for piwikUrl.')
    );
  });

  test('# A configuration that is invalid by constraint throws.', function (assert) {
    const baseConfig = {
      piwikUrl: 'https://www.example.com/',
      siteId: -1,
    };

    assert.throws(
      () => validatePiwikConfig(baseConfig),
      new Error('[ember-metrics] Invalid number value for siteId.')
    );
  });
});
