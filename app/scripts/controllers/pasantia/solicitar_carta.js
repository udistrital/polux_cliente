'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:PasantiaSolicitarCartaCtrl
 * @description
 * # PasantiaSolicitarCartaCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite a un estudiante crear una solicitud de carta de presentación a una oficina expedida por la oficina de pasantías
 * @requires $location
 * @requires $q
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxMidService.service:poluxMidRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @property {String} codigo Código del estudiante que esta realizando la solicitud
 * @property {String} mensajeError Mensaje que se muestra cuando ocurre algún error verificando los datos del estudiante y sus solicitudes
 * @property {Boolean} errorCargar Bandera que permite identificar cuando ocurre un error veficiando los datos del estudiante y sus solicitudes, permitiendo mostrar el mensaje de error
 * @property {Object} estudiante Objeto de tipo JSON que almacena los datos del estudiante
 * @property {Object} postSolicitud Data de la solicitud que se envia para registrar en la base de datos
 * @property {String} periodoAcademicoActual Texto que carga el periodo académico actual a la solicitud
 * @property {String} nombreEmpresa Texto que carga la información sobre el nombre de la empresa para la carta
 * @property {String} nombreReceptor Texto que carga la información sobre el receptor de la carta
 * @property {String} cargoReceptor Texto que carga la información sobre el cargo del receptor de la carta
 * @property {String} cargandoEstudiante Texto que aparece durante la carga de los datos del estudiante
 * @property {String} cargandoFormulario Texto que aparece durante el envío del formulario con la información de la carta
 * @property {Boolean} loadEstudiante Indicador que maneja la carga de los datos académicos del estudiante
 * @property {Boolean} loadFormulario Indicador que maneja la carga del formulario en envío para registrarse
 */
