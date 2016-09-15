'use strict';

/**
 * @ngdoc service
 * @name poluxApp.entidadService
 * @description
 * # entidadService
 * Factory in the poluxApp.
 */
angular.module('entidadService',[])
  .factory('entidadRequest', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      getAll: function () {
        var entidades = [{"nit":"131414111242","nombre":"empresa 01","tipo_entidad":{"nombre":"empresa"}},{"nit":"13112412442","nombre":"empresa 02","tipo_entidad":{"nombre":"empresa"}}];
        return entidades;
      }
    };
  });
