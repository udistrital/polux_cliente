'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:asignarArea
 * @description
 * # asignarArea
 */
angular.module('poluxClienteApp')
  .directive('asignarEstudiantes', function (poluxRequest,academicaRequest,poluxMidRequest) {
    return {
      scope: {
        estudiantes: '=',
        },
      templateUrl: 'views/directives/solicitudes/asignar_estudiantes.html',
      controller:function($scope){
        var ctrl = this;
        ctrl.estudianteRegistrado = false;
        ctrl.estudianteExiste = false;
        ctrl.estudianteValido = false;
        ctrl.estudianteConTrabajo = false;
        ctrl.removable=false;
        ctrl.solicitante = $scope.estudiantes[0];
        ctrl.nuevosEstudiantes = [];

        ctrl.agregarEstudiante = function(){
            ctrl.estudianteRegistrado = false;
            ctrl.estudianteExiste = false;
            ctrl.estudianteValido = false;
            ctrl.estudianteConTrabajo = false;
            if(!ctrl.nuevosEstudiantes.includes(ctrl.codigoEstudiante) && ctrl.solicitante!==ctrl.codigoEstudiante){
                ctrl.verificarEstudiante();
            }else{
              ctrl.estudianteRegistrado = true;
            }
        };

        ctrl.verificarEstudiante = function(){
        academicaRequest.periodoAnterior().then(function(periodoAnterior){

            var parametros = {
              "codigo": ctrl.codigoEstudiante,
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


                  ctrl.estudiante={
                    "Codigo": parametros.codigo,
                    "Nombre": response2[0].NOMBRE,
                    "Modalidad": 1,
                    "Tipo": "POSGRADO",
                    "PorcentajeCursado": response3,
                    "Promedio": response2[0].PROMEDIO,
                    "Rendimiento": "0"+response2[0].REG_RENDIMIENTO_AC,
                    "Estado": response2[0].EST_ESTADO_EST,
                    "Nivel": response2[0].TRA_NIVEL,
                    "TipoCarrera": response2[0].TRA_NOMBRE
                  };


                  poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(response){

                    console.log(response);
                    if(response.data.includes("true")){
                    var parametrosTrabajoEstudiante = $.param({
                        query:"CodigoEstudiante:"+ctrl.codigoEstudiante,
                    });
                    poluxRequest.get("estudiante_trabajo_grado",parametrosTrabajoEstudiante).then(function(responseTrabajoEstudiante){
                          if(responseTrabajoEstudiante.data===null){

                              //verificacion en el ruler API
                              ctrl.nuevosEstudiantes.push(ctrl.codigoEstudiante);
                              $scope.estudiantes = ctrl.nuevosEstudiantes;
                          }else{
                              ctrl.estudianteConTrabajo = true;
                          }
                    });

                  }else{
                        ctrl.estudianteValido = true;
                    }

                  });

                });
              } else {
                ctrl.estudianteExiste = true;
              }
            });
          });

        }

      },
      controllerAs:'d_asignarEstudiante'
    };
  });
