# ember-metrics
*Send data to multiple analytics services without re-implementing new API*

This addon adds a simple `metrics` service and customized `LinkComponent` to your app that makes it simple to send data to multiple analytics services without having to implement a new API each time.

Using this addon, you can easily use bundled adapters for various analytics services, and one API to track events, page views, and more. When you decide to add another analytics service to your stack, all you need to do is add it to your configuration, and that's it!

Writing your own adapters for currently unsupported analytics services is easy too. If you'd like to then share it with the world, submit a pull request and we'll add it to the bundled adapters.

## Installing the addon

For Ember CLI >= `0.2.3`:

```shell
ember install ember-metrics
```

For Ember CLI < `0.2.3`:

```shell
ember install:addon ember-metrics
```

## Usage

In order to use the addon, you must first [configure](#configuration) it, then inject it into any Object registered in the container that you wish to track. For example, you can call a `trackPage` event across all your analytics services like so:

```js
import Ember from 'ember';

export default Ember.Route.extend({
  metrics: Ember.inject.service(),
  
  activate() {
    const metrics = get(this, 'metrics');

    metrics.trackPage({
      title: 'My Awesome App'
    });
  }
});
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

## Writing Your Own Adapters

First, generate a new Metrics Adapter:

```sh
$ ember generate metrics-adapter foo-bar
```

This creates `app/metrics-adapters/foo-bar.js`, which you should now customize. Apart from the 4 methods that the service expects, you must implement the `init` hook in order to inject the script tag and initialize the analytics service. 

## Testing

For unit tests, you will need to specify the adapters in use under `needs`, like so:

```js
moduleFor('route:foo', 'Unit | Route | foo', {
  needs: [
    'ember-metrics@metrics-adapter:google-analytics',
    'ember-metrics@metrics-adapter:mixpanel',
    'metrics-adapter:local-dummy-adapter'
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
