import removeScriptFromDOM from '../../../utils/remove-script-from-dom';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, removeSpy;

moduleFor('util:remove-script-from-dom', 'Unit | Utility | remove-script-from-dom', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(document, 'querySelectorAll').returns([{
      parentElement: {
        removeChild: (removeSpy = sinon.spy())
      }
    }]);
  },

  afterEach() {
    sandbox.restore();
  }
});

test('calls querySelectorAll with script selector passed', function(assert) {
  const selector = 'script[data-fb-script]';
  removeScriptFromDOM(selector);
  assert.ok(document.querySelectorAll.calledWith(selector));
});

test('calls removeChild for each element returned from the query', function(assert) {
  const selector = 'script[data-fb-script]';
  removeScriptFromDOM(selector);
  assert.equal(removeSpy.callCount, 1);
});

test('if canUseDom false, does not attempt to query DOM', function(assert) {
  const selector = 'script[data-fb-script]';
  const og = window.document.createElement;
  window.document.createElement = undefined;

  removeScriptFromDOM(selector);
  assert.equal(document.querySelectorAll.callCount, 0);
  assert.equal(removeSpy.callCount, 0);

  window.document.createElement = og;
});
