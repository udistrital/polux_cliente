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

        var path = CONF.GENERAL.ACADEMICA_SERVICE;

        return {

            get: function(service, params) {
                var param_string = "";
                angular.forEach(params, function(parametro) {
                    param_string += "/" + parametro;
                });
                return $http.get(path + "/" + service + param_string, { headers: { 'Accept': 'application/json' }});
            }

        };
    });
