'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.poluxMidService
 * @description
 * # poluxMidService
 * Factory in the poluxClienteApp.
 */
angular.module('poluxMidService',[])
  .factory('poluxMidRequest', function ($http) {
    // Service logic
    // ...
    var path = "http://10.20.0.254/polux_api_mid/v1/";
    // Public API here
    return {
      get: function (tabla,params) {
        return $http.get(path+tabla+"/?"+params);
      },
      post: function (tabla,elemento) {
        return $http.post(path+tabla,elemento);
      },
      put: function (tabla,id,elemento) {
        return $http.put(path+tabla+"/"+id,elemento);
      },
      delete: function (tabla,id) {
        return $http.delete(path+tabla+"/"+id);
      }
    };
  });
