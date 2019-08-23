import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, find } from '@ember/test-helpers';

module('Acceptance | application', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function(assert) {
    await visit('/');

    assert.equal(find('*').textContent, 'bar bar');
  });
});
