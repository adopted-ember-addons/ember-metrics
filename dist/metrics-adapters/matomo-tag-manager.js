import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';

class MatomoTagManager extends BaseAdapter {
  toStringExtension() {
    return 'MatomoTagManager';
  }
  install() {
    const {
      matomoUrl,
      containerId
    } = this.config;
    assert(`[ember-metrics] You must pass a \`matomoUrl\` and a \`containerId\` to the ${this.toString()} adapter`, matomoUrl && containerId);
    this._injectScript(matomoUrl, containerId);
  }
  _injectScript(matomoUrl, containerId) {
    window._mtm = window._mtm || [];
    window._mtm.push({
      'mtm.startTime': new Date().getTime(),
      event: 'mtm.Start'
    });
    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.src = `https://${matomoUrl}/js/container_${containerId}.js`;
    s?.parentNode?.insertBefore(g, s);
    g.id = 'matomo-tag-manager';
  }
  identify(options = {}) {
    window._mtm.push(['setUserId', options.userId]);
  }
  trackEvent(options = {}) {
    window._mtm.push(['trackEvent', options.category, options.action, options.name, options.value]);
  }
  trackPage(options = {}) {
    window._mtm.push(['setCustomUrl', options.page]);
    window._mtm.push(['trackPageView', options.title]);
  }
  uninstall() {
    removeFromDOM(`script[id="matomo-tag-manager"]`);
    delete window._mtm;
  }
}

export { MatomoTagManager as default };
//# sourceMappingURL=matomo-tag-manager.js.map
