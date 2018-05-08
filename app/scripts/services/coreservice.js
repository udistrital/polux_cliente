'use strict';

/**
   * @ngdoc service
   * @name poluxClienteApp.service:coreService
   * @requires $http
   * @requires CONF
   * @param {injector} $http componente http de angular
   * @param {injector} CONF compenente de configuración
   * @description
   * # coreService
   * Fabrica sobre la cual se consumen los servicios proveidos por el API del core sobre los metodos GET
   */
angular.module('poluxClienteApp')
  .service('coreService', function ($http, CONF) {
    /**
     * @ngdoc object
     * @name path
     * @propertyOf poluxClienteApp.service:coreService
     * @description
     * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.confService:CONF confService}
     */
    var path = CONF.GENERAL.CORE_SERVICE;
    return {
      /**
       * @ngdoc function
       * @name poluxClienteApp.service:coreService#get
       * @methodOf poluxClienteApp.service:coreService
       * @param {string} tabla Nombre de la tabla en el API
       * @param {string} params parametros para filtrar la busqueda
       * @return {array|object} objeto u objetos del get
       * @description Metodo GET del servicio
       */
      get: function(tabla, params) {
          var peticion = path + tabla + "?" + params;
          return $http.get(peticion);
      }
    };

  });
