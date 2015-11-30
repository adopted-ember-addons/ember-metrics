import config from '../config/environment';

export function initialize() {
  const application = arguments[1] || arguments[0];
  const { metricsAdapters = [] } = config;
  const { environment = 'development' } = config;
  const options = { metricsAdapters, environment };

  application.register('config:metrics', options, { instantiate: false });
  application.inject('service:metrics', 'options', 'config:metrics');
}

export default {
  name: 'metrics',
  initialize
};
