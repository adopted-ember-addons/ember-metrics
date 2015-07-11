import config from '../config/environment';

export function initialize(_container, application ) {
  const { metricsAdapters } = config;

  application.register('config:metrics-adapters', metricsAdapters, { instantiate: false });
  application.inject('service:metrics', 'metricsAdapters', 'config:metrics-adapters');
}

export default {
  name: 'metrics',
  initialize
};
