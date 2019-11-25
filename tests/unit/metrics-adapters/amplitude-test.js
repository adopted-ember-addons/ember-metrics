import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';
import EmberObject from '@ember/object';

let sandbox, config, instanceStub, identity;

moduleFor('ember-metrics@metrics-adapter:amplitude', 'amplitude adapter', {
  beforeEach() {
    sandbox = sinon.createSandbox();
    config = {
      apiKey: 'AMPLITUDE_KEY'
    };
    instanceStub = EmberObject.create({
      identify: sinon.fake(),
      setUserId: sinon.fake(),
      logEvent: sinon.fake(),
      setOptOut: sinon.fake()
    });
    identity = EmberObject.create();
  },
  afterEach() {
    sandbox.restore();
  }
});

test('#identify sets the distinct user ID, and calls amplitude with any extra user properties', function(assert) {
  const adapter = this.subject({ config });

  sandbox.replace(window.amplitude, 'getInstance', () => instanceStub);
  sandbox.replace(window.amplitude, 'Identify', () => identity);

  adapter.identify({
    distinctId: '123',
    email: 'ben.simmons@sixers.net'
  });

  assert.ok(instanceStub.setUserId.calledWith('123'), 'it calls setUserId with distinctId');
  assert.ok(instanceStub.identify.calledWith(identity), 'it sends the correct user identity');
  assert.ok(instanceStub.logEvent.calledWith('Identify'), 'it calls a logEvent for "Identify"');

  assert.equal(identity.get('email'), 'ben.simmons@sixers.net', 'extra user properties are correctly assigned to the identity');
});

test('#trackEvent sends the correct request shape', function(assert) {
  const adapter = this.subject({ config });
  sandbox.replace(window.amplitude, 'getInstance', () => instanceStub);

  adapter.trackEvent({
    event: 'Registered User',
    email: 'joel.embiid@sixers.net'
  });
  const expectedEventProperties = {
    email: 'joel.embiid@sixers.net'
  };

  assert.ok(instanceStub.logEvent.calledWith('Registered User', expectedEventProperties), 'track called with proper arguments');
});

test('#trackPage returns the correct response shape', function(assert) {
  const adapter = this.subject({ config });
  sandbox.replace(window.amplitude, 'getInstance', () => instanceStub);

  const pageProperties = {
    url: '/shot-charts/missed-threes'
  };
  adapter.trackPage(pageProperties);

  assert.ok(instanceStub.logEvent.calledWith('Page View', pageProperties), 'track called with proper arguments');
});

test('#optOut calls amplitude optOut with false', function(assert) {
  const adapter = this.subject({ config });
  sandbox.replace(window.amplitude, 'getInstance', () => instanceStub);

  adapter.optOut();

  assert.ok(instanceStub.setOptOut.calledWith(true), 'optOut called with correct arguments');
});

test('#optIn calls amplitude optOut with false', function(assert) {
  const adapter = this.subject({ config });
  sandbox.replace(window.amplitude, 'getInstance', () => instanceStub);

  adapter.optIn();

  assert.ok(instanceStub.setOptOut.calledWith(false), 'optOut called with correct arguments');
});
