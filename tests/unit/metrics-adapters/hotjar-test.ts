import { module, test } from 'qunit';
import type { TestContext } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import Hotjar from '#src/metrics-adapters/hotjar.ts';

interface HotjarContext extends TestContext {
  adapter: Hotjar;
}

module('hotjar adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (this: HotjarContext) {
    const config = {
      siteId: 123,
    };

    this.adapter = new Hotjar(config);
    this.adapter.install();
  });

  hooks.afterEach(function (this: HotjarContext) {
    this.adapter.uninstall();
  });

  test('#identify calls Hotjar with the right arguments', function (this: HotjarContext, assert) {
    const stub = sinon.stub(window, 'hj').callsFake(() => {
      return true;
    });

    const options = {
      userId: '12345678',
      attributes: {
        name: 'John doe',
        email: 'johndoe@email.com',
      },
    };

    this.adapter.identify(options);

    assert.spy(stub).calledWith(
      [
        'identify',
        '12345678',
        {
          name: 'John doe',
          email: 'johndoe@email.com',
        },
      ],
      'it sends the correct arguments',
    );
  });

  test('#trackEvent calls Hotjar with the right arguments', function (this: HotjarContext, assert) {
    const stub = sinon.stub(window, 'hj').callsFake(() => {
      return true;
    });

    const options = {
      actionName: 'page_viewed',
    };

    this.adapter.trackEvent(options);

    assert
      .spy(stub)
      .calledWith(['event', 'page_viewed'], 'it sends the correct arguments');
  });

  test('#trackPage calls Hotjar with the right arguments', function (this: HotjarContext, assert) {
    const stub = sinon.stub(window, 'hj').callsFake(() => {
      return true;
    });

    this.adapter.trackPage({
      actionName: 'test',
    });

    assert
      .spy(stub)
      .calledWith(['event', 'test'], 'it sends the correct arguments');

    this.adapter.trackPage();

    assert
      .spy(stub)
      .calledWith(['event', 'page_viewed'], 'it sends the correct arguments');
  });
});
