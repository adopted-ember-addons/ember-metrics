import { later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import FacebookPixel from 'ember-metrics/metrics-adapters/facebook-pixel';

async function waitForScripts(config) {
  return new Promise((resolve) => {
    function init() {
      const fbq = sinon.spy(window, 'fbq');
      return resolve(fbq);
    }

    (function wait() {
      // check for the generic script
      if (window.fbq.instance) {
        // now check for the custom script
        // it may have already loaded and
        // registering a listener will never fire
        if (window.fbq.instance.configsLoaded[config.id]) {
          init();
        } else {
          later(wait, 10);
        }
      } else {
        // generic script hasn't run yet
        later(wait, 10);
      }
    })();
  });
}

module('facebook-pixel adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function () {
    this.config = {
      id: '1234567890',
      dataProcessingOptions: {
        method: ['LDU'],
        country: 1,
        state: 1000,
      },
    };

    this.subject = new FacebookPixel(this.config);
    this.subject.install();

    this.fbq = await waitForScripts(this.config);
  });

  hooks.afterEach(function () {
    this.subject.uninstall();
  });

  test('#trackEvent calls `fbq.track` with the right arguments', function (assert) {
    this.subject.trackEvent({ event: 'Search', opt1: 'bar', opt2: 'baz' });

    assert
      .spy(this.fbq)
      .calledWith(
        ['track', 'Search', { opt1: 'bar', opt2: 'baz' }],
        'it sends the correct arguments and options'
      );
  });

  test('#trackPage calls `fbq.track` with the right arguments', function (assert) {
    this.subject.trackPage({ page: '/my-page', title: 'My Title' });

    assert
      .spy(this.fbq)
      .calledWith(
        ['track', 'PageView', { page: '/my-page', title: 'My Title' }],
        'it sends the correct arguments and options'
      );
  });

  test('#init calls `fbq` with dataProcessingOptions', function (assert) {
    const {
      instance: {
        pluginConfig: {
          _configStore: {
            dataProcessingOptions: {
              global: {
                dataProcessingOptions,
                dataProcessingCountry,
                dataProcessingState,
              },
            },
          },
        },
      },
    } = this.fbq;

    assert.deepEqual(
      dataProcessingOptions,
      ['LDU'],
      'it sends the correct Data Processing Options'
    );

    assert.strictEqual(
      dataProcessingCountry,
      1,
      'it sends the correct Data Processing Country'
    );

    assert.strictEqual(
      dataProcessingState,
      1000,
      'it sends the correct Data Processing State'
    );
  });
});
