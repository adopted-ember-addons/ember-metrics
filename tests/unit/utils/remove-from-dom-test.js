import removeFromDOM from '../../../utils/remove-from-dom';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Utility | remove-from-dom', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.removeSpy = sinon.spy();
    this.querySpy = sinon.stub(document, 'querySelectorAll').returns([
      {
        parentElement: {
          removeChild: this.removeSpy,
        },
      },
    ]);
  });

  test('calls querySelectorAll with selector passed', function (assert) {
    const selector = 'script[data-fb-script]';
    removeFromDOM(selector);

    assert.spy(this.querySpy).calledWith([selector]);
  });

  test('calls removeChild for each element returned from the query', function (assert) {
    const selector = 'script[data-fb-script]';
    removeFromDOM(selector);

    assert.spy(this.removeSpy).calledOnce();
  });
});
