(function() {

// Protects views where angular is not loaded from errors
  if ( typeof angular === 'undefined' ) {
    return;
  }

  angular.module('DevicesModel',[]).factory("Devices",function(ModelCore) {
    return ModelCore.instance({
      $type : "Devices",
      $pkField : "id",
      $settings : {
        urls : {
          base : System.api.url("dev") + "/api/devices"
        }
      },

      customCall : function(url,method,parameters,query) {
        var self = this;

        return self.$call({
          url : self.$url(url,parameters),
          method : method,
          data : self.$toObject()
        }, self, query);
      }
    });
  });

})();
