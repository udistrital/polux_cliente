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
        var entidades = [
          {"nit":"131414111242",
          "nombre":"empresa 01",
          "pais":"colombia",
          "ciudad":"Bogota",
          "tipo_entidad":
          {"nombre":"empresa"},
          "info_contacto":
          [{
          "tipo_contacto":"telefono",
          "contacto":"241241412"
        },
        {
        "tipo_contacto":"direccion",
        "contacto":"sda23dd"
      }]
        },
          {"nit":"13112412442",
          "nombre":"empresa 02",
          "pais":"colombia",
          "ciudad":"Bogota",
          "tipo_entidad":{"nombre":"empresa"},
          "info_contacto":
          [{
          "tipo_contacto":"telefono",
          "contacto":"241241412"
        },
        {
        "tipo_contacto":"direccion",
        "contacto":"sda23dd"
      }]
        }];

        return entidades;
      }
    };
  });
