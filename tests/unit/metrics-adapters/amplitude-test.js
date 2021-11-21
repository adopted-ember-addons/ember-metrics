import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupTest } from 'ember-qunit';
import Amplitude from 'ember-metrics/metrics-adapters/amplitude';

module('amplitude adapter', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.config = {
      apiKey: 'AMPLITUDE_KEY',
    };

    this.instanceStub = {
      identify: sinon.fake(),
      setUserId: sinon.fake(),
      logEvent: sinon.fake(),
      setOptOut: sinon.fake(),
    };

    this.identityStub = {
      set: sinon.fake(),
      get: sinon.fake(),
    };

    this.adapter = new Amplitude(this.config);
  });

  test('#identify sets the distinct user ID, and calls amplitude with any extra user properties', function (assert) {
    sinon.replace(window.amplitude, 'getInstance', () => this.instanceStub);

    this.adapter._identity = this.identityStub;

    this.adapter.identify({
      distinctId: '123',
      email: 'ben.simmons@sixers.net',
    });

    assert
      .spy(this.instanceStub.setUserId)
      .calledWith(['123'], 'it calls setUserId with distinctId');

    assert
      .spy(this.instanceStub.identify)
      .calledWith([this.identityStub], 'it sends the correct user identity');
  });

  test('#trackEvent sends the correct request shape', function (assert) {
    sinon.replace(window.amplitude, 'getInstance', () => this.instanceStub);

    this.adapter.trackEvent({
      event: 'Registered User',
      email: 'joel.embiid@sixers.net',
    });

    const expectedEventProperties = {
      email: 'joel.embiid@sixers.net',
    };

    assert
      .spy(this.instanceStub.logEvent)
      .calledWith(
        ['Registered User', expectedEventProperties],
        'track called with proper arguments'
      );
  });

  test('#trackPage returns the correct response shape', function (assert) {
    sinon.replace(window.amplitude, 'getInstance', () => this.instanceStub);

    const pageProperties = {
      url: '/shot-charts/missed-threes',
    };

    this.adapter.trackPage(pageProperties);

    assert
      .spy(this.instanceStub.logEvent)
      .calledWith(
        ['Page View', pageProperties],
        'track called with proper arguments'
      );
  });

  test('#optOut calls amplitude optOut with false', function (assert) {
    sinon.replace(window.amplitude, 'getInstance', () => this.instanceStub);

    this.adapter.optOut();

    assert
      .spy(this.instanceStub.setOptOut)
      .calledWith([true], 'optOut called with correct arguments');
  });

  test('#optIn calls amplitude optOut with false', function (assert) {
    sinon.replace(window.amplitude, 'getInstance', () => this.instanceStub);

    this.adapter.optIn();

    assert
      .spy(this.instanceStub.setOptOut)
      .calledWith([false], 'optOut called with correct arguments');
  });
});
