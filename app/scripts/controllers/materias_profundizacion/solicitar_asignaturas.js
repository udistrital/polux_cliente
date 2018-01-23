'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasProfundizacionSolicitarAsignaturasCtrl
 * @description
 * # MateriasProfundizacionSolicitarAsignaturasCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasProfundizacionSolicitarAsignaturasCtrl', function (poluxMidRequest, academicaRequest, $scope) {
    var ctrl = this;
    $scope.codigo="20112085061";

    $scope.$watch("codigo",function() {

      academicaRequest.get("periodo_academico","P").then(function(periodoAnterior){

        var parametros = {
          "codigo": $scope.codigo,
          //periodo anterior
          'ano' : periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio,
          'periodo' :periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo,
          'sin_rendimiento':1
        };

        academicaRequest.get("datos_estudiante",[$scope.codigo, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio,periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo ]).then(function(response2){
          if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {

              ctrl.estudiante={
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

              console.log(ctrl.estudiante);
              ctrl.modalidad="MATERIAS PROFUNDIZACION";

              poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(response){
                  console.log(response);
                  ctrl.validar= response.data;
              });
            });

          }
        });

      });
    });
  });
