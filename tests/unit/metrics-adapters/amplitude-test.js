import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupTest } from 'ember-qunit';
import Amplitude from 'ember-metrics/metrics-adapters/amplitude';

let sandbox, config, instanceStub, identityStub, adapter;

module('amplitude adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    sandbox = sinon.createSandbox();
    config = {
      apiKey: 'AMPLITUDE_KEY',
    };
    instanceStub = {
      identify: sinon.fake(),
      setUserId: sinon.fake(),
      logEvent: sinon.fake(),
      setOptOut: sinon.fake(),
    };
    identityStub = {
      set: sinon.fake(),
      get: sinon.fake(),
    };

    adapter = new Amplitude(config);
  });

  hooks.afterEach(function () {
    sandbox.restore();
  });

  test('#identify sets the distinct user ID, and calls amplitude with any extra user properties', function (assert) {
    sandbox.replace(window.amplitude, 'getInstance', () => instanceStub);
    adapter._identity = identityStub;

    adapter.identify({
      distinctId: '123',
      email: 'ben.simmons@sixers.net',
    });

    assert.ok(
      instanceStub.setUserId.calledWith('123'),
      'it calls setUserId with distinctId'
    );
    // assert.ok(identity.set.lastArg, 'ben.simmons@sixers.net');
    assert.ok(
      instanceStub.identify.calledWith(identityStub),
      'it sends the correct user identity'
    );
    assert.ok(
      instanceStub.logEvent.calledWith('Identify'),
      'it calls a logEvent for "Identify"'
    );
  });

  test('#trackEvent sends the correct request shape', function (assert) {
    sandbox.replace(window.amplitude, 'getInstance', () => instanceStub);

    adapter.trackEvent({
      event: 'Registered User',
      email: 'joel.embiid@sixers.net',
    });
    const expectedEventProperties = {
      email: 'joel.embiid@sixers.net',
    };

    assert.ok(
      instanceStub.logEvent.calledWith(
        'Registered User',
        expectedEventProperties
      ),
      'track called with proper arguments'
    );
  });

  test('#trackPage returns the correct response shape', function (assert) {
    sandbox.replace(window.amplitude, 'getInstance', () => instanceStub);

    const pageProperties = {
      url: '/shot-charts/missed-threes',
    };
    adapter.trackPage(pageProperties);

    assert.ok(
      instanceStub.logEvent.calledWith('Page View', pageProperties),
      'track called with proper arguments'
    );
  });

  test('#optOut calls amplitude optOut with false', function (assert) {
    sandbox.replace(window.amplitude, 'getInstance', () => instanceStub);

    adapter.optOut();

    assert.ok(
      instanceStub.setOptOut.calledWith(true),
      'optOut called with correct arguments'
    );
  });

  test('#optIn calls amplitude optOut with false', function (assert) {
    sandbox.replace(window.amplitude, 'getInstance', () => instanceStub);

    adapter.optIn();

    assert.ok(
      instanceStub.setOptOut.calledWith(false),
      'optOut called with correct arguments'
    );
  });
});
