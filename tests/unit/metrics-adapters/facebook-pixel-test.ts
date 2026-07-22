import { later } from '@ember/runloop';
import { module, test } from 'qunit';
import type { TestContext } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import FacebookPixel from '#src/metrics-adapters/facebook-pixel.js';

// The real fbevents.js decorates `window.fbq` with these internals once it has
// loaded; this integration test inspects them.
interface LoadedFbq {
  (...args: unknown[]): void;
  instance: {
    configsLoaded: Record<string, unknown>;
    pluginConfig: {
      _configStore: {
        dataProcessingOptions: {
          global: {
            dataProcessingOptions: unknown;
            dataProcessingCountry: unknown;
            dataProcessingState: unknown;
          };
        };
      };
    };
  };
}

interface FacebookContext extends TestContext {
  config: Record<string, unknown>;
  subject: FacebookPixel;
  fbq: LoadedFbq;
}

async function waitForScripts(
  config: Record<string, unknown>,
): Promise<LoadedFbq> {
  return new Promise((resolve) => {
    function init() {
      const fbq = sinon.spy(window, 'fbq') as unknown as LoadedFbq;
      return resolve(fbq);
    }

    (function wait() {
      const fbq = window.fbq as unknown as LoadedFbq | undefined;
      // check for the generic script
      if (fbq?.instance) {
        // now check for the custom script
        // it may have already loaded and
        // registering a listener will never fire
        if (fbq.instance.configsLoaded[config.id as string]) {
          init();
        } else {
          // eslint-disable-next-line ember/no-runloop
          later(wait, 10);
        }
      } else {
        // generic script hasn't run yet
        // eslint-disable-next-line ember/no-runloop
        later(wait, 10);
      }
    })();
  });
}

module('facebook-pixel adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function (this: FacebookContext) {
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

  hooks.afterEach(function (this: FacebookContext) {
    this.subject.uninstall();
  });

  test('#trackEvent calls `fbq.track` with the right arguments', function (this: FacebookContext, assert) {
    this.subject.trackEvent({ event: 'Search', opt1: 'bar', opt2: 'baz' });

    assert
      .spy(this.fbq)
      .calledWith(
        ['track', 'Search', { opt1: 'bar', opt2: 'baz' }],
        'it sends the correct arguments and options',
      );
  });

  test('#trackPage calls `fbq.track` with the right arguments', function (this: FacebookContext, assert) {
    this.subject.trackPage({ page: '/my-page', title: 'My Title' });

    assert
      .spy(this.fbq)
      .calledWith(
        ['track', 'PageView', { page: '/my-page', title: 'My Title' }],
        'it sends the correct arguments and options',
      );
  });

  test('#init calls `fbq` with dataProcessingOptions', function (this: FacebookContext, assert) {
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
      'it sends the correct Data Processing Options',
    );

    assert.strictEqual(
      dataProcessingCountry,
      1,
      'it sends the correct Data Processing Country',
    );

    assert.strictEqual(
      dataProcessingState,
      1000,
      'it sends the correct Data Processing State',
    );
  });
});
