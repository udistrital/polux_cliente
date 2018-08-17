'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:RegistrarTgCtrl
 * @description
 * # GeneralRegistrarNotaCtrl
 * Controller of the poluxClienteApp
 * Actualmente no se utiliza este controlador
 * @requires services/academicaService.service:academicaRequest
 */
angular.module('poluxClienteApp')
	.controller('RegistrarTgCtrl',
		function(academicaRequest) {

			var self = this;

			self.estudiantes = academicaRequest.getAllEstudiantesJson(); //cambiar a self.estudiantes=academicaRequest.ObtenerEstudiantes();

		});