## v2.0.0-beta.1 (2022-05-12)

### Changes

A significant the Metrics adapter API. We're rewriting these as native classes
in order to move away from the Ember Object model. Historically we've relied
upon the `init` and `willDestroy` hooks to do our cleanup. Moving forward an
`install` and `uninstall` hook will need to be defined. Please see the
[Google Analytics](https://github.com/dhochbaum-dcp/dcp-ember-metrics/blob/4d0f088a302597d3ab7b2e5efd08ce51a78b1d68/addon/metrics-adapters/google-analytics.js)
for an example.

## v1.5.2 (2022-05-17)

### Changes

Introduce deprecation warning for some GA behaviour (https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/444)


## v1.5.1 (2022-05-12)

### Changes

- Revert a broad refactor to native classes that's not backwards compatible https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/372

## v1.5.0 (2022-05-10)

### Changes

- Reexport the built-in MetricsAdapters from the app folder (https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/432)
- Add Matomo Tag Manager adapter (https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/439)
- Segment improvements (https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/436)

### Closing remarks

Many thanks to our contributors:

- @Windvis
- @VincentHardouin
- @GabrielCousin



## v1.4.1 (2021-11-22)

#### Changes

- Fix teardown code (https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/374)

#### Closing remarks

Thank you to @gilest for catching this bug. D'oh!


## v1.4.0 (2021-11-21)

This will be the last release in the v1 series. See below for notes on the
forthcoming v2 release.

### Changes

- Numerous dependency updates
- Modernized tests using qunit-sinon-assertions
- Add deprecations for adapters extending EmberObject
- Deprecate an automatic identify event with Amplitude adapter (see https://github.com/dhochbaum-dcp/dcp-ember-metrics/issues/278)
- Type numerous object transformation tools (https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/343)
- Documentation updated
- Add the Pendo adapter

### Upcoming v2 release

- An upgrade guide will be made available as soon as possible
- This should resolve the embroider-optimized scenario failures

### Closing remarks

A hearty thank you to all contributors. The following people contributed to this release:

* @GreatWizard
* @jfdnc
* @Windvis


## v1.3.1 (2021-09-26)

* Resolves duplicate GTM script injection (#291, #292)


## v1.3.0 (2021-09-14)

## Features

N/A

## Fix

N/A

## Changed

- Add support for additional Mixpanel config options
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/244

# v1.0.0

## Features

N/A

## Fix

N/A

## Changed

- Add Azure App Insights identify method
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/271

# v0.17.0

One more!

## Features

- Add Azure App Insights Adapter
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/262
- Allow for multiple GA Properties
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/269

## Fix

- Blueprints generate ES6 class adapter
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/262

## Changed

- Update Ember to 3.21
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/261

# v0.16.0

This aims to be the lacks version before 1.0.0.

## Features

- Add Amplitude adapter
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/235

## Fix

- Removed export of `canUseDom`
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/255

## Changed

- Refactor to native classes
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/253
- Update Mix Panel
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/224

# v0.15.0

## Features

- Allow configuring data processing options with Facebook Pixel
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/246

## Fix

- Ensure `ga.create` is called with valid config
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/174
- Resolve some `npm audit` sadness
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/230

## Changed

- Update Ember, and friends
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/242
- Remove `getWithDefault`
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/243
- Update Segment's loading snippet
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/240
- Add faces of the contributors
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/236
- Native class examples
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/234
- Replace `canUseDom` with `Adapter.supportsFastboot`
  https://github.com/dhochbaum-dcp/dcp-ember-metrics/pull/175
