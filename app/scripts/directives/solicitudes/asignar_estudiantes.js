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
        estudiante: '=',
        estudiantes: '=',
        modalidad: '=',
        },
      templateUrl: 'views/directives/solicitudes/asignar_estudiantes.html',
      controller:function($scope){
        var ctrl = this;

        ctrl.estudianteRegistrado = false;
        ctrl.estudianteExiste = false;
        ctrl.estudianteValido = false;
        ctrl.estudianteConTrabajo = false;
        ctrl.cantidadExcedida = false;
        ctrl.estudianteNoEncontrado = false;
        ctrl.estudianteConSolicitud = false;
        ctrl.removable=false;
        ctrl.nuevosEstudiantes = [];

        ctrl.agregarEstudiante = function(){
            ctrl.estudianteRegistrado = false;
            ctrl.estudianteExiste = false;
            ctrl.estudianteValido = false;
            ctrl.estudianteConTrabajo = false;
            ctrl.cantidadExcedida = false;
            ctrl.estudianteNoEncontrado = false;
            ctrl.estudianteConSolicitud = false;

            console.log("estudiante",$scope.estudiante);
            if(!ctrl.nuevosEstudiantes.includes(ctrl.codigoEstudiante) && $scope.estudiante!==""+ctrl.codigoEstudiante){
                ctrl.verificarEstudiante();
            }else{
              ctrl.estudianteRegistrado = true;
            }
        };

        ctrl.verificarEstudiante = function(){
          academicaRequest.get("periodo_academico","P").then(function(periodoAnterior){

              academicaRequest.get("datos_estudiante",[ctrl.codigoEstudiante, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio,periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo ]).then(function(response2){
                if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {

                    ctrl.estudiante={
                      "Codigo": parametros.codigo,
                      "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                      "Modalidad": $scope.modalidad,
                      "Tipo": "POSGRADO",
                      "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].porcentaje,
                      "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                      "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                      "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                      "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                      "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].nombre_tipo_carrera
                    };
                    console.log(ctrl.estudiante);

                    poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(response){

                      console.log(response);
                      if(response.data.includes("true")){
                      var parametrosTrabajoEstudiante = $.param({
                          query:"EstadoEstudianteTrabajoGrado:1,Estudiante:"+ctrl.codigoEstudiante,
                      });
                      poluxRequest.get("estudiante_trabajo_grado",parametrosTrabajoEstudiante).then(function(responseTrabajoEstudiante){
                          if(responseTrabajoEstudiante.data===null){
                            var cantidad;
                            cantidad =  2+ctrl.nuevosEstudiantes.length;
                            ctrl.datosModalidad = {
                              "Modalidad": $scope.modalidad+"",
                              "Cantidad": cantidad+""
                            };
                            console.log("cantidad");
                            console.log(ctrl.datosModalidad);
                            poluxMidRequest.post("verificarRequisitos/CantidadModalidades",ctrl.datosModalidad).then(function(validado){
                                  console.log(validado)
                                  if(validado.data === "true"){
                                    var parametrosEstudiante = $.param({
                                      query:"SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id:2,Usuario:"+ctrl.codigoEstudiante,
                                      sortby:"SolicitudTrabajoGrado",
                                      order:"desc",
                                      limit:1
                                    });
                                    poluxRequest.get("usuario_solicitud",parametrosEstudiante).then(function(responseSolicitud){
                                      if(responseSolicitud.data!==null){
                                        var idSolicitud = responseSolicitud.data[0].SolicitudTrabajoGrado.Id;
                                        var parametrosSolicitudEstudiante = $.param({
                                          query:"Activo:true,EstadoSolicitud.Id:1,SolicitudTrabajoGrado.Id:"+idSolicitud,
                                        });
                                        poluxRequest.get("respuesta_solicitud",parametrosSolicitudEstudiante).then(function(resultadoSolicitudes){
                                          if(resultadoSolicitudes.data===null){
                                            ctrl.nuevosEstudiantes.push(ctrl.codigoEstudiante);
                                            $scope.estudiantes = ctrl.nuevosEstudiantes;
                                          }else{
                                            ctrl.estudianteConSolicitud = true;
                                          }
                                        });
                                      }else{
                                        ctrl.nuevosEstudiantes.push(ctrl.codigoEstudiante);
                                        $scope.estudiantes = ctrl.nuevosEstudiantes;
                                      }
                                    });
                                  }else{
                                    ctrl.cantidadExcedida = true;
                                  }
                            });
                          }else{
                              ctrl.estudianteConTrabajo = true;
                          }
                      });

                    }else{
                          ctrl.estudianteValido = true;
                      }

                    });
              } else {
                ctrl.estudianteNoEncontrado = true;
              }
            });
          });

        }

      },
      controllerAs:'d_asignarEstudiante'
    };
  });
