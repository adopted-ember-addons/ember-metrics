import config from '../config/environment';

export function initialize(_container, application ) {
  const { metricsAdapters = {} } = config;

  application.register('config:metrics', metricsAdapters, { instantiate: false });
  application.inject('service:metrics', 'metricsAdapters', 'config:metrics');
}

export default {
  name: 'metrics',
  initialize
};
