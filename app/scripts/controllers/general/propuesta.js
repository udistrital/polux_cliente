'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:GeneralPropuestaCtrl
 * @description
 * # GeneralPropuestaCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite ver una propuesta de trabajo de grado. Actualmente no se utiliza y no se utilizará ya que esta función la
 * hace el módulo de revisiones.
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:nuxeoClient
 * @requires services/poluxService.service:poluxRequest
 */
angular.module('poluxClienteApp')
    .controller('PropuestaCtrl', function (academicaRequest, poluxRequest, nuxeo) {
        nuxeo.connect()
            .then(function (client) {
                // client.user.id === 'Administrator'
                console.log(client.user);
            })
            .catch(function (error) {
                // wrong credentials / auth method / ...
                throw error;
            });
        var self = this;
        self.idAreas = [];
        //cuando se trabaje con el servidor cambiar a:  self.docentes=academicaRequest.obtenerDocentes();
        // academicaRequest.obtenerDocentes(parametros).then(function(response) {
        //     self.docentes = response;
        // });
        /*self.estudiantes=academicaRequest.getAllEstudiantesJson(); */ //cambiar a self.estudiantes=academicaRequest.obtenerEstudiantes();
        var parametros = {
            'carrera': 20
        };
        academicaRequest.obtenerEstudiantes(parametros).then(function (response) {
            self.estudiantes = response;
        });
        poluxRequest.get("area_conocimiento", "").then(function (response) {
            self.areas = response.data;
        });
    });