import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import AzureAppInsights from 'ember-metrics/metrics-adapters/azure-app-insights';

module('azure-app-insights adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.sandbox = sinon.createSandbox();
    this.config = {
      instrumentationKey: '12345',
    };

    this.adapter = new AzureAppInsights(this.config);
  });

  hooks.afterEach(function () {
    this.sandbox.restore();
  });

  test('#trackEvent calls appInsights with the correct arguments', function (assert) {
    const trackEventStub = this.sandbox
      .stub(window.appInsights, 'trackEvent')
      .callsFake(() => true);

    this.adapter.trackEvent({
      category: 'login',
      action: 'click',
      name: 'submit button',
      value: 1,
      customKey: "I'm custom!",
    });

    assert.ok(
      trackEventStub.calledWithExactly({
        name: 'submit button',
        properties: {
          action: 'click',
          category: 'login',
          value: 1,
          customKey: "I'm custom!",
        },
      }),
      'it sends the correct arguments'
    );
  });

  test('#trackPage calls appInsights with the correct arguments', function (assert) {
    const trackPageViewStub = this.sandbox
      .stub(window.appInsights, 'trackPageView')
      .callsFake(() => true);

    this.adapter.trackPage();
    assert.ok(trackPageViewStub.calledWith(), 'it sends the correct arguments');

    trackPageViewStub.resetHistory();

    this.adapter.trackPage({ name: 'my page' });
    assert.ok(
      trackPageViewStub.calledWith({ name: 'my page' }),
      'it sends the correct arguments'
    );
  });

  test('#identify calls appInsights with the right arguments', function (assert) {
    const setAuthenticatedUserContextStub = this.sandbox
      .stub(window.appInsights, 'setAuthenticatedUserContext')
      .callsFake(() => true);

    this.adapter.identify({ userId: 'jdoe' });
    assert.ok(
      setAuthenticatedUserContextStub.calledWithExactly(
        'jdoe',
        undefined,
        true
      ),
      'it sends the correct arguments'
    );

    setAuthenticatedUserContextStub.resetHistory();

    this.adapter.identify({
      userId: 'jdoe',
      accountId: '123',
      storeInCookie: false,
    });
    assert.ok(
      setAuthenticatedUserContextStub.calledWithExactly('jdoe', '123', false),
      'it sends the correct arguments'
    );
  });
});