angular.module('poluxClienteApp')
  .controller('PasantiaSolicitarCartaCtrl',
    function($location, $q, $scope,notificacionRequest, $translate, academicaRequest, poluxRequest, poluxMidRequest, token_service) {
      var ctrl = this;

      //mensajes para load
      $scope.cargandoEstudiante = $translate.instant('LOADING.CARGANDO_ESTUDIANTE');
      $scope.cargandoFormulario = $translate.instant('LOADING.ENVIANDO_FORLMULARIO');

      //código de la pesona que se loguea
      //token_service.token.documento = "20141020036";
      //ctrl.codigo = token_service.token.documento;
      ctrl.codigo = token_service.getAppPayload().appUserDocument;

      /**
       * @ngdoc method
       * @name validarRequisitosEstudiante
       * @methodOf poluxClienteApp.controller:PasantiaSolicitarCartaCtrl
       * @description 
       * Permite verificar si un estudiante cumple con los requisitos para solicitar la carta. 
       * Se traen los datos del estudiante del servicio {@link services/academicaService.service:academicaRequest academicaRequest}. 
       * Se verifica que el estudiante cumpla con los requisitos para cursar la modalidad y realizar la solicitud con el servicio de {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest}.
       * Se verifica que el estudiante no tenga registrado un trabajo de grado en {@link services/poluxService.service:poluxRequest poluxRequest}.
       * Se verifica que no tenga solicitudes activas en {@link services/poluxService.service:poluxRequest poluxRequest}.
       * @param {undefined} undefined No requiere parámetros.
       * @returns {undefined} No retorna ningún valor.
       */
      ctrl.validarRequisitosEstudiante = function() {
        ctrl.mensajeError = "";
        ctrl.errorCargar = false;
        academicaRequest.get("periodo_academico", "P").then(function(periodoAnterior) {
          academicaRequest.get("datos_estudiante", [ctrl.codigo, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo]).then(function(response2) {
            
            if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
             
              ctrl.estudiante = {
                "Codigo": ctrl.codigo,
                "Nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                "Modalidad": 1, //id modalidad de pasantia
                "Tipo": "POSGRADO",
                "PorcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].porcentaje_cursado,
                "Promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                "Rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                "Estado": response2.data.estudianteCollection.datosEstudiante[0].estado,
                "Nivel": response2.data.estudianteCollection.datosEstudiante[0].nivel,
                "TipoCarrera": response2.data.estudianteCollection.datosEstudiante[0].tipo_carrera,
                "Carrera": response2.data.estudianteCollection.datosEstudiante[0].carrera
              };
              if (ctrl.estudiante.Nombre != undefined) {
                poluxMidRequest.post("verificarRequisitos/Registrar", ctrl.estudiante).then(function(verificacion) {
                  
                    if (verificacion.data.RequisitosModalidades) {
                      // se verifica que no tenga trabajos de grado actualmente
                      var parametrosTrabajo = $.param({
                        query: "EstadoEstudianteTrabajoGrado:1,Estudiante:" + ctrl.codigo,
                        limit: 1,
                      });
                      poluxRequest.get("estudiante_trabajo_grado", parametrosTrabajo).then(function(responseTrabajo) {
                          if (Object.keys(responseTrabajo.data[0]).length > 0) {
                            // se verifica que no tenga solicitudes pendientes
                            var parametrosUsuario = $.param({
                              query: "usuario:" + ctrl.codigo,
                              limit: 0,
                            });
                            poluxRequest.get("usuario_solicitud", parametrosUsuario).then(function(responseSolicitudes) {
                                if (Object.keys(responseSolicitudes.data[0]).length === 0) {
                                  //no ha hecho solicitudes
                                  $scope.loadEstudiante = false;
                                } else {
                                  //tiene solicitudes registradas se consulta la respuesta
                                  var requestRespuesta = function(solicitudesActuales, id) {
                                    var defered = $q.defer();
                                    var parametrosSolicitudesActuales = $.param({
                                      query: "EstadoSolicitud.in:1|2,activo:TRUE,SolicitudTrabajoGrado:" + id,
                                      limit: 1,
                                    });
                                    poluxRequest.get("respuesta_solicitud", parametrosSolicitudesActuales).then(function(responseSolicitudesActuales) {
                                        if (Object.keys(responseSolicitudesActuales.data[0]).length > 0) {
                                          defered.resolve(responseSolicitudesActuales.data);
                                          solicitudesActuales.push(responseSolicitudesActuales.data[0]);
                                        } else {
                                          defered.resolve(responseSolicitudesActuales.data);
                                        }
                                      })
                                      .catch(function(error) {
                                        defered.reject(error);
                                      });
                                    return defered.promise;
                                  }
                                  var actuales = [];
                                  var promesas = [];
                                  angular.forEach(responseSolicitudes.data, function(solicitud) {
                                    promesas.push(requestRespuesta(actuales, solicitud.SolicitudTrabajoGrado.Id));
                                  });
                                  $q.all(promesas).then(function() {
                                      if (actuales.length === 0) {
                                        //no tiene solicitudes pendientes por responder
                                        $scope.loadEstudiante = false;
                                      } else {
                                        
                                        ctrl.mensajeError = $translate.instant("ERROR.HAY_SOLICITUD_PENDIENTE");
                                        ctrl.errorCargar = true;
                                        $scope.loadEstudiante = false;
                                      }
                                    })
                                    .catch(function(error) {
                                      
                                      ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                                      ctrl.errorCargar = true;
                                      $scope.loadEstudiante = false;
                                    });
                                }
                              })
                              .catch(function(error) {
                                
                                ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                                ctrl.errorCargar = true;
                                $scope.loadEstudiante = false;
                              });
                          } else {
                            
                            ctrl.mensajeError = $translate.instant("ESTUDIANTE_TRABAJO_GRADO");
                            ctrl.errorCargar = true;
                            $scope.loadEstudiante = false;
                          }
                        })
                        .catch(function(error) {
                          
                          ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                          ctrl.errorCargar = true;
                          $scope.loadEstudiante = false;
                        });
                    } else {
                      
                      ctrl.mensajeError = $translate.instant("ESTUDIANTE_NO_REQUISITOS");
                      ctrl.errorCargar = true;
                      $scope.loadEstudiante = false;
                    }
                  })
                  .catch(function(error) {
                    
                    ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
                    ctrl.errorCargar = true;
                    $scope.loadEstudiante = false;
                  });
              } else {
                //faltan datos del estudiante
                
                ctrl.mensajeError = $translate.instant("FALTAN_DATOS_ESTUDIANTE");
                ctrl.errorCargar = true;
                $scope.loadEstudiante = false;
              }
            } else {
              
              ctrl.mensajeError = $translate.instant("ERROR.ESTUDIANTE_NO_ENCONTRADO");
              ctrl.errorCargar = true;
              $scope.loadEstudiante = false;
            }
          }).catch(function(error) {
            
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTE");
            ctrl.errorCargar = true;
            $scope.loadEstudiante = false;
          });
        }).catch(function(error) {
          
          ctrl.mensajeError = $translate.instant("ERROR.CARGANDO_PERIODO");
          ctrl.errorCargar = true;
          $scope.loadEstudiante = false;
        });
      }

      $scope.loadEstudiante = true;
      //Se consulta el periodo academico actual
      academicaRequest.get("periodo_academico", "A").then(function(periodoActual) {
          ctrl.periodoAcademicoActual = periodoActual.data.periodoAcademicoCollection.periodoAcademico[0].anio + "-" + periodoActual.data.periodoAcademicoCollection.periodoAcademico[0].periodo;
          //Se valida que el estudiante cumpla con los requisitos para realizar la solicitud
          ctrl.validarRequisitosEstudiante();
        })
        .catch(function(error) {
          
          ctrl.mensajeError = $translate.instant("ERROR.CARGANDO_PERIODO");
          ctrl.errorCargar = true;
          $scope.loadEstudiante = false;
        });


      /**
       * @ngdoc method
       * @name postSolicitud
       * @methodOf poluxClienteApp.controller:PasantiaSolicitarCartaCtrl
       * @description 
       * Permite realizar el post de la solicitud en {@link services/poluxService.service:poluxRequest poluxRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que permite identificar cuando se completó el post de la solicitud, se resuelve con la respuesta que retorna el servidor
       */
      ctrl.postSolicitud = function() {
        var defer = $q.defer();

        var data_detalles = [];
        var data_solicitante = [];
        var data_respuesta = {};
        var fecha = new Date();

        //datos de la solicitud
        var data_solicitud = {
          "Fecha": fecha,
          "ModalidadTipoSolicitud": {
            //id solicitud de carta en modalidad_tipo_solicitud
            "Id": 1
          },
          "PeriodoAcademico": ctrl.periodoAcademicoActual,
        };

        //detalles de la solicitud, nombre empresa, nombre encargado y cargo
        data_detalles.push({
          "Descripcion": ctrl.nombreEmpresa,
          "SolicitudTrabajoGrado": {
            "Id": 0
          },
          "DetalleTipoSolicitud": {
            "Id": 1
          }
        });
        data_detalles.push({
          "Descripcion": ctrl.nombreReceptor,
          "SolicitudTrabajoGrado": {
            "Id": 0
          },
          "DetalleTipoSolicitud": {
            "Id": 2
          }
        });
        data_detalles.push({
          "Descripcion": ctrl.cargoReceptor,
          "SolicitudTrabajoGrado": {
            "Id": 0
          },
          "DetalleTipoSolicitud": {
            "Id": 3
          }
        });

        //informacion del solicitante
        data_solicitante.push({
          "Usuario": ctrl.codigo,
          "SolicitudTrabajoGrado": {
            "Id": 0
          }
        });

        //Respuesta de la solicitud
        data_respuesta = {
          "Fecha": fecha,
          "Justificacion": "La solicitud fue radicada",
          "EnteResponsable": 0,
          "Usuario": 0,
          "EstadoSolicitud": {
            "Id": 1
          },
          "SolicitudTrabajoGrado": {
            "Id": 0
          },
          "Activo": true
        }

        //se crea objeto con las solicitudes
        ctrl.postSolicitud = {
          Solicitud: data_solicitud,
          Respuesta: data_respuesta,
          DetallesSolicitud: data_detalles,
          UsuariosSolicitud: data_solicitante
        }

        poluxRequest.post("tr_solicitud", ctrl.postSolicitud)
          .then(function(response) {
            var nick = token_service.getAppPayload().email.split("@").slice(0);
            academicaRequest.get("datos_basicos_estudiante", [ctrl.codigo])
            .then(function(responseDatosBasicos) {
              var carrera = responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
              academicaRequest.get("carrera",[carrera]).then(function(ResponseCarrea){
                carrera = ResponseCarrea.data.carrerasCollection.carrera[0].nombre;
                notificacionRequest.enviarNotificacion('Solicitud de '+carrera+' de '+nick[0],'PoluxCola','/solicitudes/listar_solicitudes');               
              });
              });  defer.resolve(response);
          })
          .catch(function(error) {
            defer.reject(error);
          });

        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name enviarSolicitud
       * @methodOf poluxClienteApp.controller:PasantiaSolicitarCartaCtrl
       * @description 
       * Permite mostrar un mensaje de confirmación al usuario y en caso de que este acepte llama al método postSolicitud para registrar la solicitud
       * @param {undefined} undefined No requiere parámetros.
       * @returns {undefined} No retorna ningún valor.
       */
      ctrl.enviarSolicitud = function() {
        swal({
          title: $translate.instant("INFORMACION_SOLICITUD"),
          text: $translate.instant("PASANTIA.SEGURO_INFORMACION_CARTA", {
            nombre: ctrl.nombreReceptor,
            cargo: ctrl.cargoReceptor,
            empresa: ctrl.nombreEmpresa
          }),
          type: "warning",
          confirmButtonText: $translate.instant("ACEPTAR"),
          cancelButtonText: $translate.instant("CANCELAR"),
          showCancelButton: true
        }).then(function(responseSwal) {
          if (responseSwal) {
            $scope.loadFormulario = true;
            ctrl.postSolicitud()
              .then(function(response) {
                if (response.data[0] === "Success") {
                  swal(
                    $translate.instant("FORMULARIO_SOLICITUD"),
                    $translate.instant("SOLICITUD_REGISTRADA"),
                    'success'
                  );
                  $location.path("/solicitudes/listar_solicitudes");
                } else {
                  swal(
                    $translate.instant("FORMULARIO_SOLICITUD"),
                    $translate.instant(response.data[1]),
                    'warning'
                  );
                }
                $scope.loadFormulario = false;
              })
              .catch(function(error) {
                swal(
                  $translate.instant("FORMULARIO_SOLICITUD"),
                  $translate.instant("ERROR_CARGAR_SOLICITUDES"),
                  'warning'
                );
              })
          }
        });

      }

    });