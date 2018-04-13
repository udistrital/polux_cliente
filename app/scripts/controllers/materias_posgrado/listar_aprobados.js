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

      // Se configura el mensaje mientras se cargan las solicitudes aprobadas
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

      $scope.admitidosCargados = true;
      $scope.cargandoRegistroPago = false;

      // Se define la cuadrícula de las solicitudes aprobadas y las columnas visibles
      ctrl.cuadriculaSolicitudesAprobadas = {};
      ctrl.cuadriculaSolicitudesAprobadas.columnDefs = [{
        name: 'idSolicitud',
        displayName: $translate.instant("SOLICITUD"),
        width: '10%'
      }, {
        name: 'fechaSolicitud',
        displayName: $translate.instant("FECHA"),
        type: 'date',
        cellFilter: 'date:\'yyyy-MM-dd\'',
        width: '8%'
      }, {
        name: 'codigoEstudiante',
        displayName: $translate.instant("CODIGO"),
        width: '12%'
      }, {
        name: 'nombreEstudiante',
        displayName: $translate.instant("NOMBRE"),
        width: '27%'
      }, {
        name: 'promedioAcademico',
        displayName: $translate.instant("PROMEDIO"),
        width: '10%'
      }, {
        name: 'nombreEstado',
        displayName: $translate.instant("ESTADO_SIN_DOSPUNTOS"),
        width: '18%'
      }, {
        name: 'opcionesDeSolicitud',
        displayName: $translate.instant("OPCIONES"),
        width: '15%',
        cellTemplate: '<btn-registro funcion="grid.appScope.loadrow(row)" grupobotones="grid.appScope.opcionesSolicitud"></btn-registro>'
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
          ctrl.consultarSolicitudesAprobadas();
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
              // Se elimina la información redundante
              delete detalleSolicitudRespondida.data[0].SolicitudTrabajoGrado;
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
        poluxRequest.get("usuario_solicitud", ctrl.obtenerParametrosUsuarioDeSolicitud(solicitudAprobada.SolicitudTrabajoGrado.Id))
          .then(function(usuarioDeSolicitud) {
            // Se estudia si la información existe
            if (usuarioDeSolicitud.data) {
              // Se elimina la información redundante
              delete usuarioDeSolicitud.data[0].SolicitudTrabajoGrado;
              // Se resuelve la solicitud aprobada con el usuario dentro
              solicitudAprobada.usuarioDeSolicitud = usuarioDeSolicitud.data[0];
              ctrl.consultarInformacionAcademicaDelEstudiante(usuarioDeSolicitud.data[0].Usuario)
                .then(function(estudianteConsultado) {
                  // Se resuelve la información académica del estudiante cargada a la solicitud
                  solicitudAprobada.estudianteAsociado = estudianteConsultado;
                  deferred.resolve(solicitudAprobada);
                })
                .catch(function(excepcionEstudianteConsultado) {
                  // Se presenta cuando ocurrió un error al traer la información desde la petición académica
                  $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
                  deferred.reject(null);
                });
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
       * [Función que consulta los datos académicos del estudiante asociado al usuario]
       * @param  {[Object]} usuarioConSolicitudAprobada [description]
       * @return {[Promise]}                             [Los datos académicos del estudiante, o la excepción generada]
       */
      ctrl.consultarInformacionAcademicaDelEstudiante = function(codigoUsuarioConSolicitudAprobada) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia los datos del estudiante desde el servicio de académica
        academicaRequest.get("datos_estudiante", [codigoUsuarioConSolicitudAprobada, ctrl.periodoSeleccionado.anio, ctrl.periodoSeleccionado.periodo])
          .then(function(estudianteConsultado) {
            // Se estudia si los resultados de la consulta son válidos
            if (!angular.isUndefined(estudianteConsultado.data.estudianteCollection.datosEstudiante)) {
              // Se resuelve la información académica del estudiante
              deferred.resolve(estudianteConsultado.data.estudianteCollection.datosEstudiante[0]);
            } else {
              // Se presenta cuando no existe registro de estudiantes con dichas características
              $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.NO_EXISTE_ESTUDIANTE_POSGRADO");
              deferred.reject(null);
            }
          })
          .catch(function(excepcionEstudianteConsultado) {
            // Se presenta cuando ocurrió un error al traer la información desde la petición académica
            $scope.msgErrorConsultaAdmitidos = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
            deferred.reject(null);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que carga las solicitudes aprobadas a la cuadrícula con la información correspondiente]
       * @param  {[Object]} solicitudesAprobadas [La colección de solicitudes aprobadas ya consultadas]
       * @return {[void]}                      [El procedimiento de contruir el arreglo de datos visibles sobre las solicitudes aprobadas]
       */
      ctrl.mostrarSolicitudesAprobadas = function(solicitudesAprobadas) {
        // Se prepara una colección para almacenar los datos disponibles en la cuadrícula de las solicitudes aprobadas
        ctrl.coleccionSolicitudesAprobadasVisibles = [];
        // Se recorren las solicitudes aprobadas para obtener los datos correspondientes
        angular.forEach(solicitudesAprobadas, function(solicitudAprobada) {
          var solicitudAprobadaVisible = {
            "idSolicitud": solicitudAprobada.SolicitudTrabajoGrado.Id,
            "fechaSolicitud": solicitudAprobada.Fecha,
            "codigoEstudiante": solicitudAprobada.estudianteAsociado.codigo,
            "nombreEstudiante": solicitudAprobada.estudianteAsociado.nombre,
            "promedioAcademico": solicitudAprobada.estudianteAsociado.promedio,
            "nombreEstado": solicitudAprobada.EstadoSolicitud.Nombre,
          };
          ctrl.coleccionSolicitudesAprobadasVisibles.push(solicitudAprobadaVisible);
        });
        // Se cargan los datos visibles a la cuadrícula
        ctrl.cuadriculaSolicitudesAprobadas.data = ctrl.coleccionSolicitudesAprobadasVisibles;
      }

      /**
       * [Función que actualiza el contenido de la lista de aprobados al posgrado]
       * @return {[void]} [El procedimiento de carga, o la excepción generada]
       */
      ctrl.consultarSolicitudesAprobadas = function() {
        // Se establece que inicia la carga de las solicitudes aprobadas
        $scope.cargandoSolicitudesAprobadas = true;
        // Se consultan las solicitudes respondidas
        ctrl.consultarSolicitudesRespondidas()
          .then(function(solicitudesRespondidas) {
            // Se detiene la carga y se muestra la cuadrícula
            $scope.cargandoSolicitudesAprobadas = false;
            ctrl.mostrarSolicitudesAprobadas(solicitudesRespondidas);
          })
          .catch(function(sinResultados) {
            // Se detiene la carga y se muestra el error
            $scope.cargandoSolicitudesAprobadas = false;
            $scope.sinResultados = sinResultados;
            $scope.sinDatosConsulta = sinResultados;
          });
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
                    ctrl.consultarSolicitudesAprobadas();
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