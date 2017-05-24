'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:GeneralPropuestaCtrl
 * @description
 * # GeneralPropuestaCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('PropuestaCtrl', function (academicaRequest,poluxRequest) {
    var self=this;
    self.idAreas=[];
    //cuando se trabaje con el servidor cambiar a:  self.docentes=academicaRequest.obtenerDocentes();
    self.docentes=academicaRequest.obtenerDocentesJson();
    /*self.estudiantes=academicaRequest.getAllEstudiantesJson(); *///cambiar a self.estudiantes=academicaRequest.obtenerEstudiantes();
     var parametros = {
          'carrera' : 20
        };
    academicaRequest.obtenerEstudiantes(parametros).then(function(response){
      self.estudiantes = response;
    });
    poluxRequest.get("area_conocimiento","").then(function(response){
      self.areas=response.data;
    });
  });
