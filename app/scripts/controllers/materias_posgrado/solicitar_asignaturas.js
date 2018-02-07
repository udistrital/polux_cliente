'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoSolicitarAsignaturasCtrl
 * @description
 * # MateriasPosgradoSolicitarAsignaturasCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoSolicitarAsignaturasCtrl', function (poluxMidRequest, academicaRequest, $scope) {
    var ctrl = this;
    $scope.codigo="20092020008";

    $scope.$watch("codigo",function() {

      academicaRequest.get("periodo_academico","P").then(function(periodoAnterior){

      academicaRequest.get("datos_estudiante",[$scope.codigo, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio,periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo ]).then(function(response2){
        if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
            if(response2){


                    ctrl.estudiante={
                      "Codigo": $scope.codigo,
                      "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                      "Modalidad": 2,
                      "Tipo": "POSGRADO",
                      "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].creditosCollection.datosCreditos[0].porcentaje.porcentaje_cursado[0].porcentaje_cursado,
                      "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                      "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                      "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                      "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                      "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].tipo_carrera,

                    };

                    console.log(ctrl.estudiante);
                    ctrl.modalidad="MATERIAS POSGRADO";

                    poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(response){
                        console.log(response);
                        ctrl.validar= response.data;
                    });
            }
          }
        });

      });
    });

  });
