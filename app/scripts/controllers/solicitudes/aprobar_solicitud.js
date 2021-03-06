'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
 * @description
 * # SolicitudesAprobarSolicitudCtrl
 * Controller of the poluxClienteApp
 * Controlador de la vista de aprobar_solicitud que permite al coordinador aprobar una solicitud de cualquier tipo
 * para acceder a la opción se debenn  incluir en los parametros de la url el id de la solicitud
 * @requires $location
 * @requires $q
 * @requires $routeParams
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires $window
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxMidService.service:poluxMidRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:nuxeoService
 * @requires services/poluxService.service:nuxeoClient
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @property {Object} carrerasCoordinador Objeto que contiene las carreras asociadas al coordinador que aprueba la solicitud
 * @property {Object} respuestaActual Objeto que contiene la respuesta actual de la solicitud, que se encuentra en estado radicada.
 * @property {Boolean} noAprobar booleano que permite saber si se puede permitir o no aprobar a solicitud
 * @property {Object} fechaInicio Contiene la fecha de inicio del proceso de aprobación de solicitudes de materias de posgrado
 * @property {Object} fechaFin Contiene la fecha de fin del proceso de aprobación de solicitudes de materias de posgrado
 * @property {Object} detallesSolicitud Contiene los detalles asociados a la solicitud
 * @property {Object} dataSolicitud Contiene los datos principales de la solicitud
 * @property {Object} docentes Contiene los docientes que pueden ser elegidos como evaluadores o directores de trabajo de grado que no estan asociados al trabajo de grado actual
 * @property {Object} docentesVinculadosTg Contiene los docenes vinculados al trabajo de grado
 * @property {Object} dataRespuesta Contiene la data de la respuesta que se va a registrar cuando se apruebe o rechace la solicitud
 * @property {Object} documentos Contiene las actas subidas a las carreras asocuadas al coordinador
 * @property {String} respuestaSolicitud Texto que carga la respuesta de la solicitud en atención
 * @property {String} justificacion Texto que carga la justificación de la solicitud en atención
 * @property {Number} solicitud Número que carga el identificador de la solicitud que llega al controlador
 * @property {Boolean} isInicial Identificador que decide si la solicitud es inicial
 * @property {Boolean} isCambio Identificador que decide si la solicitud es de cambio
 * @property {Boolean} isPasantia Identificador que decide si la solicitud es de pasantía
 * @property {Boolean} hasRevisor Identificador que decide si la solicitud tiene revisor asociado
 * @property {Array} acta Colección que maneja el contenido de las actas en el controlador
 * @property {Array} docentesVinculadosTg Colección que almacena el contenido de los docentes vinculados a la solicitud
 * @property {String} mensajeErrorCargaSolicitud Texto que aparece en caso de aparecer un error durante la carga de la solicitud
 * @property {Object} periodoSiguiente Objeto que carga la informración del periodo siguiente
 * @property {Object} fechaActual Objeto que carga la información de la fecha actual
 * @property {String} mensajeNoAprobar Texto que aparece en caso de haber un error durante la comprobación de las fechas
 * @property {Array} todoDetalles Colección que almacena el contenido de todos los detalles de la solicitud
 * @property {Object} docenteDirector Objeto que guarda la información del docente director
 * @property {Object} docenteCoDirector Objeto que guarda la información del docente co-director
 * @property {Object} docenteCambio Objeto que guarda la información del docente para el cambio
 * @property {Object} directorActualTg Objeto que guarda la información del director actual del trabajo de grado
 * @property {Object} directorOpcionTg Objeto que guarda la información del director opcionado para el trabajo de grado
 * @property {Array} evaluadoresActualesTg Colección que respalda la información de los evaluadores actuales del trabajo de grado
 * @property {Array} evaluadoresOpcionesTg Colección que respalda la información de los evaluadores opcionados para el trabajo de grado
 * @property {Array} areas Colección que maneja las áreas de conocimiento para el trabajo de grado
 * @property {Boolean} tieneCoDirector Indicador que maneja si en la solicitud aparece co-director del proyecto
 * @property {Array} evaluadoresInicial Colección que maneja el contenido de los evaluadores para inicio de solicitud
 * @property {Number} directorActual Valor que carga el identificador del director actual sobre la solicitud
 * @property {Number} directorNuevo Valor que carga el identificador del nuevo director sobre la solicitud
 * @property {Number} evaluadorActual Valor que carga el identificador del director actual sobre la solicitud
 * @property {Number} evaluadorNuevo Valor que carga el identificador del nuevo evaluador sobre la solicitud
 * @property {String} tituloNuevo Texto que carga el contenido del nuevo título para el trabajo de grado
 * @property {Number} asignaturaActual Valor que carga el identificador de la asignatura en curso
 * @property {Number} asignaturaNueva Valor que carga el identificador de la nueva asignatura a cursar
 * @property {Number} directorExternoActual Valor que carga el identificador del director externo que está vinculado al trabajo de grado
 * @property {String} nombreDirectorExternoNUevo Texto que carga el nombre del nuevo director externo a vincular al trabajo de grado
 * @property {Object} docenteCambio Objeto que carga la información del cambio de docente
 * @property {Number} codirector Valor que carga el identificador para el nuevo codirector del trabajo de grado
 * @property {String} docPropuestaFinal Texto que carga la información sobre el documeto para la propuesta final
 * @property {Boolean} switchCodirector Indicador que decide si se habilita la inscripción de co-director en la solicitud
 * @property {Object} trabajo_grado Objeto que carga la información sobre el trabajo de grado a registrarse con la solicitud
 * @property {Boolean} switchRevision Indicador que decide si se habilita el contenido para cambiar la vinculación
 * @property {Object} doc Objeto que carga la información sobre el documento que se obtiene
 * @property {Object} document Objeto que carga la información sobre el documento que se obtiene
 * @property {String} msgCargandoSolicitud Texto que aparece durante la carga de los detalles de la solicitud
 * @property {String} msgEnviandFormulario Texto que aparece durante el envío del formulario
 * @property {Boolean} loadSolicitud Indicador que maneja la carga de la solicitud
 * @property {Boolean} loadFormulario Indicador que maneja la carga del formulario
 * @property {Object} infiniteScroll Objeto que configura las propiedades para la barra de desplazamiento en la visualización
 * @property {Number} userId Valor que carga el código de identificación para el usuario
 * @property {Boolean} loadDocumento Indicador que maneja la carga del documento para la solicitud
 */
