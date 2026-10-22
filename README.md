# ember-metrics

_Send data to multiple analytics services without re-implementing a new API_

![Download count all time](https://img.shields.io/npm/dt/ember-metrics.svg) [![npm version](https://badge.fury.io/js/ember-metrics.svg)](http://badge.fury.io/js/ember-metrics) [![CI](https://github.com/adopted-ember-addons/ember-metrics/actions/workflows/ci.yml/badge.svg)](https://github.com/adopted-ember-addons/ember-metrics/actions/workflows/ci.yml) [![Ember Observer Score](http://emberobserver.com/badges/ember-metrics.svg)](http://emberobserver.com/addons/ember-metrics)

This addon adds a simple `metrics` service to your app that makes it easy to
send data to multiple analytics services without having to implement a new API
each time. Track events, page views, and more through one API, and add or
remove analytics services just by changing how you activate their adapters.

Writing your own adapter for an unsupported service is easy too — see
[Writing your own adapters](#writing-your-own-adapters).

> **Upgrading from the classic (string-name) API?** Adapters are now activated
> by passing adapter **classes** to `metrics.activateAdapters(...)` rather than
> by string name via `config/environment`. This makes the addon compatible with
> `ember-strict-application-resolver` and Embroider's static builds. See
> [Configuration & activation](#configuration--activation).

## Compatibility

- Ember.js v5.8 or above
- Embroider or ember-auto-import v2

## Installation

```sh
ember install ember-metrics
```

## Supported services and options

Each service ships as an adapter class you import from
`ember-metrics/metrics-adapters/<name>` (dasherized), e.g.
`ember-metrics/metrics-adapters/google-analytics-four`. The options below are
the values you put in that adapter's `config`.

1. `GoogleAnalytics` — `ember-metrics/metrics-adapters/google-analytics`

   - `id`: [Property ID](https://support.google.com/analytics/answer/1032385?hl=en), e.g. `UA-XXXX-Y`

1. `GoogleAnalyticsFour` — `ember-metrics/metrics-adapters/google-analytics-four`

   - `id`: [Measurement Id](https://support.google.com/analytics/answer/9539598?hl=en), e.g. `G-XXXX`
   - `options`: _optional_ An object passed directly to the configuration tag, e.g.:

   ```js
   options = {
     anonymize_ip: true,
     debug_mode: environment === 'development',
   };
   ```

   By default GA4 automatically tracks page views when the history location
   changes. This means `this.metrics.trackPage()` is ignored by default. If you
   want to track page views manually, set `send_page_view: false` inside the
   options. To avoid double counting, make sure
   [enhanced measurement](https://support.google.com/analytics/answer/9216061)
   is configured correctly — typically disabling _Page changes based on browser
   history events_ under the advanced settings of the page views section.

1. `Mixpanel` — `ember-metrics/metrics-adapters/mixpanel`

   - `token`: [Mixpanel token](https://mixpanel.com/help/questions/articles/where-can-i-find-my-project-token)
   - Optionally other [config options to override](https://developer.mixpanel.com/docs/javascript-full-api-reference#mixpanelinit)

1. `GoogleTagManager` — `ember-metrics/metrics-adapters/google-tag-manager`

   - `id`: [Container ID](https://developers.google.com/tag-manager/quickstart), e.g. `GTM-XXXX`
   - `dataLayer`: An array containing a single POJO of information, e.g.:

   ```js
   dataLayer = [
     {
       pageCategory: 'signup',
       visitorType: 'high-value',
     },
   ];
   ```

   - `envParams`: A string with custom arguments for configuring GTM environments (Live, Dev, etc), e.g.:

   ```js
   envParams: 'gtm_auth=xxxxx&gtm_preview=env-xx&gtm_cookies_win=x';
   ```

1. `Segment` — `ember-metrics/metrics-adapters/segment`

   - `key`: [Segment key](https://segment.com/docs/libraries/analytics.js/quickstart/)
   - `proxyDomain`: _optional_ [Custom domain proxy](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/custom-proxy/)

1. `Piwik` — `ember-metrics/metrics-adapters/piwik`

   - `piwikUrl`: [Tracker URL](http://developer.piwik.org/guides/tracking-javascript-guide)
   - `siteId`: [Site Id](http://developer.piwik.org/guides/tracking-javascript-guide)

1. `Intercom` — `ember-metrics/metrics-adapters/intercom`

   - `appId`: [App ID](https://docs.intercom.com/help-and-faqs/getting-set-up/where-can-i-find-my-app-id)

1. `FacebookPixel` — `ember-metrics/metrics-adapters/facebook-pixel`

   - `id`: [ID](https://www.facebook.com/ads/manager/pixel/facebook_pixel/?act=129849836&pid=p1)
   - `dataProcessingOptions`: _optional_ An object defining the method, country and state for [data processing options](https://developers.facebook.com/docs/marketing-apis/data-processing-options/)

   ```js
   dataProcessingOptions: {
     method: ['LDU'],
     country: 1,
     state: 1000
   }
   ```

1. `Amplitude` — `ember-metrics/metrics-adapters/amplitude`

   - `apiKey`: [API Key](https://developers.amplitude.com/#setting-up-our-sdks)

1. `AzureAppInsights` — `ember-metrics/metrics-adapters/azure-app-insights`

   - `instrumentationKey`: [Instrumentation Key](https://github.com/microsoft/ApplicationInsights-JS#configuration)

1. `Pendo` — `ember-metrics/metrics-adapters/pendo`

   - `apiKey`: [API Key](https://developers.pendo.io/docs/?bash#options)

1. `MatomoTagManager` — `ember-metrics/metrics-adapters/matomo-tag-manager`

   - `matomoUrl`: [Matomo URL](https://developer.matomo.org/guides/tagmanager/embedding)
   - `containerId`: [Container ID](https://developer.matomo.org/guides/tagmanager/embedding), e.g. `acbd1234`

1. `Hotjar` — `ember-metrics/metrics-adapters/hotjar`

   - `siteId`: [SiteID](https://help.hotjar.com/hc/en-us/articles/115009336727-How-to-Install-your-Hotjar-Tracking-Code)

### Community adapters

1. `Adobe Dynamic Tag Management`

   - [ember-metrics-adobe-dtm](https://github.com/kellyselden/ember-metrics-adobe-dtm)

1. `Simple Analytics`

   - [ember-metrics-simple-analytics](https://github.com/mrloop/ember-metrics-simple-analytics)

## Configuration & activation

The `metrics` service doesn't activate anything on its own — you activate
adapters explicitly by passing adapter **classes** (not string names) to
`metrics.activateAdapters(...)`. This keeps the addon compatible with
`ember-strict-application-resolver` and Embroider's static builds: there's no
container lookup by convention, nothing depends on `config:environment` being
registered on the owner, and only the adapters you actually import end up in
your build.

A good place to do this once is your application route — it runs on boot,
before anything renders:

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

    // Needed only if you gate adapters per environment (see `environments` below).
    this.metrics.appEnvironment = ENV.environment;

    this.metrics.activateAdapters([
      {
        name: 'GoogleAnalytics',
        adapter: GoogleAnalytics,
        environments: ['development', 'production'],
        config: {
          id: 'UA-XXXX-Y',
          // Use `analytics_debug.js` in development
          debug: ENV.environment === 'development',
          // Use verbose tracing of GA events
          trace: ENV.environment === 'development',
          // Ensure development env hits aren't sent to GA
          sendHitTask: ENV.environment !== 'development',
          // Specify Google Analytics plugins
          require: ['ecommerce'],
        },
      },
      {
        name: 'Mixpanel',
        adapter: Mixpanel,
        environments: ['production'],
        config: {
          token: '0f76c037-4d76-4fce-8a0f-a9a8f89d1453',
        },
      },
    ]);
  }
}
```

Anywhere that runs once early works — `activateAdapters` is idempotent. The
application route is a good default because it needs no legacy initializer API
and has clean access to the service.

Each entry in the array has the following shape:

```js
/**
 * @param {String}   name          A label you choose, used to target this
 *                                 adapter with `invoke` and the single-adapter
 *                                 form of the convenience methods.
 * @param {Function} adapter       The adapter class itself.
 * @param {String[]} environments  Environments to activate the adapter in.
 *                                 Defaults to `['all']`.
 * @param {Object}   config        Configuration passed to the adapter's
 *                                 constructor (see the options for each
 *                                 service above).
 */
{
  name: 'GoogleAnalytics',
  adapter: GoogleAnalytics,
  environments: ['all'],
  config: {},
}
```

To only activate an adapter in specific environments, list them under
`environments` and set `metrics.appEnvironment` (e.g. to `ENV.environment`)
before calling `activateAdapters`. Valid values are whatever your app uses for
its environment (commonly `development`, `test`, `production`), plus:

- `all` — the default; the adapter is activated in every environment.

`activateAdapters` is idempotent: adapters already active under the same `name`
are not reinstantiated. Each call defines the complete active set; registrations
omitted from a later call are uninstalled. Pass the desired set when calling it
again as more adapters or config become available (see [Activating adapters later](#activating-adapters-later)).

## Content Security Policy

If you're using [ember-cli-content-security-policy](https://github.com/rwjblue/ember-cli-content-security-policy),
you'll need to modify the content security policy to allow loading of any remote
scripts. In `config/environment.js`, add this to the `ENV` hash (modify as
necessary):

```js
// example for loading Google Analytics
contentSecurityPolicy: {
  'default-src': "'none'",
  'script-src': "'self' www.google-analytics.com",
  'font-src': "'self'",
  'connect-src': "'self' www.google-analytics.com",
  'img-src': "'self'",
  'style-src': "'self'",
  'media-src': "'self'"
}
```

## Usage

Inject the service into any object registered in the container that you wish to
track from. For example, you can call `trackPage` across all your analytics
services whenever you transition into a route:

```js
// app/routes/application.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service metrics;
  @service router;

  constructor() {
    super(...arguments);

    this.router.on('routeDidChange', () => {
      const page = this.router.currentURL;
      const title = this.router.currentRouteName || 'unknown';

      this.metrics.trackPage({ page, title });
    });
  }
}
```

To only call a single service, pass its `name` (the label you registered it
with) as the first argument:

```js
// only invokes `trackPage` on the adapter registered as `GoogleAnalytics`
metrics.trackPage('GoogleAnalytics', {
  title: 'My Awesome App',
});
```

### Context

Often you may want to include information like the current user's name with
every event or page view that's tracked. Any properties set on
`metrics.context` are merged into the options for every service call.

```js
this.metrics.context.userName = 'Jimbo';
this.metrics.trackPage({ page: 'page/1' }); // { userName: 'Jimbo', page: 'page/1' }
```

### Service API

There are four main methods, all with the same argument signature. The
optional first argument targets a single adapter by its registered `name`;
omit it to call every activated adapter.

- `trackPage([name], options)`

  Commonly used to track page views. Because of how single-page apps route,
  you'll usually call this yourself (e.g. on `routeDidChange`) to track page
  views.

- `trackEvent([name], options)`

  A general-purpose method for tracking a named event in your application.

- `identify([name], options)`

  For analytics services that support identifying a user.

- `alias([name], options)`

  For services that implement it, notifies the service that an anonymous user
  now has a unique identifier.

If an adapter implements a method beyond the four above, call it with `invoke`.
For example, the Amplitude adapter exposes `optOut`/`optIn`:

- `invoke(method, [name], options)`

  ```js
  // Target a single adapter by passing its name *and* an options object — with
  // only two arguments the second is treated as options, not a name.
  metrics.invoke('optOut', 'Amplitude', {});
  ```

Adapters that don't implement the method are skipped. The `[name]` argument may
also be an array to target several adapters at once, e.g.
`metrics.invoke('trackEvent', ['GoogleAnalytics', 'Mixpanel'], { ... })`.

### Activating adapters later

Because `activateAdapters` is idempotent, you can call it again at any time —
for example once a dynamic API key becomes available from a model:

```js
// app/routes/application.js
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';

export default class ApplicationRoute extends Route {
  @service metrics;

  afterModel(model) {
    this.metrics.activateAdapters([
      {
        name: 'GoogleAnalytics',
        adapter: GoogleAnalytics,
        environments: ['all'],
        config: { id: model.googleAnalyticsKey },
      },
    ]);
  }
}
```

Adapters already active under the same `name` won't be reinstantiated. Each
call defines the complete active set; registrations omitted from a later call
are uninstalled.

## Writing your own adapters

An adapter is a class that extends `BaseAdapter` and implements, at minimum,
`install` and `uninstall`:

```js
// app/metrics-adapters/my-adapter.js
import BaseAdapter from 'ember-metrics/metrics-adapters/base';

export default class MyAdapter extends BaseAdapter {
  // Human-readable name used in assertions.
  toStringExtension() {
    return 'MyAdapter';
  }

  // Called when the adapter is activated. Responsible for injecting the
  // provider's script tag and initializing it. Read config off `this.config`.
  install() {
    const { apiKey } = this.config;
    // ...load and initialize the service using `apiKey`
  }

  // Called when the adapter/service is torn down. Remove the script tag and
  // any globals the service created (usually on `window`).
  uninstall() {
    // ...clean up
  }

  // Optional — implement the ones your service supports.
  identify(options) {}
  trackEvent(options) {}
  trackPage(options) {}
  alias(options) {}
}
```

Then register your class like any bundled adapter:

```js
import MyAdapter from 'my-app/metrics-adapters/my-adapter';

metrics.activateAdapters([
  {
    name: 'MyAdapter',
    adapter: MyAdapter,
    environments: ['all'],
    config: { apiKey: '29fJs90qnfEa' },
  },
]);
```

`ember-metrics` ships TypeScript types. `BaseAdapter`, `AdapterConfig`, and
`AdapterOptions` are exported from `ember-metrics/metrics-adapters/base`, so you
can author adapters in TypeScript with full type-checking. The shape of a
`activateAdapters` entry is exported as `AdapterRegistration` from
`ember-metrics/services/metrics`.

If you build an adapter for a service others might use, consider publishing it
as a [community adapter](#community-adapters) and opening a PR to list it here.

## Contributors

We're grateful to these wonderful people who've contributed to `ember-metrics`:

[//]: contributor-faces

<a href="https://github.com/jherdman"><img src="https://avatars.githubusercontent.com/u/3300?v=4" title="jherdman" width="80" height="80"></a>
<a href="https://github.com/poteto"><img src="https://avatars.githubusercontent.com/u/1390709?v=4" title="poteto" width="80" height="80"></a>
<a href="https://github.com/kellyselden"><img src="https://avatars.githubusercontent.com/u/602423?v=4" title="kellyselden" width="80" height="80"></a>
<a href="https://github.com/chrismllr"><img src="https://avatars.githubusercontent.com/u/9942917?v=4" title="chrismllr" width="80" height="80"></a>
<a href="https://github.com/josemarluedke"><img src="https://avatars.githubusercontent.com/u/230476?v=4" title="josemarluedke" width="80" height="80"></a>
<a href="https://github.com/lfrost"><img src="https://avatars.githubusercontent.com/u/5996000?v=4" title="lfrost" width="80" height="80"></a>
<a href="https://github.com/dcyriller"><img src="https://avatars.githubusercontent.com/u/6677373?v=4" title="dcyriller" width="80" height="80"></a>
<a href="https://github.com/jfdnc"><img src="https://avatars.githubusercontent.com/u/15672873?v=4" title="jfdnc" width="80" height="80"></a>
<a href="https://github.com/mike-north"><img src="https://avatars.githubusercontent.com/u/558005?v=4" title="mike-north" width="80" height="80"></a>
<a href="https://github.com/jelhan"><img src="https://avatars.githubusercontent.com/u/4965703?v=4" title="jelhan" width="80" height="80"></a>
<a href="https://github.com/jwlawrence"><img src="https://avatars.githubusercontent.com/u/488888?v=4" title="jwlawrence" width="80" height="80"></a>
<a href="https://github.com/cah-briangantzler"><img src="https://avatars.githubusercontent.com/u/1529286?v=4" title="cah-briangantzler" width="80" height="80"></a>
<a href="https://github.com/GreatWizard"><img src="https://avatars.githubusercontent.com/u/1322081?v=4" title="GreatWizard" width="80" height="80"></a>
<a href="https://github.com/denneralex"><img src="https://avatars.githubusercontent.com/u/5065602?v=4" title="denneralex" width="80" height="80"></a>
<a href="https://github.com/Turbo87"><img src="https://avatars.githubusercontent.com/u/141300?v=4" title="Turbo87" width="80" height="80"></a>
<a href="https://github.com/CvX"><img src="https://avatars.githubusercontent.com/u/66961?v=4" title="CvX" width="80" height="80"></a>
<a href="https://github.com/Windvis"><img src="https://avatars.githubusercontent.com/u/3533236?v=4" title="Windvis" width="80" height="80"></a>
<a href="https://github.com/sly7-7"><img src="https://avatars.githubusercontent.com/u/1826661?v=4" title="sly7-7" width="80" height="80"></a>
<a href="https://github.com/tyleryasaka"><img src="https://avatars.githubusercontent.com/u/6504519?v=4" title="tyleryasaka" width="80" height="80"></a>
<a href="https://github.com/opsb"><img src="https://avatars.githubusercontent.com/u/46232?v=4" title="opsb" width="80" height="80"></a>
<a href="https://github.com/charlesfries"><img src="https://avatars.githubusercontent.com/u/2275005?v=4" title="charlesfries" width="80" height="80"></a>
<a href="https://github.com/Artmann"><img src="https://avatars.githubusercontent.com/u/91954?v=4" title="Artmann" width="80" height="80"></a>
<a href="https://github.com/colinhoernig"><img src="https://avatars.githubusercontent.com/u/195992?v=4" title="colinhoernig" width="80" height="80"></a>
<a href="https://github.com/gmurphey"><img src="https://avatars.githubusercontent.com/u/373721?v=4" title="gmurphey" width="80" height="80"></a>
<a href="https://github.com/gilest"><img src="https://avatars.githubusercontent.com/u/36919?v=4" title="gilest" width="80" height="80"></a>
<a href="https://github.com/bobisjan"><img src="https://avatars.githubusercontent.com/u/112557?v=4" title="bobisjan" width="80" height="80"></a>
<a href="https://github.com/JoepHeijnen"><img src="https://avatars.githubusercontent.com/u/23332441?v=4" title="JoepHeijnen" width="80" height="80"></a>
<a href="https://github.com/jrjohnson"><img src="https://avatars.githubusercontent.com/u/349624?v=4" title="jrjohnson" width="80" height="80"></a>

[//]: contributor-faces

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
