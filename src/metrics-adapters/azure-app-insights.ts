import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';
import { injectAzureAppInsights } from '../-private/vendor/snippets.ts';

export default class AzureAppInsightsAdapter extends BaseAdapter {
  toStringExtension() {
    return 'AzureAppInsights';
  }

  install() {
    assert(
      `[ember-metrics] You must pass a \`instrumentationKey\`to the ${this.toString()} adapter`,
      this.config.instrumentationKey,
    );

    injectAzureAppInsights(this.config);
  }

  trackEvent(properties: AdapterOptions = {}) {
    const { name } = properties;
    delete properties.name;

    window.appInsights.trackEvent({
      name,
      properties,
    });
  }

  trackPage(options: AdapterOptions = {}) {
    window.appInsights.trackPageView(options);
  }

  identify({
    userId,
    accountId,
    storeInCookie = true,
  }: {
    userId?: unknown;
    accountId?: unknown;
    storeInCookie?: boolean;
  } = {}) {
    if (userId) {
      window.appInsights.setAuthenticatedUserContext(
        userId,
        accountId,
        storeInCookie,
      );
    }
  }

  uninstall() {
    removeFromDOM('script[src*="azure"]');

    delete (window as Partial<Window>).appInsights;
  }
}
