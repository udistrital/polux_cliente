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
              academicaRequest.get("creditos_aprobados", [parametros.codigo]).then(function(response3){
                console.log(response3);
                ctrl.creditos_aprobados=response3.data.notas.nota[0].creditos_aprobados;
                //Créditos del pensum
                academicaRequest.get("creditos_plan", [response2.data.estudiante.estudiante[0].pensum]).then(function(response4) {
                    console.log(response4)
                    ctrl.creditos_plan=response2.data.creditosCollection.creditosPlan[0].creditos;
                    console.log(ctrl.creditos_aprobados+"*100/"+ctrl.creditos_plan);
                    var porcentaje_cursado=ctrl.creditos_aprobados*100/ctrl.creditos_plan;
                    console.log(porcentaje_cursado);

                    console.log(response3);

                    ctrl.estudiante={
                      "Codigo": parametros.codigo,
                      "Nombre": response2.data.estudiante.estudiante[0].nombre,
                      "Modalidad": 2,
                      "Tipo": "POSGRADO",
                      "PorcentajeCursado": porcentaje_cursado,
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

                  });
              });

              academicaRequest.porcentajeCursado(parametros).then(function(response3){
                console.log(response3);

                ctrl.estudiante={
                  "Codigo": parametros.codigo,
                  "Nombre": response2[0].NOMBRE,
                  "Modalidad": 2,
                  "Tipo": "POSGRADO",
                  "PorcentajeCursado": response3,
                  "Promedio": response2[0].PROMEDIO,
                  "Rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
                  "Estado": response2[0].EST_ESTADO_EST,
                  "Nivel": response2[0].TRA_NIVEL,
                  "TipoCarrera": response2[0].TRA_NOMBRE

                };

                console.log(ctrl.estudiante);
                ctrl.modalidad="MATERIAS POSGRADO";

                poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(response){
                    console.log(response);
                    ctrl.validar= response.data;
                });
              });
            }
          }
        });

      });
    });

  });
