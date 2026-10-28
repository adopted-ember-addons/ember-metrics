import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';
import { injectAzureAppInsights } from '../-private/vendor/snippets.js';

class AzureAppInsightsAdapter extends BaseAdapter {
  toStringExtension() {
    return 'AzureAppInsights';
  }
  install() {
    assert(`[ember-metrics] You must pass a \`instrumentationKey\`to the ${this.toString()} adapter`, this.config.instrumentationKey);
    injectAzureAppInsights(this.config);
  }
  trackEvent(properties = {}) {
    const {
      name
    } = properties;
    delete properties.name;
    window.appInsights.trackEvent({
      name,
      properties
    });
  }
  trackPage(options = {}) {
    window.appInsights.trackPageView(options);
  }
  identify({
    userId,
    accountId,
    storeInCookie = true
  } = {}) {
    if (userId) {
      window.appInsights.setAuthenticatedUserContext(userId, accountId, storeInCookie);
    }
  }
  uninstall() {
    removeFromDOM('script[src*="azure"]');
    delete window.appInsights;
  }
}

export { AzureAppInsightsAdapter as default };
//# sourceMappingURL=azure-app-insights.js.map
