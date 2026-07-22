import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';
import { injectHotjar } from '../-private/vendor/snippets.ts';

export default class Hotjar extends BaseAdapter {
  toStringExtension() {
    return 'Hotjar';
  }

  install() {
    const { siteId } = this.config;

    assert(
      `[ember-metrics] You must pass a \`siteId\` to the ${this.toString()} adapter`,
      siteId,
    );

    injectHotjar(siteId);
  }

  identify(options: AdapterOptions = {}) {
    if (options.userId && options.attributes) {
      window.hj('identify', options.userId, options.attributes);
    }
  }

  trackEvent(options: AdapterOptions = {}) {
    if (options.actionName) {
      window.hj('event', options.actionName);
    }
  }

  trackPage(options: AdapterOptions = {}) {
    const event = { actionName: 'page_viewed' };

    if (options.actionName) {
      this.trackEvent(options);
    } else {
      this.trackEvent(event);
    }
  }

  uninstall() {
    removeFromDOM(`script[id="hotjar"]`);

    delete (window as Partial<Window>).hj;
  }
}
