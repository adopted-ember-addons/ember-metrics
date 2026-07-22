import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { metricsAdapters } from '../metrics-config.ts';

import type MetricsService from '#src/services/metrics.ts';
import type Owner from '@ember/owner';

export interface MetricsDemoSignature {
  Args: Record<string, unknown>;
}

export default class MetricsDemo extends Component<MetricsDemoSignature> {
  @service declare metrics: MetricsService;

  // Written to by LocalDummyAdapter#trackEvent (via the `controller` option).
  @tracked foo: string | null = null;

  constructor(owner: Owner, args: MetricsDemoSignature['Args']) {
    super(owner, args);

    // Adapters are activated explicitly by passing their classes (idempotent).
    this.metrics.activateAdapters(metricsAdapters);

    // Targeted at LocalDummyAdapter so the demo stays clean; drop the first
    // argument to broadcast to every activated adapter.
    this.metrics.trackEvent('LocalDummyAdapter', { controller: this });
  }

  <template>
    <p>
      This component activated
      {{metricsAdapters.length}}
      adapters and called
      <code>metrics.trackEvent</code>, which
      <code>LocalDummyAdapter</code>
      forwarded by setting
      <code>foo</code>.
    </p>

    <p>
      <code>foo</code>
      is now:
      <strong>{{if this.foo this.foo "(unset)"}}</strong>
    </p>
  </template>
}
