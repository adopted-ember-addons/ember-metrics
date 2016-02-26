import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';

let sandbox, config;
moduleFor('ember-metrics@metrics-adapter:dynamic-tag-manager', 'dynamic-tag-manager adapter', {
  beforeEach() {
    sandbox = sinon.sandbox.create();
    config = {
      src: '//path.com/to.src.js'
    };
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var adapter = this.subject({ config });
  assert.ok(adapter);
});
