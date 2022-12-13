# ember-metrics

_Send data to multiple analytics services without re-implementing new API_

![Download count all time](https://img.shields.io/npm/dt/ember-metrics.svg) [![npm version](https://badge.fury.io/js/ember-metrics.svg)](http://badge.fury.io/js/ember-metrics) ![Build Status](https://github.com/adopted-ember-addons/ember-metrics/workflows/Test/badge.svg?branch=master) [![Ember Observer Score](http://emberobserver.com/badges/ember-metrics.svg)](http://emberobserver.com/addons/ember-metrics)

This addon adds a simple `metrics` service to your app that makes it simple to send data to multiple analytics services without having to implement a new API each time.

Using this addon, you can easily use bundled adapters for various analytics services, and one API to track events, page views, and more. When you decide to add another analytics service to your stack, all you need to do is add it to your configuration, and that's it!

Writing your own adapters for currently unsupported analytics services is easy too. If you'd like to then share it with the world, submit a pull request and we'll add it to the bundled adapters.

#### Currently supported services and options

1. `GoogleAnalytics`

   - `id`: [Property ID](https://support.google.com/analytics/answer/1032385?hl=en), e.g. `UA-XXXX-Y`

1. `GoogleAnalyticsFour`

   - `id`: [Measurement Id](https://support.google.com/analytics/answer/9539598?hl=en), e.g. `G-XXXX`
   - `options`: _optional_ An object which will be directly passed to the configuration tag, e.g.:

   ```js
   options = {
     anonymize_ip: true,
     debug_mode: environment === 'development',
   };
   ```

   By default GA4 automatically tracks page views when the history locations changes. This means that `this.metrics.trackPage()` is ignoreded by default. However, if you want to track the page views manually, you need to set `send_page_view: false` inside the options. To avoid double counting page views make sure [enhanced measurement](https://support.google.com/analytics/answer/9216061) is configured correctly. Typically, this means disabling _Page changes based on browser history events_ under the advanced settings of the page views section.

1. `Mixpanel`

   - `token`: [Mixpanel token](https://mixpanel.com/help/questions/articles/where-can-i-find-my-project-token)
   - Optionally other [config options to override](https://developer.mixpanel.com/docs/javascript-full-api-reference#mixpanelinit)

1. `GoogleTagManager`

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

1. `Segment`

   - `key`: [Segment key](https://segment.com/docs/libraries/analytics.js/quickstart/)
   - `proxyDomain`: _optional_ [Custom domain proxy](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/custom-proxy/)

1. `Piwik`

   - `piwikUrl`: [Tracker URL](http://developer.piwik.org/guides/tracking-javascript-guide)
   - `siteId`: [Site Id](http://developer.piwik.org/guides/tracking-javascript-guide)

1. `Intercom`

   - `appId`: [App ID](https://docs.intercom.com/help-and-faqs/getting-set-up/where-can-i-find-my-app-id)

1. `Facebook Pixel`

   - `id`: [ID](https://www.facebook.com/ads/manager/pixel/facebook_pixel/?act=129849836&pid=p1)
   - dataProcessingOptions: _optional_ An object defining the method, country and state for [data processing options](https://developers.facebook.com/docs/marketing-apis/data-processing-options/)

   ```js
   dataProcessingOptions: {
     method: ['LDU'],
     country: 1,
     state: 1000
   }
   ```

1. `Amplitude`

   - `apiKey`: [API Key](https://developers.amplitude.com/#setting-up-our-sdks)

1. `Azure App Insights`

   - `instrumentationKey`: [Instrumentation Key](https://github.com/microsoft/ApplicationInsights-JS#configuration)

1. `Pendo`

   - `apiKey`: [API Key](https://developers.pendo.io/docs/?bash#options)

1. `MatomoTagManager`

   - `matomoUrl`: [Matomo URL](https://developer.matomo.org/guides/tagmanager/embedding)
   - `containerId`: [Container ID](https://developer.matomo.org/guides/tagmanager/embedding), e.g. `acbd1234`

1. `Hotjar`

   - `siteId`: [SiteID](https://help.hotjar.com/hc/en-us/articles/115009336727-How-to-Install-your-Hotjar-Tracking-Code)

#### Community adapters

1. `Adobe Dynamic Tag Management`

   - [ember-metrics-adobe-dtm](https://github.com/kellyselden/ember-metrics-adobe-dtm)

## Installing The Addon

```shell
ember install ember-metrics
```

## Compatibility

- Ember.js v3.20 or above
- Ember CLI v3.20 or above
- Node.js v12 or above

## Configuration

To setup, you should first configure the service through `config/environment`:

```javascript
module.exports = function (environment) {
  var ENV = {
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: 'UA-XXXX-Y',
          // Use `analytics_debug.js` in development
          debug: environment === 'development',
          // Use verbose tracing of GA events
          trace: environment === 'development',
          // Ensure development env hits aren't sent to GA
          sendHitTask: environment !== 'development',
          // Specify Google Analytics plugins
          require: ['ecommerce'],
        },
      },
      {
        name: 'GoogleAnalyticsFour',
        environments: ['production'],
        config: {
          id: 'G-XXXX',
          options: {
            anonymize_ip: true,
            debug_mode: environment === 'development',
          },
        },
      },
      {
        name: 'Mixpanel',
        environments: ['production'],
        config: {
          token: '0f76c037-4d76-4fce-8a0f-a9a8f89d1453',
        },
      },
      {
        name: 'Segment',
        environments: ['production'],
        config: {
          key: '4fce-8a0f-a9a8f89d1453',
        },
      },
      {
        name: 'Piwik',
        environments: ['production'],
        config: {
          piwikUrl: 'http://piwik.my.com',
          siteId: 42,
        },
      },
      {
        name: 'Intercom',
        environments: ['production'],
        config: {
          appId: 'def1abc2',
        },
      },
      {
        name: 'FacebookPixel',
        environments: ['production'],
        config: {
          id: '1234567890',
          dataProcessingOptions: {
            method: ['LDU'],
            country: 1,
            state: 1000,
          },
        },
      },
      {
        name: 'Amplitude',
        environments: ['production'],
        config: {
          apiKey: '12345672daf5f3515f30f0000f1f0000cdfe433888',
          options: {
            trackingOptions: {
              ip_address: false,
            },
            // ...other amplitude configuration options
            // https://developers.amplitude.com/#sdk-advanced-settings
          },
        },
      },
      {
        name: 'AzureAppInsights',
        environments: ['production'],
        config: {
          instrumentationKey: '123',
          // ...other appInsights configuration options
          // https://github.com/microsoft/ApplicationInsights-JS#configuration
        },
      },
      {
        name: 'Pendo',
        environments: ['production'],
        config: {
          apiKey: '123456789',
        },
      },
      {
        name: 'LocalAdapter',
        environments: ['all'], // default
        config: {
          foo: 'bar',
        },
      },
      {
        name: 'MatomoTagManager',
        environments: ['production'],
        config: {
          matomoUrl: 'matomo.my.com',
          containerId: 'acd123',
        },
      },
      {
        name: 'Hotjar',
        environments: ['production'],
        config: {
          siteId: '123456789',
        },
      },
    ],
  };
};
```

Adapter names are PascalCased. Refer to the [list of supported adapters](#currently-supported-services-and-options) above for more information.

The `metricsAdapters` option in `ENV` accepts an array of objects containing settings for each analytics service you want to use in your app in the following format:

```js
/**
 * @param {String} name Adapter name
 * @param {Array} environments Environments that the adapter should be activated in
 * @param {Object} config Configuration options for the service
 */
{
  name: 'Analytics',
  environments: ['all'],
  config: {}
}
```

Values in the `config` portion of the object are dependent on the adapter. If you're writing your own adapter, you will be able to retrieve the options passed into it:

```js
// Example adapter
export default class ExampleAdapter extends BaseAdapter {
  init() {
    const { apiKey, options } = this.config;
    this.setupService(apiKey);
    this.setOptions(options);
  }
}
```

To only activate adapters in specific environments, you can add an array of environment names to the config, as the `environments` key. Valid environments are:

- `development`
- `test`
- `production`
- `all` (default, will be activated in all environments)

## Content Security Policy

If you're using [ember-cli-content-security-policy](https://github.com/rwjblue/ember-cli-content-security-policy), you'll need to modify the content security policy to allow loading of any remote scripts. In `config/environment.js`, add this to the `ENV` hash (modify as necessary):

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

In order to use the addon, you must first [configure](#configuration) it, then inject it into any Object registered in the container that you wish to track. For example, you can call a `trackPage` event across all your analytics services whenever you transition into a route, like so:

```js
// app/routes/application.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

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

If you wish to only call a single service, just specify it's name as the first argument:

```js
// only invokes the `trackPage` method on the `GoogleAnalyticsAdapter`
metrics.trackPage('GoogleAnalytics', {
  title: 'My Awesome App',
});
```

#### Context

Often, you may want to include information like the current user's name with every event or page view that's tracked. Any properties that are set on `metrics.context` will be merged into options for every Service call.

```js
this.metrics.context.userName = 'Jimbo';
this.metrics.trackPage({ page: 'page/1' }); // { userName: 'Jimbo', page: 'page/1' }
```

### API

#### Service API

There are 4 main methods implemented by the service, with the same argument signature:

- `trackPage([analyticsName], options)`

  This is commonly used by analytics services to track page views. Due to the way Single Page Applications implement routing, you will need to call this on the `activate` hook of each route to track all page views.

- `trackEvent([analyticsName], options)`

  This is a general purpose method for tracking a named event in your application.

- `identify([analyticsName], options)`

  For analytics services that have identification functionality.

- `alias([analyticsName], options)`

  For services that implement it, this method notifies the analytics service that an anonymous user now has a unique identifier.

If an adapter implements specific methods you wish to call, then you can use `invoke`

- `invoke(method, [analyticsName], options)`

  ```js
  metrics.invoke('trackLink', 'Piwik', {
    url: 'my_favorite_link',
    linkType: 'download',
  });
  ```

### Lazy Initialization

If your app implements dynamic API keys for various analytics integration, you can defer the initialization of the adapters. Instead of configuring `ember-metrics` through `config/environment`, you can call the following from any Object registered in the container:

```js
// app/routes/application.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service metrics;

  afterModel(model) {
    const id = model.googleAnalyticsKey;

    this.metrics.activateAdapters([
      {
        name: 'GoogleAnalytics',
        environments: ['all'],
        config: {
          id,
        },
      },
    ]);
  }
}
```

Because `activateAdapters` is idempotent, you can call it as many times as you'd like. However, it will not reinstantiate existing adapters.

Since ember-metrics now automatically removes all unused adapters, it's also important to force the inclusion of the adapter via `config/environment`. NOTE: If the adapter is already defined in the `metricsAdapters` array of `config/environment` then this step is not necessary.

```js
// config/environment
module.exports = function(environment) {
  var ENV = {
    'ember-metrics': {
      includeAdapters: ['google-analytics']
    }
  };

  return ENV;
```

## Writing Your Own Adapters

First, generate a new Metrics Adapter:

```sh
$ ember generate metrics-adapter foo-bar
```

This creates `app/metrics-adapters/foo-bar.js` and a unit test at `tests/unit/metrics-adapters/foo-bar-test.js`, which you should now customize.

### Required Methods

The standard contracts are optionally defined, but `init` and `willDestroy` must be implemented by your adapter.

#### init

This method is called when an adapter is activated by the service. It is responsible for adding the required script tag used by the integration, and for initializing it.

#### willDestroy

When the adapter is destroyed, it should remove its script tag and property. This is usually defined on the `window`.

### Usage

Once you have implemented your adapter, you can add it to your [app's config](#configuration), like so:

```js
module.exports = function (environment) {
  var ENV = {
    metricsAdapters: [
      {
        name: 'MyAdapter',
        environments: ['all'],
        config: {
          secret: '29fJs90qnfEa',
          options: {
            foo: 'bar',
          },
        },
      },
    ],
  };
};
```

## Contributors

We're grateful to these wonderful contributors who've contributed to `ember-metrics`:

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
