import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Pendo from 'ember-metrics/metrics-adapters/pendo';
import sinon from 'sinon';

module('pendo adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    const config = {
      apiKey: '123456789',
    };

    this.adapter = new Pendo(config);
    this.adapter.install();
  });

  hooks.afterEach(function () {
    this.adapter.uninstall();
  });

  test('#identify calls pendo with the right arguments', function (assert) {
    const stub = sinon.stub(window.pendo, 'identify').callsFake(() => {
      return true;
    });

    this.adapter.identify({
      visitor: {
        id: 123,
        role: 'employee',
      },
      account: {
        id: 'def1abc2',
        env: 'development',
      },
    });

    assert.spy(stub).calledWith(
      [
        {
          visitor: {
            id: 123,
            role: 'employee',
          },
          account: {
            id: 'def1abc2',
            env: 'development',
          },
        },
      ],
      'it sends the correct arguments'
    );
  });

  test('#trackEvent calls pendo with the right arguments', function (assert) {
    const stub = sinon.stub(window.pendo, 'track').callsFake(() => {
      return true;
    });

    this.adapter.trackEvent({
      event: 'ClickedThing',
      prop1: 'ThingID',
      prop2: 'ThingValue',
    });

    this.adapter.trackEvent({
      event: 'DrinkACoffee',
    });

    assert.spy(stub.firstCall).calledWith(
      [
        'ClickedThing',
        {
          prop1: 'ThingID',
          prop2: 'ThingValue',
        },
      ],
      'it sends the correct arguments'
    );

    assert
      .spy(stub.secondCall)
      .calledWith(['DrinkACoffee'], 'it sends the correct arguments');
  });

  test('#trackPage calls pendo with the right arguments', function (assert) {
    const stub = sinon.stub(window.pendo, 'track').callsFake(() => {
      return true;
    });

    this.adapter.trackPage({ page: '/products/1' });

    this.adapter.trackPage({
      event: 'Page View',
      page: '/products/1',
    });

    assert
      .spy(stub.firstCall)
      .calledWith(
        ['page viewed', { page: '/products/1' }],
        'it sends the correct arguments and options'
      );

    assert
      .spy(stub.secondCall)
      .calledWith(
        ['Page View', { page: '/products/1' }],
        'it sends the correct arguments and options'
      );
  });
});
