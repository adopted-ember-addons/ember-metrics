import Ember from 'ember';
import config from './config/environment';

const { Router } = Ember;

const EmRouter = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

EmRouter.map(() => {
});

export default Router;
