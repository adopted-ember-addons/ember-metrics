module.exports = {
  description: 'Generates an dcp-ember-metrics adapter.',

  locals: function (options) {
    var importStatement =
      "import BaseAdapter from 'dcp-ember-metrics/metrics-adapters/base';";
    var baseClass = 'BaseAdapter';
    var toStringExtension = 'return ' + "'" + options.entity.name + "';";
    // Return custom template variables here.
    return {
      importStatement: importStatement,
      baseClass: baseClass,
      toStringExtension: toStringExtension,
    };
  },
};
