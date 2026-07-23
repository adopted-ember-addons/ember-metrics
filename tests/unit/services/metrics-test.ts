import { set } from '@ember/object';
import type { TestContext } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import MetricsService from '#src/services/metrics.ts';
import GoogleAnalytics from '#src/metrics-adapters/google-analytics.ts';
import Mixpanel from '#src/metrics-adapters/mixpanel.ts';

import BaseAdapter from '#src/metrics-adapters/base.ts';

interface MetricsTestContext extends TestContext {
  service: MetricsService;
}

class LocalDummyAdapter extends BaseAdapter {
  static override supportsFastBoot = true;
  foo: string | null = null;

  override toStringExtension() {
    return 'LocalDummy';
  }

  override install() {
    this.foo = 'bar';
  }

  override trackEvent({ controller }: { controller?: { foo?: unknown } } = {}) {
    if (controller) {
      controller.foo = 'bar';
    }
  }

  override uninstall() {}
}

module('Unit | Service | metrics', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (this: MetricsTestContext) {
    this.service = new MetricsService();

    this.service.activateAdapters([
      {
        name: 'GoogleAnalytics',
        adapter: GoogleAnalytics,
        environments: ['all'],
        config: {
          id: 'UA-XXXX-Y',
        },
      },
      {
        name: 'Mixpanel',
        adapter: Mixpanel,
        environments: ['all'],
        config: {
          token: '0f76c037-4d76-4fce-8a0f-a9a8f89d1453',
        },
      },
      {
        name: 'LocalDummyAdapter',
        adapter: LocalDummyAdapter,
        environments: ['all'],
        config: {
          foo: 'bar',
        },
      },
    ]);
  });

  hooks.afterEach(function () {
    delete (window as Partial<Window>).ga;
    delete (window as Partial<Window>).mixpanel;
    delete window.FastBoot;
  });

  test('it activates local adapters', function (this: MetricsTestContext, assert) {
    assert.ok(
      this.service._adapters.LocalDummyAdapter,
      'it activated the LocalDummyAdapter',
    );

    assert.strictEqual(
      this.service._adapters.LocalDummyAdapter!.config.foo,
      'bar',
      'it passes config options to the LocalDummyAdapter',
    );
  });

  test('#activateAdapters activates an array of adapters', function (this: MetricsTestContext, assert) {
    assert.ok(
      this.service._adapters.GoogleAnalytics,
      'it activated the GoogleAnalytics adapter',
    );

    assert.strictEqual(
      this.service._adapters.GoogleAnalytics!.config.id,
      'UA-XXXX-Y',
      'it passes config options to the GoogleAnalytics adapter',
    );
  });

  test('#activateAdapters is idempotent', function (this: MetricsTestContext, assert) {
    this.service.activateAdapters([
      {
        name: 'GoogleAnalytics',
        adapter: GoogleAnalytics,
        environments: ['all'],
        config: {
          id: 'I like pie',
        },
      },
      {
        adapter: Mixpanel,
        name: 'Mixpanel',
        environments: ['all'],
        config: {
          id: 'I like pie',
        },
      },
      {
        adapter: LocalDummyAdapter,
        name: 'LocalDummyAdapter',
        environments: ['all'],
        config: {
          id: 'I like pie',
        },
      },
    ]);

    assert.strictEqual(
      this.service._adapters.GoogleAnalytics!.config.id,
      'UA-XXXX-Y',
      'it does not override the GoogleAnalytics adapter',
    );

    assert.strictEqual(
      this.service._adapters.Mixpanel!.config.token,
      '0f76c037-4d76-4fce-8a0f-a9a8f89d1453',
      'it does not override the Mixpanel adapter',
    );

    assert.strictEqual(
      this.service._adapters.LocalDummyAdapter!.config.foo,
      'bar',
      'it does not override the LocalDummyAdapter',
    );
  });

  test('#invoke invokes the named method on activated adapters', function (this: MetricsTestContext, assert) {
    const mixpanelStub = sinon.stub(window.mixpanel, 'identify');

    const googleAnalyticsStub = sinon.stub(window, 'ga');

    const googleAnalyticsSpy = sinon.spy(
      this.service._adapters.GoogleAnalytics!,
      'identify',
    );

    const mixpanelSpy = sinon.spy(this.service._adapters.Mixpanel!, 'identify');

    const opts = {
      userId: '1e810c197e',
      name: 'Bill Limbergh',
      email: 'bill@initech.com',
    };

    this.service.invoke('identify', opts);

    assert
      .spy(googleAnalyticsSpy)
      .calledOnce('it invokes the identify method on the adapter');

    assert
      .spy(googleAnalyticsSpy)
      .calledWith([opts], 'it invokes with the correct arguments');

    assert
      .spy(googleAnalyticsStub)
      .calledOnce('it invoked the GoogleAnalytics method');

    assert
      .spy(mixpanelSpy)
      .calledOnce('it invokes the identify method on the adapter');

    assert
      .spy(mixpanelSpy)
      .calledWith([opts], 'it invokes with the correct arguments');

    assert.spy(mixpanelStub).calledOnce('it invoked the Mixpanel method');
  });

  test('#invoke invokes the named method on a single activated adapter', function (this: MetricsTestContext, assert) {
    const googleAnalyticsStub = sinon.stub(window, 'ga');

    const googleAnalyticsSpy = sinon.spy(
      this.service._adapters.GoogleAnalytics!,
      'trackEvent',
    );

    const mixpanelSpy = sinon.spy(
      this.service._adapters.Mixpanel!,
      'trackEvent',
    );

    const opts = {
      userId: '1e810c197e',
      name: 'Bill Limbergh',
      email: 'bill@initech.com',
    };

    this.service.invoke('trackEvent', 'GoogleAnalytics', opts);

    assert
      .spy(googleAnalyticsSpy)
      .calledOnce('it invokes the track method on the adapter');

    assert
      .spy(googleAnalyticsSpy)
      .calledWith([opts], 'it invokes with the correct arguments');

    assert
      .spy(googleAnalyticsStub.withArgs('send'))
      .calledOnce('it invoked the Google Analytics method');

    assert.spy(mixpanelSpy).calledTimes(0, 'it does not invoke other adapters');
  });

  test('#invoke invokes the named methods on a whitelist of activated adapters', function (this: MetricsTestContext, assert) {
    const mixpanelStub = sinon.stub(window.mixpanel, 'identify');

    const googleAnalyticsStub = sinon.stub(window, 'ga');

    const googleAnalyticsSpy = sinon.spy(
      this.service._adapters.GoogleAnalytics!,
      'identify',
    );

    const mixpanelSpy = sinon.spy(this.service._adapters.Mixpanel!, 'identify');

    const localDummyAdapterSpy = sinon.spy(
      this.service._adapters.LocalDummyAdapter!,
      'trackEvent',
    );

    const opts = {
      userId: '1e810c197e',
      name: 'Bill Limbergh',
      email: 'bill@initech.com',
    };

    this.service.invoke('identify', ['GoogleAnalytics', 'Mixpanel'], opts);

    assert
      .spy(googleAnalyticsSpy)
      .calledOnce('it invokes the identify method on the adapter');

    assert
      .spy(googleAnalyticsSpy)
      .calledWith([opts], 'it invokes with the correct arguments');

    assert
      .spy(googleAnalyticsStub)
      .calledOnce('it invoked the GoogleAnalytics method');

    assert
      .spy(mixpanelSpy)
      .calledOnce('it invokes the identify method on the adapter');

    assert
      .spy(mixpanelSpy)
      .calledWith([opts], 'it invokes with the correct arguments');

    assert.spy(mixpanelStub).calledOnce('it invoked the Mixpanel method');

    assert
      .spy(localDummyAdapterSpy)
      .calledTimes(0, 'it does not invoke other adapters');
  });

  test("#invoke doesn't error when asked to use a single deactivated adapter", function (this: MetricsTestContext, assert) {
    this.service.invoke('trackEvent', 'Trackmaster2000', {});
    assert.true(true, 'No exception was thrown');
  });

  test('#invoke invokes the named method on a single activated adapter with no arguments', function (this: MetricsTestContext, assert) {
    const googleAnalyticsStub = sinon.stub(window, 'ga');

    const googleAnalyticsSpy = sinon.spy(
      this.service._adapters.GoogleAnalytics!,
      'trackPage',
    );

    this.service.invoke('trackPage', 'GoogleAnalytics');

    assert
      .spy(googleAnalyticsSpy)
      .calledOnce('it invokes the track method on the adapter');

    assert
      .spy(googleAnalyticsStub.withArgs('send'))
      .calledOnce('it invoked the Google Analytics method');
  });

  test('#invoke includes `context` properties', function (this: MetricsTestContext, assert) {
    const googleAnalyticsSpy = sinon.spy(
      this.service._adapters.GoogleAnalytics!,
      'trackPage',
    );

    set(this.service, 'context.userName', 'Jimbo');

    this.service.invoke('trackPage', 'GoogleAnalytics', {
      page: 'page/1',
      title: 'page one',
    });

    assert.spy(googleAnalyticsSpy).calledWith(
      [
        {
          userName: 'Jimbo',
          page: 'page/1',
          title: 'page one',
        },
      ],
      'it includes context properties',
    );
  });

  test('#invoke does not leak options between calls', function (this: MetricsTestContext, assert) {
    const googleAnalyticsSpy = sinon.spy(
      this.service._adapters.GoogleAnalytics!,
      'trackPage',
    );

    set(this.service, 'context.userName', 'Jimbo');

    this.service.invoke('trackPage', 'GoogleAnalytics', {
      page: 'page/1',
      title: 'page one',
      callOne: true,
    });

    this.service.invoke('trackPage', 'GoogleAnalytics', {
      page: 'page/1',
      title: 'page one',
      callTwo: true,
    });

    assert.spy(googleAnalyticsSpy).calledWith(
      [
        {
          userName: 'Jimbo',
          page: 'page/1',
          title: 'page one',
          callTwo: true,
        },
      ],
      'it does not include options from previous call',
    );
  });

  test('it can be disabled', function (this: MetricsTestContext, assert) {
    const googleAnalyticsSpy = sinon.spy(
      this.service._adapters.GoogleAnalytics!,
      'trackPage',
    );

    set(this.service, 'enabled', false);

    this.service.invoke('trackPage', 'GoogleAnalytics', {
      page: 'page/1',
      title: 'page one',
    });

    assert.spy(googleAnalyticsSpy).calledTimes(0, 'it does not call adapters');
  });

  test('it implements standard contracts', function (this: MetricsTestContext, assert) {
    delete (window.mixpanel as { toString?: unknown }).toString;

    sinon.stub(window.mixpanel);
    sinon.stub(window, 'ga');

    const spy = sinon.spy(this.service, 'invoke');
    const expectedContracts = [
      'identify',
      'alias',
      'trackEvent',
      'trackPage',
    ] as const;

    expectedContracts.forEach((contractName) => {
      this.service[contractName]({
        foo: 'bar',
      });
    });

    assert.spy(spy).called(4, 'it implements standard contracts');
  });

  test('it does not activate adapters that are not in the current app environment', function (this: MetricsTestContext, assert) {
    this.service.activateAdapters([
      {
        name: 'GoogleAnalytics',
        adapter: GoogleAnalytics,
        config: {
          id: 'UA-XXXX-Y',
        },
      },
      {
        name: 'LocalDummyAdapter',
        adapter: LocalDummyAdapter,
        environments: ['production'],
        config: {
          foo: 'bar',
        },
      },
    ]);

    assert.ok(
      this.service._adapters.GoogleAnalytics,
      'it activated the GoogleAnalytics adapter',
    );

    assert.notOk(
      this.service._adapters.LocalDummyAdapter,
      'it did not activate the LocalDummyAdapter',
    );
  });

  test('when in FastBoot env, it does not activate adapters that are not FastBoot-enabled', function (this: MetricsTestContext, assert) {
    window.FastBoot = true;

    this.service.activateAdapters([
      {
        adapter: GoogleAnalytics,
        name: 'GoogleAnalytics',
        config: {
          id: 'UA-XXXX-Y',
        },
      },
      {
        adapter: LocalDummyAdapter,
        name: 'LocalDummyAdapter',
        config: {
          foo: 'bar',
        },
      },
    ]);

    assert.notOk(
      this.service._adapters.GoogleAnalytics,
      'it did not activate the GoogleAnalytics adapter',
    );
    assert.ok(
      this.service._adapters.LocalDummyAdapter,
      'it activated the LocalDummyAdapter',
    );
  });

  test('convenience methods correctly invoke a single adapter', function (this: MetricsTestContext, assert) {
    assert.expect(8);

    const methods = ['identify', 'alias', 'trackEvent', 'trackPage'] as const;
    const opts = {
      userId: '1e810c197e',
      name: 'Bill Limbergh',
      email: 'bill@initech.com',
    };

    methods.forEach((method) => {
      const spy = sinon.spy(this.service._adapters.GoogleAnalytics!, method);

      this.service[method]('GoogleAnalytics', opts);

      assert
        .spy(spy)
        .calledOnce(`it invokes the ${method} method on the adapter`);

      assert
        .spy(spy)
        .calledWith(
          [opts],
          `it invokes the ${method} method with the correct arguments`,
        );
    });
  });

  test('convenience methods correctly invoke available adapters when none specified', function (this: MetricsTestContext, assert) {
    assert.expect(24);

    const methods = ['identify', 'alias', 'trackEvent', 'trackPage'] as const;
    const availableAdapters = [
      'LocalDummyAdapter',
      'Mixpanel',
      'GoogleAnalytics',
    ] as const;
    const opts = {
      userId: '1e810c197e',
      name: 'Bill Limbergh',
      email: 'bill@initech.com',
    };

    methods.forEach((method) => {
      const spies = availableAdapters.map((adapter) =>
        sinon.spy(this.service._adapters[adapter]!, method),
      );

      this.service[method](opts);

      spies.forEach((spy) => {
        assert
          .spy(spy)
          .calledOnce(`it invokes the ${method} method on the adapter`);

        assert
          .spy(spy)
          .calledWith(
            [opts],
            `it invokes the ${method} method with the correct arguments`,
          );
      });
    });
  });
});
