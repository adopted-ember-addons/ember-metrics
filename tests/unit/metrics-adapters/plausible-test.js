import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import Plausible from 'ember-metrics/metrics-adapters/plausible';

module('plausible adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.config = {
      scriptUrl: 'https://plausible.io/js/script.manual.js',
      siteId: 'my.site.io',
    };

    this.adapter = new Plausible(this.config);
    this.adapter.install();
  });

  hooks.afterEach(function () {
    this.adapter.uninstall();
  });

  test('#install installs container correctly', function (assert) {
    const script = document.querySelector('script[src*="plausible"]');
    console.log({ script });
    assert.strictEqual(
      script.getAttribute('src'),
      'https://plausible.io/js/script.manual.js'
    );
    assert.strictEqual(script.getAttribute('data-domain'), 'my.site.io');
  });

  test('#trackEvent calls Plausible with the right arguments', function (assert) {
    const stub = sinon.stub(window, 'plausible').callsFake(() => {
      return true;
    });

    this.adapter.trackEvent({
      eventName: 'click menu',
      action: 'click',
      category: 'navigation',
      value: 'profile',
    });
    assert.spy(stub).calledWith(
      [
        'click menu',
        {
          props: {
            category: 'navigation',
            action: 'click',
            value: 'profile',
          },
        },
      ],
      'it sends the correct arguments'
    );
  });

  test('#trackPage calls Plausible with the right arguments', function (assert) {
    const stub = sinon.stub(window, 'plausible').callsFake(() => {
      return true;
    });

    this.adapter.trackPage({
      page: 'page',
    });

    assert
      .spy(stub)
      .calledWith(
        ['pageview', { props: { page: 'page' } }],
        'it sends the correct arguments'
      );
  });

  test('#trackPage calls Plausible with the overriden plausible props', function (assert) {
    const stub = sinon.stub(window, 'plausible').callsFake(() => {
      return true;
    });

    this.adapter.trackPage({
      plausibleAttributes: { u: '/page/_ID_/test?id=1' },
      page: 'page',
    });

    assert
      .spy(stub)
      .calledWith(
        ['pageview', { u: '/page/_ID_/test?id=1', props: { page: 'page' } }],
        'it sends the correct arguments'
      );
  });
});
