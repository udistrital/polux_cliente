'use strict';

/**
   * @ngdoc service
   * @name poluxClienteApp.service:sesionesService
   * @requires $http
   * @param {injector} $http componente http de angular
   * @description
   * # poluxRequest
   * Fabrica sobre la cual se consumen los servicios proveidos por el API de polux sobre los metodos GET, POST, PUT y DELETE
   */
 angular.module('poluxClienteApp')
 .factory('sesionesRequest', function ($http, CONF,token_service) {
    /**
     * @ngdoc object
     * @name path
     * @propertyOf poluxClienteApp.service:sesionesService
     * @description
     * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.service:CONF confService}
     */
    var path = CONF.GENERAL.SESIONES_SERVICE;
    return {
      /**
             * @ngdoc function
             * @name poluxClienteApp.service:sesionesService#get
             * @methodOf poluxClienteApp.service:sesionesService
             * @param {string} tabla Nombre de la tabla en el API
             * @param {string} params parametros para filtrar la busqueda
             * @return {array|object} objeto u objetos del get
             * @description Metodo GET del servicio
             */
            get: function(tabla, params) {
              var peticion = path + tabla + "?" + params;
              return $http.get(peticion,token_service.getHeader());
          },
          /**
           * @ngdoc function
           * @name poluxClienteApp.service:sesionesService#post
           * @param {string} tabla Nombre de la tabla en el API
           * @param {object} elemento objeto a ser creado por el API
           * @methodOf poluxClienteApp.service:sesionesService
           * @return {array|string} mensajes del evento en el servicio
           * @description Metodo POST del servicio
           */
          post: function(tabla, elemento) {
              //se realiza definicion de post con formato header, para resolucion del problema post
              return $http.post(path + tabla, elemento, token_service.getHeader());
                /*{
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                  }
              });*/
          },
          /**
           * @ngdoc function
           * @name poluxClienteApp.service:sesionesService#put
           * @param {string} tabla Nombre de la tabla en el API
           * @param {string|int} id del elemento en el API
           * @param {object} elemento objeto a ser actualizado por el API
           * @methodOf poluxClienteApp.service:sesionesService
           * @return {array|string} mensajes del evento en el servicio
           * @description Metodo PUT del servicio
           */
          put: function(tabla, id, elemento) {
              return $http.put(path + tabla + "/" + id, elemento,token_service.getHeader());
          },
          /**
           * @ngdoc function
           * @name poluxClienteApp.service:sesionesService#delete
           * @methodOf poluxClienteApp.service:sesionesService
           * @param {string} tabla Nombre de la tabla en el API
           * @param {object} elemento objeto a ser eliminado por el API
           * @return {array|string} mensajes del evento en el servicio
           * @description Metodo DELETE del servicio
           */
          delete: function(tabla, id) {
              return $http.delete(path + tabla + "/" + id,token_service.getHeader());
          }
    };
  });
