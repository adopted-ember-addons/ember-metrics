/**
 * Dev-only ambient types for the third-party analytics globals that the
 * bundled adapters interact with. Each adapter's `install()` injects a vendor
 * script that defines these on `window`; here we describe just the surface the
 * adapter method bodies actually call, so those bodies type-check cleanly
 * without `any`.
 *
 * Script-mode (no top-level import/export) so `interface Window` merges with
 * the global one. Lives in `unpublished-development-types` and is not shipped.
 */

// --- Amplitude ---
interface AmplitudeIdentify {
  set(key: string, value: unknown): void;
}
interface AmplitudeInstance {
  init(
    apiKey: unknown,
    userId?: string | null,
    options?: Record<string, unknown>,
  ): void;
  setUserId(distinctId: unknown): void;
  logEvent(event: unknown, properties?: Record<string, unknown>): void;
  identify(identity: AmplitudeIdentify): void;
  setOptOut(optOut: boolean): void;
}
interface Amplitude {
  getInstance(): AmplitudeInstance;
  Identify: new () => AmplitudeIdentify;
}

// --- Azure Application Insights ---
interface AzureAppInsights {
  trackEvent(event: {
    name?: unknown;
    properties?: Record<string, unknown>;
  }): void;
  trackPageView(options?: Record<string, unknown>): void;
  setAuthenticatedUserContext(
    userId: unknown,
    accountId?: unknown,
    storeInCookie?: boolean,
  ): void;
}

// --- Mixpanel ---
interface MixpanelPeople {
  set(props: Record<string, unknown>): void;
}
interface Mixpanel {
  init(token: unknown, config?: Record<string, unknown>): void;
  track(event: unknown, props?: Record<string, unknown>): void;
  identify(distinctId: unknown): void;
  alias(alias: unknown, original?: unknown): void;
  people: MixpanelPeople;
}

// --- Pendo ---
interface Pendo {
  initialize(config: Record<string, unknown>): void;
  identify(options: Record<string, unknown>): void;
  track(event: unknown, props?: Record<string, unknown>): void;
}

// --- Segment (analytics.js) ---
// The loading snippet (see vendor/snippets.ts) decorates this with queueing
// stubs; the adapter only ever calls these runtime methods.
interface SegmentAnalytics {
  identify(...args: unknown[]): void;
  track(...args: unknown[]): void;
  page(...args: unknown[]): void;
  alias(...args: unknown[]): void;
}

type AnalyticsFn = (...args: unknown[]) => void;

interface Window {
  amplitude: Amplitude;
  appInsights: AzureAppInsights;
  // Optional: the Facebook Pixel adapter guards on `window.fbq` existing.
  fbq?: AnalyticsFn;
  _fbq?: AnalyticsFn;
  ga: AnalyticsFn;
  ga_debug: { trace: boolean };
  dataLayer: unknown[];
  hj: AnalyticsFn;
  Intercom: AnalyticsFn;
  _mtm: unknown[];
  _paq: unknown[];
  mixpanel: Mixpanel;
  pendo: Pendo;
  analytics: SegmentAnalytics;
  FastBoot?: boolean;
}
