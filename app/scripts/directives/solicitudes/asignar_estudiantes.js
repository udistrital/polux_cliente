'use strict';

/**
 * @ngdoc directive
 * @name poluxClienteApp.directive:asignarEstudiante
 * @description
 * # asignarEstudiante
 * Directiva que permite agregar a un estudiante a una solicitud inicial de trabajo de grado
 * Controller: {@link poluxClienteApp.directive:asignarEstudiante.controller:asignarEstudianteCtrl asignarEstudianteCtrl}
 * @param {object} estudiante Estudiante que realiza la solicitud
 * @param {object} estudiantes Listado de estudiantes asociados a la solicitud
 * @param {number} modalidad Identificador de la modalidad a la que pertenece la solicitud
 */
angular.module('poluxClienteApp')
  .directive('asignarEstudiantes', function ($translate, poluxRequest, academicaRequest, poluxMidRequest) {
    return {
      scope: {
        estudiante: '=',
        estudiantes: '=',
        modalidad: '=',
      },
      templateUrl: 'views/directives/solicitudes/asignar_estudiantes.html',
      /**
       * @ngdoc controller
       * @name poluxClienteApp.directive:asignarEstudiante.controller:asignarEstudianteCtrl
       * @description
       * # poluxClienteApp.directive:asignarEstudiante.controller:asignarEstudianteCtrl
       * Controller of the poluxClienteApp.directive:asignarEstudiante
       * Controlador de la directiva {@link poluxClienteApp.directive:asignarEstudiante asignarEstudiante} que permite agregar estudiantes a la solicitud inical de una modalidad de trabajo de grado
       * @requires decorators/poluxClienteApp.decorator:TextTranslate
       * @requires services/poluxService.service:poluxRequest
       * @requires services/academicaService.service:academicaRequest
       * @requires services/poluxMidService.service:poluxMidRequest
       * @requires $scope
       * @property {object} estudiante Datos del estudiante que se va a almacenar.
       * @property {boolean} estudianteRegistrado Booleano que permite identificar si un estudiante esta registrado o no.
       * @property {boolean} estudianteExiste Booleano que permite identificar si el estudiante existe o no.
       * @property {boolean} estudianteValido Booleano que permite identificar si el estudiante es valido para ser solicitado o no.
       * @property {boolean} estudianteConTrabajo Booleano que permite identificar si el estudiante tiene un trabajo de grado o no.
       * @property {boolean} cantidadExcedida Booleano que permite identificar si se excede la cantidad de estudiantes que se pueden agregar.
       * @property {boolean} estudianteNoEncontrado Booleano que permite identificar si el estudiante es encontrado o no.
       * @property {boolean} estudianteConSolicitud Booleano que permite identificar si el estudiante solicitado tiene una solicitud pendiente o no.
       * @property {boolean} loading Booleano que permite identificar si se esta cargando o no.
       * @property {boolean} error Booleano que permite identificar si ocurrio un error ejecutando el proceso.
       * @property {array} nuevosEstudiantes Estudiantes que se agregarán al trabajo de grado.
       * @property {object} datosModalidad Datos de la modalidad a la que se trata de agregar el estudiante.
       */
      controller: function ($scope) {
        var ctrl = this;
        ctrl.cargando = $translate.instant("LOADING.CARGANDO_ESTUDIANTE");
        ctrl.estudianteRegistrado = false;
        ctrl.estudianteExiste = false;
        ctrl.estudianteValido = false;
        ctrl.estudianteConTrabajo = false;
        ctrl.cantidadExcedida = false;
        ctrl.estudianteNoEncontrado = false;
        ctrl.estudianteConSolicitud = false;
        ctrl.removable = false;
        ctrl.nuevosEstudiantes = [];

        /**
         * @ngdoc method
         * @name agregarEstudiante
         * @methodOf poluxClienteApp.directive:asignarEstudiante.controller:asignarEstudianteCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {undefined} No retorna ningún valor
         * @description 
         * Verifica que el estudiante no este agregado en el arreglo de estudiantes y llama la función verificar estudiante.
         */
        ctrl.agregarEstudiante = function () {
          ctrl.estudianteRegistrado = false;
          ctrl.estudianteExiste = false;
          ctrl.estudianteValido = false;
          ctrl.estudianteConTrabajo = false;
          ctrl.cantidadExcedida = false;
          ctrl.estudianteNoEncontrado = false;
          ctrl.estudianteConSolicitud = false;

          
          if (!ctrl.nuevosEstudiantes.includes(ctrl.codigoEstudiante) && $scope.estudiante !== "" + ctrl.codigoEstudiante) {
            ctrl.verificarEstudiante();
          } else {
            ctrl.estudianteRegistrado = true;
          }
        };

        /**
         * @ngdoc method
         * @name verificarEstudiante
         * @methodOf poluxClienteApp.directive:asignarEstudiante.controller:asignarEstudianteCtrl
         * @param {undefined} undefined No recibe parametros
         * @returns {undefined} No retorna ningún valor
         * @description 
         * Permite agregar al estdiante a la solicitud, se traen los datos del estudiante
         * del servicio {@link services/academicaService.service:academicaRequest academicaRequest} y se verifica que: el estudiante cumpla con los requisitos para
         * cursar la modalidad y realizar la solicitud con el servicio de {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest}, se verifica que el estudiante 
         * no tenga registrado un trabajo de grado en {@link services/poluxService.service:poluxRequest poluxRequest}, se verifica la cantidad de estudiantes máximos para la solicitud
         * en {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest} y por ultimo se te verifica que no tenga solicitudes activas 
         * en {@link services/poluxService.service:poluxRequest poluxRequest}.
         */
        ctrl.verificarEstudiante = function () {
          ctrl.loading = true;
          academicaRequest.get("periodo_academico", "P").then(function (periodoAnterior) {
            academicaRequest.get("datos_estudiante", [ctrl.codigoEstudiante, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo]).then(function (response2) {
              if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
                ctrl.estudiante = {
                  "Codigo": ctrl.codigoEstudiante,
                  "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                  "Modalidad": $scope.modalidad,
                  "Tipo": "POSGRADO",
                  "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].porcentaje_cursado,
                  "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                  "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                  "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                  "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                  "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].nombre_tipo_carrera,
                  "Carrera": response2.data.estudianteCollection.datosEstudiante[0].carrera
                };

                poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function (response) {
                  if (response.data.RequisitosModalidades) {
                    var parametrosTrabajoEstudiante = $.param({
                      query: "EstadoEstudianteTrabajoGrado:1,Estudiante:" + ctrl.codigoEstudiante,
                    });
                    poluxRequest.get("estudiante_trabajo_grado", parametrosTrabajoEstudiante).then(function (responseTrabajoEstudiante) {
                      if (Object.keys(responseTrabajoEstudiante.data[0]).length === 0) {
                        var cantidad;
                        cantidad = 2 + ctrl.nuevosEstudiantes.length;
                        ctrl.datosModalidad = {
                          "Modalidad": $scope.modalidad + "",
                          "Cantidad": cantidad + ""
                        };
                        
                        
                        poluxMidRequest.post("verificarRequisitos/CantidadModalidades", ctrl.datosModalidad).then(function (validado) {
                          if (validado.data.RequisitosModalidades) {
                            var parametrosEstudiante = $.param({
                              query: "SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud.Id:2,Usuario:" + ctrl.codigoEstudiante,
                              sortby: "SolicitudTrabajoGrado",
                              order: "desc",
                              limit: 1
                            });
                            poluxRequest.get("usuario_solicitud", parametrosEstudiante).then(function (responseSolicitud) {
                              if (Object.keys(responseSolicitud.data[0]).length > 0) {
                                var idSolicitud = responseSolicitud.data[0].SolicitudTrabajoGrado.Id;
                                var parametrosSolicitudEstudiante = $.param({
                                  query: "Activo:true,EstadoSolicitud.Id:1,SolicitudTrabajoGrado.Id:" + idSolicitud,
                                });
                                poluxRequest.get("respuesta_solicitud", parametrosSolicitudEstudiante).then(function (resultadoSolicitudes) {
                                  if (Object.keys(resultadoSolicitudes.data[0]).length === 0) {
                                    ctrl.nuevosEstudiantes.push(ctrl.codigoEstudiante);
                                    $scope.estudiantes = ctrl.nuevosEstudiantes;
                                    ctrl.loading = false;
                                  } else {
                                    ctrl.estudianteConSolicitud = true;
                                    ctrl.loading = false;
                                  }
                                })
                                  .catch(function (error) {
                                    
                                    ctrl.error = true;
                                    ctrl.loading = false;
                                  });
                              } else {
                                ctrl.nuevosEstudiantes.push(ctrl.codigoEstudiante);
                                $scope.estudiantes = ctrl.nuevosEstudiantes;
                                ctrl.loading = false;
                              }
                            })
                              .catch(function (error) {
                                
                                ctrl.error = true;
                                ctrl.loading = false;
                              });
                          } else {
                            ctrl.cantidadExcedida = true;
                            ctrl.loading = false;
                          }
                        })
                          .catch(function (error) {
                            
                            ctrl.error = true;
                            ctrl.loading = false;
                          });
                      } else {
                        ctrl.estudianteConTrabajo = true;
                        ctrl.loading = false;
                      }
                    })
                      .catch(function (error) {
                        
                        ctrl.error = true;
                        ctrl.loading = false;
                      });

                  } else {
                    ctrl.estudianteValido = true;
                    ctrl.loading = false;
                  }

                })
                  .catch(function (error) {
                    
                    ctrl.error = true;
                    ctrl.loading = false;
                  });
              } else {
                ctrl.estudianteNoEncontrado = true;
                ctrl.loading = false;
              }
            })
              .catch(function (error) {
                
                ctrl.error = true;
                ctrl.loading = false;
              });
          })
            .catch(function (error) {
              
              ctrl.error = true;
              ctrl.loading = false;
            });
        }

      },
      controllerAs: 'd_asignarEstudiante'
    };
  });
