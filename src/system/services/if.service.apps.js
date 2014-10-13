(function() {
  'use strict';
  angular.module('ifApp.service.apps', [])
  .factory('AppsService', AppsService);

  AppsService.$inject = ['AppsModel'];

  function AppsService(AppsModel) {
    var self = self || new AppsModel();
    return {
      model: self,
      getDetails: function(id) {
        return id;
      },
      getInstalled: function() {}
    };
  }
})();