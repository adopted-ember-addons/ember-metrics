import Service from '@ember/service';
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
export default class MetricsService extends Service {
    /**
     * Cached adapters, keyed by their registered `name`, to reduce multiple
     * expensive lookups.
     */
    _adapters: Record<string, MetricsAdapter>;
    /**
     * Contextual information attached to each call to an adapter. Often you'll
     * want to include things like `currentUser.name` with every event or page
     * view that's tracked. Any properties that you bind to `metrics.context`
     * will be merged into the options for every service call.
     */
    context: AdapterOptions;
    /**
     * Indicates whether calls to the service will be forwarded to the adapters.
     * This is determined by investigating the user's doNotTrack settings.
     *
     * Note that the doNotTrack specification is deprecated, and could stop
     * working at any minute. As such should this feature not be detected we
     * presume tracking is permitted.
     */
    enabled: boolean;
    /**
     * Environment the host application is running in (e.g. development or
     * production). Set this before calling `activateAdapters` if you rely on
     * the `environments` option to gate adapters per environment.
     */
    appEnvironment: string;
    /**
     * Instantiates adapters from passed adapter options and caches them for
     * future retrieval.
     */
    activateAdapters(adapterOptions?: AdapterRegistration[]): Record<string, MetricsAdapter> | undefined;
    /**
     * Returns all adapterOptions that should be activated in the current
     * application environment. Defaults to all environments if the option is
     * `all` or undefined.
     */
    _adaptersForEnv(adapterOptions?: AdapterRegistration[]): AdapterRegistration[];
    /**
     * Instantiates an adapter.
     */
    _activateAdapter({ adapter, config, }: {
        adapter: MetricsAdapterClass;
        config?: AdapterConfig;
    }): MetricsAdapter;
    identify(...args: unknown[]): void;
    alias(...args: unknown[]): void;
    trackEvent(...args: unknown[]): void;
    trackPage(...args: unknown[]): void;
    /**
     * Invokes a method on the passed adapters, or across all activated adapters
     * if a specific set is not passed. `methodName` may be any method an adapter
     * implements — including adapter-specific ones beyond the four standard
     * contracts (e.g. the Amplitude adapter's `optOut`/`optIn`). Adapters that
     * don't implement the method are skipped.
     */
    invoke(methodName: string, ...args: unknown[]): void;
    /**
     * On teardown, destroy cached adapters together with the Service.
     */
    willDestroy(): void;
}
export {};
//# sourceMappingURL=metrics.d.ts.map