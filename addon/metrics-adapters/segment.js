import { assert } from '@ember/debug';
import removeFromDOM from '../utils/remove-from-dom';
import { compact } from '../utils/object-transforms';
import BaseAdapter from './base';
import classic from 'ember-classic-decorator';

@classic
export default class Segment extends BaseAdapter {
  toStringExtension() {
    return 'Segment';
  }

  SCRIPT_DATA_ATTRIBUTE = 'data-ember-metrics-segment';

  init() {
    const config = { ...this.config };
    const segmentKey = config.key;

    assert(
      `[ember-metrics] You must pass a valid \`key\` to the ${this.toString()} adapter`,
      segmentKey
    );

    // start of segment loading snippet, taken here:
    // https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/#step-1-copy-the-snippet

    /* eslint-disable no-console */

    // Create a queue, but don't obliterate an existing one!
    let analytics = (window.analytics = window.analytics || []);

    // If the real analytics.js is already on the page return.
    if (analytics.initialize) return;

    // If the snippet was invoked already show an error
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
      'addSourceMiddleware',
      'addDestinationMiddleware',
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
    ];

    // Define a factory to create stubs. These are placeholders
    // for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    analytics.factory = function (method) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        analytics.push(args);
        return analytics;
      };
    };

    // For each of our methods, generate a queueing stub.
    for (var i = 0; i < analytics.methods.length; i++) {
      var key = analytics.methods[i];
      analytics[key] = analytics.factory(key);
    }

    const dataAttribute = this.SCRIPT_DATA_ATTRIBUTE;
    // Define a method to load Analytics.js from our CDN,
    // and that will be sure to only ever load it once.
    analytics.load = function (key, options) {
      // Create an async script element based on your key.
      var script = document.createElement('script');
      script.setAttribute(dataAttribute, '');
      script.type = 'text/javascript';
      script.async = true;
      script.src =
        'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';

      // Insert our script next to the first script element.
      var first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);
      analytics._loadOptions = options;
    };

    // Add a version to keep track of what's in the wild.
    analytics.SNIPPET_VERSION = '4.1.0';

    // Load Analytics.js with your key, which will automatically
    // load the tools you've enabled for your account.
    analytics.load(segmentKey);

    /* eslint-enable no-console */

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

  willDestroy() {
    removeFromDOM(`script[${this.SCRIPT_DATA_ATTRIBUTE}]`);

    delete window.analytics;
  }
}
