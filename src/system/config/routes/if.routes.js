(function() {
  'use strict';

  angular.module('ifApp.config.routes', [])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
      function($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        // Rule to automatically add trailing slash in the URL
        $urlRouterProvider.rule(function($injector, $location) {
          var path = $location.url();
          if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
            return;
          }
          if (path.indexOf('?') > -1) {
            return path.replace('?', '/?');
          }
          return path + '/';
        });

        $locationProvider.html5Mode(false);

        $stateProvider
        // Home
        .state('home', {
          url: '/',
          controller: 'HomeCtrl'
        })
        // Login screen
        .state('login', {
          url: '/login/',
          templateUrl: 'login.html'
        });
      }
    ]);
})();
