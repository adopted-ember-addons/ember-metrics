import config from '../config/environment';

export function initialize(_container, application ) {
  const { metricsAdapters = {} } = config;
  const { environment = 'development' } = config;

  application.register('config:metrics', metricsAdapters, { instantiate: false });
  application.register('config:metrics-env', environment, { instantiate: false });
  application.inject('service:metrics', 'metricsAdapters', 'config:metrics');
  application.inject('service:metrics', 'environment', 'config:metrics-env');
}

export default {
  name: 'metrics',
  initialize
};
