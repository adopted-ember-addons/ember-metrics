import Ember from 'ember';

const {
  Service,
  getWithDefault,
  assert,
  get,
  set,
  copy,
  makeArray,
  A: emberArray,
  String: { dasherize },
  getOwner
} = Ember;
const { keys } = Object;
const assign = Ember.assign || Ember.merge;

export default Service.extend({
  /**
   * Cached adapters to reduce multiple expensive lookups.
   *
   * @property _adapters
   * @private
   * @type Object
   * @default null
   */
  _adapters: null,

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
  context: null,

  /**
   * Indicates whether calls to the service will be forwarded to the adapters
   *
   * @property enabled
   * @type Boolean
   * @default true
   */
  enabled: true,

  /**
   * When the Service is created, activate adapters that were specified in the
   * configuration. This config is injected into the Service as
   * `options`.
   *
   * @method init
   * @param {Void}
   * @return {Void}
   */
  init() {
    const owner = getOwner(this);
    owner.registerOptionsForType('ember-metrics@metrics-adapter', { instantiate: false });
    owner.registerOptionsForType('metrics-adapter', { instantiate: false });
    set(this, 'appEnvironment', getWithDefault(this, 'options.environment', 'development'));
    set(this, '_adapters', {});
    set(this, 'context', {});
    this.activateAdapters(this._adapterOptions());
    this._super(...arguments);
  },

  identify(...args) {
    this.invoke('identify', ...args);
  },

  alias(...args) {
    this.invoke('alias', ...args);
  },

  trackEvent(...args) {
    this.invoke('trackEvent', ...args);
  },

  trackPage(...args) {
    this.invoke('trackPage', ...args);
  },

  /**
   * Instantiates the adapters specified in the configuration and caches them
   * for future retrieval.
   *
   * @method activateAdapters
   * @param {Array} adapterOptions
   * @return {Object} instantiated adapters
   */
  activateAdapters(adapterOptions = []) {
    this.willDestroy();

    const appEnvironment = get(this, 'appEnvironment');
    const cachedAdapters = get(this, '_adapters');
    const activatedAdapters = {};


    adapterOptions
      .filter((adapterOption) => this._filterEnvironments(adapterOption, appEnvironment))
      .forEach((adapterOption) => {
        const { name, config } = adapterOption;
        const adapter = cachedAdapters[name] ? cachedAdapters[name] : this._activateAdapter(adapterOption);

        set(activatedAdapters, name, adapter);
      });

    return set(this, '_adapters', activatedAdapters);
  },

  /**
   * Activates the given adapter that supports enableOnStart flag
   *
   * @method activateAdapter
   * @param {String} adapterName
   * @return {Void}
   */
  activateAdapter(adapterName) {
    if ( this._adapterEnableStateWillChange(adapterName, true) ) {
      this.activateAdapters(this._changeAdapterEnableState(adapterName, true));
    }
  },

  /**
   * Deactives the given adapter that supports enableOnStart flag
   *
   * @method deactivateAdapter
   * @param {String} adapterName
   * @return {Void}
   */
  deactivateAdapter(adapterName) {
    if ( this._adapterEnableStateWillChange(adapterName, false) ) {
      this.activateAdapters(this._changeAdapterEnableState(adapterName, false));
    }
  },

  /**
   * Invokes a method on the passed adapter, or across all activated adapters if not passed.
   *
   * @method invoke
   * @param {String} methodName
   * @param {Rest} args
   * @return {Void}
   */
  invoke(methodName, ...args) {
    if ( !get(this, 'enabled') ) { return; }

    const cachedAdapters = get(this, '_adapters');
    const allAdapterNames = keys(cachedAdapters);
    const [selectedAdapterNames, options] = args.length > 1 ? [makeArray(args[0]), args[1]] : [allAdapterNames, args[0]];
    const context = copy(get(this, 'context'));
    const mergedOptions = assign(context, options);

    selectedAdapterNames
      .map((adapterName) => get(cachedAdapters, adapterName))
      .forEach((adapter) => adapter && adapter[methodName](mergedOptions));
  },

  /**
   * On teardown, destroy cached adapters together with the Service.
   *
   * @method willDestroy
   * @param {Void}
   * @return {Void}
   */
  willDestroy() {
    const cachedAdapters = get(this, '_adapters');

    for (let adapterName in cachedAdapters) {
      get(cachedAdapters, adapterName).destroy();
    }

    set(this, '_adapters', {});
  },

  /**
   * Instantiates an adapter if one is found.
   *
   * @method _activateAdapter
   * @param {Object}
   * @private
   * @return {Adapter}
   */
  _activateAdapter({ name, config } = {}) {
    const Adapter = this._lookupAdapter(name);
    assert(`[ember-metrics] Could not find metrics adapter ${name}.`, Adapter);

    return Adapter.create({ this, config });
  },

  /**
   * Change the enableOnStart state of the given adapter to the given state
   *
   * @method _changeAdapterEnableState
   * @param {String} adapterName
   * @param {Boolean} state
   * @return {Object} instantiated adapters
   */
  _changeAdapterEnableState(adapterName, state) {
    let adapters = this._adapterOptions();

    adapters.forEach((adapter) => {
      if ( adapter.name == adapterName ) {
        set(adapter.config, 'enableOnStart', state);
      }
    });

    return adapters;
  },

  /**
   * Compare the enableOnStart state of the given adapter
   *
   * @method _adapterEnableStateWillChange
   * @param {String} adapterName
   * @param {Boolean} state
   * @return {Boolean} true if adapter enableOnStart state will change
   */
  _adapterEnableStateWillChange(adapterName, state) {
    let adapterOption = this._adapterOptions().filter((adapterOption) => {
      return adapterOption.name === adapterName;
    })[0];

    return adapterOption.config.enableOnStart !== state;
  },

  /**
   * The current state of metricsAdapter options
   *
   * @method _adapterOptions
   * @param {Void}
   * @return {Array} adapter options
   */
  _adapterOptions() {
    return getWithDefault(this, 'options.metricsAdapters', emberArray());
  },

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
    assert('[ember-metrics] Could not find metrics adapter without a name.', adapterName);

    const dasherizedAdapterName = dasherize(adapterName);
    const availableAdapter = getOwner(this).lookup(`ember-metrics@metrics-adapter:${dasherizedAdapterName}`);
    const localAdapter = getOwner(this).lookup(`metrics-adapter:${dasherizedAdapterName}`);

    return localAdapter ? localAdapter : availableAdapter;
  },

  /**
   * Predicate that Filters out adapters that should not be activated in the
   * current application environment. Defaults to all environments if the option
   * is `all` or undefined.
   *
   * @method _filterEnvironments
   * @param {Object} adapterOption
   * @param {String} appEnvironment
   * @private
   * @return {Boolean} should an adapter be activated
   */
  _filterEnvironments(adapterOption, appEnvironment) {
    let { environments } = adapterOption;
    environments = environments || ['all'];
    const wrappedEnvironments = emberArray(environments);

    return wrappedEnvironments.indexOf('all') > -1 || wrappedEnvironments.indexOf(appEnvironment) > -1;
  }
});
