/* eslint-env node */

module.exports = {
  description: 'Generates a metrics-adapter unit test',
  locals: function (options) {
    return {
      friendlyTestDescription: [
        'Unit',
        'MetricsAdapter',
        options.entity.name,
      ].join(' | '),
    };
  },
};
