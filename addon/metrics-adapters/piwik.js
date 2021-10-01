import { assert } from '@ember/debug';
import removeFromDOM from '../utils/remove-from-dom';
import BaseAdapter from './base';
import classic from 'ember-classic-decorator';

@classic
export default class Piwik extends BaseAdapter {
  toStringExtension() {
    return 'Piwik';
  }

  SCRIPT_DATA_ATTRIBUTE = 'data-ember-metrics-piwik';

  init() {
    const { piwikUrl, siteId } = this.config;

    assert(
      `[ember-metrics] You must pass a \`piwikUrl\` and a \`siteId\` to the ${this.toString()} adapter`,
      piwikUrl && siteId
    );

    this._injectScript(piwikUrl, siteId, this.SCRIPT_DATA_ATTRIBUTE);
  }

  // prettier-ignore
  _injectScript(piwikUrl, siteId, dataAttribute) {
    window._paq = window._paq || [];
    (function() {
      window._paq.push(['setTrackerUrl', `${piwikUrl}/piwik.php`]);
      window._paq.push(['setSiteId', siteId]);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.setAttribute(dataAttribute,'');
      g.type='text/javascript'; g.async=true; g.defer=true; g.src=`${piwikUrl}/piwik.js`; s.parentNode.insertBefore(g,s);
    })();
  }

  identify(options = {}) {
    window._paq.push(['setUserId', options.userId]);
  }

  trackEvent(options = {}) {
    window._paq.push([
      'trackEvent',
      options.category,
      options.action,
      options.name,
      options.value,
    ]);
  }

  trackPage(options = {}) {
    window._paq.push(['setCustomUrl', options.page]);
    window._paq.push(['trackPageView', options.title]);
  }

  willDestroy() {
    removeFromDOM(`script[${this.SCRIPT_DATA_ATTRIBUTE}]`);

    delete window._paq;
  }
}
