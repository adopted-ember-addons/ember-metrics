/* eslint-env node */
module.exports = {
  scenarios: [
    {
      name: 'ember-1.13',
      bower: {
        dependencies: {
          'ember': '~1.13.0'
        },
        resolutions: {
          'ember': '~1.13.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-2.0',
      bower: {
        dependencies: {
          'ember': '~2.0.0'
        },
        resolutions: {
          'ember': '~2.0.0'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-lts',
      bower: {
        dependencies: {
          "ember": "~2.4.0"
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-latest',
      bower: {
        dependencies: {
          "ember": "release"
        },
        resolutions: {
          "ember": "release"
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          "ember": "beta"
        },
        resolutions: {
          "ember": "beta"
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    },
    {
      name: 'ember-canary',
      bower: {
        dependencies: {
          "ember": "canary"
        },
        resolutions: {
          "ember": "canary"
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    }
  ]
};
