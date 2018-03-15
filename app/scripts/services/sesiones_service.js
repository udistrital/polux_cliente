'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.sesionesService
 * @description
 * # sesionesService
 * Factory in the poluxClienteApp.
 */
 angular.module('poluxClienteApp')
 .factory('sesionesRequest', function ($http, CONF) {
  var path = CONF.GENERAL.SESIONES_SERVICE;
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
