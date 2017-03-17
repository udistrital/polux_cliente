'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.poluxService
 * @description
 * # poluxService
 * Factory in the poluxClienteApp.
 */
angular.module('poluxService',[])
  .factory('poluxRequest', function($http) {
    // Service logic
    var path = "http://127.0.0.1:8080/v1/";
    //var path = "http://10.20.0.254/polux/v1/";

    // Public API here
    return {
      get: function(tabla, params) {
          var peticion = path + tabla + "?" + params;
          return $http.get(peticion);
      },
      post: function(tabla, elemento) {
        //se realiza definicion de post con formato header, para resolucion del problema post
        return $http.post(path + tabla, elemento, {
          headers : {
              'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
           }
       });
      },
      put: function(tabla, id, elemento) {
        return $http.put(path + tabla + "/" + id, elemento);
      },
      delete: function(tabla, id) {
        return $http.delete(path + tabla + "/" + id);
      }
    };
  });
