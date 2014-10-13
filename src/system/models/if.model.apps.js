(function() {
  'use strict';
  angular.module('ifApp.model.apps', ['ModelCore'])
  .factory('AppsModel', AppsModel);

  AppsModel.$inject = ['ModelCore', 'cbParametersService'];

  function AppsModel(ModelCore, cbParametersService) {
    return ModelCore.instance({
      $type: 'Apps',
      $pkField: 'idApp',
      $settings: {
        urls: {
          base: cbParametersService.api.default + 'apps/:command',
//          model.$get("");

          post: cbParametersService.api.default + 'apps/subscribe/:appMasterUUID'
//          model.$post("{appMasterUUID}");

//          get: cbParametersService.api.default + 'apps/list',
//          model.$get("list");

//          info: cbParametersService.api.default + 'apps/:appUUID'
//          model.$get("{appUUID}");
        }
      }
    });
  }
})();