import Ember from 'ember';

const get = Ember.get;
const {
  LinkComponent,
  inject,
  isPresent,
  String: emberString
} = Ember;
const {
  camelize
} = emberString;

export default LinkComponent.reopen({
  metrics: inject.service(),

  click() {
    const attrs = Object.keys(get(this, 'attrs'));
    const metrics = get(this, 'metrics');
    const metricsProperties = this._deserializeEvent(attrs);
    const hasMetricsKeys = isPresent(Object.keys(metricsProperties));

    if (hasMetricsKeys) {
      metrics.trackEvent(metricsProperties);
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
  }
});
