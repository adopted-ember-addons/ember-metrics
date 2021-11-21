import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import Intercom from 'ember-metrics/metrics-adapters/intercom';

module('intercom adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.config = {
      appId: 'def1abc2',
    };

    this.adapter = new Intercom(this.config);
    this.adapter.install();
  });

  hooks.afterEach(function () {
    this.adapter.uninstall();
  });

  test('#identify with `distinctId` calls `Intercom()` with the right arguments', function (assert) {
    const stub = sinon.stub(window, 'Intercom').callsFake(() => {
      return true;
    });

    this.adapter.identify({
      distinctId: 123,
      foo: 'bar',
    });

    this.adapter.identify({ distinctId: 123 });

    assert.spy(stub.firstCall).calledWith(
      [
        'boot',
        {
          app_id: 'def1abc2',
          foo: 'bar',
          user_id: 123,
        },
      ],
      'it sends the correct arguments'
    );

    assert.spy(stub.secondCall).calledWith(
      [
        'update',
        {
          app_id: 'def1abc2',
          user_id: 123,
        },
      ],
      'it sends the correct arguments'
    );
  });

  test('#identify with `email` calls `Intercom()` with the right arguments', function (assert) {
    const stub = sinon.stub(window, 'Intercom').callsFake(() => {
      return true;
    });

    this.adapter.identify({
      email: 'tomster@ember.js',
      foo: 'bar',
    });

    this.adapter.identify({
      email: 'tomster@ember.js',
    });

    assert.spy(stub.firstCall).calledWith(
      [
        'boot',
        {
          app_id: 'def1abc2',
          email: 'tomster@ember.js',
          foo: 'bar',
        },
      ],
      'it sends the correct arguments'
    );

    assert.spy(stub.secondCall).calledWith(
      [
        'update',
        {
          app_id: 'def1abc2',
          email: 'tomster@ember.js',
        },
      ],
      'it sends the correct arguments'
    );
  });

  test('#identify without `distinctId` or `email` throws', function (assert) {
    const stub = sinon.stub(window, 'Intercom').callsFake(() => {
      return true;
    });

    assert.throws(
      () => {
        this.adapter.identify({
          foo: 'bar',
        });
      },
      /You must pass `distinctId` or `email`/,
      'exception is thrown'
    );

    assert.spy(stub).calledTimes(0, 'Intercom() is not called');
  });

  test('#identify calls `Intercom()` with `boot` on initial call, then `update` on subsequent calls', function (assert) {
    const stub = sinon.stub(window, 'Intercom').callsFake(() => {
      return true;
    });

    this.adapter.identify({ distinctId: 123 });

    this.adapter.identify({ distinctId: 123 });

    this.adapter.identify({ distinctId: 123 });

    assert
      .spy(stub.firstCall)
      .calledWith(
        ['boot', { app_id: 'def1abc2', user_id: 123 }],
        'it sends the correct arguments'
      );

    assert.spy(stub.secondCall).calledWith(
      [
        'update',
        {
          app_id: 'def1abc2',
          user_id: 123,
        },
      ],
      'it sends the correct arguments'
    );

    assert
      .spy(stub.thirdCall)
      .calledWith(
        ['update', { app_id: 'def1abc2', user_id: 123 }],
        'it sends the correct arguments'
      );
  });

  test('#trackEvent calls `Intercom()` with the right arguments', function (assert) {
    const stub = sinon.stub(window, 'Intercom').callsFake(() => {
      return true;
    });

    this.adapter.trackEvent({
      event: 'Video played',
      videoLength: 213,
      id: 'hY7gQr0',
    });

    this.adapter.trackEvent({ event: 'Ate a cookie' });

    this.adapter.trackEvent({ event: null, id: 'hY7gQr0' });

    assert
      .spy(stub.firstCall)
      .calledWith(
        ['trackEvent', 'Video played', { videoLength: 213, id: 'hY7gQr0' }],
        'it sends the correct arguments'
      );

    assert
      .spy(stub.secondCall)
      .calledWith(
        ['trackEvent', 'Ate a cookie'],
        'it sends the correct arguments'
      );

    assert
      .spy(stub.thirdCall)
      .calledWith(
        ['trackEvent', 'unspecified-event', { id: 'hY7gQr0' }],
        'it sends the correct arguments'
      );
  });

  test('#trackPage calls `Intercom()` with the right arguments', function (assert) {
    const stub = sinon.stub(window, 'Intercom').callsFake(() => {
      return true;
    });

    this.adapter.trackPage({ page: '/products/1' });

    this.adapter.trackPage({
      event: 'Page View',
      page: '/products/1',
    });

    assert.spy(stub.firstCall).calledWith(
      [
        'trackEvent',
        'page viewed',
        {
          page: '/products/1',
        },
      ],
      'it sends the correct arguments and options'
    );

    assert.spy(stub.secondCall).calledWith(
      [
        'trackEvent',
        'Page View',
        {
          page: '/products/1',
        },
      ],
      'it sends the correct arguments and options'
    );
  });
});
