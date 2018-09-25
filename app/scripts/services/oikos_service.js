'use strict';

/**
  * @ngdoc overview
  * @name oikosService
  * @description Modulo para servicio de oikos provee los servicios descritos en {@link oikosService.service:oikosRequest oikosRequest}.
  * Actualmente no se utiliza.
  */
angular.module('oikosService', [])
    /**
     * @ngdoc service
     * @name oikosService.service:oikosRequest
     * @requires $http
     * @requires CONF
     * @param {injector} $http componente http de angular
     * @param {injector} CONF compenente de configuración
     * @description
     * # oikosService
     * Fabrica sobre la cual se consumen los servicios proveidos por el API de oikos sobre los metodos GET, POST, PUT y DELETE.
     * Actualmente no se utiliza.
     */
    .factory('oikosRequest', function($http,CONF) {
        /**
         * @ngdoc object
         * @name path
         * @propertyOf oikosService.service:oikosRequest
         * @description
         * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.service:CONF confService}
         */
        var path = CONF.GENERAL.OIKOS_SERVICE;
        return {
            /**
             * @ngdoc function
             * @name oikosService.service:oikosRequest#get
             * @methodOf oikosService.service:oikosRequest
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
             * @name oikosService.service:oikosRequest#post
             * @param {string} tabla Nombre de la tabla en el API
             * @param {object} elemento objeto a ser creado por el API
             * @methodOf oikosService.service:oikosRequest
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
             * @name oikosService.service:oikosRequest#put
             * @param {string} tabla Nombre de la tabla en el API
             * @param {string|int} id del elemento en el API
             * @param {object} elemento objeto a ser actualizado por el API
             * @methodOf oikosService.service:oikosRequest
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo PUT del servicio
             */
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento);
            },
            /**
             * @ngdoc function
             * @name oikosService.service:oikosRequest#delete
             * @methodOf oikosService.service:oikosRequest
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
