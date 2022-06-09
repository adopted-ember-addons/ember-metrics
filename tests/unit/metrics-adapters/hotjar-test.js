import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import Hotjar from 'ember-metrics/metrics-adapters/hotjar';

module('hotjar adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    const config = {
      siteId: 123,
    };

    this.adapter = new Hotjar(config);
    this.adapter.install();
  });

  hooks.afterEach(function () {
    this.adapter.uninstall();
  });

  test('#identify calls Hotjar with the right arguments', function (assert) {
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
      'it sends the correct arguments'
    );
  });

  test('#trackEvent calls Hotjar with the right arguments', function (assert) {
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

  test('#trackPage calls Hotjar with the right arguments', function (assert) {
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
