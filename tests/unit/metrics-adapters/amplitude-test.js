import { module, test } from 'ember-qunit';
import sinon from 'sinon';
import EmberObject from '@ember/object';

module('amplitude adapter', function(hooks) {
  hooks.beforeEach(function () {
    this.sandbox = sinon.createSandbox();
    this.config = {
      apiKey: 'AMPLITUDE_KEY'
    };
    this.instanceStub = EmberObject.create({
      identify: sinon.fake(),
      setUserId: sinon.fake(),
      logEvent: sinon.fake(),
      setOptOut: sinon.fake()
    });
    this.identity = EmberObject.create();

    this.subject = this.owner.factoryFor('ember-metrics@metrics-adapter:amplitude').create({ config: this.config });
  });

  hooks.afterEach(function () {
    this.sandbox.restore();
  });

  test('#identify sets the distinct user ID, and calls amplitude with any extra user properties', function(assert) {

    this.sandbox.replace(window.amplitude, 'getInstance', () => this.instanceStub);
    this.sandbox.replace(window.amplitude, 'Identify', () => this.identity);

    this.adapter.identify({
      distinctId: '123',
      email: 'ben.simmons@sixers.net'
    });

    assert.ok(this.instanceStub.setUserId.calledWith('123'), 'it calls setUserId with distinctId');
    assert.ok(this.instanceStub.identify.calledWith(this.identity), 'it sends the correct user identity');
    assert.ok(this.instanceStub.logEvent.calledWith('Identify'), 'it calls a logEvent for "Identify"');

    assert.equal(this.identity.get('email'), 'ben.simmons@sixers.net', 'extra user properties are correctly assigned to the identity');
  });

  test('#trackEvent sends the correct request shape', function(assert) {
    this.sandbox.replace(window.amplitude, 'getInstance', () => this.instanceStub);

    this.adapter.trackEvent({
      event: 'Registered User',
      email: 'joel.embiid@sixers.net'
    });
    const expectedEventProperties = {
      email: 'joel.embiid@sixers.net'
    };

    assert.ok(this.instanceStub.logEvent.calledWith('Registered User', expectedEventProperties), 'track called with proper arguments');
  });

  test('#trackPage returns the correct response shape', function(assert) {
    this.sandbox.replace(window.amplitude, 'getInstance', () => this.instanceStub);

    const pageProperties = {
      url: '/shot-charts/missed-threes'
    };
    this.adapter.trackPage(pageProperties);

    assert.ok(this.instanceStub.logEvent.calledWith('Page View', pageProperties), 'track called with proper arguments');
  });

  test('#optOut calls amplitude optOut with false', function(assert) {
    this.sandbox.replace(window.amplitude, 'getInstance', () => this.instanceStub);

    this.adapter.optOut();

    assert.ok(this.instanceStub.setOptOut.calledWith(true), 'optOut called with correct arguments');
  });

  test('#optIn calls amplitude optOut with false', function(assert) {
    this.sandbox.replace(window.amplitude, 'getInstance', () => this.instanceStub);

    this.adapter.optIn();

    assert.ok(this.instanceStub.setOptOut.calledWith(false), 'optOut called with correct arguments');
  });
});

