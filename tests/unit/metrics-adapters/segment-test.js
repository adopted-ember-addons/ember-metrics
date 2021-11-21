import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import Segment from 'ember-metrics/metrics-adapters/segment';

module('segment adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    const config = {
      key: 'SEGMENT_KEY',
    };

    this.adapter = new Segment(config);
    this.adapter.install();
  });

  hooks.afterEach(function () {
    this.adapter.uninstall();
  });

  test('#identify calls analytics with the right arguments', function (assert) {
    const stub = sinon.stub(window.analytics, 'identify').callsFake(() => {
      return true;
    });

    this.adapter.identify({ distinctId: 123 });

    assert.spy(stub).calledWith([123], 'it sends the correct arguments');
  });

  test('#trackEvent returns the correct response shape', function (assert) {
    const stub = sinon.stub(window.analytics, 'track');

    this.adapter.trackEvent({
      event: 'Signed Up',
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4,
    });

    const expectedArguments = {
      category: 'button',
      action: 'click',
      label: 'nav buttons',
      value: 4,
    };

    assert
      .spy(stub)
      .calledWith(
        ['Signed Up', expectedArguments],
        'track called with proper arguments'
      );
  });

  test('#trackPage returns the correct response shape', function (assert) {
    const stub = sinon.stub(window.analytics, 'page');

    this.adapter.trackPage({
      page: '/my-overridden-page?id=1',
      title: 'my overridden page',
    });

    const expectedArguments = { title: 'my overridden page' };

    assert
      .spy(stub)
      .calledWith(
        ['/my-overridden-page?id=1', expectedArguments],
        'page called with proper arguments'
      );

    this.adapter.trackPage();

    assert.spy(stub).calledWith([], 'page called with default arguments');
  });

  test('#alias returns the correct response shape', function (assert) {
    const stub = sinon.stub(window.analytics, 'alias');
    this.adapter.alias({ alias: 'foo', original: 'bar' });

    assert
      .spy(stub)
      .calledWith(['foo', 'bar'], 'page called with default arguments');
  });
});
