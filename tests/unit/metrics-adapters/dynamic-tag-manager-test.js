import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;
moduleFor('ember-metrics@metrics-adapter:dynamic-tag-manager', 'dynamic-tag-manager adapter', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
    config = {
      src: '//path.com/to.src.js'
    };
    window._satellite = { track() {} };
  },
  afterEach() {
    sandbox.restore();
  }
});

test('#trackEvent calls `_satellite.track`', function(assert) {
  const adapter = this.subject({ config });
  const stub = sandbox.stub(window._satellite, 'track');

  const event = 'click-button';
  const eventData = {
    event,
    category: 'button',
    action: 'click',
    label: 'nav buttons',
    value: 4
  };

  const result = adapter.trackEvent(eventData);

  assert.ok(stub.calledWith(event), 'it sends the right argument');
  assert.deepEqual(result, eventData, 'it returns the right response');
});

test('#trackPage calls `_satellite.track`', function(assert) {
  const adapter = this.subject({ config });
  const stub = sandbox.stub(window._satellite, 'track');

  const event = 'vpv';
  const eventData = { event };

  const result = adapter.trackPage();

  assert.ok(stub.calledWith(event), 'it sends the right argument');
  assert.deepEqual(result, eventData, 'it returns the right response');
});
