'use strict';

/**
 * @ngdoc service
 * @name poluxApp.documentoService
 * @description
 * # documentoService
 * Factory in the poluxApp.
 */
angular.module('documentoService',[])
  .factory('documentoRequest', function ($http) {
    // Service logic
    // ...

    var path = "http://127.0.0.1:8080/v1/";

    // Public API here
    return {


      getDocumento: function (id) {
        return $http.get(path+"documento/?query=Id%3A"+id);
      },
      postDocumento: function (documento){
        return $http.post(path+"documento",documento);
      }
    };
  });
