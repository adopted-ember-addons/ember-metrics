import removeScriptFromDOM from 'dummy/utils/remove-script-from-dom';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, removeChildSpy;

function setupDOM() {
  // eslint-disable-next-line no-global-assign
  window = window || {};
  // eslint-disable-next-line no-global-assign
  document = document || { createElement: function() {} };

  sandbox.stub(document, 'querySelectorAll').returns([
    { parentElement: { removeChild: removeChildSpy } }
  ]);
}

moduleFor('util:remove-script-from-dom', 'Unit | Util | remove-script-from-dom', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
    removeChildSpy = sinon.spy();
  },

  afterEach() {
    sandbox.restore();
  }
});

test('if dom, attempts script removal', function(assert) {
  const script = 'script[example]';
  setupDOM();

  removeScriptFromDOM(script);

  assert.ok(sinon.assert.calledOnce(removeChildSpy), 'expected removeChild to be called');
  assert.ok(
    sinon.assert.calledWith(document.querySelectorAll, script),
    'expected querySelectorAll stub to be called with script'
  );
});
