import Ember from 'ember';
import canUseDOM from '../utils/can-use-dom';
import objectTransforms from '../utils/object-transforms';
import BaseAdapter from './base';

const {
  assert,
  get,
  set,
  A: emberArray
} = Ember;
const {
  compact
} = objectTransforms;

export default BaseAdapter.extend({
  toStringExtension() {
    return 'DynamicTagManager';
  },

  init() {
    const config = get(this, 'config');
    const { src } = config;

    assert(`[ember-metrics] You must pass a valid \`src\` to the ${this.toString()} adapter`, src);
    set(this, 'dtmSrc', src);

    let dataLayerNameString = set(this, 'dataLayerNameString', config['dataLayerName'] || 'dtmDataLayer');
    window[dataLayerNameString] = {};

    if (canUseDOM) {
      /* jshint ignore:start */
      let script = document.createElement("script");
      script.src = get(this, 'dtmSrc');
      script.async = true;
      document.getElementsByTagName('head')[0].appendChild(script);
      /* jshint ignore:end */
    }

    this.eventQueue = emberArray();
  },

  pushAndCheck(dtmEvent) {
    this.eventQueue.push(dtmEvent);
    this.checkForQueue();
  },

  checkForQueue() {
    if (this.get('eventQueue').length) {
      if (this.isSatelliteDefined()) {
        this.sendEvents();
      } else {
        Ember.run.later(() => {
          this.checkForQueue();
        }, 50);
      }
    }
  },

  sendEvents() {
    this.get('eventQueue').forEach((event) => {
      for (var key of Object.keys(event)) {
        window[get(this, 'dataLayerNameString')][key] = event[key];
      }
      window._satellite.track(event['event']);
    });
    this.set('eventQueue', []);
  },

  isSatelliteDefined() {
    return typeof(window._satellite) === "object";
  },

  trackEvent(options = {}) {
    const dtmEvent = compact(options);
    this.pushAndCheck(dtmEvent);
    return dtmEvent;
  },

  pushPayload(payload) {
    for (var key of Object.keys(payload)) {
      window[get(this, 'dataLayerNameString')][key] = payload[key];
    }
  },

  trackPage(options = {}) {
    const dtmEvent = compact(options);
    dtmEvent['event'] = 'vpv';
    this.pushAndCheck(dtmEvent);
    return dtmEvent;
  },

  willDestroy() {
    delete window['_satellite'];
    delete window[get(this, 'dataLayerNameString')];
  }
});
