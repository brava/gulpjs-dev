(function() {
  'use strict';
  angular.module('ifApp.controller.home', [])
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope'];

  function HomeCtrl($scope) {
    console.log('HomeCtrl');
  }
})();