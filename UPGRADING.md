# Upgrading

## Upgrade to v3

v3 ships ember-metrics as a [v2 addon](https://cli.emberjs.com/release/advanced-use/embroider/)
and replaces string-name, `config/environment`-based configuration with
explicit, class-based adapter activation. Your custom adapter classes
themselves don't need to change — only how you register and activate adapters.

### Compatibility

- Ember.js v5.8 or above
- Embroider or ember-auto-import v2

If your app still builds with classic ember-cli and doesn't have
ember-auto-import v2, you'll need to add it (or move to Embroider) before
upgrading.

### 1. Activate adapters explicitly (the main change)

Adapters are no longer read from `config/environment`. Instead, import the
adapter **classes** and pass them to `metrics.activateAdapters(...)` — a good
place is your application route, which runs once at boot. (Any spot that runs
once early works, and `activateAdapters` is idempotent; the application route
avoids the legacy initializer API, which is on Ember's deprecation path.)

**Before** (v2 — `config/environment.js`):

```js
module.exports = function (environment) {
  const ENV = {
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['all'],
        config: { id: 'UA-XXXX-Y' },
      },
      {
        name: 'Mixpanel',
        config: { token: '0f76c037-4d76-4fce-8a0f-a9a8f89d1453' },
      },
    ],
  };

  return ENV;
};
```

**After** (v3):

1. Remove the `metricsAdapters` (and any `'ember-metrics'`) keys from
   `config/environment.js`.
2. Register the adapters where they'll run once at boot — e.g. the application
   route — adding an `adapter` (the imported class) to each entry:

```js
// app/routes/application.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ENV from 'my-app/config/environment';
import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';
import Mixpanel from 'ember-metrics/metrics-adapters/mixpanel';

export default class ApplicationRoute extends Route {
  @service metrics;

  constructor() {
    super(...arguments);

    // Only needed if you gate adapters per environment (see step 4).
    this.metrics.appEnvironment = ENV.environment;

    this.metrics.activateAdapters([
      {
        name: 'GoogleAnalytics',
        adapter: GoogleAnalytics,
        environments: ['all'],
        config: { id: 'UA-XXXX-Y' },
      },
      {
        name: 'Mixpanel',
        adapter: Mixpanel,
        config: { token: '0f76c037-4d76-4fce-8a0f-a9a8f89d1453' },
      },
    ]);
  }
}
```

`name` stays exactly as before — it's still the label used to target an adapter
with `invoke` and the single-adapter form of `trackEvent`/`trackPage`/etc. The
only new field is `adapter`, the class you import from
`ember-metrics/metrics-adapters/<dasherized-name>`.

### 2. Remove `includeAdapters`

```js
// DELETE this from config/environment.js
'ember-metrics': {
  includeAdapters: ['segment', 'hotjar', /* ... */],
},
```

`includeAdapters` was a **build-time** whitelist for the old adapter
tree-shaking, which no longer exists. Adapters are now plain modules: only the
ones you `import` end up in your build, so there is nothing to "force include".
To use one, import it and add it to `activateAdapters` (step 1).

### 3. Custom adapters: import them, don't rely on the resolver

Custom adapters are no longer looked up from the container by name, so placing a
file in `app/metrics-adapters/` no longer registers it (and overriding a bundled
adapter by defining an app file with the same name is no longer supported).
Import your adapter class and pass it like any other:

```js
import MyAdapter from 'my-app/metrics-adapters/my-adapter';

metrics.activateAdapters([
  { name: 'MyAdapter', adapter: MyAdapter, config: { apiKey: '...' } },
]);
```

The adapter class itself is unchanged — it still extends `BaseAdapter` and
implements `install`/`uninstall` (plus any of `identify`/`trackEvent`/
`trackPage`/`alias`).

### 4. Set `appEnvironment` for per-environment gating

The service no longer reads `config:environment`, so it no longer knows your
app's environment on its own. If you use the `environments` option, set
`metrics.appEnvironment` before calling `activateAdapters` (see step 1). It
defaults to `'development'`.

### 5. `@ember/string` is no longer a peer dependency

ember-metrics no longer depends on `@ember/string`. If your app relied on it
being pulled in transitively, add it to your own dependencies.

### TypeScript

ember-metrics is now written in TypeScript and ships its own types.
`BaseAdapter`, `AdapterConfig`, and `AdapterOptions` are exported from
`ember-metrics/metrics-adapters/base`, and `AdapterRegistration` (the shape of an
`activateAdapters` entry) from `ember-metrics/services/metrics`.

---

## Upgrade to v2

### Updating your adapters

1. The Base adapter no longer inherits from EmberObject. Any usages of this API by
   your custom adapter must be removed, or replaced with some equivalent.
2. Rename your `init` method to `install`.
3. Rename your `willDestroy` method to `uninstall`.
