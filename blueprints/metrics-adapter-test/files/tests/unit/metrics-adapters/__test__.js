import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import <%= classifiedModuleName %> from '<%= dasherizedPackageName %>/metrics-adapters/<%= dasherizedModuleName %>';

module('<%= friendlyTestDescription %>', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = new <%= classifiedModuleName %>({
      // TODO: Add adapter config
    });
    assert.ok(adapter);
  });
});
