'use strict';

/**
  * @ngdoc overview
  * @name poluxService
  * @description Modulo para servicio de polux provee los servicios descritos en {@link poluxService.service:poluxRequest poluxRequest}
  */
angular.module('poluxService', [])
    /**
     * @ngdoc service
     * @name poluxService.service:poluxRequest
     * @requires $http
     * @param {injector} $http componente http de angular
     * @description
     * # poluxRequest
     * Fabrica sobre la cual se consumen los servicios proveidos por el API de polux sobre los metodos GET, POST, PUT y DELETE
     */
    .factory('poluxRequest', function($http,CONF) {
        /**
         * @ngdoc object
         * @name path
         * @propertyOf poluxService.service:poluxRequest
         * @description
         * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.service:CONF confService}
         */
        var path = CONF.GENERAL.POLUX_SERVICE;
        return {
            /**
             * @ngdoc function
             * @name poluxService.service:poluxRequest#get
             * @methodOf poluxService.service:poluxRequest
             * @param {string} tabla Nombre de la tabla en el API
             * @param {string} params parametros para filtrar la busqueda
             * @return {array|object} objeto u objetos del get
             * @description Metodo GET del servicio
             */
            get: function(tabla, params) {
                var peticion = path + tabla + "?" + params;
                return $http.get(peticion);
            },
            /**
             * @ngdoc function
             * @name poluxService.service:poluxRequest#post
             * @param {string} tabla Nombre de la tabla en el API
             * @param {object} elemento objeto a ser creado por el API
             * @methodOf poluxService.service:poluxRequest
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo POST del servicio
             */
            post: function(tabla, elemento) {
                //se realiza definicion de post con formato header, para resolucion del problema post
                return $http.post(path + tabla, elemento, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                });
            },
            /**
             * @ngdoc function
             * @name poluxService.service:poluxRequest#put
             * @param {string} tabla Nombre de la tabla en el API
             * @param {string|int} id del elemento en el API
             * @param {object} elemento objeto a ser actualizado por el API
             * @methodOf poluxService.service:poluxRequest
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo PUT del servicio
             */
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento);
            },
            /**
             * @ngdoc function
             * @name poluxService.service:poluxRequest#delete
             * @methodOf poluxService.service:poluxRequest
             * @param {string} tabla Nombre de la tabla en el API
             * @param {object} elemento objeto a ser eliminado por el API
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo DELETE del servicio
             */
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id);
            }
        };
    });
