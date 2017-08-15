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

      academicaRequest.periodoAnterior().then(function(periodoAnterior){

        var parametros = {
          "codigo": $scope.codigo,
          //periodo anterior
          'ano' : periodoAnterior[0].APE_ANO,
          'periodo' :periodoAnterior[0].APE_PER
        };

        academicaRequest.promedioEstudiante(parametros).then(function(response2){

          if(response2){
            //porcentaje cursado
            var parametros2 = {
              "codigo": parametros.codigo
            };

            academicaRequest.porcentajeCursado(parametros).then(function(response3){
              console.log(response3);

              ctrl.estudiante={
                "Codigo": parametros.codigo,
                "Nombre": response2[0].NOMBRE,
                "Modalidad": 7,
                "Tipo": "PREGRADO",
                "PorcentajeCursado": response3,
                "Promedio": response2[0].PROMEDIO,
                "Rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
                "Estado": response2[0].EST_ESTADO_EST,
                "Nivel": response2[0].TRA_NIVEL,
                "TipoCarrera": response2[0].TRA_NOMBRE,
                "TipoCarrera": "TECNOLOGIA"

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
