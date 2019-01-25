import removeScriptFromDOM from 'dummy/utils/remove-script-from-dom';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, removeChildSpy;

moduleFor('Unit | Utility | remove script from dom', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
    removeChildSpy = sinon.spy();
    sandbox.stub(document, 'querySelectorAll').returns([
      { parentElement: { removeChild: removeChildSpy } }
    ]);
  },

  afterEach() {
    sandbox.restore();
  }
});

test('if dom, attempts script removal', function(assert) {
  const script = 'script[example]';

  removeScriptFromDOM(script);

  assert.ok(sinon.assert.calledOnce(removeChildSpy), 'expected removeChild to be called');
  assert.ok(
    sinon.assert.calledWith(document.querySelectorAll, script),
    'expected stub to be called with script'
  );
});
