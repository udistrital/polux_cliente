'use strict';

/**
  * @ngdoc overview
  * @name academicaService
  * @description Modulo para servicio de academica provee los servicios descritos en {@link academicaService.service:academicaRequest academicaRequest}
  */
angular.module('academicaService', [])
    /**
     * @ngdoc service
     * @name academicaService.service:academicaRequest
     * @requires $http
     * @requires CONF
     * @param {injector} $http componente http de angular
     * @param {injector} CONF compenente de configuración
     * @description
     * # academicaService
     * Fabrica sobre la cual se consumen los servicios proveidos por el API de academica sobre los metodos GET, POST, PUT y DELETE
     */
    .factory('academicaRequest', function($http, CONF) {
        /**
         * @ngdoc object
         * @name path
         * @propertyOf academicaService.service:academicaRequest
         * @description
         * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.service:CONF confService}
         */
        var path = CONF.GENERAL.ACADEMICA_SERVICE;
        return {
            /**
             * @ngdoc function
             * @name academicaService.service:academicaRequest#get
             * @methodOf academicaService.service:academicaRequest
             * @param {string} service Nombre de la tabla en el API|Servicio
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
