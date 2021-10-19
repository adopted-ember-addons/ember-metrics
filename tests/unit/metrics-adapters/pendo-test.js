import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;

module('pendo adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    sandbox = sinon.createSandbox();
    config = {
      apiKey: '123456789',
    };
  });

  hooks.afterEach(function () {
    sandbox.restore();
  });

  test('#identify calls pendo with the right arguments', function (assert) {
    const adapter = this.owner
      .factoryFor('ember-metrics@metrics-adapter:pendo')
      .create({ config });
    const stub = sandbox.stub(window.pendo, 'identify').callsFake(() => {
      return true;
    });
    adapter.identify({
      visitor: {
        id: 123,
        role: 'employee',
      },
      account: {
        id: 'def1abc2',
        env: 'development',
      },
    });
    assert.ok(
      stub.calledWith({
        visitor: {
          id: 123,
          role: 'employee',
        },
        account: {
          id: 'def1abc2',
          env: 'development',
        },
      }),
      'it sends the correct arguments'
    );
  });

  test('#trackEvent calls pendo with the right arguments', function (assert) {
    const adapter = this.owner
      .factoryFor('ember-metrics@metrics-adapter:pendo')
      .create({ config });
    const stub = sandbox.stub(window.pendo, 'track').callsFake(() => {
      return true;
    });
    adapter.trackEvent({
      event: 'ClickedThing',
      prop1: 'ThingID',
      prop2: 'ThingValue',
    });
    adapter.trackEvent({
      event: 'DrinkACoffee',
    });
    assert.ok(
      stub.firstCall.calledWith('ClickedThing', {
        prop1: 'ThingID',
        prop2: 'ThingValue',
      }),
      'it sends the correct arguments'
    );
    assert.ok(
      stub.secondCall.calledWith('DrinkACoffee'),
      'it sends the correct arguments'
    );
  });

  test('#trackPage calls pendo with the right arguments', function (assert) {
    const adapter = this.owner
      .factoryFor('ember-metrics@metrics-adapter:pendo')
      .create({ config });
    const stub = sandbox.stub(window.pendo, 'track').callsFake(() => {
      return true;
    });
    adapter.trackPage({
      page: '/products/1',
    });
    adapter.trackPage({
      event: 'Page View',
      page: '/products/1',
    });
    assert.ok(
      stub.firstCall.calledWith('page viewed', {
        page: '/products/1',
      }),
      'it sends the correct arguments and options'
    );
    assert.ok(
      stub.secondCall.calledWith('Page View', {
        page: '/products/1',
      }),
      'it sends the correct arguments and options'
    );
  });
});
