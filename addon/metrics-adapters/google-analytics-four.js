import { assert } from '@ember/debug';
import { compact } from 'dcp-ember-metrics/-private/utils/object-transforms';
import removeFromDOM from 'dcp-ember-metrics/-private/utils/remove-from-dom';
import BaseAdapter from './base';

export default class GoogleAnalyticsFour extends BaseAdapter {
  toStringExtension() {
    return 'GoogleAnalyticsFour';
  }

  install() {
    const { id, options } = this.config;

    assert(
      `[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`,
      id
    );

    this.options = {
      send_page_view: true,
      ...options,
    };

    this._injectScript(id);

    window.dataLayer = window.dataLayer || [];
    this.gtag('js', new Date());
    this.gtag('config', id, compact(this.options));
  }

  _injectScript(id) {
    let script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;

    document.head.appendChild(script);
  }

  gtag() {
    window.dataLayer.push(arguments);

    return arguments;
  }

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;

    if (!event) {
      return;
    }

    delete compactedOptions.event;

    return this.gtag('event', event, compactedOptions);
  }

  trackPage(options = {}) {
    if (this.options.send_page_view) {
      return;
    }

    if (options?.page && !options?.page_location) {
      options.page_location = options?.page;
      delete options.page;
    }

    if (options?.title && !options?.page_title) {
      options.page_title = options?.title;
      delete options.title;
    }

    return this.trackEvent({
      event: 'page_view',
      ...options,
    });
  }

  uninstall() {
    removeFromDOM('script[src*="gtag/js"]');

    delete window.dataLayer;
  }
}
