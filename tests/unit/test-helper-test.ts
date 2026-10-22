import { module, test } from 'qunit';
import { isExternalUrl } from '../test-helper.ts';

module('Unit | Test helper | external URLs', function () {
  test('distinguishes the local test origin from external provider origins', function (assert) {
    assert.false(
      isExternalUrl(window.location.href),
      'the test app origin is local',
    );
    assert.false(
      isExternalUrl('/synthetic-provider.js'),
      'relative URLs stay local',
    );
    assert.true(
      isExternalUrl('https://analytics.example.invalid/sdk.js'),
      'an external provider URL is recognized without making a request',
    );
  });
});
