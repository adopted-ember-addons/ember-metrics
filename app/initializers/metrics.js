import config from '../config/environment';

export function initialize(_container, application ) {
  const { metricsAdapters = {} } = config;
  const { environment = 'development' } = config;
  const options = { metricsAdapters, environment };

  application.register('config:metrics', options, { instantiate: false });
  application.inject('service:metrics', 'options', 'config:metrics');
}

export default {
  name: 'metrics',
  initialize
};
