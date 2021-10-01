import { isPresent } from '@ember/utils';
import { assert } from '@ember/debug';
import { capitalize } from '@ember/string';
import { compact } from '../utils/object-transforms';
import removeFromDOM from '../utils/remove-from-dom';
import BaseAdapter from './base';
import classic from 'ember-classic-decorator';

@classic
export default class GoogleAnalytics extends BaseAdapter {
  gaSendKey = 'send';

  toStringExtension() {
    return 'GoogleAnalytics';
  }

  init() {
    const config = { ...this.config };
    const { id, sendHitTask, trace, require, debug, trackerName } = config;

    if (trackerName) {
      this.gaSendKey = `${trackerName}.send`;
    }

    assert(
      `[ember-metrics] You must pass a valid \`id\` to the ${this.toString()} adapter`,
      id
    );

    delete config.id;
    delete config.require;
    delete config.debug;
    delete config.sendHitTask;
    delete config.trace;
    delete config.trackerName;

    const hasOptions = isPresent(Object.keys(config));

    this._injectScript(debug, this.SCRIPT_DATA_ATTRIBUTE);

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

  /* eslint-disable */
  // prettier-ignore
  _injectScript(debug, dataAttribute) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.setAttribute(dataAttribute,'');
      a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
    })(window,document,'script',`https://www.google-analytics.com/analytics${debug ? '_debug' : ''}.js`,'ga');
  }
  /* eslint-enable */

  identify(options = {}) {
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;

    window.ga('set', 'userId', distinctId);
  }

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const sendEvent = { hitType: 'event' };
    const eventKeys = ['category', 'action', 'label', 'value'];
    let gaEvent = {};

    if (compactedOptions.nonInteraction) {
      gaEvent.nonInteraction = compactedOptions.nonInteraction;
      delete compactedOptions.nonInteraction;
    }

    for (let key in compactedOptions) {
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

  trackPage(options = {}) {
    const compactedOptions = compact(options);
    const sendEvent = { hitType: 'pageview' };
    const event = { ...sendEvent, ...compactedOptions };

    for (let key in compactedOptions) {
      // eslint-disable-next-line
      if (compactedOptions.hasOwnProperty(key)) {
        window.ga('set', key, compactedOptions[key]);
      }
    }
    const gaSendKey = this.gaSendKey;
    window.ga(gaSendKey, event);

    return event;
  }

  willDestroy() {
    removeFromDOM(`[${this.SCRIPT_DATA_ATTRIBUTE}]`);

    delete window.ga;
  }
}
