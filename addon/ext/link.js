import Ember from 'ember';

const {
  LinkComponent,
  inject,
  isPresent,
  get,
  String: { camelize }
} = Ember;

export default LinkComponent.reopen({
  metrics: inject.service(),

  click() {
    const attrs = Object.keys(get(this, 'attrs'));
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
        const strippedAttr = attr.replace('metrics', '');
        const camelizedAttr = camelize(strippedAttr);
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
