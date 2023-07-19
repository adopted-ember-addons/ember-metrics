import { assert } from '@ember/debug';
import removeFromDOM from 'dcp-ember-metrics/-private/utils/remove-from-dom';
import { compact } from 'dcp-ember-metrics/-private/utils/object-transforms';
import BaseAdapter from './base';

export default class Segment extends BaseAdapter {
  toStringExtension() {
    return 'Segment';
  }

  install() {
    const config = { ...this.config };
    const segmentKey = config.key;
    const proxyDomain = config.proxyDomain || 'https://cdn.segment.com';

    assert(
      `[ember-metrics] You must pass a valid \`key\` to the ${this.toString()} adapter`,
      segmentKey
    );

    // start of segment loading snippet, taken here:
    // https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/#step-2-copy-the-segment-snippet

    // Create a queue, but don't obliterate an existing one!
    let analytics = (window.analytics = window.analytics || []);

    // If the real analytics.js is already on the page return.
    if (analytics.initialize) return;

    // If the snippet was invoked already show an error.
    if (analytics.invoked) {
      if (window.console && console.error) {
        console.error('Segment snippet included twice.');
      }
      return;
    }

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    analytics.invoked = true;

    // A list of the methods in Analytics.js to stub.
    analytics.methods = [
      'trackSubmit',
      'trackClick',
      'trackLink',
      'trackForm',
      'pageview',
      'identify',
      'reset',
      'group',
      'track',
      'ready',
      'alias',
      'debug',
      'page',
      'once',
      'off',
      'on',
      'addSourceMiddleware',
      'addIntegrationMiddleware',
      'setAnonymousId',
      'addDestinationMiddleware',
    ];
    // Define a factory to create stubs. These are placeholders
    // for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    analytics.factory = function (method) {
      return function () {
        let args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        analytics.push(args);
        return analytics;
      };
    };

    // For each of our methods, generate a queueing stub.
    for (let i = 0; i < analytics.methods.length; i++) {
      const key = analytics.methods[i];
      analytics[key] = analytics.factory(key);
    }

    // Define a method to load Analytics.js from our CDN,
    // and that will be sure to only ever load it once.
    analytics.load = function (key, options) {
      // Create an async script element based on your key.
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `${proxyDomain}/analytics.js/v1/${key}/analytics.min.js`;

      // Insert our script next to the first script element.
      const first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);
      analytics._loadOptions = options;
    };
    analytics._writeKey = segmentKey;

    // Add a version to keep track of what's in the wild.
    analytics.SNIPPET_VERSION = '4.15.2';

    // Load Analytics.js with your key, which will automatically
    // load the tools you've enabled for your account. Boosh!
    analytics.load(segmentKey);

    // end of segment loading snippet
  }

  alias(options = {}) {
    const compactedOptions = compact(options);
    const { alias, original } = compactedOptions;

    if (original) {
      window.analytics.alias(alias, original);
    } else {
      window.analytics.alias(alias);
    }
  }

  identify(options = {}) {
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    delete compactedOptions.distinctId;

    window.analytics.identify(distinctId, compactedOptions);
  }

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    delete compactedOptions.event;

    window.analytics.track(event, compactedOptions);
  }

  trackPage(options = {}) {
    const compactedOptions = compact(options);
    const { page } = compactedOptions;
    delete compactedOptions.page;

    window.analytics.page(page, compactedOptions);
  }

  uninstall() {
    removeFromDOM('script[src*="segment.com"]');

    delete window.analytics;
  }
}
