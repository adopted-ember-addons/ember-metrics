import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import sinon from 'sinon';

let application, sandbox, service;

module('Acceptance | augmented link', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
    application = startApp();
    service = application.__container__.lookup('service:metrics');
  },

  afterEach() {
    sandbox.restore();
    Ember.run(application, 'destroy');
  }
});

test('clicking a link with named adapter and metrics properties triggers the metrics service', function(assert) {
  const spy = sandbox.spy(service, 'trackEvent');
  visit('/foo');

  andThen(() => click(find('#only-google-analytics')));
  andThen(() => {
    assert.ok(spy.calledOnce, 'it calls `trackEvent` on the metrics service');
    assert.ok(spy.calledWith('GoogleAnalytics', {
      action: 'click',
      category: 'Home Button',
      label: 'Top Nav'
    }), 'it calls with the right arguments');
  });
});

test('clicking a link with metrics properties triggers the metrics service', function(assert) {
  const spy = sandbox.spy(service, 'trackEvent');
  visit('/foo');

  andThen(() => click(find('#all-integrations')));
  andThen(() => {
    assert.ok(spy.calledOnce, 'it calls `trackEvent` on the metrics service');
    assert.ok(spy.calledWith({
      action: 'click',
      category: 'Home Button',
      label: 'Top Nav'
    }), 'it calls with the right arguments');
  });
});
