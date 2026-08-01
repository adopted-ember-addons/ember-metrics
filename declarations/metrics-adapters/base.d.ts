/**
 * Configuration passed to an adapter's constructor. Each adapter reads its own
 * provider-specific keys, so it stays intentionally loose.
 */
export type AdapterConfig = Record<string, unknown>;
/**
 * Options forwarded to an adapter method (merged with the service `context`).
 */
export type AdapterOptions = Record<string, unknown>;
export default class BaseAdapter {
    static supportsFastBoot: boolean;
    metrics: unknown;
    config: AdapterConfig;
    constructor(config?: AdapterConfig);
    /**
     * Overridden by subclasses to give the adapter a human-readable name in
     * assertions and `toString()`.
     */
    toStringExtension(): string;
    install(): void;
    uninstall(): void;
    toString(): string;
    identify(_options?: AdapterOptions): void;
    trackEvent(_options?: AdapterOptions): void;
    trackPage(_options?: AdapterOptions): void;
    alias(_options?: AdapterOptions): void;
}
//# sourceMappingURL=base.d.ts.map