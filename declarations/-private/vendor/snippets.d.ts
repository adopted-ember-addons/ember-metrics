/**
 * Vendor script-injection snippets, verbatim from each analytics provider.
 *
 * These are minified third-party blobs; they are intentionally quarantined
 * here (with `@ts-nocheck` and eslint disabled) so the adapters that call them
 * stay fully typed. Each function keeps the provider's snippet exactly as
 * shipped, taking the adapter-supplied values (id, key, config, ...) as
 * typed parameters.
 */
export declare function injectAmplitude(): void;
export declare function injectAzureAppInsights(config: Record<string, unknown>): void;
export declare function injectFacebookPixel(): void;
export declare function injectGoogleAnalytics(debug: unknown): void;
export declare function injectGoogleTagManager(dataLayerName: string, id: unknown, envParamsString: string): void;
export declare function injectHotjar(siteId: unknown): void;
export declare function injectIntercom(appId: unknown): void;
export declare function injectMixpanel(): void;
export declare function injectPendo(apiKey: unknown): void;
/**
 * Segment's analytics.js loading snippet.
 * https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/#step-2-copy-the-segment-snippet
 */
export declare function injectSegment(proxyDomain: string, segmentKey: string): void;
//# sourceMappingURL=snippets.d.ts.map