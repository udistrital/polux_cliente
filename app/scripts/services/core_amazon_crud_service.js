'use strict';

/**
   * @ngdoc service
   * @name poluxClienteApp.service:coreAmazonCrudService
   * @requires $http
   * @requires CONF
   * @param {injector} $http componente http de angular
   * @param {injector} CONF compenente de configuración
   * @description
   * # coreAmazonCrudService
   * Fabrica sobre la cual se consumen los servicios proveidos por el API del core de amazon sobre los metodos GET
   */
angular.module('poluxClienteApp')
  .service('coreAmazonCrudService', function ($http, CONF,token_service) {
    /**
     * @ngdoc object
     * @name path
     * @propertyOf poluxClienteApp.service:coreAmazonCrudService
     * @description
     * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.service:CONF confService}
     */
    var path = CONF.GENERAL.CORE_AMAZON_CRUD_SERVICE;
    return {
      /**
       * @ngdoc function
       * @name poluxClienteApp.service:coreAmazonCrudService#get
       * @methodOf poluxClienteApp.service:coreAmazonCrudService
       * @param {string} tabla Nombre de la tabla en el API
       * @param {string} params parametros para filtrar la busqueda
       * @return {array|object} objeto u objetos del get
       * @description Metodo GET del servicio
       */
      get: function(tabla, params) {
          var peticion = path + tabla + "?" + params;
          return $http.get(peticion,token_service.getHeader());
      }
    };

  });
