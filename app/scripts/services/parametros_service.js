'use strict';

/**
  * @ngdoc overview
  * @name parametrosService
  * @description Modulo para servicio de parametros que provee los servicios descritos en {@link parametrosService.service:parametrosRequest parametrosRequest}
  */
 angular.module('parametrosService', [])
    /**
     * @ngdoc service
     * @name parametrosService.service:parametrosRequest
     * @requires $http
     * @requires CONF
     * @param {injector} $http componente http de angular
     * @param {injector} CONF compenente de configuración
     * @description
     * # parametrosService
     * Fabrica sobre la cual se consumen los servicios proveidos por el API de parametros sobre los metodos GET
     */
    .factory('parametrosRequest', function($http, CONF, token_service){
        /**
         * @ngdoc object
         * @name path
         * @propertyOf parametrosService.service:parametrosRequest
         * @description
         * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.service:CONF confService}
         */
        var path = CONF.GENERAL.PARAMETROS_SERVICE;
        return {
            /**
             * @ngdoc function
             * @name parametrosService.service:parametrosRequest#get
             * @methodOf parametrosService.service:parametrosRequest
             * @param {string} service Nombre de la tabla en el API|Servicio
             * @param {string} params parametros para filtrar la busqueda
             * @return {array|object} objeto u objetos del get
             * @description Metodo GET del servicio
             */
            get: function(service, params){
                return $http.get(path + service + params, token_service.getHeader());
            }
        }
    });