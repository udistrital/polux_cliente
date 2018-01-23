'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.academicaService
 * @description
 * # academicaService
 * Factory in the poluxClienteApp.
 */
angular.module('academicaService', [])
    .factory('academicaRequest', function($http, CONF) {

        var path = "http://10.20.0.127/polux/index.php?data=";
        var estudiantes = "sj7574MlJOsg4LjjeAOJP5CBi1dRh84M-gX_Z-i_0Om74SuwW6IkfDoYa6tncUbxFQOnPY89W5nK1iqlZM0A46MmBGhubLLF7DrHMUwJvi67vmq5o_7ABH2LLvMfV9hM";
        var nueva_ruta = CONF.GENERAL.ACADEMICA_SERVICE;

        return {

            obtener: function(ruta, parametros) {
                return $http.get(path + ruta, { params: parametros })
                    .then(function(response) {
                        return response.data;
                    });
            },

            obtenerEstudiantes: function(parametros) {
                return this.obtener(estudiantes, parametros);
            },

            get: function(service, params) {
                var param_string = "";
                angular.forEach(params, function(parametro) {
                    param_string += "/" + parametro;
                });
                return $http.get(nueva_ruta + "/" + service + param_string, { headers: { 'Accept': 'application/json' }});
            }

        };
    });
