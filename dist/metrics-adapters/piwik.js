import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';

class Piwik extends BaseAdapter {
  toStringExtension() {
    return 'Piwik';
  }
  install() {
    const {
      piwikUrl,
      siteId
    } = this.config;
    assert(`[ember-metrics] You must pass a \`piwikUrl\` and a \`siteId\` to the ${this.toString()} adapter`, piwikUrl && siteId);
    this._injectScript(piwikUrl, siteId);
  }
  _injectScript(piwikUrl, siteId) {
    window._paq = window._paq || [];
    window._paq.push(['setTrackerUrl', `${piwikUrl}/piwik.php`]);
    window._paq.push(['setSiteId', siteId]);
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.defer = true;
    g.src = `${piwikUrl}/piwik.js`;
    s?.parentNode?.insertBefore(g, s);
  }
  identify(options = {}) {
    window._paq.push(['setUserId', options.userId]);
  }
  trackEvent(options = {}) {
    window._paq.push(['trackEvent', options.category, options.action, options.name, options.value]);
  }
  trackPage(options = {}) {
    window._paq.push(['setCustomUrl', options.page]);
    window._paq.push(['trackPageView', options.title]);
  }
  uninstall() {
    removeFromDOM('script[src*="piwik"]');
    delete window._paq;
  }
}

export { Piwik as default };
//# sourceMappingURL=piwik.js.map
