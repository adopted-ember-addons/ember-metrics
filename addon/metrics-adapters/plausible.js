import { assert } from '@ember/debug';
import removeFromDOM from 'ember-metrics/-private/utils/remove-from-dom';
import BaseAdapter from './base';

export default class Plausible extends BaseAdapter {
  toStringExtension() {
    return Plausible.name;
  }

  install() {
    const { siteId, scriptUrl } = this.config;
    assert(
      `[ember-metrics] You must pass a \`scriptUrl\` and a \`siteId\` to the ${this.toString()} adapter`,
      scriptUrl && siteId
    );
    this._injectScript(scriptUrl, siteId);
  }

  // prettier-ignore
  _injectScript(scriptUrl, siteId) {
    window.plausible =
      window.plausible ||
      function (...args) {
        (window.plausible.q = window.plausible.q || []).push(args);
      };

      const scriptElement = document.createElement('script');
      const firstScriptElement = document.getElementsByTagName('script')[0];
      scriptElement.type = 'text/javascript';
      scriptElement.defer = true;
      scriptElement.async = true;
      scriptElement.src = scriptUrl;
      scriptElement.setAttribute('data-domain', siteId);
      firstScriptElement.parentNode.insertBefore(scriptElement, firstScriptElement);
  }

  identify() {}

  /**
   * Custom events allow you to measure button clicks, form completions...
   *
   * @param {Object} params
   * @param {string} params.eventName - must not contain spaces, examples: verify-this or That+Completion
   * @param {Objects} params.props - event metadatas, must not contain any personally identifiable information
   */
  trackEvent({ eventName, plausibleAttributes = {}, ...props }) {
    window.plausible(eventName, { ...plausibleAttributes, props });
  }

  trackPage({ plausibleAttributes = {}, ...props }) {
    window.plausible('pageview', { ...plausibleAttributes, props });
  }

  uninstall() {
    removeFromDOM('script[src*="plausible"]');
    delete window.plausible;
  }
}
