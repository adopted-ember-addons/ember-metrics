import { module, test } from 'qunit';
import type { TestContext } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import removeFromDOM from '#src/-private/utils/remove-from-dom.ts';

interface RemoveFromDOMContext extends TestContext {
  removeSpy: sinon.SinonSpy;
  querySpy: sinon.SinonStub;
}

module('Unit | Utility | remove-from-dom', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (this: RemoveFromDOMContext) {
    this.removeSpy = sinon.spy();
    this.querySpy = sinon.stub(document, 'querySelectorAll').returns([
      {
        parentElement: {
          removeChild: this.removeSpy,
        },
      },
    ] as unknown as NodeListOf<Element>);
  });

  hooks.afterEach(function (this: RemoveFromDOMContext) {
    this.querySpy.restore();
  });

  test('calls querySelectorAll with selector passed', function (this: RemoveFromDOMContext, assert) {
    const selector = 'script[data-fb-script]';
    removeFromDOM(selector);

    assert.spy(this.querySpy).calledWith([selector]);
  });

  test('calls removeChild for each element returned from the query', function (this: RemoveFromDOMContext, assert) {
    const selector = 'script[data-fb-script]';
    removeFromDOM(selector);

    assert.spy(this.removeSpy).calledOnce();
  });
});
