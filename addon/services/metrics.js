import Ember from 'ember';

const {
  Service,
  getWithDefault,
  assert,
  isNone,
  warn,
  get,
  set,
  merge,
  A: emberArray,
  String: { dasherize }
} = Ember;

export default Service.extend({
  _adapters: {},
  context: null,

  init() {
    const adapters = getWithDefault(this, 'metricsAdapters', emberArray([]));
    this._super(...arguments);
    this.activateAdapters(adapters);
    set(this, 'context', {});
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

  activateAdapters(adapterOptions = []) {
    const cachedAdapters = get(this, '_adapters');
    let activatedAdapters = {};

    adapterOptions.forEach((adapterOption) => {
      const { name } = adapterOption;
      let adapter;

      if (cachedAdapters[name]) {
        warn(`[ember-metrics] Metrics adapter ${name} has already been activated.`);
        adapter = cachedAdapters[name];
      } else {
        adapter = this._activateAdapter(adapterOption);
      }

      set(activatedAdapters, name, adapter);
    });

    return set(this, '_adapters', activatedAdapters);
  },

  invoke(methodName, ...args) {
    const adaptersObj = get(this, '_adapters');
    const allAdapterNames = Object.keys(adaptersObj);
    const [selectedAdapterNames, options] = args.length > 1 ? [[args[0]], args[1]] : [allAdapterNames, args[0]];
    const context = get(this, 'context');
    const mergedOptions = merge(context, options);

    const selectedAdapters = selectedAdapterNames.map((adapterName) => {
      return get(adaptersObj, adapterName);
    });

    selectedAdapters.forEach((adapter) => {
      adapter[methodName](mergedOptions);
    });
  },

  _activateAdapter(adapterOption = {}) {
    const metrics = this;
    const { name, config } = adapterOption;
    const Adapter = this._lookupAdapter(name);
    assert(`[ember-metrics] Could not find metrics adapter ${name}.`, Adapter);

    return Adapter.create({ metrics, config });
  },

  _lookupAdapter(adapterName = '') {
    const container = get(this, 'container');

    if (isNone(container)) {
      return;
    }

    const dasherizedAdapterName = dasherize(adapterName);
    const availableAdapter = container.lookupFactory(`ember-metrics@metrics-adapter:${dasherizedAdapterName}`);
    const localAdapter = container.lookupFactory(`metrics-adapter:${dasherizedAdapterName}`);
    const adapter = localAdapter ? localAdapter : availableAdapter;

    return adapter;
  },

  willDestroy() {
    const adapters = get(this, '_adapters');

    for (let adapterName in adapters) {
      get(adapters, adapterName).destroy();
    }
  }
});
