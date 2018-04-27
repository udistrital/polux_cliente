'use strict';

/**
 * @ngdoc service
 * @name poluxClienteApp.academicaService
 * @description
 * # academicaService
 * Factory in the poluxClienteApp.
 */
angular.module('academicaService', [])
    /**
     * @ngdoc service
     * @name academicaService.service:academicaRequest
     * @requires $http
     * @param {injector} $http componente http de angular
     * @param {injector} CONF compenente de configuración
     * @description
     * # academicaService
     * Fabrica sobre la cual se consumen los servicios proveidos por el API de academica sobre los metodos GET, POST, PUT y DELETE
     */
    .factory('academicaRequest', function($http, CONF) {
        // Service logic
        var path = CONF.GENERAL.ACADEMICA_SERVICE;
        // Public API here
        return {
            /**
             * @ngdoc function
             * @name academicaService.service:academicaRequest#get
             * @methodOf academicaService.service:academicaRequest
             * @param {string} tabla Nombre de la tabla en el API|Servicio
             * @param {string} params parametros para filtrar la busqueda
             * @return {array|object} objeto u objetos del get
             * @description Metodo GET del servicio
             */
            get: function(service, params) {
                var param_string = "";
                angular.forEach(params, function(parametro) {
                    param_string += "/" + parametro;
                });
                return $http.get(path + "/" + service + param_string, { headers: { 'Accept': 'application/json' }});
            }

        };
    });
