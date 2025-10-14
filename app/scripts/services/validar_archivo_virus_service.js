'use strict';

/**
 * @ngdoc overview
 * @name validarArchivoVirusService
 * @description Servicio para validar archivos en busca de virus
 */
angular.module('validarArchivoVirusService', [])
    /**
     * @ngdoc service
     * @name validarArchivoVirusService.service:validarArchivoVirusRequest
     * @requires $http
     * @param {injector} $http Protocolo para peticiones desde angular
     * @description
     * # validarArchivoVirusRequest
     * Factoría que habilita el consumo del servicio para la validación de archivos en busca de virus
    */
	.factory('validarArchivoVirusRequest', function(CONF, $http) {
        /**
		 * @ngdoc object
		 * @name path
		 * @propertyOf validarArchivoVirusService.service:validarArchivoVirusRequest
		 * @description
		 * Dirección del servicio consumen los servicios proveidos por {@link poluxClienteApp.service:CONF confService}
		 */
		var path = CONF.GENERAL.POLUX_MID_SERVICE;
		var header = {
			headers: {
			  'Accept': 'application/json',
              'Content-Type': 'application/json',
			  "Authorization": "Bearer " + window.localStorage.getItem('access_token'),
			}
		};
        
		/**
		* @ngdoc function
		* @name validarArchivoVirusService.service:validarArchivoVirusRequest#post
		* @param {string} endPoint Nombre del endPoint en el API
		* @param {object} data Objeto con el PDF en base64
		* @return {Promise<object>} Resultado con { limpio: boolean, mensaje: string }
		* @description Envía el archivo al servicio antivirus y analiza la respuesta
		*/
		return {
			post: async function (endPoint, data) {
			try {
				const response = await $http.post(path + endPoint, data, header);

				if (response.status === 200 && response.data && response.data.Success === true) {
					const msg = response.data.Message || '';
					const limpio = msg.includes('limpio') || msg.includes('clean');
					return { limpio, mensaje: msg };
				} else {
					const msg = response.data?.Message || 'Error desconocido';
					return { limpio: false, mensaje: msg };
				}
			} catch (error) {
				return { limpio: false, mensaje: "Error en la verificación" };
			}
			}
		};

    });