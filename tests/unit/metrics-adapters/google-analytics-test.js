import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox;

moduleFor('ember-metrics@metrics-adapter:google-analytics', 'google-analytics', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  beforeEach() {
    sandbox = sinon.sandbox.create();
  },
  afterEach() {
    sandbox.restore();
  }
});

test('#trackEvent returns the correct response shape', function(assert) {
  const adapter = this.subject({
    config: {
      id: 'UA-XXXX-Y'
    }
  });
  const result = adapter.trackEvent({
    category: 'button',
    action: 'click',
    label: 'nav buttons',
    value: 4
  });
  const expectedResult = {
    hitType: 'event',
    eventCategory: 'button',
    eventAction: 'click',
    eventLabel: 'nav buttons',
    eventValue: 4
  };

  assert.deepEqual(result, expectedResult, 'it sends the correct response shape');
});

test('#trackPage returns the correct response shape', function(assert) {
  const adapter = this.subject({
    config: {
      id: 'UA-XXXX-Y'
    }
  });
  const result = adapter.trackPage({
    page: '/my-overridden-page?id=1',
    title: 'my overridden page'
  });
  const expectedResult = {
    hitType: 'pageview',
    page: '/my-overridden-page?id=1',
    title: 'my overridden page'
  };

  assert.deepEqual(result, expectedResult, 'it sends the correct response shape');
});
