'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
 * @description
 * # MateriasPosgradoListarSolicitudesCtrl
 * Controller of the poluxClienteApp
 * Controlador de la vista de listar solicitudes, este controlador permite listar las solicitudes de estudiantes que han sido aceptadas en los pregrados y realizar el proceso de selección de admitidos al posgrado
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires $scope
 * @requires $q
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxMidService.service:poluxMidRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires uiGridConstants
 * @property {Array} periodo Colección de datos asociados al periodo de operación
 * @property {Object} gridOptionsAdmitidos Almacena las opciones del ui-grid de los estudiantes admitidos
 * @property {Object} gridOptionsopcionados Almacena las opciones del ui-grid de los estudiantes opcionados
 * @property {Object} gridOptionsNoAdmitidos Almacena las opciones del ui-grid de los estudiantes no admitidos
 * @property {Object} gridOptions opciones del grid que muestra todas las solicitudes
 * @property {Object} periodoAnterior Periodo anterior, año y periodo
 * @property {Object} periodoActual Periodo actual, año y periodo
 * @property {Object} carreras Carreras asociadas al coordinador
 * @property {boolean} permitirPrimeraFecha Flag para permitir realizar el proceso de selección en la primera fecha
 * @property {boolean} permitirSegundaFecha Flag para permitir realizar el proceso de selección en la segunda fecha
 * @property {Object} fechas Almacena las fechas correspondientes a la modaldiad de materias de posgrado
 * @property {number} cuposDisponibles Cantidad de cupos disponibles para selección de admitidos
 * @property {number} numeroAdmitidos Cantidad de personas seleccionadas como admitidos
 * @property {Object} sols Solicitudes de estudiantes
 * @property {String} mensajeError Mensaje que aparece en caso de haber un error durante la carga
 * @property {Object} primeraFecha Objeto que carga la información para la primera fecha de convocatoria
 * @property {Object} segundaFecha Objeto que carga la información para la segunda fecha de convocatoria
 * @property {Boolean} errorCargarParametros Indicador que maneja la aparición de un error durante la carga de parámetros iniciales
 * @property {Object} carrera Objeto que carga la información asociada a la carrera seleccionada
 * @property {Boolean} errorCargarSolicitudes Indicador que maneja la aparición de un error durante la carga de las solicitudes
 * @property {Array} opcionados Colección que maneja los opcionados durante la convocatoria
 * @property {Array} admitidos Colección que maneja los admitidos durante la convocatoria
 * @property {Array} noAdmitidos Colección que maneja los no admitidos durante la convocatoria
 * @property {Number} fecha Valor que define el número de convocatoria para las solicitudes
 * @property {Boolean} loadParametros Indicador que opera durante la carga de parámetros
 * @property {String} cargandoParametros Mensaje que aparece durante la carga de parámetros
 * @property {String} mensajeCargandoSolicitudes Mensaje que aparece durante la carga de las solicitudes
 * @property {String} cargandoRespuestas Mensaje que aparece durante la carga de las respuestas a las solicitudes
 * @property {String} userId Valor que carga el documento del usuario en sesión
 * @property {String} fechaActual Valor que carga la fecha en el momento de ejecución
 * @property {Boolean} loadSolicitudes Indicador que maneja la carga de las solicitudes en la vista
 * @property {String} mensajeErrorSolicitudes Texto que aparece en caso de haber un error en la carga de solicitudes
 * @property {Boolean} errorCargarSolicitudes Indicador que maneja la aparición de un error durante la carga de las solicitudes
 * @property {Boolean} loadRespuestas Indicador que maneja la carga de las respuestas a las solicitudes
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoListarSolicitudesCtrl',
    function($scope, $q, $translate, academicaRequest, poluxMidRequest, poluxRequest, token_service, sesionesRequest, uiGridConstants) {
      $scope.$ = $;

      $scope.loadParametros = true;
      $scope.cargandoParametros = $translate.instant("LOADING.CARGANDO_PARAMETROS");
      $scope.mensajeCargandoSolicitudes = $translate.instant("LOADING.CARGANDO_SOLICITUDES");
      $scope.cargandoRespuestas = $translate.instant('LOADING.REGISTRANDO_RESPUESTAS');

      var ctrl = this;

      ctrl.periodo = [];
      ctrl.carreras = [];
      ctrl.otro = [];
      //cedula coordinador
      //token_service.token.documento = "12237136";
      //$scope.userId = token_service.token.documento;
      $scope.userId = token_service.getAppPayload().appUserDocument;
      //uigrid
      ctrl.gridOptionsAdmitidos = {
        enableSorting: false,
      }

      ctrl.gridOptionsAdmitidos.columnDefs = [{
        name: 'estudiante',
        displayName: $translate.instant('CODIGO'),
        width: "20%"
      }, {
        name: 'nombre',
        displayName: $translate.instant('NOMBRE'),
        width: "40%"
      }, {
        name: 'promedio',
        displayName: $translate.instant('PROMEDIO'),
        width: "15%",
        sort: {
          direction: uiGridConstants.DESC,
          priority: 0
        }
      }, {
        name: 'rendimiento',
        displayName: $translate.instant('RENDIMIENTO'),
        width: "25%",
        sort: {
          direction: uiGridConstants.DESC,
          priority: 1
        }
      }, ];

      ctrl.gridOptionsOpcionados = JSON.parse(JSON.stringify(ctrl.gridOptionsAdmitidos));
      ctrl.gridOptionsNoAdmitidos = JSON.parse(JSON.stringify(ctrl.gridOptionsAdmitidos));

      ctrl.gridOptions = {
        enableSorting: false,
      };

      ctrl.gridOptions.columnDefs = [{
        name: 'solicitud',
        displayName: $translate.instant('SOLICITUD'),
        width: "7%"
      }, {
        name: 'fecha',
        displayName: $translate.instant('FECHA'),
        type: 'date',
        cellFilter: 'date:\'yyyy-MM-dd\'',
        width: "7%"
      }, {
        name: 'estudiante',
        displayName: $translate.instant('CODIGO'),
        width: "8%"
      }, {
        name: 'nombreCarrera',
        displayName: $translate.instant('CARRERA'),
        width: "10%"
      }, {
        name: 'nombre',
        displayName: $translate.instant('NOMBRE'),
        width: "15%"
      }, {
        name: 'promedio',
        displayName: $translate.instant('PROMEDIO'),
        width: "9%",
        sort: {
          direction: uiGridConstants.DESC,
          priority: 0
        }
      }, {
        name: 'porcentajeCursado',
        displayName: $translate.instant('PORCENTAJE_CURSADO'),
        width: "13%",
        sort: {
          direction: uiGridConstants.DESC,
          priority: 1
        }
      }, {
        name: 'rendimiento',
        displayName: $translate.instant('RENDIMIENTO'),
        width: "15%",
        sort: {
          direction: uiGridConstants.DESC,
          priority: 2
        }
      }, {
        name: 'estado.Nombre',
        displayName: $translate.instant('ESTADO_SIN_DOSPUNTOS'),
        width: "8%"
      }, {
        name: 'aprobar',
        displayName: $translate.instant('ADMITIR'),
        width: "8%",
        cellTemplate: '<center><div ng-if="grid.appScope.listarSolicitudes.permitirPrimeraFecha || grid.appScope.listarSolicitudes.permitirSegundaFecha"><md-checkbox class="blue" ng-model="row.entity.aprobado" ng-click="grid.appScope.listarSolicitudes.verificarDisponibilidad(row.entity)" aria-label="checkbox" ng-if="row.entity.permitirAprobar" > </md-checkbox> <div ng-if="!row.entity.permitirAprobar">{{"SOLICITUD_NO_PUEDE_APROBARSE"| translate}}</div></div><div ng-if="!grid.appScope.listarSolicitudes.permitirPrimeraFecha && !grid.appScope.listarSolicitudes.permitirSegundaFecha">{{"ACCION_NO_DISPONIBLE" | translate}}</div></center>',
      }];

      /**
       * @ngdoc method
       * @name getPeriodoAnterior
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Consulta el periodo anterior al actual consultando periodo_academico de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parametros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto Periodo anterior
       */
      ctrl.getPeriodoAnterior = function() {
        var defer = $q.defer()
        academicaRequest.get("periodo_academico", "P")
          .then(function(responsePeriodo) {
            if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
              ctrl.periodoAnterior = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
              console.log(ctrl.periodoAnterior);
              defer.resolve(ctrl.periodoAnterior);
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.SIN_PERIODO");
              defer.reject("sin periodo");
            }
          })
          .catch(function() {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_PERIODO");
            defer.reject("no se pudo cargar periodo");
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getPeriodoActual
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Consulta el periodo academico actual del servicio de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parametros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto Periodo actual
       */
      ctrl.getPeriodoActual = function() {
        var defer = $q.defer()
        academicaRequest.get("periodo_academico", "X")
          .then(function(responsePeriodo) {
            if (!angular.isUndefined(responsePeriodo.data.periodoAcademicoCollection.periodoAcademico)) {
              ctrl.periodo = responsePeriodo.data.periodoAcademicoCollection.periodoAcademico[0];
              defer.resolve(ctrl.periodo);
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.SIN_PERIODO");
              defer.reject("sin periodo");
            }
          })
          .catch(function() {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_PERIODO");
            defer.reject("no se pudo cargar periodo");
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name getCarrerasCoordinador
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Consulta las carreras asociadas al coordinador del servicio de {@link services/academicaService.service:academicaRequest academicaRequest}.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto carreras
       */
      ctrl.getCarrerasCoordinador = function() {
        var defer = $q.defer()
        academicaRequest.get("coordinador_carrera", [$scope.userId, "POSGRADO"])
          .then(function(responseCarreras) {
            console.log(responseCarreras);
            if (!angular.isUndefined(responseCarreras.data.coordinadorCollection.coordinador)) {
              ctrl.carreras = responseCarreras.data.coordinadorCollection.coordinador;
              defer.resolve(ctrl.carreras);
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.SIN_CARRERAS_POSGRADO");
              defer.reject("no hay carreras");
            }
          })
          .catch(function() {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CARRERAS");
            defer.reject("no se pudo cargar carreras")
          });
        return defer.promise
      }

      /**
       * @ngdoc method
       * @name getFechas
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Consulta las fechas para el proceso de selección de admitidos en {@link services/poluxClienteApp.service:sesionesService sesionesService}.
       * @param {Object} periodo Periodo en el cual se buscan las fechas vigentes
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto fechas
       */
      ctrl.getFechas = function(periodo) {
        var defer = $q.defer()
        $scope.fechaActual = moment(new Date()).format("YYYY-MM-DD HH:mm");
        //traer fechas
        var parametrosSesiones = $.param({
          query: "SesionPadre.periodo:" + periodo.anio + periodo.periodo,
          limit: 0
        });
        sesionesRequest.get("relacion_sesiones", parametrosSesiones).then(function(responseFechas) {
            if (responseFechas.data !== null) {
              ctrl.fechas = responseFechas.data;
              angular.forEach(ctrl.fechas, function(fecha) {
                //console.log(fecha.SesionHijo);
                var fechaInicio = new Date(fecha.SesionHijo.FechaInicio);
                fechaInicio.setTime(fechaInicio.getTime() + fechaInicio.getTimezoneOffset() * 60 * 1000);
                var fechaFin = new Date(fecha.SesionHijo.FechaFin);
                fechaFin.setTime(fechaFin.getTime() + fechaFin.getTimezoneOffset() * 60 * 1000);
                fecha.inicio = moment(fechaInicio).format("YYYY-MM-DD HH:mm");
                fecha.fin = moment(fechaFin).format("YYYY-MM-DD HH:mm");
                //fecha.inicio = moment(new Date(fecha.SesionHijo.FechaInicio)).format("YYYY-MM-DD HH:MM");
                //fecha.fin = moment(new Date(fecha.SesionHijo.FechaFin)).format("YYYY-MM-DD HH:MM");
                if (fecha.SesionHijo.TipoSesion.Id === 4) {
                  //primera fecha de selección de admitidos
                  ctrl.primeraFecha = fecha;
                  if (ctrl.primeraFecha.inicio <= $scope.fechaActual && ctrl.primeraFecha.fin >= $scope.fechaActual) {
                    ctrl.permitirPrimeraFecha = true;
                  }
                  //console.log(fecha.inicio, ctrl.primeraFecha.inicio<=$scope.fechaActual && ctrl.primeraFecha.fin>=$scope.fechaActual);
                } else if (fecha.SesionHijo.TipoSesion.Id === 6) {
                  //segunda fecha de selección de admitidos
                  ctrl.segundaFecha = fecha;
                  if (ctrl.segundaFecha.inicio <= $scope.fechaActual && ctrl.segundaFecha.fin >= $scope.fechaActual) {
                    ctrl.permitirSegundaFecha = true;
                  }
                }
              });

              defer.resolve(ctrl.fechas);
            } else {
              ctrl.mensajeError = $translate.instant("ERROR.SIN_FECHAS_MODALIDAD_POSGRADO");
              defer.reject("no hay fechas registradas");
            }
          })
          .catch(function() {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_FECHAS_MODALIDAD_POSGRADO");
            defer.reject("no se pudo cargar fechas")
          });
        return defer.promise
      }

      /**
       * @ngdoc method
       * @name getCupos
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Consulta el servicio de {@link services/poluxMidService.service:poluxMidRequest poluxMidRequest} para traer el número de cupos disponibles.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplio la petición y se resuleve con el objeto cuposDisponibles
       */
      ctrl.getCupos = function() {
        var defer = $q.defer();
        poluxMidRequest.get("cupos/Obtener").then(function(responseCupos) {
            //$scope.cupos_excelencia = response.data.Cupos_excelencia;
            //$scope.cupos_adicionales = response.data.Cupos_adicionales;
            ctrl.cuposDisponibles = responseCupos.data.Cupos_excelencia + responseCupos.data.Cupos_adicionales;
            ctrl.numeroAdmitidos = 0;
            defer.resolve(ctrl.cuposDisponibles);
          })
          .catch(function() {
            ctrl.mensajeError = $translate.instant("ERROR.CARGAR_CUPOS");
            defer.reject("no se pudo cargar fechas")
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name cargarParametros
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Llama a las funciones de getPeriodoActual, getPeriodoAnterior, getFechas, getCarrerasCoordinador, getCupos y los une en promesas, los rechaza en caso de que alguna sea rechazada.
       * @param {undefined} undefined No requiere parametros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cargarParametros = function() {
        ctrl.getPeriodoActual()
          .then(function(periodo) {
            console.log(periodo)
            if (!angular.isUndefined(periodo)) {
              var promises = [];
              promises.push(ctrl.getPeriodoAnterior());
              promises.push(ctrl.getFechas(periodo));
              promises.push(ctrl.getCarrerasCoordinador());
              promises.push(ctrl.getCupos());
              $q.all(promises)
                .then(function() {
                  console.log(periodo)
                  console.log(ctrl.fechas);
                  console.log(ctrl.carreras);
                  console.log("success");
                  $scope.loadParametros = false;
                })
                .catch(function(error) {
                  console.log(ctrl.mensajeError);
                  ctrl.errorCargarParametros = true;
                  $scope.loadParametros = false;
                });
            } else {
              console.log(ctrl.mensajeError);
              ctrl.errorCargarParametros = true;
              $scope.loadParametros = false;
            }
          })
          .catch(function(error) {
            console.log(ctrl.mensajeError);
            ctrl.errorCargarParametros = true;
            $scope.loadParametros = false;
          });
      }

      ctrl.cargarParametros();

      /**
       * @ngdoc method
       * @name consultarNombreCarrera
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Consula el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para obtener la información sobre la carrera de acuerdo al código ingresado.
       * @param {Integer} codigoCarrera Identificador de la carrera del estudiante 
       * @returns {Promise} Objeto de tipo promesa que arroja el resultado de consultar el nombre de la carrera del estudiante
       */
      ctrl.consultarNombreCarrera = function(codigoCarrera) {
        var deferred = $q.defer();
        academicaRequest.get("carrera", [codigoCarrera])
          .then(function(respuestaCarrera) {
            deferred.resolve(respuestaCarrera.data.carrerasCollection.carrera[0].nombre);
          })
          .catch(function(excepcionCarrera) {
            deferred.reject("ERROR.CARGAR_CARRERA_ESTUDIANTE");
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name cargarParametrosSolicitud
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Consula el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para obtener los datos detalles de la solicitud, el usuario y consulta los datos del estudiante del servicio de {@link services/academicaService.service:academicaRequest academicaService}.
       * @param {Object} solicitud Objeto de tipo solicitud para los parámetros de búsqueda
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con el objeto cuposDisponibles
       */
      ctrl.cargarParametrosSolicitud = function(value) {
        var defer = $q.defer();
        //buscar detalle_tipo_solicitud=37->detalle de Espacios academicos
        var parametros = $.param({
          query: "DetalleTipoSolicitud:37" + ",SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
        });
        poluxRequest.get("detalle_solicitud", parametros).then(function(detalleSolicitud) {
            if (detalleSolicitud.data !== null) {
              var carreraSolicitud = JSON.parse(detalleSolicitud.data[0].Descripcion.split("-")[1]);
              if (ctrl.carrera == carreraSolicitud.Codigo) {
                var parametros = $.param({
                  query: "SolicitudTrabajoGrado:" + value.SolicitudTrabajoGrado.Id
                });
                poluxRequest.get("usuario_solicitud", parametros).then(function(usuarioSolicitud) {
                    academicaRequest.get("datos_estudiante", [usuarioSolicitud.data[0].Usuario, ctrl.periodoAnterior.anio, ctrl.periodoAnterior.periodo]).then(function(response2) {
                        //academicaRequest.get("datos_estudiante", [usuarioSolicitud.data[0].Usuario, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].anio, periodoAnterior.data.periodoAcademicoCollection.periodoAcademico[0].periodo]).then(function (response2) {
                        if (!angular.isUndefined(response2.data.estudianteCollection.datosEstudiante)) {
                          ctrl.consultarNombreCarrera(response2.data.estudianteCollection.datosEstudiante[0].carrera)
                            .then(function(nombreCarrera) {
                              var solicitud = {
                                "solicitud": value.SolicitudTrabajoGrado.Id,
                                "fecha": value.Fecha,
                                "estudiante": usuarioSolicitud.data[0].Usuario,
                                "nombre": response2.data.estudianteCollection.datosEstudiante[0].nombre,
                                "promedio": response2.data.estudianteCollection.datosEstudiante[0].promedio,
                                "rendimiento": response2.data.estudianteCollection.datosEstudiante[0].rendimiento,
                                "estado": value.EstadoSolicitud,
                                "porcentajeCursado": response2.data.estudianteCollection.datosEstudiante[0].creditosCollection.datosCreditos[0].porcentaje.porcentaje_cursado[0].porcentaje_cursado + "%",
                                "nombreCarrera": nombreCarrera,
                                //"respuesta": ""+value.Id,
                                "respuestaSolicitud": value
                              };
                              console.log("datos estudiante", response2.data.estudianteCollection.datosEstudiante[0]);
                              if (solicitud.estado.Id == 7 || solicitud.estado.Id == 8 || solicitud.estado.Id == 9 || solicitud.estado.Id == 10) {
                                solicitud.aprobado = true;
                                ctrl.numeroAdmitidos += 1;
                              } else {
                                solicitud.aprobado = false;
                              }
                              if (solicitud.estado.Id == 3 || solicitud.estado.Id == 5) {
                                solicitud.permitirAprobar = true;
                              } else {
                                solicitud.permitirAprobar = false;
                              }
                              $scope.sols.push(solicitud);
                              defer.resolve();
                            })
                            .catch(function(excepcionCarrera) {
                              defer.reject(excepcionCarrera);
                            });
                        } else {
                          defer.reject("ERROR.CARGAR_DATOS_SOLICITUDES");
                        }
                      })
                      .catch(function(error) {
                        console.log(error);
                        defer.reject("ERROR.CARGAR_DATOS_ESTUDIANTES");
                      });
                  })
                  .catch(function(error) {
                    console.log(error);
                    defer.reject("ERROR.CARGAR_SOLICITANTES");
                  });
              } else {
                //solicitud no pertenece a la carrera
                defer.resolve();
              }
            } else {
              defer.reject("ERROR.CARGAR_DATOS_SOLICITUDES");
            }
          })
          .catch(function() {
            defer.reject("ERROR.CARGAR_DATOS_SOLICITUDES");
          });
        return defer.promise;
      }

      /**
       * @ngdoc method
       * @name buscarSolicitudes
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Consula el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para obtener las solicitudes iniciales de la modalidad de materias de posgrado y sus respuestas y llama a la función CargarParametrosSolicitud para cargar los parámetros asociados a esta.
       * @param {Object} carrera Carrera de la cual se van a consultar las solicitudes
       * @returns {Promise} Objeto de tipo promesa que indica si ya se cumplió la petición y se resuleve con el objeto cuposDisponibles
       */
      ctrl.buscarSolicitudes = function(carrera) {
        ctrl.errorCargarSolicitudes = undefined;
        $scope.loadSolicitudes = true;
        ctrl.carrera = carrera;
        $scope.carrera = carrera;
        ctrl.numeroAdmitidos = 0;
        if (carrera) {
          $scope.sols = [];
          var parametros = $.param({
            query: "Activo:true,EstadoSolicitud.Id.in:3|5|6|7|8|9|10|11,SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:13",
            limit: 0
          });
          poluxRequest.get("respuesta_solicitud", parametros).then(function(respuestaSolicitud) {
              var promises = [];
              angular.forEach(respuestaSolicitud.data, function(value) {
                if (value != null) {
                  promises.push(ctrl.cargarParametrosSolicitud(value));
                }
              });
              $q.all(promises).then(function() {
                  $scope.loadSolicitudes = false;
                })
                .catch(function(error) {
                  $scope.mensajeErrorSolicitudes = $translate.instant(error);
                  $scope.errorCargarSolicitudes = true;
                  $scope.loadSolicitudes = false;
                  console.log(error);
                });
            })
            .catch(function() {
              $scope.mensajeErrorSolicitudes = $translate.instant('ERROR.CARGA_SOLICITUDES');
              $scope.errorCargarSolicitudes = true;
              $scope.loadSolicitudes = false;
              console.log("error traer respuestas")
            });
          ctrl.gridOptions.data = $scope.sols;
        }
      }

      /**
       * @ngdoc method
       * @name admitirPrimeraFecha
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Muestra el modal para admitir en primera fecha si no se encuentra ningún error.
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {undefined} No retorna nada
       */
      ctrl.admitirPrimeraFecha = function() {
        if (ctrl.numeroAdmitidos <= ctrl.cuposDisponibles) {
          ctrl.opcionados = [];
          ctrl.admitidos = [];
          ctrl.noAdmitidos = [];
          ctrl.gridOptionsAdmitidos.data = [];
          ctrl.gridOptionsOpcionados.data = [];
          angular.forEach($scope.sols, function(solicitud) {
            if (solicitud.aprobado === true && (solicitud.estado.Id == 3 || solicitud.estado.Id == 5 || solicitud.estado.Id == 7 || solicitud.estado.Id == 8 || solicitud.estado.Id == 9 || solicitud.estado.Id == 10)) {
              ctrl.admitidos.push(solicitud);
            } else if (solicitud.estado.Id == 6) {
              ctrl.noAdmitidos.push(solicitud);
            } else {
              ctrl.opcionados.push(solicitud);
            }
          });
          ctrl.fecha = 1;
          ctrl.gridOptionsAdmitidos.data = ctrl.admitidos;
          ctrl.gridOptionsOpcionados.data = ctrl.opcionados;
          ctrl.gridOptionsNoAdmitidos.data = ctrl.noAdmitidos;
          //console.log(ctrl.admitidos, ctrl.opcionados);
          $('#modalAdmitir').modal('show')
        } else {
          swal(
            $translate.instant('ERROR'),
            $translate.instant('ERROR.NUMERO_ADMITIDOS', {
              cuposDisponibles: ctrl.cuposDisponibles
            }),
            'warning'
          )
        }
      }

      /**
       * @ngdoc method
       * @name admitirSegundaFecha
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Muestra el modal para admitir en segunda fecha si no se encuentra ningún error
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {undefined} No retorna nada
       */
      ctrl.admitirSegundaFecha = function() {
        if (ctrl.numeroAdmitidos <= ctrl.cuposDisponibles) {
          ctrl.opcionados = [];
          ctrl.admitidos = [];
          ctrl.noAdmitidos = [];
          ctrl.gridOptionsAdmitidos.data = [];
          ctrl.gridOptionsNoAdmitidos.data = [];
          angular.forEach($scope.sols, function(solicitud) {
            if (solicitud.aprobado === true && (solicitud.estado.Id == 3 || solicitud.estado.Id == 5 || solicitud.estado.Id == 7 || solicitud.estado.Id == 8 || solicitud.estado.Id == 9 || solicitud.estado.Id == 10)) {
              ctrl.admitidos.push(solicitud);
            } else if (solicitud.estado.Id == 6) {
              ctrl.noAdmitidos.push(solicitud);
            } else {
              ctrl.opcionados.push(solicitud);
            }
          });
          ctrl.fecha = 2;
          ctrl.gridOptionsAdmitidos.data = ctrl.admitidos;
          ctrl.gridOptionsOpcionados.data = ctrl.opcionados;
          ctrl.gridOptionsNoAdmitidos.data = ctrl.noAdmitidos;
          //console.log(ctrl.admitidos, ctrl.noAdmitidos);
          $('#modalAdmitir').modal('show')
        } else {
          swal(
            $translate.instant('ERROR'),
            $translate.instant('ERROR.NUMERO_ADMITIDOS', {
              cuposDisponibles: ctrl.cuposDisponibles
            }),
            'warning'
          )
        }
      }

      /**
       * @ngdoc method
       * @name admitir
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Funcion que hace la petición post a {@link services/poluxService.service:poluxRequest poluxRequest} para empezar a ejecutar el proceso de selección de admitidos.
       * @param {undefined} undefined No recibe ningún parámetro
       * @returns {undefined} No retorna nada
       */
      ctrl.admitir = function() {
        var date = new Date();
        var respuestasNuevas = [];
        var respuestasUpdate = [];
        angular.forEach($scope.sols, function(solicitud) {
          if (solicitud.permitirAprobar) {
            solicitud.respuestaSolicitud.Activo = false;
            respuestasUpdate.push(solicitud.respuestaSolicitud);
            var respuestaTemp = {
              "Activo": true,
              "EnteResponsable": 0,
              "Usuario": parseInt($scope.userId),
              "EstadoSolicitud": {
                "Id": 0,
              },
              "Fecha": date,
              "SolicitudTrabajoGrado": {
                "Id": solicitud.solicitud,
              }
            }
            if (solicitud.aprobado === true) {
              respuestaTemp.EstadoSolicitud.Id = 7;
              respuestaTemp.Justificacion = "Solicitud Aprobada por el Posgrado"
            } else {
              respuestaTemp.EstadoSolicitud.Id = (ctrl.fecha === 1) ? 5 : 6;
              respuestaTemp.Justificacion = (ctrl.fecha === 1) ? "Opcionada para segunda convocatoria" : "Rechazada por falta de cupos";
            }
            respuestasNuevas.push(respuestaTemp);
          }
        });
        var dataAdmitidos = {
          "RespuestasNuevas": respuestasNuevas,
          "RespuestasAntiguas": respuestasUpdate,
        }
        $scope.loadRespuestas = true;
        console.log("dataAdmitidos", dataAdmitidos)
        $('#modalAdmitir').modal('hide')
        poluxRequest.post("tr_registrar_respuestas_solicitudes", dataAdmitidos).then(function(response) {
            $scope.loadRespuestas = false;
            console.log("Repsuesta", response.data);
            if (response.data[0] === "Success") {
              swal(
                $translate.instant('MATERIAS_POSGRADO.PROCESO_ADMISION_COMPLETO'),
                $translate.instant('MATERIAS_POSGRADO.RESPUESTAS_SOLICITUD'),
                'success'
              )
              //recargar datos
              ctrl.buscarSolicitudes($scope.carrera);
            } else {
              swal(
                $translate.instant('ERROR'),
                $translate.instant(response.data[1]),
                'warning'
              )
            }

          })
          .catch(function(error) {
            console.log(error);
            $scope.loadRespuestas = false;
            swal(
              $translate.instant('ERROR'),
              $translate.instant('ERROR_CARGAR_SOLICITUDES'),
              'warning'
            )
          });
      }

      /**
       * @ngdoc method
       * @name verificarDisponibilidad
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarSolicitudesCtrl
       * @description 
       * Aumenta o disminuye el número de admitidos.
       * @param {Object} solicitud Solicitud que se selecciona en la cuadrícula
       * @returns {undefined} No retorna nada
       */
      ctrl.verificarDisponibilidad = function(solicitud) {
        if (!solicitud.aprobado) {
          ctrl.numeroAdmitidos += 1;
        } else {
          ctrl.numeroAdmitidos -= 1;
        }
      }

    });