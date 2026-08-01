import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';
import { injectHotjar } from '../-private/vendor/snippets.js';

class Hotjar extends BaseAdapter {
  toStringExtension() {
    return 'Hotjar';
  }
  install() {
    const {
      siteId
    } = this.config;
    assert(`[ember-metrics] You must pass a \`siteId\` to the ${this.toString()} adapter`, siteId);
    injectHotjar(siteId);
  }
  identify(options = {}) {
    if (options.userId && options.attributes) {
      window.hj('identify', options.userId, options.attributes);
    }
  }
  trackEvent(options = {}) {
    if (options.actionName) {
      window.hj('event', options.actionName);
    }
  }
  trackPage(options = {}) {
    const event = {
      actionName: 'page_viewed'
    };
    if (options.actionName) {
      this.trackEvent(options);
    } else {
      this.trackEvent(event);
    }
  }
  uninstall() {
    removeFromDOM(`script[id="hotjar"]`);
    delete window.hj;
  }
}

export { Hotjar as default };
//# sourceMappingURL=hotjar.js.map
