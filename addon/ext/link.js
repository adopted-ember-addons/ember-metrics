import Ember from 'ember';

const {
  inject,
  isPresent,
  get,
  getWithDefault,
  String: { camelize }
} = Ember;
const LinkComponent = Ember.LinkComponent || Ember.LinkView;

export default LinkComponent.reopen({
  metrics: inject.service(),

  click() {
    const attrs = Object.keys(getWithDefault(this, 'attrs', this));
    const metricsProperties = this._deserializeEvent(attrs);
    const hasMetricsKeys = isPresent(Object.keys(metricsProperties));

    if (hasMetricsKeys) {
      this._trackEvent(metricsProperties);
    }

    this._super(...arguments);
  },

  _deserializeEvent(attrs) {
    let metricsProperties = {};

    attrs.forEach((attr) => {
      if (attr.indexOf('metrics') !== -1) {
        const camelizedAttr = camelize(attr.replace('metrics', ''));
        metricsProperties[camelizedAttr] = get(this, attr);
      }
    });

    return metricsProperties;
  },

  _trackEvent(metricsProperties) {
    const metrics = get(this, 'metrics');
    const { adapterName } = metricsProperties;
    delete metricsProperties.adapterName;

    if (adapterName) {
      metrics.trackEvent(adapterName, metricsProperties);
    } else {
      metrics.trackEvent(metricsProperties);
    }
  }
});