angular.module('poluxClienteApp')
  .controller('SolicitudesAprobarSolicitudCtrl',
    function($location, $q, $routeParams, $scope, $translate, $window, academicaRequest, poluxRequest, poluxMidRequest, nuxeo, nuxeoClient, sesionesRequest, token_service) {
      var ctrl = this;

      ctrl.respuestaSolicitud = "";
      ctrl.justificacion = "";
      ctrl.solicitud = $routeParams.idSolicitud;

      $scope.msgCargandoSolicitud = $translate.instant("LOADING.CARGANDO_DETALLES_SOLICITUD");
      $scope.msgEnviandFormulario = $translate.instant('LOADING.ENVIANDO_FORLMULARIO');
      $scope.loadSolicitud = true;
      $scope.loadFormulario = false;

      ctrl.isInicial = false;
      ctrl.isCambio = false;
      ctrl.isPasantia = false;
      ctrl.hasRevisor = false;

      //datos para el acta
      ctrl.acta = [];
      ctrl.acta.nombre = $translate.instant('DOCUMENTO.SIN_DOCUMENTO');
      ctrl.acta.url = "";

      ctrl.docentesVinculadosTg = [];

      //datos para infinite SolicitudesAprobarSolicitudCtrl//Infinite Scroll Magic
      $scope.infiniteScroll = {};
      $scope.infiniteScroll.numToAdd = 20;
      $scope.infiniteScroll.currentItems = 20;
      $scope.reloadScroll = function() {
        $scope.infiniteScrollcurrentItems = $scope.infiniteScroll.numToAdd;
      };
      $scope.addMoreItems = function() {
        $scope.infiniteScroll.currentItems += $scope.infiniteScroll.numToAdd;
      };

      //carreras del coordinador
      /*  var parametrosCoordinador = {
          "identificacion":19451396,
          "tipo":"PREGRADO",
        };*/
      //$scope.userId=19451396;
      //token_service.token.documento = "79537917"; //Coordinador de artes
      token_service.token.documento = "79647592" //Coordinador de sistemas
      $scope.userId = parseInt(token_service.token.documento);

      ctrl.carrerasCoordinador = [];

      /**
       * @ngdoc method
       * @name getCarrerasCoordinador
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {Promise} Objeto de tipo promesa que resuelve las carreras del coordinador o la excepción gnerada
       * @description 
       * Consulta las carreras asociadas al coordinador
       * se consueme el servicio {@link academicaService.service:academicaRequest academicaRequest}
       */
      ctrl.getCarrerasCoordinador = function() {
        var defer = $q.defer();
        academicaRequest.get("coordinador_carrera", [$scope.userId, "PREGRADO"]).then(function(response) {
            //console.log(response);
            if (!angular.isUndefined(response.data.coordinadorCollection.coordinador)) {
              ctrl.carrerasCoordinador = response.data.coordinadorCollection.coordinador;
              defer.resolve();
            } else {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("NO_CARRERAS_PREGRADO");
              defer.reject("Carreras no definidas");
            }
          })
          .catch(function(error) {
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_CARRERAS");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getRespuestaSolicitud
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {Promise} Objeto de tipo promesa que se resuelve con la respuesta de la solicitud o la excepción generada
       * @description 
       * Consulta si la respuesta tiene una respuesta asociada actualmente en el servicio {@link services/poluxService.service:poluxRequest poluxRequest} y bloquea el formulario que permite aprobar la solicitud.
       */
      ctrl.getRespuestaSolicitud = function() {
        var defer = $q.defer();
        var parametros = $.param({
          query: "SolicitudTrabajoGrado.Id:" + ctrl.solicitud + ",Activo:TRUE"
        });
        poluxRequest.get("respuesta_solicitud", parametros).then(function(responseRespuesta) {
            if (responseRespuesta.data != null) {
              ctrl.respuestaActual = responseRespuesta.data[0];
              if (responseRespuesta.data[0].EstadoSolicitud.Id != 1) {
                ctrl.mensajeNoAprobar += ' ' + $translate.instant('SOLICITUD_CON_RESPUESTA');
                ctrl.noAprobar = true;
              }
              defer.resolve();
            } else {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
              defer.reject("no hay respuesta");
            }
          })
          .catch(function(error) {
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_RESPUESTA_SOLICITUD");
            defer.reject(error);
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getFechasAprobacion
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {Number} idModalidadTipoSolicitud Identificador de modalidad_tipo_solicitud que permite saber el tipo de solicitud y la modaliad a la que pertenece
       * @returns {Promise} Objeto de tipo promesa que indica si se cumplen las fechas de aprobación o se rechaza con la excepción generada
       * @description 
       * Si el idModalidadTipoSolicitud es igual a 13 (solicitud inicial de materias de posgrado) consulta las fechas asociadas al proceso de solicitudes en el servicio
       * {@link services/poluxClienteApp.service:sesionesService sesionesService}, con el periodo que consulta de 
       * {@link services/academicaService.service:academicaRequest academicaRequest}.
       */
      ctrl.getFechasAprobacion = function(idModalidadTipoSolicitud) {
        var defer = $q.defer();
        //si la solicitud es de tipo inicial en la modalidad de materias de posgrado
        if (idModalidadTipoSolicitud === 13) {
          academicaRequest.get("periodo_academico", "X")
            .then(function(responsePeriodo) {
              if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
                ctrl.periodoSiguiente = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
                var parametrosSesiones = $.param({
                  query: "SesionHijo.TipoSesion.Id:8,SesionPadre.periodo:" + ctrl.periodoSiguiente.anio + ctrl.periodoSiguiente.periodo,
                  limit: 1
                });
                sesionesRequest.get("relacion_sesiones", parametrosSesiones)
                  .then(function(responseFechas) {
                    if (responseFechas.data !== null) {
                      ctrl.fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm");
                      var sesion = responseFechas.data[0];
                      var fechaHijoInicio = new Date(sesion.SesionHijo.FechaInicio);
                      fechaHijoInicio.setTime(fechaHijoInicio.getTime() + fechaHijoInicio.getTimezoneOffset() * 60 * 1000);
                      ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
                      var fechaHijoFin = new Date(sesion.SesionHijo.FechaFin);
                      fechaHijoFin.setTime(fechaHijoFin.getTime() + fechaHijoFin.getTimezoneOffset() * 60 * 1000);
                      ctrl.fechaInicio = moment(fechaHijoInicio).format("YYYY-MM-DD HH:mm");
                      ctrl.fechaFin = moment(fechaHijoFin).format("YYYY-MM-DD HH:mm");
                      if (ctrl.fechaInicio <= ctrl.fechaActual && ctrl.fechaActual <= ctrl.fechaFin) {
                        console.log();
                        defer.resolve();
                      } else {
                        ctrl.mensajeNoAprobar += ' ' + $translate.instant('ERROR.NO_EN_FECHAS_APROBACION_POSGRADO', {
                          inicio: ctrl.fechaInicio,
                          fin: ctrl.fechaFin
                        });
                        ctrl.noAprobar = true;
                        defer.resolve();
                      }
                    } else {
                      ctrl.mensajeNoAprobar += ' ' + $translate.instant('ERROR.SIN_FECHAS_MODALIDAD_POSGRADO');
                      ctrl.noAprobar = true;
                      defer.resolve();
                    }
                  })
                  .catch(function() {
                    ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_FECHAS_MODALIDAD_POSGRADO");
                    defer.reject("no se pudo cargar fechas");
                  });
              } else {
                ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.SIN_PERIODO");
                defer.reject("sin periodo");
              }
            })
            .catch(function(error) {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_PERIODO");
              defer.reject(error);
            });
        } else {
          defer.resolve();
        }
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getDetallesSolicitud
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {Object} parametrosDetalleSolicitud Parámetros necesarios para hacer las consultas
       * @returns {Promise} Objeto de tipo promesa que indica si se cumple la consulta de las solicitudes o se rechaza con la excepción generada
       * @description 
       * Consulta los detalles y usuarios asociados a la solicitud del servicio 
       * {@link services/poluxService.service:poluxRequest poluxRequest} para poder mostrarlos en el formulario.
       * En caso de que la descripción del dellate tenga el documento de un docente se usa el servicio {@link services/academicaService.service:academicaRequest academicaRequest}
       * para consultar los datos del docente, por último si el detalle es un JSON lo divide y formatea como correspoda.
       */
      ctrl.getDetallesSolicitud = function(parametrosDetallesSolicitud) {
        var defered = $q.defer();
        var promise = defered.promise;
        poluxRequest.get("detalle_solicitud", parametrosDetallesSolicitud).then(function(responseDetalles) {
            poluxRequest.get("usuario_solicitud", parametrosDetallesSolicitud).then(function(responseEstudiantes) {
                if (responseDetalles.data === null) {
                  ctrl.detallesSolicitud = [];
                } else {
                  ctrl.detallesSolicitud = responseDetalles.data;
                }

                var solicitantes = "";
                ctrl.detallesSolicitud.id = ctrl.solicitud;
                ctrl.detallesSolicitud.tipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud;
                ctrl.detallesSolicitud.fechaSolicitud = ctrl.dataSolicitud.Fecha.toString().substring(0, 10);
                ctrl.detallesSolicitud.PeriodoAcademico = ctrl.dataSolicitud.PeriodoAcademico;
                angular.forEach(responseEstudiantes.data, function(estudiante) {
                  solicitantes += (", " + estudiante.Usuario);
                });
                ctrl.todoDetalles = [];
                var promises = [];
                var getDocente = function(id, detalle) {
                  var defer = $q.defer();
                  academicaRequest.get("docente_tg", [detalle.Descripcion]).then(function(docente) {
                      if (!angular.isUndefined(docente.data.docenteTg.docente)) {
                        console.log(docente.data.docenteTg.docente[0]);
                        detalle.Descripcion = docente.data.docenteTg.docente[0].id + " " + docente.data.docenteTg.docente[0].nombre;
                        if (id === 9 || id === 37) {
                          ctrl.docenteDirector = {
                            "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                            "id": docente.data.docenteTg.docente[0].id,
                          };
                          //console.log(ctrl.docenteDirector);
                        }

                        //docente codirector solicitado
                        if (id === 56) {
                          ctrl.docenteCoDirector = {
                            "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                            "id": docente.data.docenteTg.docente[0].id,
                          };
                        }

                        //docente solicitado para el cambio
                        if (id === 15 || id === 17 || id === 58) {
                          ctrl.docenteCambio = {
                            "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                            "id": docente.data.docenteTg.docente[0].id,
                          };
                          //  console.log("docente cambio", ctrl.docenteCambio);
                        }

                        //docente en solicitud de socialización o de director
                        if (id === 14) {
                          ctrl.directorActualTg = {
                            "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                            "id": docente.data.docenteTg.docente[0].id,
                          };
                          ctrl.directorOpcionTg = {
                            "NOMBRE": docente.data.docenteTg.docente[0].nombre,
                            "id": docente.data.docenteTg.docente[0].id,
                          };
                        }

                        defer.resolve();
                      } else {
                        ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
                        defer.reject(error);
                      }
                    })
                    .catch(function(error) {
                      ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                var getDocentes = function(detalle) {
                  var defer = $q.defer();
                  var promesasDocentes = [];
                  var detallesTemporales = [];
                  angular.forEach(detalle.Descripcion.split(","), function(docDocente) {
                    var detalleTemp = {
                      Descripcion: docDocente,
                      id: docDocente,
                    }
                    detallesTemporales.push(detalleTemp);
                    promesasDocentes.push(getDocente(0, detalleTemp));
                  })
                  $q.all(promesasDocentes)
                    .then(function() {
                      detalle.Descripcion = detallesTemporales.map(function(detalleTemp) {
                        return detalleTemp.Descripcion
                      }).join(", ");
                      if (detalle.DetalleTipoSolicitud.Detalle.Id == 61) {
                        for (var j = 0; j < detallesTemporales.length; j++) {
                          detallesTemporales[j].label = (detallesTemporales.length > 1) ? $translate.instant('SELECT.EVALUADOR_NUMERO', {
                            numero: (j + 1)
                          }) : $translate.instant('SELECT.DOCENTE_REVISOR');
                          detallesTemporales[j].docente = {
                            NOMBRE: detallesTemporales[j].Descripcion.substring(detallesTemporales[j].Descripcion.indexOf(" ") + 1),
                            id: detallesTemporales[j].id,
                          }
                        }
                        ctrl.evaluadoresActualesTg = angular.copy(detallesTemporales);
                        ctrl.evaluadoresOpcionesTg = angular.copy(detallesTemporales);
                      }
                      defer.resolve();
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                var getExterno = function(detalle) {
                  var defer = $q.defer();
                  var parametrosVinculado = $.param({
                    query: "TrabajoGrado:" + detalle.SolicitudTrabajoGrado.TrabajoGrado.Id,
                    limit: 0
                  });
                  poluxRequest.get("detalle_pasantia", parametrosVinculado)
                    .then(function(dataExterno) {
                      if (dataExterno.data != null) {
                        var temp = dataExterno.data[0].Observaciones.split(" y dirigida por ");
                        temp = temp[1].split(" con número de identificacion ");
                        detalle.Descripcion = temp[0];
                        detalle.documentoExterno = temp[1];
                        defer.resolve();
                      } else {
                        defer.reject("No hay datos relacionados al director externo");
                      }
                    })
                    .catch(function(error) {
                      defer.reject(error);
                    });
                  return defer.promise;
                }

                angular.forEach(ctrl.detallesSolicitud, function(detalle) {
                  ctrl.todoDetalles.push(detalle);
                  detalle.filas = [];
                  var id = detalle.DetalleTipoSolicitud.Detalle.Id
                  if (id === 49) {
                    detalle.Descripcion = detalle.Descripcion.split("-")[1];
                  } else if (id === 9 || id === 14 || id === 15 || id === 16 || id === 17 || id === 48 || id === 37 || id === 56 || id === 57 || id === 58) {
                    if (detalle.Descripcion != "No solicita") {
                      promises.push(getDocente(id, detalle));
                    }
                  } else if (id == 61) {
                    promises.push(getDocentes(detalle));
                  } else if (id == 39) {
                    //detalle de director externo anterior
                    promises.push(getExterno(detalle));
                  } else if (detalle.Descripcion.includes("JSON-")) {
                    if (detalle.DetalleTipoSolicitud.Detalle.Id === 8) {
                      //areas de conocimiento
                      ctrl.areas = [];
                      var datosAreas = detalle.Descripcion.split("-");
                      datosAreas.splice(0, 1);
                      detalle.Descripcion = "";
                      angular.forEach(datosAreas, function(area) {
                        ctrl.areas.push(JSON.parse(area).Id);
                        detalle.Descripcion = detalle.Descripcion + ", " + JSON.parse(area).Nombre;
                      });
                      detalle.Descripcion = detalle.Descripcion.substring(2);
                    } else if (detalle.DetalleTipoSolicitud.Detalle.Id === 22) {
                      //materias
                      var datosMaterias = detalle.Descripcion.split("-");
                      detalle.carrera = JSON.parse(datosMaterias[1]);
                      datosMaterias.splice(0, 2);
                      angular.forEach(datosMaterias, function(materia) {
                        detalle.filas.push(JSON.parse(materia));
                        console.log(materia);
                      });

                      detalle.gridOptions = [];
                      detalle.gridOptions.columnDefs = [{
                        name: 'CodigoAsignatura',
                        displayName: $translate.instant('CODIGO_MATERIA'),
                        width: '30%',
                      }, {
                        name: 'Nombre',
                        displayName: $translate.instant('NOMBRE'),
                        width: '50%',
                      }, {
                        name: 'Creditos',
                        displayName: $translate.instant('CREDITOS'),
                        width: '20%',
                      }];
                      detalle.gridOptions.data = detalle.filas;
                    }
                  }
                  // Si la solicitud tiene un detalle con id 56 es por que tiene codirector
                  if (id === 56) {
                    ctrl.tieneCoDirector = true;
                  }
                });
                $q.all(promises).then(function() {
                    console.log(ctrl.todoDetalles);
                    ctrl.detallesSolicitud.solicitantes = solicitantes.substring(2);
                    defered.resolve(ctrl.detallesSolicitud);
                  })
                  .catch(function(error) {
                    ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DATOS_SOLICITUD");
                    defered.reject(error);
                  });
              })
              .catch(function(error) {
                ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DATOS_ESTUDIANTES");
                defered.reject(error);
              });
          })
          .catch(function(error) {
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DETALLES_SOLICITUD");
            defered.reject(error);
          });
        return promise;
      };

      /**
       * @ngdoc method
       * @name evaluarSolicitud
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si se cumple la consulta para evaluar la solicitud
       * @description 
       * Verifica el tipo de solicitud y guarda sus datos, si la solicitud no es de tipo de materias de posgrado consulta los docentes disponibles 
       * para dirigir trabajos de grado del servicio docentes_tg de {@link services/academicaService.service:academicaRequest academicaRequest}.
       */
      ctrl.evaluarSolicitud = function() {
        var defer = $q.defer();
        var promise = defer.promise;
        ctrl.dataSolicitud.TipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id;
        ctrl.dataSolicitud.NombreTipoSolicitud = ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Nombre;
        ctrl.dataSolicitud.NombreModalidad = ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Nombre;
        ctrl.dataSolicitud.modalidad = ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id;
        console.log(ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id);
        if (ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id === 2) {
          if (ctrl.dataSolicitud.modalidad !== 2 && ctrl.dataSolicitud.modalidad !== 3) {
            ctrl.isInicial = true;
            //Si no es de materias de posgrado y profundización trae los docentes
            academicaRequest.get("docentes_tg").then(function(docentes) {
                if (!angular.isUndefined(docentes.data.docentesTg.docente)) {
                  ctrl.docentes = docentes.data.docentesTg.docente;
                  defer.resolve(ctrl.docentes);
                }
              })
              .catch(function(error) {
                ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DOCENTES");
                defer.reject(error);
              });
            if (ctrl.dataSolicitud.modalidad === 1) {
              ctrl.isPasantia = true;
            }
          } else {
            defer.resolve(ctrl.dataSolicitud.modalidad);
          }
        } else if (ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id === 4 || ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id === 10 || ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id === 12) {
          ctrl.isCambio = true;
          academicaRequest.get("docentes_tg").then(function(docentes) {
              if (!angular.isUndefined(docentes.data.docentesTg.docente)) {
                ctrl.docentes = docentes.data.docentesTg.docente;
                defer.resolve(ctrl.docentes);
              }
            })
            .catch(function(error) {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DOCENTES");
              defer.reject(error);
            });
        } else if (ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id === 13 || ctrl.dataSolicitud.ModalidadTipoSolicitud.TipoSolicitud.Id === 6) {
          ctrl.isRevision = true;
          academicaRequest.get("docentes_tg").then(function(docentes) {
              if (!angular.isUndefined(docentes.data.docentesTg.docente)) {
                ctrl.docentes = docentes.data.docentesTg.docente;
                defer.resolve(ctrl.docentes);
              }
            })
            .catch(function(error) {
              ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_DOCENTES");
              defer.reject(error);
            });
        } else {
          defer.resolve(ctrl.dataSolicitud.modalidad);
        }
        return promise;
      };

      /**
       * @ngdoc method
       * @name getEvaluadores
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {Object} solicitud Objeto de tipo solicitud
       * @returns {Promise} Objeto de tipo promesa que indica si se cumple la consulta para traer los evaluadores vinculados
       * @description 
       * Función que llama al servicio {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest} para
       * consultar el número de evaluadores máximo que puede tener la modalidad.
       */
      ctrl.getEvaluadores = function(solicitud) {
        var defer = $q.defer();
        poluxMidRequest.post("evaluadores/ObtenerEvaluadores", solicitud).then(function(response) {
            ctrl.evaluadoresInicial = new Array(parseInt(response.data.cantidad_evaluadores));
            for (var i = 0; i < ctrl.evaluadoresInicial.length; i++) {
              var label = (ctrl.evaluadoresInicial.length > 1) ? $translate.instant('SELECT.EVALUADOR_NUMERO', {
                numero: (i + 1)
              }) : $translate.instant('SELECT.DOCENTE_REVISOR');
              ctrl.evaluadoresInicial[i] = {
                indice: i + 1,
                label: label,
              };
            }
            ctrl.hasRevisor = ctrl.evaluadoresInicial.length > 0;
            defer.resolve(ctrl.evaluadoresInicial);
          })
          .catch(function(error) {
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_EVALUADORES");
            defer.reject(error);
          });
        return defer.promise;
      };

      /**
       * @ngdoc method
       * @name docenteVinculado
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {Object} vinculados Docentes vinculados al trabajo de grado
       * @param {Object} docente Documento del docente que se confronta para ver si se encuentra vinculado
       * @returns {Boolean} Indicador que define si el docente tiene vinculación a la solicitud de trabajo de grado
       * @description 
       * Verifica si un docente se encuentra vinculado al trabajo de grado de un estudiante
       */
      ctrl.docenteVinculado = function(vinculados, docente) {
        var esta = false;
        angular.forEach(vinculados, function(vinculado) {
          if (vinculado.Usuario == docente) {
            esta = true;
          }
        });
        return esta;
      };

      var parametrosSolicitud = $.param({
        query: "Id:" + ctrl.solicitud,
        limit: 1
      });
      poluxRequest.get("solicitud_trabajo_grado", parametrosSolicitud).then(function(responseSolicitud) {
          if (responseSolicitud.data != null) {
            var parametrosDetallesSolicitud = $.param({
              query: "SolicitudTrabajoGrado.Id:" + ctrl.solicitud,
              limit: 0
            });
            ctrl.mensajeNoAprobar = $translate.instant('ERROR') + ':';

            ctrl.dataSolicitud = responseSolicitud.data[0];
            var promises = [];
            promises.push(ctrl.getDetallesSolicitud(parametrosDetallesSolicitud));
            promises.push(ctrl.evaluarSolicitud());
            promises.push(ctrl.getEvaluadores(ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id));
            promises.push(ctrl.getCarrerasCoordinador());
            promises.push(ctrl.getRespuestaSolicitud());
            //obtener fechas de aprobación para la solicitud
            promises.push(ctrl.getFechasAprobacion(responseSolicitud.data[0].ModalidadTipoSolicitud.Id));
            $q.all(promises).then(function() {
                if (ctrl.dataSolicitud.TrabajoGrado !== null) {
                  var parametrosVinculacion = $.param({
                    query: "Activo:true,TrabajoGrado:" + ctrl.dataSolicitud.TrabajoGrado.Id,
                    limit: 0
                  });
                  poluxRequest.get("vinculacion_trabajo_grado", parametrosVinculacion).then(function(docentesVinculados) {
                      if (docentesVinculados.data !== null) {
                        var vinculados = [];
                        ctrl.docentesVinculadosTg = docentesVinculados.data;
                        angular.forEach(ctrl.docentes, function(docente) {
                          if (ctrl.docenteVinculado(docentesVinculados.data, docente.id)) {
                            console.log("vinculado", docente);
                            vinculados.push(docente);
                          }
                        });
                        angular.forEach(vinculados, function(docente) {
                          var index = ctrl.docentes.indexOf(docente);
                          ctrl.docentes.splice(index, 1);
                        });
                        $scope.loadSolicitud = false;
                      } else {
                        $scope.loadSolicitud = false;
                      }
                    })
                    .catch(function(error) {
                      console.log(error);
                      ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.CARGAR_VINCULADOS_TRABAJO_GRADO");
                      ctrl.errorCargarSolicitud = true;
                      $scope.loadSolicitud = false;
                    });
                } else {
                  $scope.loadSolicitud = false;
                }
              })
              .catch(function(error) {
                console.log(error);
                ctrl.errorCargarSolicitud = true;
                $scope.loadSolicitud = false;
              });
          } else {
            ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.SOLICITUD_NO_ENCONTRADA");
            ctrl.errorCargarSolicitud = true;
            $scope.loadSolicitud = false;
          }
        })
        .catch(function(error) {
          console.log(error);
          ctrl.mensajeErrorCargaSolicitud = $translate.instant("ERROR.SOLICITUD_NO_ENCONTRADA");
          ctrl.errorCargarSolicitud = true;
          $scope.loadSolicitud = false;
        });

      /**
       * @ngdoc method
       * @name responder
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Crea la data necesaria para responder la solicitud y la envía al servicio post de 
       * {@link services/poluxMidService.service/poluxMidRequest poluxMidRequest} para realizar la transacción correspondiente.
       */
      ctrl.responder = function() {
        var fechaRespuesta = new Date();
        var errorDocente = false;
        //se desactiva respuesta anterior
        var objRtaAnterior = ctrl.respuestaActual;
        objRtaAnterior.Activo = false;
        //data respuesta nueva
        var objRtaNueva = {
          "Id": null,
          "Fecha": fechaRespuesta,
          "Justificacion": ctrl.justificacion,
          "EnteResponsable": 0,
          "Usuario": $scope.userId,
          "Activo": true,
          "EstadoSolicitud": {
            "Id": Number(ctrl.respuestaSolicitud),
          },
          "SolicitudTrabajoGrado": {
            "Id": Number(ctrl.solicitud)
          }
        }

        var anio = ctrl.detallesSolicitud.PeriodoAcademico.split('-')[0];
        var periodo = ctrl.detallesSolicitud.PeriodoAcademico.split('-')[1];

        if (ctrl.acta.id != null) {
          var data_documento = {
            "DocumentoEscrito": {
              "Id": ctrl.acta.id,
            },
            "SolicitudTrabajoGrado": {
              "Id": Number(ctrl.solicitud)
            }
          }

          ctrl.dataRespuesta = {
            RespuestaAnterior: objRtaAnterior,
            RespuestaNueva: objRtaNueva,
            DocumentoSolicitud: data_documento,
            TipoSolicitud: ctrl.respuestaActual.SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
            Vinculaciones: null,
            EstudianteTrabajoGrado: null,
            VinculacionesCancelacion: null,
            TrTrabajoGrado: null,
            ModalidadTipoSolicitud: ctrl.detallesSolicitud.tipoSolicitud,
            TrabajoGrado: null,
            SolicitudTrabajoGrado: null,
            EspaciosAcademicos: null,
            DetallesPasantia: null,
            TrRevision: null,
          };
          //solicitud aprobada
          if (ctrl.respuestaSolicitud == 3) {
            //solicitud aprobada
            //se recorren los detalles y se obtienen los nombres de las nuevas vinculaciones
            angular.forEach(ctrl.todoDetalles, function(detalle) {
              if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Director Actual") {
                var aux = detalle.Descripcion.split(" ");
                ctrl.directorActual = Number(aux[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Director Nuevo") {
                var aux = detalle.Descripcion.split(" ");
                ctrl.directorNuevo = Number(aux[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Evaluador Actual") {
                var aux = detalle.Descripcion.split(" ");
                ctrl.evaluadorActual = Number(aux[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Evaluador Nuevo") {
                var aux = detalle.Descripcion.split(" ");
                ctrl.evaluadorNuevo = Number(aux[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.Enunciado == "ESCRIBA_NOMBRE_NUEVO_PROPUESTA") {
                ctrl.tituloNuevo = detalle.Descripcion;
              } else if (detalle.DetalleTipoSolicitud.Detalle.Id == 23) {
                //Para obtener la asignatura Actual
                ctrl.asignaturaActual = Number(detalle.Descripcion.split("-")[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.Id == 24) {
                //Para obtener la asignatura Nueva
                ctrl.asignaturaNueva = Number(detalle.Descripcion.split("-")[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.Id == 39) {
                //Director externo anterior
                ctrl.directorExternoActual = Number(detalle.documentoExterno);
              } else if (detalle.DetalleTipoSolicitud.Detalle.Id == 40) {
                //Nombre del nuevo director Externo
                ctrl.nombreDirectorExternoNuevo = detalle.Descripcion;
              } else if (detalle.DetalleTipoSolicitud.Detalle.Id == 55) {
                //Documento del nuevo director Externo
                ctrl.docenteCambio = {
                  id: detalle.Descripcion,
                }
              } else if (detalle.DetalleTipoSolicitud.Detalle.Id == 57) {
                //Documento del codirector
                var aux = detalle.Descripcion.split(" ");
                ctrl.codirector = Number(aux[0]);
              } else if (detalle.DetalleTipoSolicitud.Detalle.Id == 59 || detalle.DetalleTipoSolicitud.Detalle.Id == 60) {
                //Documento de propuesta final si el detalle es documennto fila o evidencias de publicación
                ctrl.docPropuestaFinal = detalle.Descripcion;
              }
            });

            //funcion para cambiar vinculaciones
            var addVinculacion = function(vinculaciones, documentoActual, documentoNuevo) {
              var vinculacionActual = [];
              angular.forEach(ctrl.docentesVinculadosTg, function(docenteVinculado) {
                if (docenteVinculado.Usuario === Number(documentoActual)) {
                  vinculacionActual = docenteVinculado;
                }
              });
              var nuevaVinculacion = angular.copy(vinculacionActual);
              //actualizar vinculacion actual
              vinculacionActual.Activo = false;
              vinculacionActual.FechaFin = fechaRespuesta;
              //nueva vinculacion
              nuevaVinculacion.Id = null;
              nuevaVinculacion.Usuario = Number(documentoNuevo);
              nuevaVinculacion.FechaInicio = fechaRespuesta;
              //nuevaVinculacion.FechaFin=null;
              vinculaciones.push(vinculacionActual);
              vinculaciones.push(nuevaVinculacion);
            }
            //Se verifica por tipo de solicitud
            if (ctrl.dataSolicitud.TipoSolicitud == 2) {
              //solicitud inicial
              //solicitud espacios académicos de posgrado o solicitud espacios académicos de profundización
              if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 13 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 16) {
                //La solicitud solo se aprueba para que siga el curso
                /*var data_trabajo_grado = {};
                var data_estudiantes = [];
                var otro = {};
                var estudiante = {};
                var solicitudInicial = {};
                angular.forEach(ctrl.detallesSolicitud, function(detalle) {
                    if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Estudiantes") {
                        otro.Estudiantes = detalle.Descripcion;
                    }
                });
                data_trabajo_grado = {
                    "Titulo": ctrl.detallesSolicitud.tipoSolicitud.Modalidad.Nombre,
                    "Modalidad": {
                        "Id": ctrl.detallesSolicitud.tipoSolicitud.Modalidad.Id
                    },
                    "EstadoTrabajoGrado": {
                        "Id": 1
                    },
                    "DistincionTrabajoGrado": null
                }
                estudiante = {
                    "Estudiante": otro.Estudiantes,
                    "TrabajoGrado": {
                        "Id": 0
                    },
                    "EstadoEstudianteTrabajoGrado": {
                        "Id": 1
                    }
                }
                console.log(estudiante);
                data_estudiantes.push(estudiante);
                console.log(data_estudiantes);
                ctrl.trabajo_grado = {
                    TrabajoGrado: data_trabajo_grado,
                    EstudianteTrabajoGrado: data_estudiantes,
                    DocumentoEscrito: null,
                    DocumentoTrabajoGrado: null,
                    AreasTrabajoGrado: null,
                    VinculacionTrabajoGrado: null
                }
                console.log(ctrl.trabajo_grado);
                ctrl.rtaSol = {
                    RespuestaAnterior: objRtaAnterior,
                    RespuestaNueva: objRtaNueva,
                    DocumentoSolicitud: data_documento,
                    TipoSolicitud: ctrl.respuestaActual.data[0].SolicitudTrabajoGrado.ModalidadTipoSolicitud.TipoSolicitud,
                    Vinculaciones: null,
                    EstudianteTrabajoGrado: null,
                    TrTrabajoGrado: ctrl.trabajo_grado,
                    ModalidadTipoSolicitud: ctrl.detallesSolicitud.tipoSolicitud
                };
                */
              } else if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 2 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 20 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 46 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 38 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 55 || ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 28) {
                //Pasantia, Monografia, Proyecto de emprendimento, Creación e Interpretación, Producción académica
                //se obtienen datos para crear el trabajo
                var tempTrabajo = {};
                angular.forEach(ctrl.detallesSolicitud, function(detalle) {
                  if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Nombre propuesta") {
                    tempTrabajo.Titulo = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Estudiantes") {
                    tempTrabajo.Estudiantes = detalle.Descripcion.split(',');
                  } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Propuesta" ||
                    detalle.DetalleTipoSolicitud.Detalle.Nombre == "Plan de actividades de investigación" ||
                    detalle.DetalleTipoSolicitud.Detalle.Nombre == "Plan o modelo de negocios") {
                    tempTrabajo.Enlace = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Resumen propuesta") {
                    tempTrabajo.Resumen = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Áreas de conocimiento") {
                    tempTrabajo.Areas = ctrl.areas;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Nombre Empresa") {
                    tempTrabajo.Empresa = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Nombre del director externo") {
                    tempTrabajo.NombreDirectorExterno = detalle.Descripcion;
                  } else if (detalle.DetalleTipoSolicitud.Detalle.Nombre == "Documento del director externo") {
                    tempTrabajo.DocumentoDirectorExterno = detalle.Descripcion;
                  }
                });
                // por defecto el estado es En evaluación por revisor
                var estadoTrabajoGrado = 4;
                // si  la modalidad es de producción academica de una se vez se crea en estado listo para sustentar
                if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id == 8) {
                  estadoTrabajoGrado = 13;
                }
                // si la modalidad es de pasantia se crea en estado de espera de ARL id 21
                if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id == 1) {
                  //estadoTrabajoGrado = 5;
                  estadoTrabajoGrado = 21;
                }
                if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id == 6) {
                  // Si la modalidad es creación o interpretación el trabajo de grado  se crea en estado en curso
                  //KB 26100
                  estadoTrabajoGrado = 13;
                }
                //data para crear el trabajo de grado
                var data_trabajo_grado = {
                  "Titulo": tempTrabajo.Titulo,
                  "Modalidad": {
                    "Id": ctrl.detallesSolicitud.tipoSolicitud.Modalidad.Id
                  },
                  "EstadoTrabajoGrado": {
                    "Id": estadoTrabajoGrado,
                  },
                  "DistincionTrabajoGrado": null,
                  "PeriodoAcademico": ctrl.detallesSolicitud.PeriodoAcademico,
                }
                //se agregan estudiantes
                var estudiante = {};
                var data_estudiantes = [];
                angular.forEach(tempTrabajo.Estudiantes, function(est) {
                  estudiante = {
                    "Estudiante": est,
                    "TrabajoGrado": {
                      "Id": 0
                    },
                    "EstadoEstudianteTrabajoGrado": {
                      "Id": 1
                    }
                  }
                  data_estudiantes.push(estudiante);
                });
                //Se crea la data para el documento de propuesta
                var data_propuesta = {
                  "Titulo": tempTrabajo.Titulo,
                  "Enlace": tempTrabajo.Enlace,
                  "Resumen": tempTrabajo.Resumen,
                  "TipoDocumentoEscrito": 3
                }
                //SI la modalidad es la de producción academica se sube de una vez como propuesta el documento
                if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id == 8) {
                  data_propuesta.TipoDocumentoEscrito = 4;
                }
                //SI la modalidad es la de creación sube de una vez como propuesta el documento
                if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id == 6) {
                  data_propuesta.TipoDocumentoEscrito = 4;
                }
                var data_documento_tg = {
                  "TrabajoGrado": {
                    "Id": 0
                  },
                  "DocumentoEscrito": {
                    "Id": 0
                  }
                }
                //se agregan las areaSnies
                var data_areas = [];
                angular.forEach(ctrl.areas, function(area) {
                  data_areas.push({
                    "AreaConocimiento": {
                      "Id": Number(area)
                    },
                    "TrabajoGrado": {
                      "Id": 0
                    },
                    "Activo": true,
                  });
                });
                // se agregan las vinculaciones del tg
                var vinculacion = {};
                var data_vinculacion = [];
                // docente director
                vinculacion = {
                  "Usuario": Number(ctrl.docenteDirector.id),
                  "Activo": true,
                  "FechaInicio": fechaRespuesta,
                  //"FechaFin": null,
                  "RolTrabajoGrado": {
                    "Id": 1
                  },
                  "TrabajoGrado": {
                    "Id": 0
                  }
                }
                data_vinculacion.push(vinculacion);
                //verificar que el docente no este repetido
                var vinculados = [];
                vinculados.push(ctrl.docenteDirector.id);
                // docente codirector
                // Si la opción del docente codirector esta activada se agrega la vinculacion
                if (ctrl.switchCodirector) {
                  if (ctrl.docenteCoDirector.id != ctrl.docenteDirector.id) {
                    data_vinculacion.push({
                      "Usuario": Number(ctrl.docenteCoDirector.id),
                      "Activo": true,
                      "FechaInicio": fechaRespuesta,
                      //"FechaFin": null,
                      // Rol de codirector
                      "RolTrabajoGrado": {
                        "Id": 4
                      },
                      "TrabajoGrado": {
                        "Id": 0
                      }
                    });
                    vinculados.push(ctrl.docenteCoDirector.id)
                  } else {
                    errorDocente = true;
                  }
                }
                // evaluadores
                angular.forEach(ctrl.evaluadoresInicial, function(docente) {
                  vinculacion = {
                    "Usuario": Number(docente.docente.id),
                    "Activo": true,
                    "FechaInicio": fechaRespuesta,
                    //"FechaFin": null,
                    "RolTrabajoGrado": {
                      "Id": 3
                    },
                    "TrabajoGrado": {
                      "Id": 0
                    }
                  };
                  data_vinculacion.push(vinculacion);
                  if (vinculados.includes(docente.docente.id)) {
                    errorDocente = true;
                  } else {
                    vinculados.push(docente.docente.id);
                  }
                });
                //data para las asignaturas_trabajo_grado
                var data_asignaturasTrabajoGrado = [];
                //Para asignatura tg1
                data_asignaturasTrabajoGrado.push({
                  "CodigoAsignatura": 1,
                  "Periodo": parseInt(periodo),
                  "Anio": parseInt(anio),
                  "Calificacion": 0,
                  "TrabajoGrado": {
                    "Id": 0
                  },
                  "EstadoAsignaturaTrabajoGrado": {
                    "Id": 1,
                  }
                });
                //Para asignatura tg2
                data_asignaturasTrabajoGrado.push({
                  "CodigoAsignatura": 2,
                  "Periodo": parseInt(periodo),
                  "Anio": parseInt(anio),
                  "Calificacion": 0,
                  "TrabajoGrado": {
                    "Id": 0
                  },
                  "EstadoAsignaturaTrabajoGrado": {
                    "Id": 1,
                  }
                });
                //Si la solicitud es de pasantia se crea el detalle y se almacena en la data y se agregan a las vinculaciones el docente director externo
                if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Id == 2) {
                  ctrl.dataRespuesta.DetallesPasantia = {
                    Empresa: 0,
                    Horas: 0,
                    ObjetoContrato: "Contrato de aprendizaje",
                    Observaciones: "Pasantia realizada en " + tempTrabajo.Empresa + " y dirigida por " + tempTrabajo.NombreDirectorExterno + " con número de identificacion " + tempTrabajo.DocumentoDirectorExterno,
                    TrabajoGrado: {
                      Id: 0,
                    }
                  }
                  //Docente director
                  data_vinculacion.push({
                    "Usuario": Number(tempTrabajo.DocumentoDirectorExterno),
                    "Activo": true,
                    "FechaInicio": fechaRespuesta,
                    //"FechaFin": null,
                    "RolTrabajoGrado": {
                      "Id": 2
                    },
                    "TrabajoGrado": {
                      "Id": 0
                    }
                  });
                }
                ctrl.trabajo_grado = {
                  TrabajoGrado: data_trabajo_grado,
                  EstudianteTrabajoGrado: data_estudiantes,
                  DocumentoEscrito: data_propuesta,
                  DocumentoTrabajoGrado: data_documento_tg,
                  AreasTrabajoGrado: data_areas,
                  VinculacionTrabajoGrado: data_vinculacion,
                  AsignaturasTrabajoGRado: data_asignaturasTrabajoGrado
                }
                var solicitudInicial = ctrl.respuestaActual.SolicitudTrabajoGrado;
                solicitudInicial.TrabajoGrado = {
                  "Id": 0
                }
                //se guarda data de la respuesta
                ctrl.dataRespuesta.TrTrabajoGrado = ctrl.trabajo_grado;
                ctrl.dataRespuesta.SolicitudTrabajoGrado = solicitudInicial;
              }
            } else if (ctrl.dataSolicitud.TipoSolicitud == 4 || ctrl.dataSolicitud.TipoSolicitud == 10 || ctrl.dataSolicitud.TipoSolicitud == 5 || ctrl.dataSolicitud.TipoSolicitud == 12) {
              //cambio de director interno, codirector o evaluadores
              // 5 cambio de director externo
              var vinculaciones = [];
              var vinculacionActual = [];
              angular.forEach(ctrl.docentesVinculadosTg, function(docenteVinculado) {
                if (docenteVinculado.Usuario === ctrl.directorActual) {
                  vinculacionActual = docenteVinculado;
                } else if (docenteVinculado.Usuario === ctrl.evaluadorActual) {
                  vinculacionActual = docenteVinculado;
                } else if (docenteVinculado.Usuario === Number(ctrl.directorExternoActual)) {
                  vinculacionActual = docenteVinculado;
                } else if (docenteVinculado.Usuario === Number(ctrl.codirector)) {
                  vinculacionActual = docenteVinculado;
                } else if (docenteVinculado.Usuario === Number(ctrl.directorExternoActual)) {
                  vinculacionActual = docenteVinculado;
                }
              });
              var nuevaVinculacion = angular.copy(vinculacionActual);
              //actualizar vinculacion actual
              vinculacionActual.Activo = false;
              vinculacionActual.FechaFin = fechaRespuesta;
              //nueva vinculacion
              nuevaVinculacion.Id = null;
              nuevaVinculacion.Usuario = Number(ctrl.docenteCambio.id);
              nuevaVinculacion.FechaInicio = fechaRespuesta;
              //nuevaVinculacion.FechaFin=null;
              vinculaciones.push(vinculacionActual);
              vinculaciones.push(nuevaVinculacion);
              //Esperar a que se cumplan las promesas
              console.log(vinculaciones);
              //Se escribe la data de las vinculaciones
              ctrl.dataRespuesta.Vinculaciones = vinculaciones;
              //Si la solicitud es de cambio de director externo se envia el detalle de la pasantia para actualizarlo
              if (ctrl.dataSolicitud.TipoSolicitud == 5) {
                ctrl.dataRespuesta.DetallesPasantia = {
                  Empresa: 0,
                  Horas: 0,
                  ObjetoContrato: "Contrato de aprendizaje",
                  Observaciones: " y dirigida por " + ctrl.nombreDirectorExternoNuevo + " con número de identificacion " + ctrl.docenteCambio.id,
                  TrabajoGrado: {
                    Id: nuevaVinculacion.TrabajoGrado.Id,
                  }
                }
              }
            } else if (ctrl.dataSolicitud.TipoSolicitud == 3) {
              //solicitud de cancelacion de modalidad
              //se crea data del estudiante
              var dataEstudianteTg = {
                "Estudiante": ctrl.detallesSolicitud.solicitantes,
                "TrabajoGrado": ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado,
                "EstadoEstudianteTrabajoGrado": {
                  "Id": 2,
                },
              }
              //Se cambia la fecha de finalización de los vinculados
              angular.forEach(ctrl.docentesVinculadosTg, function(docente) {
                docente.FechaFin = fechaRespuesta;
              });
              console.log(ctrl.docentesVinculadosTg);
              ctrl.dataRespuesta.VinculacionesCancelacion = ctrl.docentesVinculadosTg;
              ctrl.dataRespuesta.EstudianteTrabajoGrado = dataEstudianteTg;
            } else if (ctrl.dataSolicitud.TipoSolicitud == 8) {
              //solicitud de cambio titulo de trabajo de grado
              var tgTemp = ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado;
              //Se cambia el titulo
              tgTemp.Titulo = ctrl.tituloNuevo;
              ctrl.dataRespuesta.TrabajoGrado = tgTemp;
            } else if (ctrl.dataSolicitud.TipoSolicitud == 9) {
              //solicitud de cambio de materia
              var espacios = [];
              //Asignatura vieja
              espacios.push({
                "Nota": 0,
                "EspaciosAcademicosElegibles": {
                  "Id": 0,
                  "CodigoAsignatura": ctrl.asignaturaActual,
                },
                "EstadoEspacioAcademicoInscrito": {
                  "Id": 2
                },
                "TrabajoGrado": ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado,
              });
              //Asignatura Nueva
              espacios.push({
                "Nota": 0,
                "EspaciosAcademicosElegibles": {
                  "Id": 0,
                  "CodigoAsignatura": ctrl.asignaturaNueva,
                },
                "EstadoEspacioAcademicoInscrito": {
                  "Id": 1
                },
                "TrabajoGrado": ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado,
              });
              ctrl.dataRespuesta.EspaciosAcademicos = espacios;
              console.log("Espacios", ctrl.dataRespuesta.EspaciosAcademicos);
            } else if (ctrl.dataSolicitud.TipoSolicitud == 13) {
              //Solicitud de revisión de tg
              var data_tg = ctrl.respuestaActual.SolicitudTrabajoGrado.TrabajoGrado;
              //trabajo de grado en revisión id 15
              data_tg.EstadoTrabajoGrado = {
                Id: 15
              };
              if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id == 8) {
                // Si la modalidad es producción academica el trabajo de grado de una vez pasa a listo para sustentar
                data_tg.EstadoTrabajoGrado.Id = 17;
              }
              if (ctrl.dataSolicitud.ModalidadTipoSolicitud.Modalidad.Id == 6) {
                // Si la modalidad es creación o interpretación el trabajo de grado de una vez pasa a listo para sustentar
                //KB 26100
                data_tg.EstadoTrabajoGrado.Id = 17;
              }
              //Vinculaciones del tg
              var data_vinculaciones = [];
              //Si se escogio cambiar la vinculación
              if (ctrl.switchRevision) {
                //Si se cambio el  director original
                if (ctrl.directorOpcionTg.id != ctrl.directorActualTg.id) {
                  //Cambiar vinculaciones
                  // console.log("Cambia director");
                  addVinculacion(data_vinculaciones, ctrl.directorActualTg.id, ctrl.directorOpcionTg.id);
                }
                //Si se cambiaron los evaluadores actuales
                if (ctrl.evaluadoresActualesTg != undefined) {
                  for (var e = 0; e < ctrl.evaluadoresActualesTg.length; e++) {
                    if (ctrl.evaluadoresActualesTg[e].docente.id != ctrl.evaluadoresOpcionesTg[e].docente.id) {
                      //Cambiar vinculaciones                  
                      //console.log(ctrl.evaluadoresOpcionesTg[e].docente.id, ctrl.evaluadoresActualesTg[e].docente.id);
                      //console.log("Cambia evaluador"+(e+1));
                      addVinculacion(data_vinculaciones, ctrl.evaluadoresActualesTg[e].docente.id, ctrl.evaluadoresOpcionesTg[e].docente.id);
                    }
                  }
                  //console.log("Vinculaciones revisión", data_vinculaciones);
                  //buscar si hay algun valor repetido
                  angular.forEach(data_vinculaciones, function(vinculacion) {
                    if (data_vinculaciones.filter(function(value) {
                        return value.Usuario === vinculacion.Usuario
                      }).length > 1) {
                      errorDocente = true;
                    }
                  });
                }
              }
              //Documento escrito
              var data_documentoEscrito = {
                Id: 0,
                Titulo: data_tg.Titulo,
                Enlace: ctrl.docPropuestaFinal,
                Resumen: "Documento para revisión final del trabajo de grado",
                //Tipo documento 5 para revisión final
                TipoDocumentoEscrito: 5
              };
              var data_revision = {
                TrabajoGrado: data_tg,
                Vinculaciones: data_vinculaciones,
                DocumentoEscrito: data_documentoEscrito,
                DocumentoTrabajoGrado: {
                  Id: 0,
                  DocumentoEscrito: {
                    Id: 0,
                  },
                  TrabajoGrado: data_tg,
                }
              }
              ctrl.dataRespuesta.TrRevision = data_revision;
            } else if (ctrl.dataSolicitud.TipoSolicitud == 6) {
              //Solicitud de socialización
              //Vinculaciones del tg
              var data_vinculaciones = [];
              //Si se escogio cambiar las vinculaciones se cambian, el resto de la justificación va en la data
              if (ctrl.switchRevision) {
                //Si se cambio el  director original
                if (ctrl.directorOpcionTg.id != ctrl.directorActualTg.id) {
                  //Cambiar vinculaciones
                  addVinculacion(data_vinculaciones, ctrl.directorActualTg.id, ctrl.directorOpcionTg.id);
                }
                //Si se cambiaron los evaluadores actuales
                if (ctrl.evaluadoresActualesTg != undefined) {
                  for (var e = 0; e < ctrl.evaluadoresActualesTg.length; e++) {
                    if (ctrl.evaluadoresActualesTg[e].docente.id != ctrl.evaluadoresOpcionesTg[e].docente.id) {
                      //Cambiar vinculaciones                  
                      addVinculacion(data_vinculaciones, ctrl.evaluadoresActualesTg[e].docente.id, ctrl.evaluadoresOpcionesTg[e].docente.id);
                    }
                  }
                  //buscar si hay algun valor repetido
                  angular.forEach(data_vinculaciones, function(vinculacion) {
                    if (data_vinculaciones.filter(function(value) {
                        return value.Usuario === vinculacion.Usuario
                      }).length > 1) {
                      errorDocente = true;
                    }
                  });
                }
              } else {
                data_vinculaciones = null;
              }
              ctrl.dataRespuesta.Vinculaciones = data_vinculaciones;
            }
          }

          if (!errorDocente) {
            //console.log("envia", ctrl.dataRespuesta);
            poluxRequest.post("tr_respuesta_solicitud", ctrl.dataRespuesta).then(function(response) {
                ctrl.mostrarRespuesta(response);
              })
              .catch(function(error) {
                console.log(error);
                swal(
                  $translate.instant("ERROR"),
                  $translate.instant("ERROR.ENVIO_SOLICITUD"),
                  'warning'
                );
              });
          } else {
            swal(
              $translate.instant("ERROR"),
              $translate.instant("ERROR.DOCENTE_DUPLICADO"),
              'warning'
            );
          }
        } else {
          ctrl.mostrarRespuesta("SELECCIONE_ACTA");
        }
      }

      /**
       * @ngdoc method
       * @name mostrarRespuesta
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {object} response Respuesta que se mostrará
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que se encarga de mostrar el resultado de la transacción de responder solicitud.
       */
      ctrl.mostrarRespuesta = function(response) {
        if (response.data !== undefined) {
          if (response.data[0] == 'Success') {
            swal(
              $translate.instant("RESPUESTA_SOLICITUD"),
              $translate.instant("SOLICITUD_APROBADA"),
              'success'
            );
            $location.path("/solicitudes/listar_solicitudes");
          } else {
            if (Array.isArray(response.data)) {
              swal(
                $translate.instant("RESPUESTA_SOLICITUD"),
                $translate.instant(response.data[1]),
                'warning'
              );
            } else {
              swal(
                $translate.instant("RESPUESTA_SOLICITUD"),
                response.data,
                'warning'
              );
            }
          }
        } else {
          swal(
            $translate.instant("RESPUESTA_SOLICITUD"),
            $translate.instant(response),
            'warning'
          );
        }
      }

      /**
       * @ngdoc method
       * @name cargarJustificacion
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {function} callFunction Funcion que se ejecuta una vez se termina de cargar el documento
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Conecta el cliente de {@link services/poluxClienteApp.service:nuxeoService nuxeo} y crea la data del documento que se va a cargar y llama a la función cargar documento.
       */
      ctrl.cargarJustificacion = function(callFunction) {
        nuxeo.connect().then(function(client) {
          // OK, the returned client is connected
          console.log("CONECTADO");
          var tam = 2000;
          $scope.loadFormulario = true;
          var documento = ctrl.acta;
          if (documento.type !== "application/pdf" || documento.size > tam) {
            nuxeoClient.createDocument("ActaSolicitud" + ctrl.solicitud, "Acta de evaluación de la solicitud " + ctrl.solicitud, documento, 'Actas', function(url) {
                ctrl.urlActa = url;
              })
              .then(function() {
                ctrl.cargarRespuesta();
              }).catch(function(error) {
                ctrl.swalError();
                $scope.loadFormulario = false;
              });
          } else {
            ctrl.swalError();
            $scope.loadFormulario = false;
          }
        }, function(err) {
          // cannot connect
          ctrl.swalError();
        });

      };

      /**
       * @ngdoc method
       * @name swalError
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Enseña un mensaje de error al usuario de forma emergente
       */
      ctrl.swalError = function() {
        swal(
          $translate.instant("ERROR.SUBIR_DOCUMENTO"),
          $translate.instant("VERIFICAR_DOCUMENTO"),
          'warning'
        );
        $scope.loadFormulario = false;
      };

      /**
       * @ngdoc method
       * @name cargarRespuesta
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Enseña un mensaje de notificación al usuario de forma emergente
       */
      ctrl.cargarRespuesta = function() {
        swal(
          $translate.instant("ERROR.SUBIR_DOCUMENTO"),
          $translate.instant("VERIFICAR_DOCUMENTO"),
          'success'
        );
        $scope.loadFormulario = false;
      };

      /**
       * @ngdoc method
       * @name validarFormularioAprobacion
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Valida si el formulario de aprobación necesita cargar la justificación asociada a la solicitud
       */
      ctrl.validarFormularioAprobacion = function() {
        if (!ctrl.isInicial) {
          ctrl.cargarJustificacion();
        }
      };

      /**
       * @ngdoc method
       * @name obtenerDoc
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {number} docid Id del documento en {@link services/poluxClienteApp.service:nuxeoService nuxeo}
       * @returns {Promise} Objeto de tipo promesa que se resuelve con el documento o se rechaza con la excepción generada
       * @description 
       * Consulta un documento a {@link services/poluxClienteApp.service:nuxeoService nuxeo} y responde con el contenido.
       */
      ctrl.obtenerDoc = function(docid) {
        var defered = $q.defer();

        nuxeo.request('/id/' + docid)
          .get()
          .then(function(response) {
            ctrl.doc = response;
            //var aux=response.get('file:content');
            ctrl.document = response;
            defered.resolve(response);
          })
          .catch(function(error) {
            defered.reject(error)
          });
        return defered.promise;
      };

      /**
       * @ngdoc method
       * @name obtenerFetch
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {object} doc Documento de nuxeo al cual se le obtendrá el Blob
       * @returns {Promise} Objeto de tipo promesa que se resuelve con el Blob del documento o la excepción generada
       * @description 
       * Obtiene el blob de un documento
       */
      ctrl.obtenerFetch = function(doc) {
        var defered = $q.defer();

        doc.fetchBlob()
          .then(function(res) {
            defered.resolve(res.blob());

          })
          .catch(function(error) {
            defered.reject(error)
          });
        return defered.promise;
      };

      /**
       * @ngdoc method
       * @name getDocumento
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {number} docid Id del documento en {@link services/poluxClienteApp.service:nuxeoService nuxeo}
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Llama a la función obtenerDoc y obtenerFetch para descargar un documento de nuxeo y mostrarlo en una nueva ventana.
       */
      ctrl.getDocumento = function(docid) {
        nuxeoClient.getDocument(docid)
          .then(function(document) {
            $window.open(document.url);
          })
          .catch(function(error) {
            console.log("error", error);
            swal(
              $translate.instant("ERROR"),
              $translate.instant("ERROR.CARGAR_DOCUMENTO"),
              'warning'
            );
          });
      }

      /**
       * @ngdoc method
       * @name getDocumentos
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined no requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para consultar las 
       * actas subidas en las carreras del coordinador.
       */
      ctrl.getDocumentos = function() {
        // codigo para ejecutar consulta en nuxeo

        /*
        nuxeo.header('X-NXDocumentProperties', '*');
        nuxeo.operation('Document.Query')
            .params({
              query:"SELECT * FROM Document WHERE dc:title like 'ActasSolicitudes-20-%'",
            })
            .execute()
            .then(function(doc) {
                angular.forEach(doc.entries, function(documento){
                    ctrl.obtenerDoc(documento.uid).then(function(doc){
                        var tempDoc = {
                          "nombre":doc.get("file:content").name,
                          "url": doc.uid,
                          "documento":doc,
                        }
                        ctrl.documentos.push(tempDoc);
                    });
                });
            });
          */
        var sql = "";
        angular.forEach(ctrl.carrerasCoordinador, function(carrera) {
          sql = sql + ",Titulo.contains:Codigo de carrera: " + carrera.codigo_proyecto_curricular;

          var parametrosDocumentos = $.param({
            query: "TipoDocumentoEscrito:1" + sql,
            //query:"TipoDocumentoEscrito:1,Titulo.contains:Acta 12,Titulo.contains:Acta undefined",
            limit: 0
          });
          $scope.loadDocumento = true;
          poluxRequest.get("documento_escrito", parametrosDocumentos).then(function(responseDocumentos) {

              console.log(responseDocumentos);

              angular.forEach(responseDocumentos.data, function(documento) {
                console.log("documentos", documento);
                var tempDoc = {
                  "id": documento.Id,
                  "nombre": documento.Titulo,
                  "url": documento.Enlace,
                }
                ctrl.documentos.push(tempDoc);
              });
              $scope.loadDocumento = false;
            })
            .catch(function(error) {
              console.log(error);
              ctrl.errorCargarDocumento = true;
              $scope.loadDocumento = false;
            });
        });
      }

      /**
       * @ngdoc method
       * @name seleccionarDocumento
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined no requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que guarda el documento seleccionado por el usuario en el modalDocumento y lo cierra
       */
      ctrl.seleccionarDocumento = function() {
        if (ctrl.acta.url !== undefined) {
          $('#modalSeleccionarDocumento').modal('hide');
        } else {
          swal(
            $translate.instant("DOCUMENTO.SIN_DOCUMENTO"),
            ' ',
            'warning'
          );
        }
      }

      /**
       * @ngdoc method
       * @name modalDocumento
       * @methodOf poluxClienteApp.controller:SolicitudesAprobarSolicitudCtrl
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No retorna ningún valor
       * @description 
       * Función que muestra el modal que permite seleccionar un documento 
       */
      ctrl.modalDocumento = function() {
        ctrl.documentos = [];
        ctrl.getDocumentos();
        $('#modalSeleccionarDocumento').modal('show');
      }

    });