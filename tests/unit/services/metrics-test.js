import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

const get = Ember.get;
let sandbox, metricsAdapters;

moduleFor('service:metrics', 'Unit | Service | metrics', {
  needs: [
    'ember-metrics@metrics-adapter:google-analytics',
    'ember-metrics@metrics-adapter:mixpanel',
    'metrics-adapter:local-dummy-adapter'
  ],
  beforeEach() {
    sandbox = sinon.sandbox.create();

    metricsAdapters = [
      {
        name: 'GoogleAnalytics',
        config: {
          id: 'UA-XXXX-Y'
        }
      },
      {
        name: 'Mixpanel',
        config: {
          token: '0f76c037-4d76-4fce-8a0f-a9a8f89d1453'
        }
      },
      {
        name: 'LocalDummyAdapter',
        config: {
          foo: 'bar'
        }
      }
    ];
  },

  afterEach() {
    sandbox.restore();
  }
});

test('it activates local adapters', function(assert) {
  const service = this.subject({ metricsAdapters });

  assert.ok(get(service, '_adapters.LocalDummyAdapter'), 'it activated the LocalDummyAdapter');
  assert.equal(get(service, '_adapters.LocalDummyAdapter.config.foo'), 'bar', 'it passes config options to the LocalDummyAdapter');
});

test('#activateAdapters activates an array of adapters', function(assert) {
  const service = this.subject({ metricsAdapters });

  assert.ok(get(service, '_adapters.GoogleAnalytics'), 'it activated the GoogleAnalytics adapter');
  assert.equal(get(service, '_adapters.GoogleAnalytics.config.id'), 'UA-XXXX-Y', 'it passes config options to the GoogleAnalytics adapter');
});

test('#activateAdapters is idempotent', function(assert) {
  const service = this.subject({ metricsAdapters });
  service.activateAdapters([
    {
      name: 'GoogleAnalytics',
      config: {
        id: 'I like pie'
      }
    },
    {
      name: 'Mixpanel',
      config: {
        id: 'I like pie'
      }
    },
    {
      name: 'LocalDummyAdapter',
      config: {
        id: 'I like pie'
      }
    }
  ]);
  assert.equal(get(service, '_adapters.GoogleAnalytics.config.id'), 'UA-XXXX-Y', 'it does not override the GoogleAnalytics adapter');
  assert.equal(get(service, '_adapters.Mixpanel.config.token'), '0f76c037-4d76-4fce-8a0f-a9a8f89d1453', 'it does not override the Mixpanel adapter');
  assert.equal(get(service, '_adapters.LocalDummyAdapter.config.foo'), 'bar', 'it does not override the LocalDummyAdapter');
});

test('#invoke invokes the named method on activated adapters', function(assert) {
  const service = this.subject({ metricsAdapters });
  const MixpanelStub = sandbox.stub(window.mixpanel, 'identify');
  const GoogleAnalyticsStub = sandbox.stub(window, 'ga');
  const GoogleAnalyticsSpy = sandbox.spy(get(service, '_adapters.GoogleAnalytics'), 'identify');
  const MixpanelSpy = sandbox.spy(get(service, '_adapters.Mixpanel'), 'identify');
  const options = {
    userId: '1e810c197e',
    name: 'Bill Limbergh',
    email: 'bill@initech.com'
  };
  service.invoke('identify', options);

  assert.ok(GoogleAnalyticsSpy.calledOnce, 'it invokes the identify method on the adapter');
  assert.ok(GoogleAnalyticsSpy.calledWith(options), 'it invokes with the correct arguments');
  assert.ok(GoogleAnalyticsStub.calledOnce, 'it invoked the GoogleAnalytics method');
  assert.ok(MixpanelSpy.calledOnce, 'it invokes the identify method on the adapter');
  assert.ok(MixpanelSpy.calledWith(options), 'it invokes with the correct arguments');
  assert.ok(MixpanelStub.calledOnce, 'it invoked the Mixpanel method');
});

test('#invoke invokes the named method on a single activated adapter', function(assert) {
  const service = this.subject({ metricsAdapters });
  const GoogleAnalyticsStub = sandbox.stub(window, 'ga');
  const GoogleAnalyticsSpy = sandbox.spy(get(service, '_adapters.GoogleAnalytics'), 'trackEvent');
  const MixpanelSpy = sandbox.spy(get(service, '_adapters.Mixpanel'), 'trackEvent');
  const options = {
    userId: '1e810c197e',
    name: 'Bill Limbergh',
    email: 'bill@initech.com'
  };
  service.invoke('trackEvent', 'GoogleAnalytics', options);

  assert.ok(GoogleAnalyticsSpy.calledOnce, 'it invokes the track method on the adapter');
  assert.ok(GoogleAnalyticsSpy.calledWith(options), 'it invokes with the correct arguments');
  assert.ok(GoogleAnalyticsStub.calledOnce, 'it invoked the Google Analytics method');
  assert.equal(MixpanelSpy.callCount, 0, 'it does not invoke other adapters');
});

test('#invoke invokes the named method on a single activated adapter with no arguments', function(assert) {
  const service = this.subject({ metricsAdapters });
  const GoogleAnalyticsStub = sandbox.stub(window, 'ga');
  const GoogleAnalyticsSpy = sandbox.spy(get(service, '_adapters.GoogleAnalytics'), 'trackPage');
  service.invoke('trackPage', 'GoogleAnalytics');

  assert.ok(GoogleAnalyticsSpy.calledOnce, 'it invokes the track method on the adapter');
  assert.ok(GoogleAnalyticsStub.calledOnce, 'it invoked the Google Analytics method');
});

test('it implements standard contracts', function(assert) {
  const service = this.subject({ metricsAdapters });
  sandbox.stub(window.mixpanel);
  sandbox.stub(window, 'ga');
  const spy = sandbox.spy(service, 'invoke');
  const expectedContracts = [ 'identify', 'alias', 'trackEvent', 'trackPage' ];

  expectedContracts.forEach((contractName) => {
    service[contractName]({
      foo: 'bar'
    });
  });

  assert.equal(spy.callCount, 4, 'it implements standard contracts');
});
