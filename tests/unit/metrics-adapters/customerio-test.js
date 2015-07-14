import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;

moduleFor('metrics-adapter:customerio', 'customerio adapter', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
    config = {
      siteid: 'abc123'
    };
  },
  afterEach() {
    sandbox.restore();
  }
});

test('#identify calls `_cio.identify` with the right arguments', function(assert) {
  let adapter = this.subject({ config });
  const stub = sandbox.stub(window._cio, 'identify', () => {
    return true;
  });

  let options = {
    id: 'production_34',
    email: 'customer@example.com',
    created_at: 1333688268,
    name: 'Joe',
    plan: 'premium'
  };

  adapter.identify(options);

  assert.ok(stub.firstCall.calledWith('production_34', options), 'it sends the correct arguments and options');
});

