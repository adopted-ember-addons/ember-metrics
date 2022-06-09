import { assert } from '@ember/debug';
import removeFromDOM from '../-private/utils/remove-from-dom';
import BaseAdapter from './base';

export default class Hotjar extends BaseAdapter {
  toStringExtension() {
    return 'Hotjar';
  }

  install() {
    const { siteId } = this.config;

    assert(
      `[ember-metrics] You must pass a \`siteId\` to the ${this.toString()} adapter`,
      siteId
    );

    this._injectScript(siteId);
  }

  // prettier-ignore
  _injectScript(siteId) {
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:siteId,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      r.id='hotjar';
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
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
    const event = { actionName: 'page_viewed' };

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
