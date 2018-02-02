'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.coreService
 * @description
 * # coreService
 * Service in the poluxClienteApp.
 */
angular.module('poluxClienteApp')
  .service('coreService', function ($http, CONF) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    //var path = "http://10.20.0.254/core_api/v1/";
    var path = CONF.GENERAL.CORE_SERVICE;

    return {
      get: function(tabla, params) {
          var peticion = path + tabla + "?" + params;
          return $http.get(peticion);
      }
    };

  });
