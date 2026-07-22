import { isPresent } from '@ember/utils';
import { assert } from '@ember/debug';
import BaseAdapter, { type AdapterOptions } from './base.ts';
import { compact } from '../-private/utils/object-transforms.ts';
import capitalize from '../-private/utils/capitalize.ts';
import removeFromDOM from '../-private/utils/remove-from-dom.ts';
import { injectGoogleAnalytics } from '../-private/vendor/snippets.ts';

export default class GoogleAnalytics extends BaseAdapter {
  gaSendKey = 'send';

  toStringExtension() {
    return 'GoogleAnalytics';
  }

  install() {
    const config = { ...this.config } as {
      id?: unknown;
      sendHitTask?: unknown;
      trace?: unknown;
      require?: unknown[];
      debug?: unknown;
      trackerName?: string;
    };
    const { id, sendHitTask, trace, require, debug, trackerName } = config;

    if (trackerName) {
      this.gaSendKey = `${trackerName}.send`;
    }

    assert(
      `[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`,
      id,
    );

    delete config.id;
    delete config.require;
    delete config.debug;
    delete config.sendHitTask;
    delete config.trace;
    delete config.trackerName;

    const hasOptions = isPresent(Object.keys(config));

    this._injectScript(debug);

    if (trace === true) {
      window.ga_debug = { trace: true };
    }

    window.ga('create', id, hasOptions ? config : 'auto', trackerName);

    if (require) {
      require.forEach((plugin) => {
        window.ga('require', plugin);
      });
    }

    if (sendHitTask === false) {
      window.ga('set', 'sendHitTask', null);
    }
  }

  // Thin wrapper around the vendor snippet so tests can stub script injection.
  _injectScript(debug: unknown) {
    injectGoogleAnalytics(debug);
  }

  identify(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;

    window.ga('set', 'userId', distinctId);
  }

  trackEvent(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const sendEvent = { hitType: 'event' };
    const eventKeys = ['category', 'action', 'label', 'value'];
    const gaEvent: Record<string, unknown> = {};

    if (compactedOptions.nonInteraction) {
      gaEvent.nonInteraction = compactedOptions.nonInteraction;
      delete compactedOptions.nonInteraction;
    }

    for (const key in compactedOptions) {
      if (eventKeys.includes(key)) {
        const capitalizedKey = capitalize(key);
        gaEvent[`event${capitalizedKey}`] = compactedOptions[key];
      } else {
        gaEvent[key] = compactedOptions[key];
      }
    }

    const event = { ...sendEvent, ...gaEvent };
    const gaSendKey = this.gaSendKey;

    window.ga(gaSendKey, event);

    return event;
  }

  trackPage(options: AdapterOptions = {}) {
    const compactedOptions = compact(options);
    const sendEvent = { hitType: 'pageview' };
    const event = { ...sendEvent, ...compactedOptions };

    for (const key in compactedOptions) {
      // eslint-disable-next-line no-prototype-builtins
      if (compactedOptions.hasOwnProperty(key)) {
        window.ga('set', key, compactedOptions[key]);
      }
    }
    const gaSendKey = this.gaSendKey;
    window.ga(gaSendKey, event);

    return event;
  }

  uninstall() {
    removeFromDOM('script[src*="google-analytics"]');

    delete (window as Partial<Window>).ga;
  }
}
