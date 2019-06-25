'use strict';

/**
  * @ngdoc overview
  * @name poluxMidService
  * @description Modulo para servicio del mid de polux provee los servicios descritos en {@link poluxMidService.service:poluxMidRequest poluxMidRequest}
  */
angular.module('poluxMidService',[])
  /**
   * @ngdoc service
   * @name poluxMidService.service:poluxMidRequest
   * @requires $http
   * @param {injector} $http componente http de angular
   * @description
   * # poluxRequest
   * Fabrica sobre la cual se consumen los servicios proveidos por el API de polux sobre los metodos GET, POST, PUT y DELETE
   */
  .factory('poluxMidRequest', function ($http, CONF,token_service) {
    /**
     * @ngdoc object
     * @name path
     * @propertyOf poluxMidService.service:poluxMidRequest
     * @description
     * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.service:CONF confService}
     */
    var path = CONF.GENERAL.POLUX_MID_SERVICE;
    return {
      /**
       * @ngdoc function
       * @name poluxMidService.service:poluxMidRequest#get
       * @methodOf poluxMidService.service:poluxMidRequest
       * @param {string} tabla Nombre de la tabla en el API
       * @param {string} params parametros para filtrar la busqueda
       * @return {array|object} objeto u objetos del get
       * @description Metodo GET del servicio
       */
      get: function (tabla,params) {
        return $http.get(path+tabla+"?"+params,token_service.getHeader());
      },
      /**
       * @ngdoc function
       * @name poluxMidService.service:poluxMidRequest#post
       * @param {string} tabla Nombre de la tabla en el API
       * @param {object} elemento objeto a ser creado por el API
       * @methodOf poluxMidService.service:poluxMidRequest
       * @return {array|string} mensajes del evento en el servicio
       * @description Metodo POST del servicio
       */
      post: function (tabla,elemento) {
        return $http.post(path+tabla,elemento,token_service.getHeader());
      },
      /**
       * @ngdoc function
       * @name poluxMidService.service:poluxMidRequest#put
       * @param {string} tabla Nombre de la tabla en el API
       * @param {string|int} id del elemento en el API
       * @param {object} elemento objeto a ser actualizado por el API
       * @methodOf poluxMidService.service:poluxMidRequest
       * @return {array|string} mensajes del evento en el servicio
       * @description Metodo PUT del servicio
       */
      put: function (tabla,id,elemento) {
        return $http.put(path+tabla+"/"+id,elemento,token_service.getHeader());
      },
      /**
       * @ngdoc function
       * @name poluxMidService.service:poluxMidRequest#delete
       * @methodOf poluxMidService.service:poluxMidRequest
       * @param {string} tabla Nombre de la tabla en el API
       * @param {object} elemento objeto a ser eliminado por el API
       * @return {array|string} mensajes del evento en el servicio
       * @description Metodo DELETE del servicio
       */
      delete: function (tabla,id) {
        return $http.delete(path+tabla+"/"+id,token_service.getHeader());
      }
    };
  });
