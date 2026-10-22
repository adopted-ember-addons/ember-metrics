import Service from '@ember/service';
import { assert } from '@ember/debug';

/**
 * Configuration handed to an adapter's constructor. Adapters read their own
 * provider-specific keys off of this, so it stays intentionally loose.
 */
export type AdapterConfig = Record<string, unknown>;

/**
 * Options merged with `context` and forwarded to each adapter call.
 */
export type AdapterOptions = Record<string, unknown>;

/**
 * The subset of a metrics adapter that the service depends on. Adapters are
 * authored elsewhere (and may be plain JS); this describes only what we call.
 */
interface MetricsAdapter {
  config: AdapterConfig;
  install(): void;
  uninstall(): void;
  identify(options?: AdapterOptions): void;
  alias(options?: AdapterOptions): void;
  trackEvent(options?: AdapterOptions): void;
  trackPage(options?: AdapterOptions): void;
}

interface MetricsAdapterClass {
  new (config?: AdapterConfig): MetricsAdapter;
  supportsFastBoot: boolean;
}

/**
 * A single entry in the `metricsAdapters` array passed to `activateAdapters`.
 */
export interface AdapterRegistration {
  /** Label used to target this adapter with `invoke`. */
  name: string;
  /** The adapter class itself. */
  adapter: MetricsAdapterClass;
  /** Passed straight to the adapter's constructor. */
  config?: AdapterConfig;
  /** Environments to activate the adapter in. Defaults to `['all']`. */
  environments?: string[];
}

// Set by FastBoot when server-rendering; guarded via `typeof` at runtime.
declare const FastBoot: unknown;

export default class MetricsService extends Service {
  /**
   * Cached adapters, keyed by their registered `name`, to reduce multiple
   * expensive lookups.
   */
  _adapters: Record<string, MetricsAdapter> = {};

  /**
   * Contextual information attached to each call to an adapter. Often you'll
   * want to include things like `currentUser.name` with every event or page
   * view that's tracked. Any properties that you bind to `metrics.context`
   * will be merged into the options for every service call.
   */
  context: AdapterOptions = {};

  /**
   * Indicates whether calls to the service will be forwarded to the adapters.
   * This is determined by investigating the user's doNotTrack settings.
   *
   * Note that the doNotTrack specification is deprecated, and could stop
   * working at any minute. As such should this feature not be detected we
   * presume tracking is permitted.
   */
  enabled = typeof navigator !== 'undefined' && navigator.doNotTrack !== '1';

  /**
   * Environment the host application is running in (e.g. development or
   * production). Set this before calling `activateAdapters` if you rely on
   * the `environments` option to gate adapters per environment.
   */
  appEnvironment = 'development';

  /**
   * Instantiates adapters from passed adapter options and caches them for
   * future retrieval. Adapters omitted from the active registrations are
   * uninstalled before the active set is replaced.
   */
  activateAdapters(
    adapterOptions: AdapterRegistration[] = [],
  ): Record<string, MetricsAdapter> | undefined {
    if (!this.enabled) {
      return;
    }

    const adaptersForEnv = this._adaptersForEnv(adapterOptions);
    const activeAdapters: Record<string, MetricsAdapter> = {};

    for (const { name, adapter, config } of adaptersForEnv) {
      assert(
        '[ember-metrics] Could not activate a metrics adapter without a `name`.',
        name,
      );
      assert(
        `[ember-metrics] Could not activate the \`${name}\` metrics adapter without an \`adapter\` class.`,
        adapter,
      );

      if (typeof FastBoot === 'undefined' || adapter.supportsFastBoot) {
        activeAdapters[name] =
          this._adapters[name] || this._activateAdapter({ adapter, config });
      }
    }
    for (const [name, adapter] of Object.entries(this._adapters)) {
      if (!Object.prototype.hasOwnProperty.call(activeAdapters, name)) {
        adapter.uninstall();
      }
    }
    this._adapters = activeAdapters;

    return this._adapters;
  }

  /**
   * Returns all adapterOptions that should be activated in the current
   * application environment. Defaults to all environments if the option is
   * `all` or undefined.
   */
  _adaptersForEnv(
    adapterOptions: AdapterRegistration[] = [],
  ): AdapterRegistration[] {
    return adapterOptions.filter(({ environments = ['all'] }) => {
      return (
        environments.includes('all') ||
        environments.includes(this.appEnvironment)
      );
    });
  }

  /**
   * Instantiates an adapter.
   */
  _activateAdapter({
    adapter,
    config,
  }: {
    adapter: MetricsAdapterClass;
    config?: AdapterConfig;
  }): MetricsAdapter {
    const instance = new adapter(config);
    instance.install();
    return instance;
  }

  identify(...args: unknown[]): void {
    this.invoke('identify', ...args);
  }

  alias(...args: unknown[]): void {
    this.invoke('alias', ...args);
  }

  trackEvent(...args: unknown[]): void {
    this.invoke('trackEvent', ...args);
  }

  trackPage(...args: unknown[]): void {
    this.invoke('trackPage', ...args);
  }

  /**
   * Invokes a method on the passed adapters, or across all activated adapters
   * if a specific set is not passed. `methodName` may be any method an adapter
   * implements — including adapter-specific ones beyond the four standard
   * contracts (e.g. the Amplitude adapter's `optOut`/`optIn`). Adapters that
   * don't implement the method are skipped.
   */
  invoke(methodName: string, ...args: unknown[]): void {
    if (!this.enabled) {
      return;
    }

    let selectedAdapterNames: string[];
    let options: AdapterOptions | undefined;

    if (args.length > 1) {
      selectedAdapterNames = makeArray(args[0]);
      options = args[1] as AdapterOptions;
    } else {
      selectedAdapterNames = Object.keys(this._adapters);
      options = args[0] as AdapterOptions | undefined;
    }

    for (const adapterName of selectedAdapterNames) {
      const adapter = this._adapters[adapterName] as unknown as
        | Record<string, ((options: AdapterOptions) => void) | undefined>
        | undefined;
      adapter?.[methodName]?.({ ...this.context, ...options });
    }
  }

  /**
   * On teardown, destroy cached adapters together with the Service.
   */
  willDestroy(): void {
    Object.values(this._adapters).forEach((adapter) => {
      adapter.uninstall();
    });
  }
}

function makeArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return Array.from(value) as string[];
  }
  return [value] as string[];
}
