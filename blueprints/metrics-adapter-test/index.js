/* eslint-env node */

module.exports = {
  description: 'Generates an metrics-adapter unit test',
  locals: function(options) {
    return {
      friendlyTestDescription: options.entity.name + ' adapter'
    };
  }
};
