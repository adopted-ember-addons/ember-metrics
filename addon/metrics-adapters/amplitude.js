import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import objectTransforms from 'ember-metrics/utils/object-transforms';
import removeFromDOM from 'ember-metrics/utils/remove-from-dom';
import { assert } from '@ember/debug';

const { without, compact, isPresent } = objectTransforms;

export default class AmplitudeMetricsAdapter extends BaseAdapter {
  toStringExtension() {
    return 'Amplitude';
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {
    const { config } = this;
    const { apiKey, options } = config;
    assert(
      `[ember-metrics] You must pass a valid \`apiKey\` to the ${this.toString()} adapter`,
      apiKey
    );

    this._injectScript();

    window.amplitude.getInstance().init(apiKey, null, options || {});
  }

  // prettier-ignore
  /* eslint-disable */
  _injectScript() {
    (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
    ;r.type="text/javascript"
    ;r.integrity="sha384-RsEu4WZflrqYcEacpfoGSib3qaSvdYwT4D+DrWqeBuDarSzjwUQR1jO8gDiXZd0E"
    ;r.crossOrigin="anonymous";r.async=true
    ;r.src="https://cdn.amplitude.com/libs/amplitude-6.2.0-min.gz.js"
    ;r.onload=function(){if(!e.amplitude.runQueuedFunctions){
    console.log("[Amplitude] Error: could not load SDK")}}
    ;var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)
    ;function s(e,t){e.prototype[t]=function(){
    this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
    var o=function(){this._q=[];return this}
    ;var a=["add","append","clearAll","prepend","set","setOnce","unset"]
    ;for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[]
    ;return this}
    ;var l=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
    ;for(var p=0;p<l.length;p++){s(c,l[p])}n.Revenue=c
    ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","enableTracking","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","groupIdentify","onInit","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId"]
    ;function v(e){function t(t){e[t]=function(){
    e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
    for(var n=0;n<d.length;n++){t(d[n])}}v(n);
    n.getInstance=function(e){
    e=(!e||e.length===0?"$default_instance":e).toLowerCase()
    ;if(!n._iq) {n._iq = {};} // we add this line
    if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]}
    ;e.amplitude=n})(window,document);
  }
  /* eslint-enable */

  identify(options = {}) {
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    const props = without(compactedOptions, 'distinctId');

    if (!this._identity) {
      this._identity = new window.amplitude.Identify();
    }

    assert(
      `[ember-metrics] [${this.toString()}] It appears you did not pass a distictId param to "identify". You will need to do so in order for the session to be tagged to a specific user.`,
      distinctId
    );

    if (distinctId) {
      window.amplitude.getInstance().setUserId(distinctId);
    }

    for (const k in props) {
      this._identity.set(k, props[k]);
    }

    window.amplitude.getInstance().identify(this._identity);
    window.amplitude.getInstance().logEvent('Identify');
  }

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event } = compactedOptions;
    const props = without(compactedOptions, 'event');

    if (isPresent(props)) {
      window.amplitude.getInstance().logEvent(event, props);
    } else {
      window.amplitude.getInstance().logEvent(event);
    }
  }

  trackPage(options = {}) {
    const eventOpt = { event: 'Page View' };
    const withEvent = { ...eventOpt, ...options };

    this.trackEvent(withEvent);
  }

  optOut() {
    window.amplitude.getInstance().setOptOut(true);
  }

  optIn() {
    window.amplitude.getInstance().setOptOut(false);
  }

  willDestroy() {
    removeFromDOM('script[src*="amplitude"]');

    delete window.amplitude;
  }
}
