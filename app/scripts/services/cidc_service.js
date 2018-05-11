'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.cidcService
 * @description
 * # cidcService
 * Factory in the poluxClienteApp.
 */
angular.module('cidcService', [])
  .factory('cidcRequest', function () {

    return {
      obtenerEntidades:function(){
          return [
            {"Id":"1",
              "Nombre":"Virtus"
            },
            {
              "Id":"2",
              "Nombre":"Python"
            }
          ]
      },
      obtenerDoncentes:function(){
          return [
            {"Id":"1",
              "Nombre":"Elkin Patarroyo"
            },
            {
              "Id":"2",
              "Nombre":"Carlos Gutierrez"
            }
          ]
      }
    };

  });
