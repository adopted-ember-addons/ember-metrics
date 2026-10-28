import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import { compact } from '../-private/utils/object-transforms.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';

export default class GoogleAnalyticsFour extends BaseAdapter {
  options: Record<string, unknown> = {};

  toStringExtension() {
    return 'GoogleAnalyticsFour';
  }

  install() {
    const { id, options } = this.config as {
      id?: string;
      options?: Record<string, unknown>;
    };

    assert(
      `[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`,
      id,
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

  _injectScript(id: string) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;

    document.head.appendChild(script);
  }

  gtag(...args: unknown[]): object {
    window.dataLayer.push(args);

    return { ...args };
  }

  trackEvent(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;

    if (!event) {
      return;
    }

    delete compactedOptions.event;

    return this.gtag('event', event, compactedOptions);
  }

  trackPage(options: AdapterOptions = {}) {
    if (this.options.send_page_view) {
      return;
    }

    if (options.page && !options.page_location) {
      options.page_location = options.page;
      delete options.page;
    }

    if (options.title && !options.page_title) {
      options.page_title = options.title;
      delete options.title;
    }

    return this.trackEvent({
      event: 'page_view',
      ...options,
    });
  }

  uninstall() {
    removeFromDOM('script[src*="gtag/js"]');

    delete (window as Partial<Window>).dataLayer;
  }
}
