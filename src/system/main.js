(function() {
  'use strict';

  console.log('loaded!');
  angular.module('ifApp', [
    // external dependencies
    'ui.router',
    // if modules
    'ifApp.configs',
    'ifApp.models',
    'ifApp.services',
    'ifApp.controllers'
  ])

    .run(function($rootScope) {
      console.log('running it!')
    });
})();
