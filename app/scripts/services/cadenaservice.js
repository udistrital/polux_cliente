'use strict';

/**
 * @ngdoc service
 * @name poluxApp.cadenaService
 * @description
 * # cadenaService
 * Service in the poluxApp.
 */
angular.module('cadenaService',[])
  .factory('cadenaRequest', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var servicio = {
      cambiarTipoTitulo: function (str){
        if (str) {
          return str.toProperCase();
        }
        else {
          return ;
        }
      }
  };
  return servicio;



  });
