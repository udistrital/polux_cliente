'use strict';

/**
 * @ngdoc service
 * @name poluxApp.ejemplo
 * @description
 * # ejemplo
 * Factory in the poluxApp.
 */
angular.module('ejemploService',[])
  .factory('ejemploRequest', function () {
    // Service logic
    // ...

    var ejemplo = "ejemplo de service";

    // Public API here
    return {
      metodoEjemplo: function () {
        return ejemplo;
      }
    };
  });
