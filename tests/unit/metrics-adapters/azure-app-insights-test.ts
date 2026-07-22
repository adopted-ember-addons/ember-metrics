import { module, test } from 'qunit';
import type { TestContext } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import AzureAppInsights from '#src/metrics-adapters/azure-app-insights.js';

interface AzureContext extends TestContext {
  adapter: AzureAppInsights;
}

module('azure-app-insights adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (this: AzureContext) {
    const config = {
      instrumentationKey: '12345',
    };

    this.adapter = new AzureAppInsights(config);
    this.adapter.install();
  });

  hooks.afterEach(function (this: AzureContext) {
    this.adapter.uninstall();
  });

  test('#trackEvent calls appInsights with the correct arguments', function (this: AzureContext, assert) {
    const trackEventStub = sinon
      .stub(window.appInsights, 'trackEvent')
      .callsFake(() => true);

    this.adapter.trackEvent({
      category: 'login',
      action: 'click',
      name: 'submit button',
      value: 1,
      customKey: "I'm custom!",
    });

    assert.spy(trackEventStub).calledWithExactly(
      [
        {
          name: 'submit button',
          properties: {
            action: 'click',
            category: 'login',
            value: 1,
            customKey: "I'm custom!",
          },
        },
      ],
      'it sends the correct arguments',
    );
  });

  test('#trackPage calls appInsights with the correct arguments', function (this: AzureContext, assert) {
    const trackPageViewStub = sinon
      .stub(window.appInsights, 'trackPageView')
      .callsFake(() => true);

    this.adapter.trackPage();

    assert
      .spy(trackPageViewStub)
      .calledWith([], 'it sends the correct arguments');

    trackPageViewStub.resetHistory();

    this.adapter.trackPage({ name: 'my page' });

    assert
      .spy(trackPageViewStub)
      .calledWith([{ name: 'my page' }], 'it sends the correct arguments');
  });

  test('#identify calls appInsights with the right arguments', function (this: AzureContext, assert) {
    const setAuthenticatedUserContextStub = sinon
      .stub(window.appInsights, 'setAuthenticatedUserContext')
      .callsFake(() => true);

    this.adapter.identify({ userId: 'jdoe' });
    assert.ok(
      setAuthenticatedUserContextStub.calledWithExactly(
        'jdoe',
        undefined,
        true,
      ),
      'it sends the correct arguments',
    );

    setAuthenticatedUserContextStub.resetHistory();

    this.adapter.identify({
      userId: 'jdoe',
      accountId: '123',
      storeInCookie: false,
    });
    assert.ok(
      setAuthenticatedUserContextStub.calledWithExactly('jdoe', '123', false),
      'it sends the correct arguments',
    );
  });
});
