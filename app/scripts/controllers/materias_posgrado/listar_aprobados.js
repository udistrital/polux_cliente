'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
 * @description
 * # MateriasPosgradoListarAprobadosCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoListarAprobadosCtrl',
    function($location, $q, $scope, $translate, academicaRequest, poluxRequest, sesionesRequest) {
      var ctrl = this;

      // El Id del usuario depende de la sesión
      $scope.userId = "12237136";

      // En el inicio de la página, se están cargando los posgrados
      $scope.cargandoPosgrados = true;
      $scope.mensajeCargandoPosgrados = $translate.instant("LOADING.CARGANDO_INFO_ACADEMICA");

      // Se define el mensaje de error cuando no se pueden cargar los posgrados asociados y los periodos correspondientes
      $scope.mensajeErrorCargandoConsultasIniciales = $translate.instant("ERROR.SIN_INFO_ACADEMICA");

      // Se inhabilita la selección del periodo correspondiente
      $scope.periodoCorrespondienteHabilitado = false;

      $scope.admitidosCargados = true;
      $scope.cargandoRegistroPago = false;
      $scope.mensajeCargandoAdmitidos = $translate.instant("LOADING.CARGANDO_DETALLES_SOLICITUD");
      $scope.opcionesSolicitud = [{
        clase_color: "ver",
        clase_css: "fa fa-cog fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.VER_DETALLES'),
        operacion: 'verDetallesSolicitud',
        estado: true
      }];

      //ctrl.posgrados = [];
      ctrl.mostrarPeriodo = false;
      ctrl.infoAcademicaCargada = true;
      //ctrl.solicitudesPosgradoAprobadas = [];

      ctrl.propiedadesCuadricula = {};
      ctrl.propiedadesCuadricula.columnDefs = [{
        name: 'solicitud',
        displayName: $translate.instant("SOLICITUD"),
        width: '10%'
      }, {
        name: 'fecha',
        displayName: $translate.instant("FECHA"),
        type: 'date',
        cellFilter: 'date:\'yyyy-MM-dd\'',
        width: '8%'
      }, {
        name: 'estudiante',
        displayName: $translate.instant("CODIGO"),
        width: '12%'
      }, {
        name: 'nombre',
        displayName: $translate.instant("NOMBRE"),
        width: '27%'
      }, {
        name: 'promedio',
        displayName: $translate.instant("PROMEDIO"),
        width: '10%'
      }, {
        name: 'estado.Nombre',
        displayName: $translate.instant("ESTADO"),
        width: '18%'
      }, {
        name: 'modificar',
        displayName: $translate.instant("OPCIONES"),
        width: '15%',
        cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(fila)" grupobotones="grid.appScope.opcionesSolicitud" fila="row"></btn-registro>'
      }];

      ctrl.cuadriculaEspaciosAcademicos = {};
      ctrl.cuadriculaEspaciosAcademicos.columnDefs = [{
        name: 'codigo',
        displayName: $translate.instant("CODIGO_ESP_ACADEMICO"),
        width: '35%'
      }, {
        name: 'nombre',
        displayName: $translate.instant("NOMBRE_ESP_ACADEMICO"),
        width: '50%'
      }, {
        name: 'creditos',
        displayName: $translate.instant("CREDITOS"),
        width: '15%'
      }];

      /**
       * [Función que define los parámetros para consultar en la tabla coordinador_carrera]
       * @return {[Array]} [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosPosgradosDelCoordinador = function() {
        return [$scope.userId, "POSGRADO"];
      }

      /**
       * [Función que recorre la base de datos de acuerdo al coordinador en sesión y sus posgrados asociados]
       * @return {[Promise]} [La colección de posgrados asociados, o la excepción generada]
       */
      ctrl.consultarPosgradosAsociados = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se traen los resultados de los posgrados asociados desde el servicio de académica
        academicaRequest.get("coordinador_carrera", ctrl.obtenerParametrosPosgradosDelCoordinador())
          .then(function(resultadoPosgradosAsociados) {
            // Se verifica que el resultado y los datos necesarios son válidos
            if (!angular.isUndefined(resultadoPosgradosAsociados.data.coordinadorCollection.coordinador)) {
              // Se cargan los posgrados asociados
              ctrl.posgradosAsociados = resultadoPosgradosAsociados.data.coordinadorCollection.coordinador;
              // Se resuelve la promesa
              deferred.resolve(true);
            }
          })
          .catch(function(excepcionPosgradosAsociados) {
            // Se rechaza la promesa
            deferred.reject(false);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que recorre la base de datos hacia los periodos académicos]
       * @return {[Promise]} [La colección de periodos correspondientes, o la excepción generada]
       */
      ctrl.consultarPeriodosCorrespondientes = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se traen los resultados de los periodos correspondientes desde el servicio de académica
        academicaRequest.get("periodos")
          .then(function(resultadoPeriodosCorrespondientes) {
            // Se verifica que el resultado y los datos necesarios son válidos
            if (!angular.isUndefined(resultadoPeriodosCorrespondientes.data.periodosCollection.datosPeriodos)) {
              // Se cargan los periodos correspondientes
              ctrl.periodosCorrespondientes = resultadoPeriodosCorrespondientes.data.periodosCollection.datosPeriodos;
              // Se resuelve la promesa
              deferred.resolve(true);
            }
          })
          .catch(function(excepcionPeriodosCorrespondientes) {
            // Se rechaza la promesa
            deferred.reject(false);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que carga las consultas iniciales para poder listar los admitidos]
       * @return {[void]} [El procedimiento de cargar las solicitudes para listar los admitidos]
       */
      ctrl.cargarConsultasIniciales = function() {
        // Se garantiza que se cumplan todas las promesas de carga desde un inicio
        $q.all([ctrl.consultarPosgradosAsociados(), ctrl.consultarPeriodosCorrespondientes()])
          .then(function(respuestaConsultas) {
            // Se apaga el mensaje de carga
            $scope.cargandoPosgrados = false;
          })
          .catch(function(excepcionConsultas) {
            // Se apaga el mensaje de carga
            $scope.cargandoPosgrados = false;
            $scope.errorCargandoConsultasIniciales = true;
            //ctrl.infoAcademicaCargada = exception;
          });
      }

      /**
       * Se lanza la función que carga las consultas de posgrado asociado al coordinador y el periodo académico correspondientes
       */
      ctrl.cargarConsultasIniciales();

      /**
       * [Función que se ejecuta cuando se escoge el posgrado asociado desde la vista]
       * @return {[void]} [Procedimiento que habilita escoger el periodo correspondiente, y consulta el listado si es posible]
       */
      ctrl.escogerPosgrado = function() {
        // Se notifica que el posgrado asociado ha sido escogido
        $scope.periodoCorrespondienteHabilitado = true;
        // Se estudia si el periodo ha sido seleccionado
        if (ctrl.periodoSeleccionado) {
          // En ese caso, se renueva la consulta de aprobados
          ctrl.consultarAprobados();
        }
      }

      /**
       * [Función que define los parámetros para consultar en la tabla detalle_solicitud]
       * @param  {[integer]} idSolicitudTrabajoGrado [Se recibe el id de la solicitud de trabajo de grado asociada al usuario]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosDetalleSolicitudRespondida = function(idSolicitudTrabajoGrado) {
        return $.param({
          /**
           * El detalle tipo solicitud 37 relaciona el detalle y la modalidad de espacios académicos de posgrado 
           * Tabla: detalle_solicitud
           * Tablas asociadas: detalle (22) y modalidad_tipo_solicitud (13)
           */
          query: "DetalleTipoSolicitud:37," +
            "SolicitudTrabajoGrado:" +
            idSolicitudTrabajoGrado,
          limit: 1
        });
      }

      /**
       * [Función que según la solicitud, carga la información correspondiente al detalle de la misma]
       * @param  {[Object]} solicitudAprobada [La solicitud para obtener el identificador y cargar la información correspondiente al detalle]
       * @return {[Promise]}                   [La solicitud con el detalle asociado dentro, o la excepción generada]
       */
      ctrl.consultarDetalleSolicitudRespondida = function(solicitudAprobada) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia el detalle de la solicitud aprobada en la base de datos
        poluxRequest.get("detalle_solicitud", ctrl.obtenerParametrosDetalleSolicitudRespondida(solicitudAprobada.SolicitudTrabajoGrado.Id))
          .then(function(detalleSolicitudRespondida) {
            // Se estudia si la información existe
            if (detalleSolicitudRespondida.data) {
              // Se resuelve la solicitud aprobada con el detalle dentro
              solicitudAprobada.detalleSolicitud = detalleSolicitudRespondida.data[0];
              deferred.resolve(solicitudAprobada);
            } else {
              // Se establece el mensaje de error con la nula existencia de datos
              $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_INFO_SOLICITUDES_APROBADAS");
              ctrl.coleccionSolicitudesAprobadas.pop();
              deferred.resolve(null);
            }
          })
          .catch(function(excepcionDetalleSolicitudRespondida) {
            // Se presenta cuando ocurrió un error al traer el detalle de las solicitudes desde la tabla detalle_solicitud
            $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.CARGANDO_SOLICITUDES_APROBADAS");
            deferred.reject(null);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que define los parámetros para consultar en la tabla usuario_solicitud]
       * @param  {[integer]} idSolicitudTrabajoGrado [Se recibe el id de la solicitud de trabajo de grado asociada al usuario]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosUsuarioDeSolicitud = function(idSolicitudTrabajoGrado) {
        return $.param({
          /**
           * El detalle tipo solicitud 37 relaciona el detalle y la modalidad de espacios académicos de posgrado 
           * Tabla: detalle_solicitud
           * Tablas asociadas: detalle (22) y modalidad_tipo_solicitud (13)
           */
          query: "SolicitudTrabajoGrado:" +
            idSolicitudTrabajoGrado,
          limit: 1
        });
      }

      /**
       * [Función que consulta el usuario desde la tabla usuario_solicitud según la solicitud]
       * @return {[Promise]} [Los datos del usuario asociado a la solicitud, o la excepción generada]
       */
      ctrl.consultarUsuarioDeSolicitud = function(solicitudAprobada) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        poluxRequest.get("usuario_solicitud", parametrosSolicitudUsuario)
          .then(function(usuarioDeSolicitud) {
            // Se estudia si la información existe
            if (usuarioDeSolicitud.data) {
              // Se resuelve la solicitud aprobada con el usuario dentro
              solicitudAprobada.usuarioDeSolicitud = usuarioDeSolicitud.data[0];
              deferred.resolve(solicitudAprobada);
            } else {
              // Se establece el mensaje de error con la nula existencia de datos
              $scope.mensajeErrorCargandoSolicitudes = $translate.instant("ERROR.SIN_INFO_SOLICITUDES_APROBADAS");
              ctrl.coleccionSolicitudesAprobadas.pop();
              deferred.resolve(null);
            }
          })
          .catch(function(excepcionUsuarioDeSolicitud) {
            // Se presenta cuando ocurrió un error al traer el detalle de las solicitudes desde la tabla detalle_solicitud
            $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.CARGANDO_SOLICITUDES_APROBADAS");
            deferred.reject(null);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que consulta los datos académicos del estudiante asociado al usuario]
       * @param  {[Object]} usuarioConSolicitudAprobada [description]
       * @return {[Promise]}                             [Los datos académicos del estudiante, o la excepción generada]
       */
      ctrl.consultarInformacionAcademicaDelEstudiante = function(usuarioConSolicitudAprobada) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia los datos del estudiante desde el servicio de académica
        academicaRequest.get("datos_estudiante", [usuarioConSolicitudAprobada.Usuario, ctrl.periodoSeleccionado.anio, ctrl.periodoSeleccionado.periodo])
          .then(function(admitidoConsultado) {
            // Se estudia si los resultados de la consulta son válidos
            if (!angular.isUndefined(admitidoConsultado.data.estudianteCollection.datosEstudiante)) {
              // Se resuelve la información académica del estudiante
              deferred.resolve(admitidoConsultado.data.estudianteCollection.datosEstudiante[0]);
            } else {
              // Se presenta cuando no existe registro de estudiantes con dichas características
              $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.NO_EXISTE_ESTUDIANTE_POSGRADO");
              deferred.reject(null);
            }
          })
          .catch(function(errorRespuestaEstudiante) {
            // Se presenta cuando ocurrió un error al traer la información desde la petición académica
            $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
            deferred.reject(null);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que define los parámetros para consultar en la tabla respuesta_solicitud]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosSolicitudesRespondidas = function() {
        /**
         * Se traen las solicitudes cuyo estado sean:
         * 9 - Formalizada exenta de pago
         * 11 - Oficializada
         */
        return $.param({
          query: "EstadoSolicitud.Id.in:9|11," +
            "Activo:True",
          limit: 0
        });
      }

      ctrl.consultarSolicitudesRespondidas = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se establece un conjunto de procesamiento de solicitudes que reúne los procesos que deben cargarse antes de ofrecer funcionalidades
        var conjuntoProcesamientoDeSolicitudes = [];
        // Se establece una colección de solicitudes aprobadas para ser inscritas al posgrado
        ctrl.coleccionSolicitudesAprobadas = [];
        // Se consulta hacia las solicitudes respondidas en la base de datos
        poluxRequest.get("respuesta_solicitud", ctrl.obtenerParametrosSolicitudesRespondidas())
          .then(function(solicitudesRespondidas) {
            if (solicitudesRespondidas.data) {
              angular.forEach(solicitudesRespondidas.data, function(solicitudRespondida) {
                ctrl.coleccionSolicitudesAprobadas.push(solicitudRespondida);
                conjuntoProcesamientoDeSolicitudes.push(ctrl.consultarDetalleSolicitudRespondida(solicitudRespondida));
                conjuntoProcesamientoDeSolicitudes.push(ctrl.consultarUsuarioDeSolicitud(solicitudRespondida));
              });
              $q.all(conjuntoProcesamientoDeSolicitudes)
                .then(function(resultadoDelProcesamiento) {
                  // Se resuelve la colección de solicitudes para formalizar
                  deferred.resolve(ctrl.coleccionSolicitudesAprobadas);
                })
                .catch(function(excepcionDuranteProcesamiento) {
                  // Se establece el mensaje de error con la excepción durante el procesamiento de las promesas
                  $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.CARGANDO_SOLICITUDES_APROBADAS");
                  // Se rechaza la carga con la excepción generada
                  deferred.reject(excepcionDuranteProcesamiento);
                });
            } else {
              // Se presenta cuando no hay solicitudes respondidas con los parámetros establecidos
              $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_SOLICITUDES_APROBADAS");
              deferred.reject(null);
            }
          })
          .catch(function(excepcionSolicitudesRespondidas) {
            // Se presenta cuando ocurrió un error al traer las solicitudes desde la tabla respuesta_solicitud
            $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.CARGANDO_SOLICITUDES_APROBADAS");
            deferred.reject(null);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que actualiza el contenido de la lista de aprobados al posgrado]
       * @return {[void]} [El procedimiento de carga, o la excepción generada]
       */
      ctrl.consultarAprobados = function() {
        $scope.cargandoSolicitudesAprobadas = true;
        $scope.sinResultados = false;
        $scope.resultadosConsulta = [];
        ctrl.consultarSolicitudesRespondidas()
          .then(function(sinResultados) {
            $scope.cargandoSolicitudesAprobadas = false;
            ctrl.propiedadesCuadricula.data = $scope.resultadosConsulta;
            $scope.sinDatosConsulta = sinResultados;
          })
          .catch(function(sinResultados) {
            $scope.resultadosConsulta = [];
            $scope.cargandoSolicitudesAprobadas = false;
            $scope.sinResultados = sinResultados;
            $scope.sinDatosConsulta = sinResultados;
          });
      }

      ctrl.cargarAprobados = function() {
        var defered = $q.defer();
        if (ctrl.posgradoSeleccionado) {
          /**
           * Se traen las solicitudes cuyo estado sean:
           * - Aprobado con beneficio económico
           * - Aprobado sin beneficio económico
           * - Formalizada (ya se definió el posgrado para cursar)
           */
          var parametrosAdmitidosPosgrado = $.param({
            query: "EstadoSolicitud.Id.in:7|8|9,Activo:True",
            limit: 0
          });
          poluxRequest.get("respuesta_solicitud", parametrosAdmitidosPosgrado)
            .then(function(solicitudesPosgradoAprobadas) {
              if (solicitudesPosgradoAprobadas.data !== null) {
                angular.forEach(solicitudesPosgradoAprobadas.data, function(solicitudPosgradoAprobada) {
                  var parametrosDetalleSolicitudAprobada = $.param({
                    query: "DetalleTipoSolicitud:37,SolicitudTrabajoGrado:" + solicitudPosgradoAprobada.SolicitudTrabajoGrado.Id
                  });
                  poluxRequest.get("detalle_solicitud", parametrosDetalleSolicitudAprobada)
                    .then(function(detalleSolicitudPosgradoAprobada) {
                      if (detalleSolicitudPosgradoAprobada.data) {
                        var posgradoConsultado = JSON.parse(detalleSolicitudPosgradoAprobada.data[0].Descripcion.split("-")[1]);
                        if (ctrl.posgradoSeleccionado == posgradoConsultado.Codigo) {
                          var parametrosSolicitudUsuario = $.param({
                            query: "SolicitudTrabajoGrado:" + solicitudPosgradoAprobada.SolicitudTrabajoGrado.Id
                          });
                          poluxRequest.get("usuario_solicitud", parametrosSolicitudUsuario)
                            .then(function(usuarioSolicitudPosgradoAprobada) {
                              academicaRequest.get("datos_estudiante", [usuarioSolicitudPosgradoAprobada.data[0].Usuario, ctrl.periodoSeleccionado.anio, ctrl.periodoSeleccionado.periodo])
                                .then(function(admitidoConsultado) {
                                  if (!angular.isUndefined(admitidoConsultado.data.estudianteCollection.datosEstudiante)) {
                                    var solicitud = {
                                      "respuesta": solicitudPosgradoAprobada,
                                      "solicitud": solicitudPosgradoAprobada.SolicitudTrabajoGrado.Id,
                                      "fecha": solicitudPosgradoAprobada.Fecha,
                                      "estudiante": usuarioSolicitudPosgradoAprobada.data[0].Usuario,
                                      "nombre": admitidoConsultado.data.estudianteCollection.datosEstudiante[0].nombre,
                                      "promedio": admitidoConsultado.data.estudianteCollection.datosEstudiante[0].promedio,
                                      "estado": solicitudPosgradoAprobada.EstadoSolicitud,
                                      "rendimiento": admitidoConsultado.data.estudianteCollection.datosEstudiante[0].rendimiento,
                                      "posgradoAspirado": posgradoConsultado,
                                      "detalleSolicitudPosgradoAprobada": detalleSolicitudPosgradoAprobada.data[0].Descripcion
                                    };
                                    $scope.resultadosConsulta.push(solicitud);
                                    defered.resolve(false);
                                  } else {
                                    /**
                                     * No existe registro de estudiantes con dichas características
                                     */
                                    $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.NO_EXISTE_ESTUDIANTE_POSGRADO");
                                    defered.reject(true);
                                  }
                                })
                                .catch(function(errorRespuestaEstudiante) {
                                  /**
                                   * Ocurrió al traer la información desde la petición académica
                                   */
                                  $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
                                  defered.reject(true);
                                });
                            })
                            .catch(function(errorRespuestaUsuario) {
                              /**
                               * Ocurrió al traer la información del estudiante desde la petición polux
                               */
                              $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
                              defered.reject(true);
                            });
                        } else {
                          /**
                           * El posgrado consultado no coincide con el posgrado obtenido desde la base de datos
                           */
                          $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                          defered.reject(true);
                        }
                      } else {
                        /**
                         * La información sobre el detalle de la solicitud de posgrado aprobada es nula
                         */
                        $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                        defered.reject(true);
                      }
                    })
                    .catch(function(errorRespuestaDetalle) {
                      /**
                       * No fue posible obtener la información sobre el detalle de las solicitudes de posgrado aprobadas durante la consulta a la base de datos
                       */
                      $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
                      defered.reject(true);
                    });
                });
              } else {
                /**
                 * La colección de solicitudes es nula
                 * Por lo tanto no se toma en cuenta en la iteración
                 */
                $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
                defered.reject(true);
              }
            })
            .catch(function(errorRespuestaSolicitud) {
              /**
               * No fue posible obtener la información sobre las solicitudes de posgrado aprobadas desde la base de datos
               */
              $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
              defered.reject(true);
            });
        } else {
          /**
           * No hay posgrado seleccionado
           */
          $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_RESULTADOS");
          defered.reject(true);
        }
        return defered.promise;
      }

      ctrl.verDetallesSolicitud = function(filaSolicitud) {
        ctrl.entity = filaSolicitud.entity;
        ctrl.numeroSolicitud = filaSolicitud.entity.solicitud;
        var fechaCompletaSolicitud = new Date(filaSolicitud.entity.fecha);
        ctrl.fechaSolicitud = ctrl.obtenerFechaGeneral(fechaCompletaSolicitud);
        ctrl.estadoSolicitud = filaSolicitud.entity.estado;
        ctrl.nombreEstudianteSolicitante = filaSolicitud.entity.nombre;
        ctrl.codigoEstudianteSolicitante = filaSolicitud.entity.estudiante;
        ctrl.promedioEstudianteSolicitante = filaSolicitud.entity.promedio;
        ctrl.rendimientoEstudianteSolicitante = filaSolicitud.entity.rendimiento;
        ctrl.codigoPosgrado = filaSolicitud.entity.posgradoAspirado.Codigo;
        ctrl.nombrePosgrado = filaSolicitud.entity.posgradoAspirado.Nombre;
        ctrl.pensumPosgrado = filaSolicitud.entity.posgradoAspirado.Pensum;
        ctrl.respuesta = filaSolicitud.entity.respuesta;
        ctrl.cuadriculaEspaciosAcademicos.data = ctrl.obtenerEspaciosAcademicos(filaSolicitud.entity.detalleSolicitudPosgradoAprobada.split("-").slice(2));
        $('#modalVerSolicitud').modal('show');
      }

      ctrl.cambiarEstadoPago = function() {
        swal({
            title: $translate.instant("INFORMACION_SOLICITUD"),
            text: $translate.instant("REGISTRAR_PAGO_POSGRADO", {
              nombre: ctrl.nombreEstudianteSolicitante,
              codigo: ctrl.codigoEstudianteSolicitante,
              estado: ctrl.estadoSolicitud.Nombre
            }),
            type: "warning",
            confirmButtonText: $translate.instant("ACEPTAR"),
            cancelButtonText: $translate.instant("CANCELAR"),
            showCancelButton: true
          })
          .then(function(responseSwal) {
            if (responseSwal.value) {
              $scope.cargandoRegistroPago = true;
              $scope.loadFormulario = true;
              ctrl.solicitarRegistroPago()
                .then(function(response) {
                  if (response.data[0] === "Success") {
                    $scope.cargandoRegistroPago = false;
                    swal(
                      $translate.instant("REGISTRO_PAGO"),
                      $translate.instant("PAGO_REGISTRADO"),
                      'success'
                    );
                    $scope.cargandoSolicitudesPosgradoAprobadas = true;
                    ctrl.consultarAprobados();
                    $('#modalVerSolicitud').modal('hide');
                  } else {
                    $scope.cargandoRegistroPago = false;
                    swal(
                      $translate.instant("REGISTRO_PAGO"),
                      $translate.instant(response.data[1]),
                      'warning'
                    );
                  }
                })
                .catch(function(error) {
                  $scope.cargandoRegistroPago = false;
                  swal(
                    $translate.instant("REGISTRO_PAGO"),
                    $translate.instant("ERROR.REGISTRAR_PAGO"),
                    'warning'
                  );
                })
            }
          });
      }

      $scope.loadrow = function(filaSolicitud) {
        ctrl.verDetallesSolicitud(filaSolicitud);
      };

      ctrl.obtenerFechaGeneral = function(fechaCompleta) {
        return fechaCompleta.getFullYear() +
          "-" + fechaCompleta.getMonth() + 1 +
          "-" + fechaCompleta.getDate();
      }

      ctrl.obtenerEspaciosAcademicos = function(descripcionSolicitud) {
        var espaciosAcademicos = [];
        angular.forEach(descripcionSolicitud, function(espacioAcademico) {
          var objetoEspacioAcademico = JSON.parse(espacioAcademico);
          var informacionEspacioAcademico = {
            "id": objetoEspacioAcademico.Id,
            "codigo": objetoEspacioAcademico.CodigoAsignatura,
            "nombre": objetoEspacioAcademico.Nombre,
            "creditos": objetoEspacioAcademico.Creditos
          };
          espaciosAcademicos.push(informacionEspacioAcademico);
        });
        return espaciosAcademicos;
      }

      ctrl.solicitarRegistroPago = function() {
        var defered = $q.defer();

        ctrl.respuesta.Activo = false;

        ctrl.respuestaNueva = {
          Activo: true,
          EnteResponsable: 0,
          Fecha: new Date(),
          EstadoSolicitud: {
            Id: 9
          },
          Justificacion: "Pago registrado",
          SolicitudTrabajoGrado: {
            Id: ctrl.respuesta.SolicitudTrabajoGrado.Id
          },
          Usuario: parseInt($scope.userId),
        };

        ctrl.trabajoGrado = {
          Titulo: "Cursar materias de posgrado en " + ctrl.nombrePosgrado,
          Modalidad: {
            Id: parseInt(ctrl.respuesta.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad.Id)
          },
          EstadoTrabajoGrado: {
            Id: 4
          },
          DistincionTrabajoGrado: null
        };

        ctrl.estudianteTrabajoGrado = {
          Estudiante: ctrl.codigoEstudianteSolicitante,
          TrabajoGrado: {
            Id: 0
          },
          EstadoEstudianteTrabajoGrado: {
            Id: 1
          }
        };

        ctrl.espaciosAcademicosInscritos = []

        angular.forEach(ctrl.cuadriculaEspaciosAcademicos.data, function(espacioAcademico) {
          console.log(espacioAcademico);
          ctrl.espaciosAcademicosInscritos.push({
            Nota: 0,
            EspaciosAcademicosElegibles: {
              Id: espacioAcademico.id
            },
            EstadoEspacioAcademicoInscrito: {
              Id: 1
            },
            TrabajoGrado: {
              Id: 0
            }
          });
        });

        ctrl.dataRegistrarPago = {
          "RespuestaAnterior": ctrl.respuesta,
          "RespuestaNueva": ctrl.respuestaNueva,
          "TrabajoGrado": ctrl.trabajoGrado,
          "EstudianteTrabajoGrado": ctrl.estudianteTrabajoGrado,
          "EspaciosAcademicos": ctrl.espaciosAcademicosInscritos,
        };

        poluxRequest
          .post("tr_registrar_pago", ctrl.dataRegistrarPago)
          .then(function(response) {
            defered.resolve(response);
          })
          .catch(function(error) {
            defered.reject(error);
          });
        return defered.promise;
      }

    });