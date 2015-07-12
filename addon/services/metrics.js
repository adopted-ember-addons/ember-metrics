import Ember from 'ember';

const get = Ember.get;
const set = Ember.set;
const {
  String: emberString,
  Service,
  getWithDefault,
  assert,
  isNone,
  A: emberArray
} = Ember;
const {
  dasherize
} = emberString;

export default Service.extend({
  _adapters: {},

  init() {
    const adapters = getWithDefault(this, 'metricsAdapters', emberArray([]));
    this._super(...arguments);
    this.activateAdapters(adapters);
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
    let activatedAdapters = {};

    adapterOptions.forEach((adapterOption) => {
      const { name } = adapterOption;
      const adapter = this._activateAdapter(adapterOption);

      set(activatedAdapters, name, adapter);
    });

    return set(this, '_adapters', activatedAdapters);
  },

  invoke(methodName, ...args) {
    const adaptersObj = get(this, '_adapters');
    const adapterNames = Object.keys(adaptersObj);

    const adapters = adapterNames.map((adapterName) => {
      return get(adaptersObj, adapterName);
    });

    if (args.length > 1) {
      let [ adapterName, options ] = args;
      const adapter = get(adaptersObj, adapterName);

      adapter[methodName](options);
    } else if (args.length === 1) {
      const options = args.pop();

      adapters.forEach((adapter) => {
        adapter[methodName](options);
      });
    }
  },

  _activateAdapter(adapterOption = {}) {
    const metrics = this;
    const {
      name,
      config
    } = adapterOption;

    const Adapter = this._lookupAdapter(name);
    assert(`Could not find metrics adapter ${name}`, Adapter);

    return Adapter.create({
      metrics,
      config
    });
  },

  _lookupAdapter(adapterName = '') {
    const container = get(this, 'container');

    if (isNone(container)) {
      return;
    }

    const dasherizedAdapterName = dasherize(adapterName);
    const availableAdapter = container.lookupFactory(`ember-metrics@metrics-adapter:${dasherizedAdapterName}`);
    const localAdapter = container.lookupFactory(`metrics-adapter:${dasherizedAdapterName}`);
    const adapter = availableAdapter ? availableAdapter : localAdapter;

    return adapter;
  }
});
