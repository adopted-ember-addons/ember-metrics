# ember-metrics
*Send data to multiple analytics services without re-implementing new API*

[![npm version](https://badge.fury.io/js/ember-metrics.svg)](http://badge.fury.io/js/ember-metrics) [![Build Status](https://travis-ci.org/poteto/ember-metrics.svg)](https://travis-ci.org/poteto/ember-metrics) [![Ember Observer Score](http://emberobserver.com/badges/ember-metrics.svg)](http://emberobserver.com/addons/ember-metrics)

This addon adds a simple `metrics` service and customized `LinkComponent` to your app that makes it simple to send data to multiple analytics services without having to implement a new API each time.

Using this addon, you can easily use bundled adapters for various analytics services, and one API to track events, page views, and more. When you decide to add another analytics service to your stack, all you need to do is add it to your configuration, and that's it!

Writing your own adapters for currently unsupported analytics services is easy too. If you'd like to then share it with the world, submit a pull request and we'll add it to the bundled adapters.

## Installing The Addon

For Ember CLI >= `0.2.3`:

```shell
ember install ember-metrics
```

For Ember CLI < `0.2.3`:

```shell
ember install:addon ember-metrics
```

## Usage

In order to use the addon, you must first [configure](#configuration) it, then inject it into any Object registered in the container that you wish to track. For example, you can call a `trackPage` event across all your analytics services whenever you transition into a route, like so:

```js
// app/router.js
import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  metrics: inject.service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    Ember.run.scheduleOnce('afterRender', this, () => {
      const page = document.location.href;
      const title = Ember.getWithDefault(this, 'routeName', 'unknown');

      Ember.get(this, 'metrics').trackPage({ page, title });
    });
  }
});

export default Router.map(/* ... */);
```

If you wish to only call a single service, just specify it's name as the first argument:

```js
// only invokes the `trackPage` method on the `GoogleAnalyticsAdapter`

metrics.trackPage('GoogleAnalytics', {
  title: 'My Awesome App'
});
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

#### `link-to` API

To use the augmented `link-to`, just use the same helper, but add some extra `metrics` attributes:

```hbs
{{#link-to 'index' metricsAdapterName="GoogleAnalytics" metricsCategory="Home Button" metricsAction="click" metricsLabel="Top Nav"}}
  Home
{{/link-to}}
```

This is the equivalent of sending:

```js
ga('send', {
  'hitType': 'event',
  'eventCategory': 'Home Button',
  'eventAction': 'click',
  'eventLabel': 'Top Nav'
});
```

To add an attribute, just prefix it with `metrics` and enter it in camelcase. 

## Configuration

To setup, you should first configure the service through `config/environment`:

```javascript
module.exports = function(environment) {
  var ENV = {
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        config: {
          id: 'UA-XXXX-Y'
        }
      },
      {
        name: 'Mixpanel',
        config: {
          token: '0f76c037-4d76-4fce-8a0f-a9a8f89d1453'
        }
      },
      {
        name: 'LocalAdapter',
        config: {
          foo: 'bar'
        }
      }
    ]
  }
}
```

The `metricsAdapters` option in `ENV` accepts an array of objects containing settings for each analytics service you want to use in your app in the following format:

```js
{
  name: 'Analytics',
  config: {
    anyKey: 'someValue',
    apiKey: 'eb4bb7f1'
  }
}
```

Values in the `config` portion of the object are dependent on the adapter. 

### Lazy Initialization

If your app implements dynamic API keys for various analytics integration, you can defer the initialization of the adapters. Instead of configuring `ember-metrics` through `config/environment`, you can call the following from any Object registered in the container:

```js
import Ember from 'ember';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),
  afterModel(model) {
    const metrics = Ember.get(this, 'metrics');
    const id = Ember.get(model, 'googleAnalyticsKey');

    metrics.activateAdapters([
      {
        name: 'GoogleAnalytics',
        config: {
          id
        }
      }
    ]);
  }
});
```

Because `activateAdapters` is idempotent, you can call it as many times as you'd like. However, it will not reinstantiate existing adapters.

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

## Testing

For unit tests, you will need to specify the adapters in use under `needs`, like so:

```js
moduleFor('route:foo', 'Unit | Route | foo', {
  needs: [
    'ember-metrics@metrics-adapter:google-analytics', // bundled adapter
    'ember-metrics@metrics-adapter:mixpanel', // bundled adapter
    'metrics-adapter:local-dummy-adapter' // local adapter
  ]
});
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
