import removeFromDOM from '../../../utils/remove-from-dom';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, removeSpy;

moduleFor('util:remove-from-dom', 'Unit | Utility | remove-from-dom', {
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

test('calls querySelectorAll with selector passed', function(assert) {
  const selector = 'script[data-fb-script]';
  removeFromDOM(selector);
  assert.ok(document.querySelectorAll.calledWith(selector));
});

test('calls removeChild for each element returned from the query', function(assert) {
  const selector = 'script[data-fb-script]';
  removeFromDOM(selector);
  assert.equal(removeSpy.callCount, 1);
});
