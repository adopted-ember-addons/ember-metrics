import removeScriptFromDOM from '../../../utils/remove-script-from-dom';
import { moduleFor, test } from 'ember-qunit';

moduleFor('util:remove-script-from-dom', 'Unit | Util | remove-script-from-dom', {});

test('it exists', function(assert) {
  assert.ok(removeScriptFromDOM(), 'function can be called');
})
