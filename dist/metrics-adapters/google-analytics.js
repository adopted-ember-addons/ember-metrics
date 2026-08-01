import { isPresent } from '@ember/utils';
import { assert } from '@ember/debug';
import BaseAdapter from './base.js';
import { compact } from '../-private/utils/object-transforms.js';
import capitalize from '../-private/utils/capitalize.js';
import removeFromDOM from '../-private/utils/remove-from-dom.js';
import { injectGoogleAnalytics } from '../-private/vendor/snippets.js';

class GoogleAnalytics extends BaseAdapter {
  gaSendKey = 'send';
  toStringExtension() {
    return 'GoogleAnalytics';
  }
  install() {
    const config = {
      ...this.config
    };
    const {
      id,
      sendHitTask,
      trace,
      require,
      debug,
      trackerName
    } = config;
    if (trackerName) {
      this.gaSendKey = `${trackerName}.send`;
    }
    assert(`[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`, id);
    delete config.id;
    delete config.require;
    delete config.debug;
    delete config.sendHitTask;
    delete config.trace;
    delete config.trackerName;
    const hasOptions = isPresent(Object.keys(config));
    this._injectScript(debug);
    if (trace === true) {
      window.ga_debug = {
        trace: true
      };
    }
    window.ga('create', id, hasOptions ? config : 'auto', trackerName);
    if (require) {
      require.forEach(plugin => {
        window.ga('require', plugin);
      });
    }
    if (sendHitTask === false) {
      window.ga('set', 'sendHitTask', null);
    }
  }

  // Thin wrapper around the vendor snippet so tests can stub script injection.
  _injectScript(debug) {
    injectGoogleAnalytics(debug);
  }
  identify(options = {}) {
    const compactedOptions = compact(options);
    const {
      distinctId
    } = compactedOptions;
    window.ga('set', 'userId', distinctId);
  }
  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const sendEvent = {
      hitType: 'event'
    };
    const eventKeys = ['category', 'action', 'label', 'value'];
    const gaEvent = {};
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
    const event = {
      ...sendEvent,
      ...gaEvent
    };
    const gaSendKey = this.gaSendKey;
    window.ga(gaSendKey, event);
    return event;
  }
  trackPage(options = {}) {
    const compactedOptions = compact(options);
    const sendEvent = {
      hitType: 'pageview'
    };
    const event = {
      ...sendEvent,
      ...compactedOptions
    };
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
    delete window.ga;
  }
}

export { GoogleAnalytics as default };
//# sourceMappingURL=google-analytics.js.map
