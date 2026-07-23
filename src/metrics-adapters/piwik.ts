import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';

export default class Piwik extends BaseAdapter {
  toStringExtension() {
    return 'Piwik';
  }

  install() {
    const { piwikUrl, siteId } = this.config as {
      piwikUrl?: string;
      siteId?: unknown;
    };

    assert(
      `[ember-metrics] You must pass a \`piwikUrl\` and a \`siteId\` to the ${this.toString()} adapter`,
      piwikUrl && siteId,
    );

    this._injectScript(piwikUrl, siteId);
  }

  _injectScript(piwikUrl: string, siteId: unknown) {
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

  identify(options: AdapterOptions = {}) {
    window._paq.push(['setUserId', options.userId]);
  }

  trackEvent(options: AdapterOptions = {}) {
    window._paq.push([
      'trackEvent',
      options.category,
      options.action,
      options.name,
      options.value,
    ]);
  }

  trackPage(options: AdapterOptions = {}) {
    window._paq.push(['setCustomUrl', options.page]);
    window._paq.push(['trackPageView', options.title]);
  }

  uninstall() {
    removeFromDOM('script[src*="piwik"]');

    delete (window as Partial<Window>)._paq;
  }
}
