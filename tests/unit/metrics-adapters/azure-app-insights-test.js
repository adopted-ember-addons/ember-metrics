import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import sinon from "sinon";

module("azure-app-insights adapter", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.sandbox = sinon.createSandbox();
    this.config = {
      instrumentationKey: "12345",
    };
    this.adapter = this.owner
      .factoryFor("ember-metrics@metrics-adapter:azure-app-insights")
      .create({ config: this.config });
  });

  hooks.afterEach(function () {
    this.sandbox.restore();
  });

  test("#trackEvent calls appInsights with the correct arguments", function (assert) {
    const trackEventStub = this.sandbox
      .stub(window.appInsights, "trackEvent")
      .callsFake(() => true);

    this.adapter.trackEvent({
      category: "login",
      action: "click",
      name: "submit button",
      value: 1,
    });

    assert.ok(
      trackEventStub.calledWithExactly({
        name: "submit button",
        properties: {
          action: "click",
          category: "login",
          value: 1,
        },
      }),
      "it sends the correct arguments"
    );
  });

  test("#trackPage calls appInsights with the correct arguments", function (assert) {
    const trackPageViewStub = this.sandbox
      .stub(window.appInsights, "trackPageView")
      .callsFake(() => true);

    this.adapter.trackPage();
    assert.ok(trackPageViewStub.calledWith(), "it sends the correct arguments");

    trackPageViewStub.resetHistory();

    this.adapter.trackPage({ name: "my page" });
    assert.ok(
      trackPageViewStub.calledWith({ name: "my page" }),
      "it sends the correct arguments"
    );
  });

  test("#identify calls appInsights with the userId", function (assert) {
    const mockAppInsights = {
      context: {
        user: {
          id: "",
        },
      },
    };

    this.adapter.identify({ userId: "jdoe" }, mockAppInsights);
    assert.equal(
      mockAppInsights.context.user.id,
      "jdoe",
      "it sets the user id in app insights"
    );
  });
});
