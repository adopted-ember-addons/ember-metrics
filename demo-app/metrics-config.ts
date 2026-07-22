import type { AdapterRegistration } from '#src/services/metrics.ts';
import GoogleAnalytics from '#src/metrics-adapters/google-analytics.ts';
import GoogleAnalyticsFour from '#src/metrics-adapters/google-analytics-four.ts';
import Mixpanel from '#src/metrics-adapters/mixpanel.ts';
import Intercom from '#src/metrics-adapters/intercom.ts';
import AzureAppInsights from '#src/metrics-adapters/azure-app-insights.ts';
import Pendo from '#src/metrics-adapters/pendo.ts';
import Segment from '#src/metrics-adapters/segment.ts';
import GoogleTagManager from '#src/metrics-adapters/google-tag-manager.ts';
import Piwik from '#src/metrics-adapters/piwik.ts';
import FacebookPixel from '#src/metrics-adapters/facebook-pixel.ts';
import Amplitude from '#src/metrics-adapters/amplitude.ts';
import MatomoTagManager from '#src/metrics-adapters/matomo-tag-manager.ts';
import Hotjar from '#src/metrics-adapters/hotjar.ts';
import LocalDummyAdapter from './metrics-adapters/local-dummy-adapter.ts';

/**
 * Port of the old dummy app's `config/environment` `metricsAdapters`, using the
 * new class-based API: pass the adapter *class* rather than a string name.
 *
 * The old config also had an `ember-metrics.includeAdapters` list — a
 * *build-time* whitelist that forced adapters into the bundle. That no longer
 * exists: adapters are just modules, so "including" one means importing it and
 * adding it here. Those adapters (segment, google-tag-manager, piwik,
 * facebook-pixel, amplitude, matomo-tag-manager, hotjar) are the second group
 * below.
 */
export const metricsAdapters: AdapterRegistration[] = [
  {
    name: 'GoogleAnalytics',
    adapter: GoogleAnalytics,
    environments: ['all'],
    config: {
      id: 'UA-XXXX-Y',
    },
  },
  {
    name: 'GoogleAnalyticsFour',
    adapter: GoogleAnalyticsFour,
    environments: ['all'],
    config: {
      id: 'G-XXX',
    },
  },
  {
    // `environments` is optional and defaults to ['all']
    name: 'Mixpanel',
    adapter: Mixpanel,
    config: {
      token: '0f76c037-4d76-4fce-8a0f-a9a8f89d1453',
    },
  },
  {
    // `environments` is optional and defaults to ['all']
    name: 'Intercom',
    adapter: Intercom,
    config: {
      appId: 'def1abc2',
    },
  },
  {
    name: 'LocalDummyAdapter',
    adapter: LocalDummyAdapter,
    environments: ['all'],
    config: {
      foo: 'bar',
    },
  },
  {
    name: 'AzureAppInsights',
    adapter: AzureAppInsights,
    environments: ['all'],
    config: {
      instrumentationKey: '12345',
    },
  },
  {
    name: 'Pendo',
    adapter: Pendo,
    environments: ['all'],
    config: {
      apiKey: '12345',
    },
  },

  // --- Previously `includeAdapters` (build-time only); now just activated ---
  {
    name: 'Segment',
    adapter: Segment,
    environments: ['all'],
    config: {
      key: 'SEGMENT_KEY',
    },
  },
  {
    name: 'GoogleTagManager',
    adapter: GoogleTagManager,
    environments: ['all'],
    config: {
      id: 'GTM-XXXX',
    },
  },
  {
    name: 'Piwik',
    adapter: Piwik,
    environments: ['all'],
    config: {
      piwikUrl: 'https://piwik.example.com',
      siteId: 42,
    },
  },
  {
    name: 'FacebookPixel',
    adapter: FacebookPixel,
    environments: ['all'],
    config: {
      id: '1234567890',
    },
  },
  {
    name: 'Amplitude',
    adapter: Amplitude,
    environments: ['all'],
    config: {
      apiKey: 'AMPLITUDE_KEY',
    },
  },
  {
    name: 'MatomoTagManager',
    adapter: MatomoTagManager,
    environments: ['all'],
    config: {
      matomoUrl: 'matomo.example.com',
      containerId: 'abcd123',
    },
  },
  {
    name: 'Hotjar',
    adapter: Hotjar,
    environments: ['all'],
    config: {
      siteId: 123,
    },
  },
];
