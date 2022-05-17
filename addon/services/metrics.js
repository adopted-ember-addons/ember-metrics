import Service from '@ember/service';
import { assert } from '@ember/debug';
import { dasherize } from '@ember/string';
import { getOwner } from '@ember/application';

export default class Metrics extends Service {
  /**
   * Cached adapters to reduce multiple expensive lookups.
   *
   * @property _adapters
   * @private
   * @type Object
   * @default null
   */
  _adapters = {};

  /**
   * Contextual information attached to each call to an adapter. Often you'll
   * want to include things like `currentUser.name` with every event or page
   * view  that's tracked. Any properties that you bind to `metrics.context`
   * will be merged into the options for every service call.
   *
   * @property context
   * @type Object
   * @default null
   */
  context = {};

  /**
   * Environment the host application is running in (e.g. development or production).
   */
  appEnvironment = null;

  /**
   * When the Service is created, activate adapters that were specified in the
   * configuration. This config is injected into the Service as `options`.
   */
  constructor() {
    super(...arguments);

    const owner = getOwner(this);

    owner.registerOptionsForType('ember-metrics@metrics-adapter', {
      instantiate: false,
    });
    owner.registerOptionsForType('metrics-adapter', { instantiate: false });

    const config = owner.factoryFor('config:environment').class;
    const { metricsAdapters = [] } = config;
    const { environment = 'development' } = config;

    this._options = { metricsAdapters, environment };
    this.appEnvironment = environment;
    this.activateAdapters(metricsAdapters);
  }

  /**
   * Instantiates adapters from passed adapter options and caches them for future retrieval.
   *
   * @method activateAdapters
   * @param {Array} adapterOptions
   * @return {Object} instantiated adapters
   */
  activateAdapters(adapterOptions = []) {
    const adaptersForEnv = this._adaptersForEnv(adapterOptions);
    const activeAdapters = {};

    for (let { name, config } of adaptersForEnv) {
      let adapterClass = this._lookupAdapter(name);
      if (typeof FastBoot === 'undefined' || adapterClass.supportsFastBoot) {
        activeAdapters[name] =
          this._adapters[name] ||
          this._activateAdapter({ adapterClass, config });
      }
    }
    this._adapters = activeAdapters;

    return this._adapters;
  }

  /**
   * Returns all adapterOptions that should be activated in the current application environment.
   * Defaults to all environments if the option is `all` or undefined.
   *
   * @method adaptersForEnv
   * @param {Array} adapterOptions
   * @private
   * @return {Array} - adapter options in the current environment
   */
  _adaptersForEnv(adapterOptions = []) {
    return adapterOptions.filter(({ environments = ['all'] }) => {
      return (
        environments.includes('all') ||
        environments.includes(this.appEnvironment)
      );
    });
  }

  /**
   * Looks up the adapter from the container. Prioritizes the consuming app's
   * adapters over the addon's adapters.
   *
   * @method _lookupAdapter
   * @param {String} adapterName
   * @private
   * @return {Adapter} a local adapter or an adapter from the addon
   */
  _lookupAdapter(adapterName) {
    assert(
      '[ember-metrics] Could not find metrics adapter without a name.',
      adapterName
    );

    const availableAdapter = getOwner(this).lookup(
      `ember-metrics@metrics-adapter:${dasherize(adapterName)}`
    );
    const localAdapter = getOwner(this).lookup(
      `metrics-adapter:${dasherize(adapterName)}`
    );

    const adapter = localAdapter || availableAdapter;
    assert(
      `[ember-metrics] Could not find metrics adapter ${adapterName}.`,
      adapter
    );

    return adapter;
  }

  /**
   * Instantiates an adapter.
   *
   * @method _activateAdapter
   * @param {Object}
   * @private
   * @return {Adapter}
   */
  _activateAdapter({ adapterClass, config }) {
    const adapter = new adapterClass(config);
    adapter.install();
    return adapter;
  }

  identify() {
    this.invoke('identify', ...arguments);
  }

  alias() {
    this.invoke('alias', ...arguments);
  }

  trackEvent() {
    this.invoke('trackEvent', ...arguments);
  }

  trackPage() {
    this.invoke('trackPage', ...arguments);
  }

  /**
   * Invokes a method on the passed adapter, or across all activated adapters if not passed.
   *
   * @method invoke
   * @param {String} methodName
   * @param {Rest} args
   * @return {Void}
   */
  invoke(methodName, ...args) {
    let selectedAdapterNames, options;

    if (args.length > 1) {
      selectedAdapterNames = makeArray(args[0]);
      options = args[1];
    } else {
      selectedAdapterNames = Object.keys(this._adapters);
      options = args[0];
    }

    for (let adapterName of selectedAdapterNames) {
      let adapter = this._adapters[adapterName];
      adapter && adapter[methodName]({ ...this.context, ...options });
    }
  }

  /**
   * On teardown, destroy cached adapters together with the Service.
   *
   * @method willDestroy
   * @return {void}
   */
  willDestroy() {
    Object.values(this._adapters).forEach((adapter) => adapter.uninstall());
  }
}

function makeArray(maybeArray) {
  return Array.isArray(maybeArray) ? Array.from(maybeArray) : Array(maybeArray);
}
