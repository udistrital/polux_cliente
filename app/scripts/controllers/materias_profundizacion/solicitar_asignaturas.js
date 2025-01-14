'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasProfundizacionSolicitarAsignaturasCtrl
 * @description
 * # MateriasProfundizacionSolicitarAsignaturasCtrl
 * Controller of the poluxClienteApp
 * Actualmente no está siendo utilizado este controlador, dado que correspondie a la modalidad de materias de profundización
 */
angular.module('poluxClienteApp')
  .controller('MateriasProfundizacionSolicitarAsignaturasCtrl',
    function(poluxMidRequest, academicaRequest, $scope) {
      var ctrl = this;
      $scope.codigo = "20112085061";
      $scope.$watch("codigo", function() {
        academicaRequest.get("periodo_academico", "P").then(function(periodoAnterior) {
          academicaRequest.get("datos_estudiante", [$scope.codigo]).then(function(response2) {
            if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
              ctrl.estudiante = {
                "Codigo": parametros.codigo,
                "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                "Modalidad": 7,
                "Tipo": "PREGRADO",
                "PorcentajeCursado": response3,
                "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].nombre_tipo_carrera
              };
              
              ctrl.modalidad = "MATERIAS PROFUNDIZACION";
              poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(response) {
                
                ctrl.validar = response.data.Data.RequisitosModalidades;
              });
            }
          });
        });
      });
    });