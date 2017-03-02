'use strict';

/**
 * @ngdoc function
 * @name poluxApp.controller:GeneralPropuestaCtrl
 * @description
 * # GeneralPropuestaCtrl
 * Controller of the poluxApp
 */
angular.module('poluxApp')
  .controller('PropuestaCtrl', function (academicaRequest,poluxRequest) {
    var self=this;
    self.idAreas=[];
    //cuando se trabaje con el servidor cambiar a:  self.docentes=academicaRequest.obtenerDocentes();
    self.docentes=academicaRequest.obtenerDocentesJson();
    self.estudiantes=academicaRequest.getAllEstudiantesJson(); //cambiar a self.estudiantes=academicaRequest.ObtenerEstudiantes();
    poluxRequest.get("area_conocimiento","").then(function(response){
      self.areas=response.data;
    });
  });
