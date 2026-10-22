import EmberApp from 'ember-strict-application-resolver';
import EmberRouter from '@ember/routing/router';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import { setTesting } from '@embroider/macros';
import setupSinonAssert from 'qunit-sinon-assertions';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

class TestApp extends EmberApp {
  modules = {
    './router': Router,
    // add any custom services here
    // import.meta.glob('./services/*', { eager: true }),
  };
}

Router.map(function () {});

export function isExternalUrl(url: string): boolean {
  return new URL(url, window.location.href).origin !== window.location.origin;
}

function preventExternalRequests(): void {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    if (isExternalUrl(url)) {
      return Promise.resolve(new Response(null, { status: 204 }));
    }
    return nativeFetch(input, init);
  };
}

export function start() {
  preventExternalRequests();
  setTesting(true);
  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing',
    }),
  );
  setup(QUnit.assert);
  setupSinonAssert(QUnit.assert);
  setupEmberOnerrorValidation();
  qunitStart();
}
