import Application from 'dummy/app';
import config from 'dummy/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import * as QUnit from 'qunit';
import setupSinon from 'ember-sinon-qunit';
import setupSinonAssert from 'qunit-sinon-assertions';

setApplication(Application.create(config.APP));

setupSinon();
setupSinonAssert(QUnit.assert);

start();
