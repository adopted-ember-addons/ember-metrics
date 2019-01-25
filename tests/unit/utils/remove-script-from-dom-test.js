import removeScriptFromDOM from '../../../utils/remove-script-from-dom';
import { module, test } from 'qunit';

module('Unit | Utility | remove-script-from-dom');

test('it exists', function(assert) {
  assert.ok(removeScriptFromDOM(), 'function can be called');
})
