import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';

export default class MatomoTagManager extends BaseAdapter {
  toStringExtension() {
    return 'MatomoTagManager';
  }

  install() {
    const { matomoUrl, containerId } = this.config as {
      matomoUrl?: string;
      containerId?: string;
    };

    assert(
      `[ember-metrics] You must pass a \`matomoUrl\` and a \`containerId\` to the ${this.toString()} adapter`,
      matomoUrl && containerId,
    );

    this._injectScript(matomoUrl, containerId);
  }

  _injectScript(matomoUrl: string, containerId: string) {
    window._mtm = window._mtm || [];
    window._mtm.push({
      'mtm.startTime': new Date().getTime(),
      event: 'mtm.Start',
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

  identify(options: AdapterOptions = {}) {
    window._mtm.push(['setUserId', options.userId]);
  }

  trackEvent(options: AdapterOptions = {}) {
    window._mtm.push([
      'trackEvent',
      options.category,
      options.action,
      options.name,
      options.value,
    ]);
  }

  trackPage(options: AdapterOptions = {}) {
    window._mtm.push(['setCustomUrl', options.page]);
    window._mtm.push(['trackPageView', options.title]);
  }

  uninstall() {
    removeFromDOM(`script[id="matomo-tag-manager"]`);

    delete (window as Partial<Window>)._mtm;
  }
}
