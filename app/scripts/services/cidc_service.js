'use strict';

/**
  * @ngdoc overview
  * @name cidcService
  * @description Modulo para servicio de academica provee los servicios descritos en {@link cidcService.service:cidcRequest cidcService}
  */
angular.module('cidcService', [])
    /**
     * @ngdoc service
     * @name cidcService.service:cidcRequest
     * @description
     * # cidcService
     * Fabrica sobre la cual se consumen los servicios proveidos por el API del cidc sobre los metodos GET, POST, PUT y DELETE
     */
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
