'use strict';

/**
 * @ngdoc overview
 * @name autenticacionMidService
 * @description Servicio intermediaro para capturar la información de sesión a partir del correo electrónico
 */
angular.module('autenticacionMidService', [])
  /**
   * @ngdoc service
   * @name autenticacionMidService.service:autenticacionMidRequest
   * @requires CONF
   * @requires $http
   * @param {injector} CONF Enrutador para la configuración del servicio
   * @param {injector} $http Protocolo para peticiones desde angular
   * @description
   * # autenticacionMidRequest
   * Factoría que habilita el consumo de los servicios del intermediario para la autenticación en el cliente
   */
	.factory('autenticacionMidRequest', function(CONF, $http) {
		/**
		 * @ngdoc object
		 * @name path
		 * @propertyOf autenticacionMidService.service:autenticacionMidRequest
		 * @description
		 * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.service:CONF confService}
		 */
		var path = CONF.GENERAL.AUTENTICATION_MID_SERVICE;
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
			get: function(tabla, params,headers) {
				return $http.get(path + tabla + "/?" + params,headers);
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
			post: function(tabla, elemento, headers) {
				return $http.post(path + tabla, elemento,headers);
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
			put: function(tabla, id, elemento,headers) {
				return $http.put(path + tabla + "/" + id, elemento,headers);
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
			delete: function(tabla, id,headers) {
				return $http.delete(path + tabla + "/" + id,headers);
			}
		};
	});