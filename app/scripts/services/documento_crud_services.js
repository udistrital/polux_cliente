'use strict';

/**
  * @ngdoc overview
  * @name documentoService
  * @description Modulo para servicio de documento provee los servicios descritos en {@link documentoService.service:documentoRequest documentoRequest}
  */
angular.module('documentoService', [])
    /**
     * @ngdoc service
     * @name documentoService.service:documentoRequest
     * @requires $http
     * @param {injector} $http componente http de angular
     * @description
     * # documentoRequest
     * Fabrica sobre la cual se consumen los servicios proveidos por el API de documentos_crud sobre los metodos GET, POST, PUT y DELETE
     */
    .factory('documentoRequest', function($http, token_service, CONF) {
        /**
         * @ngdoc object
         * @name path
         * @propertyOf documentoService.service:documentoRequest
         * @description
         * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.service:CONF confService}
         */
        var path = CONF.GENERAL.DOCUMENTO_CRUD_SERVICE;
        // Public API here
        return {
            /**
             * @ngdoc function
             * @name documentoService.service:documentoRequest#get
             * @methodOf documentoService.service:documentoRequest
             * @param {string} tabla Nombre de la tabla en el API
             * @param {string} params parametros para filtrar la busqueda
             * @return {array|object} objeto u objetos del get
             * @description Metodo GET del servicio
             */
            get: function(tabla, params) {
                return $http.get(path + tabla + "/?" + params, token_service.getHeader());
            },
            /**
             * @ngdoc function
             * @name documentoService.service:documentoRequest#post
             * @param {string} tabla Nombre de la tabla en el API
             * @param {object} elemento objeto a ser creado por el API
             * @methodOf documentoService.service:documentoRequest
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo POST del servicio
             */
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento, token_service.getHeader());
            },
             /**
             * @ngdoc function
             * @name documentoService.service:documentoRequest#put
             * @param {string} tabla Nombre de la tabla en el API
             * @param {string|int} id del elemento en el API
             * @param {object} elemento objeto a ser actualizado por el API
             * @methodOf documentoService.service:documentoRequest
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo PUT del servicio
             */
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento, token_service.getHeader());
            },
             /**
             * @ngdoc function
             * @name documentoService.service:documentoRequest#delete
             * @methodOf documentoService.service:documentoRequest
             * @param {string} tabla Nombre de la tabla en el API
             * @param {object} elemento objeto a ser eliminado por el API
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo DELETE del servicio
             */
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id, token_service.getHeader());
            }
        };
    }); 