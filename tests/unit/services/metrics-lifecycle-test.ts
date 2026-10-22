import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import BaseAdapter from '#src/metrics-adapters/base.ts';
import MetricsService from '#src/services/metrics.ts';

class LifecycleAdapter extends BaseAdapter {
  static override supportsFastBoot = true;

  uninstallCalls = 0;

  override install() {}

  override uninstall() {
    this.uninstallCalls++;
  }
}

module('Unit | Service | metrics lifecycle', function (hooks) {
  setupTest(hooks);

  test('uninstalls adapters omitted from the active registration set', function (assert) {
    const service = new MetricsService();
    service.enabled = true;

    service.activateAdapters([
      {
        name: 'Lifecycle',
        adapter: LifecycleAdapter,
      },
    ]);

    const adapter = service._adapters.Lifecycle as LifecycleAdapter;
    service.activateAdapters([]);

    assert.strictEqual(
      adapter.uninstallCalls,
      1,
      'it uninstalls the adapter when it is removed from active registrations',
    );
    assert.notOk(
      service._adapters.Lifecycle,
      'it removes the inactive adapter',
    );

    service.willDestroy();
    assert.strictEqual(
      adapter.uninstallCalls,
      1,
      'service teardown does not uninstall the removed adapter a second time',
    );
  });
});
