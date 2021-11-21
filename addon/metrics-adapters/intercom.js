import { assert } from '@ember/debug';
import {
  compact,
  without,
} from 'ember-metrics/-private/utils/object-transforms';
import removeFromDOM from 'ember-metrics/-private/utils/remove-from-dom';
import BaseAdapter from './base';

export default class Intercom extends BaseAdapter {
  booted = false;

  toStringExtension() {
    return 'Intercom';
  }

  install() {
    const { appId } = this.config;

    assert(
      `[ember-metrics] You must pass a valid \`appId\` to the ${this.toString()} adapter`,
      appId
    );

    this._injectScript(appId);
  }

  /* eslint-disable */
  // prettier-ignore
  _injectScript(appId) {
    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',{});}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;(function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;
    s.src=`https://widget.intercom.io/widget/${appId}`;
    var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);})(); }})()
  }
  /* eslint-enable */

  identify(options = {}) {
    const { appId } = this.config;
    const compactedOptions = compact(options);
    const { distinctId } = compactedOptions;
    const props = without(compactedOptions, 'distinctId');

    props.app_id = appId;
    if (distinctId) {
      props.user_id = distinctId;
    }

    assert(
      `[ember-metrics] You must pass \`distinctId\` or \`email\` to \`identify()\` when using the ${this.toString()} adapter`,
      props.email || props.user_id
    );

    const method = this.booted ? 'update' : 'boot';

    window.Intercom(method, props);
    this.booted = true;
  }

  trackEvent(options = {}) {
    const compactedOptions = compact(options);
    const { event = 'unspecified-event' } = compactedOptions;
    const props = without(compactedOptions, 'event');

    window.Intercom('trackEvent', event, props);
  }

  trackPage(options = {}) {
    const event = { event: 'page viewed' };
    const mergedOptions = { ...event, ...options };

    this.trackEvent(mergedOptions);
  }

  uninstall() {
    removeFromDOM('script[src*="intercom"]');

    delete window.Intercom;
  }
}
