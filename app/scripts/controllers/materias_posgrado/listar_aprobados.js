'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
 * @description
 * # MateriasPosgradoListarAprobadosCtrl
 * Controller of the poluxClienteApp
 * Controlador que regula las acciones necesarias para que el coordinador del posgrado liste las solicitudes aprobadas y registre la modalidad para el trabajo de grado asociado.
 * Se realiza una selección del posgrado y el periodo académico para listar las solicitudes aprobadas y atendidas por los estudiantes.
 * El coordinador hace el registro del trabajo de grado junto a las asignaturas correspondientes, cuando selecciona la solicitud de cada estudiante.
 * Pueden visualizarse las solicitudes que ya pasaron por el registro, pero a manera de consulta únicamente.
 * Este procedimiento hace la inserción de la asginatura de trabajo de grado, y pasa el estado de dicha a "Cursando".
 * @requires $q
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @property {String} usuarioSesion El identificador del coordinador en sesión para consultar los posgrados asociados
 * @property {Boolean} cargandoPosgradosAsociados Indicador que maneja la carga de los posgrados asociados al coordinador en sesión
 * @property {String} mensajeCargandoPosgradosAsociados Mensaje que aparece durante la carga de los posgrados asociados al coordinador
 * @property {Boolean} periodoCorrespondienteHabilitado Indicador que maneja la habilitación del periodo correspondiente
 * @property {String} mensajeCargandoSolicitudesAprobadas Mensaje que aparece durante la carga de las solicitudes consultadas por el coordinador según los parámetros
 * @property {String} mensajeCargandoTransaccionRegistro Mensaje que aparece durante la carga de la transacción que registra el trabajo de grado asociado a la solicitud seleccionada
 * @property {Array} botonRegistrarTrabajoDeGrado Establece las propiedades del botón que se muestra para cada solicitud y efectúa el registro del trabajo de grado
 * @property {Object} cuadriculaSolicitudesAprobadas Almacena y adapta la información de las solicitudes aprobadas y atendidas por el estudiante, de forma que el coordinador observe la información pertinente
 * @property {Object} cuadriculaEspaciosAcademicosSolicitados Almacena y adapta la información de los espacios académicos solicitados por cada estudiante seleccionado.
 * @property {Array} posgradosAsociados Define el conjunto de posgrados asociados al coordinador en sesión
 * @property {Array} periodosCorrespondientes Define el conjunto de periodos académicos que corresponden a la modalidad de espacios académicos de posgrado
 * @property {Object} periodoAcademicoPrevio Establece el año y el periodo académico anterior a la operación, para traer los registros académicos de cada estudiante
 * @property {Object} periodoSeleccionado Almacena el periodo académico que el coordinador seleccionó desde la vista
 * @property {Boolean} errorCargandoConsultasIniciales Indicador que maneja la aparición de un error durante las consultas de posgrados asociados y periodos correspondientes
 * @property {String} mensajeErrorCargandoConsultasIniciales Mensaje que aparece en caso de que ocurra un error durante las consultas de posgrados asociados y periodos correspondientes
 * @property {Boolean} cargandoSolicitudesAprobadas Indicador que maneja la carga de las solicitudes aprobadas
 * @property {Boolean} errorCargandoSolicitudesAprobadas Indicador que maneja la aparición de algún error durante la carga de las solicitudes aprobadas
 * @property {String} mensajeErrorCargandoSolicitudesAprobadas Mensaje que aparece en caso de que ocurra algún error durante la carga de las solicitudes aprobadas
 * @property {Boolean} cargandoTransaccionRegistro Indicador que maneja la carga de la transacción que registra el trabajo de grado asociado a la solicitud seleccionada
 * @property {Object} solicitudSeleccionada Es la solicitud que el coordinador seleccionó desde la lista de solicitudes aprobadas y atendidas por el estudiante
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoListarAprobadosCtrl',
    function($q, $translate, academicaRequest, poluxRequest, sesionesRequest, token_service) {
      var ctrl = this;

      // El Id del usuario depende de la sesión
      token_service.token.documento = "12237136";
      ctrl.usuarioSesion = token_service.token.documento;

      // En el inicio de la página, se están cargando los posgrados
      ctrl.cargandoPosgradosAsociados = true;
      ctrl.mensajeCargandoPosgradosAsociados = $translate.instant("LOADING.CARGANDO_INFO_ACADEMICA");

      // Se inhabilita la selección del periodo correspondiente
      ctrl.periodoCorrespondienteHabilitado = false;

      // Se configura el mensaje mientras se cargan las solicitudes aprobadas
      ctrl.mensajeCargandoSolicitudesAprobadas = $translate.instant("LOADING.CARGANDO_SOLICITUDES_APROBADAS");

      // Se configura el mensaje mientras se carga la transacción de registro
      ctrl.mensajeCargandoTransaccionRegistro = $translate.instant("LOADING.CARGANDO_TRANSACCION_REGISTRO");

      ctrl.botonRegistrarTrabajoDeGrado = [{
        clase_color: "ver",
        clase_css: "fa fa-cog fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.VER_DETALLES'),
        operacion: 'verDetallesSolicitud',
        estado: true
      }];

      // Se define la cuadrícula de las solicitudes aprobadas y las columnas visibles
      ctrl.cuadriculaSolicitudesAprobadas = {};
      ctrl.cuadriculaSolicitudesAprobadas.columnDefs = [{
        name: 'idSolicitud',
        displayName: $translate.instant("SOLICITUD"),
        width: '9%'
      }, {
        name: 'fechaSolicitud',
        displayName: $translate.instant("FECHA"),
        type: 'date',
        cellFilter: 'date:\'yyyy-MM-dd\'',
        width: '13%'
      }, {
        name: 'codigoEstudiante',
        displayName: $translate.instant("CODIGO"),
        width: '11%'
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
        displayName: $translate.instant("LISTAR_APROBADOS.REGISTRAR"),
        width: '12%',
        cellTemplate: '<btn-registro ' +
          'ng-if="row.entity.respuestaDeSolicitud.EstadoSolicitud.Id == 9 || row.entity.respuestaDeSolicitud.EstadoSolicitud == 12"' +
          'funcion="grid.appScope.listarAprobados.cargarFila(row)"' +
          'grupobotones="grid.appScope.listarAprobados.botonRegistrarTrabajoDeGrado">' +
          '</btn-registro>' +
          '<div class="ui-grid-cell-contents" ' +
          'ng-if="row.entity.respuestaDeSolicitud.EstadoSolicitud.Id == 14">' +
          '{{"LISTAR_APROBADOS.REGISTRO_NO_HABILITADO" | translate}}' +
          '</div>'
      }];

      // Se define la cuadrícula para visualizar los espacios académicos solicitudados
      ctrl.cuadriculaEspaciosAcademicosSolicitados = {};
      ctrl.cuadriculaEspaciosAcademicosSolicitados.columnDefs = [{
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
       * @ngdoc method
       * @name obtenerParametrosPosgradosDelCoordinador
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla coordinador_carrera.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Array} Los parámetros necesarios para realizar la consulta de los posgrados asociados al coordinador
       */
      ctrl.obtenerParametrosPosgradosDelCoordinador = function() {
        return [ctrl.usuarioSesion, "POSGRADO"];
      }

      /**
       * @ngdoc method
       * @name consultarPosgradosAsociados
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que recorre la base de datos de acuerdo al coordinador en sesión y sus posgrados asociados.
       * Llama a la función: obtenerParametrosPosgradosDelCoordinador.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer los posgrados asociados al coordinador.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} La colección de posgrados asociados, o la excepción generada
       */
      ctrl.consultarPosgradosAsociados = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se traen los resultados de los posgrados asociados desde el servicio de académica
        academicaRequest.get("coordinador_carrera", ctrl.obtenerParametrosPosgradosDelCoordinador())
          .then(function(resultadoPosgradosAsociados) {
            // Se verifica que el resultado y los datos necesarios son válidos
            if (!angular.isUndefined(resultadoPosgradosAsociados.data.coordinadorCollection.coordinador)) {
              // Se resuelven los posgrados asociados
              deferred.resolve(resultadoPosgradosAsociados.data.coordinadorCollection.coordinador);
            } else {
              // En caso de no estar definida la respuesta, se rechaza el mensaje correspondiente
              deferred.reject($translate.instant("ERROR.SIN_POSGRADOS"));
            }
          })
          .catch(function(excepcionPosgradosAsociados) {
            // En caso de error se rechaza la petición con el mensaje correspondiente
            deferred.reject($translate.instant("ERROR.CARGANDO_POSGRADOS"));
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name consultarPeriodosCorrespondientes
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que recorre la base de datos hacia los periodos académicos.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer los periodos académicos registrados.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} La colección de periodos correspondientes, o la excepción generada
       */
      ctrl.consultarPeriodosCorrespondientes = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se traen los resultados de los periodos correspondientes desde el servicio de académica
        academicaRequest.get("periodos")
          .then(function(resultadoPeriodosCorrespondientes) {
            // Se verifica que el resultado y los datos necesarios son válidos
            if (!angular.isUndefined(resultadoPeriodosCorrespondientes.data.periodosCollection.datosPeriodos)) {
              // Se resuelven los periodos correspondientes
              deferred.resolve(resultadoPeriodosCorrespondientes.data.periodosCollection.datosPeriodos);
            } else {
              // En caso de no estar definida la respuesta, se rechaza el mensaje correspondiente
              deferred.reject($translate.instant("ERROR.SIN_PERIODO"));
            }
          })
          .catch(function(excepcionPeriodosCorrespondientes) {
            // En caso de error se rechaza la petición con el mensaje correspondiente
            deferred.reject($translate.instant("ERROR.CARGANDO_PERIODO"));
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name consultarPeriodoAcademicoPrevio
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que obtiene el periodo académico según los parámetros de consulta.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer el periodo académico previo al actual.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} El periodo académico previo, o la excepción generada
       */
      ctrl.consultarPeriodoAcademicoPrevio = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia el periodo académico con el servicio de academicaRequest
        // El parámetro "P" consulta el previo periodo académico al actual
        academicaRequest.get("periodo_academico", "P")
          .then(function(periodoAcademicoConsultado) {
            // Se verifica que la respuesta está definida
            if (!angular.isUndefined(periodoAcademicoConsultado.data.periodoAcademicoCollection.periodoAcademico)) {
              // Se resuelve el periodo académico correspondiente
              deferred.resolve(periodoAcademicoConsultado.data.periodoAcademicoCollection.periodoAcademico[0]);
            } else {
              // En caso de no estar definida la respuesta, se rechaza el mensaje correspondiente
              deferred.reject($translate.instant("ERROR.SIN_PERIODO"));
            }
          })
          .catch(function(excepcionPeriodoAcademicoConsultado) {
            // En caso de error se rechaza la petición con el mensaje correspondiente
            deferred.reject($translate.instant("ERROR.CARGANDO_PERIODO"));
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name cargarConsultasIniciales
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que carga las consultas iniciales para poder listar los admitidos.
       * Llama a las funciones: consultarPosgradosAsociados, consultarPeriodosCorrespondientes y consultarPeriodoAcademicoPrevio.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cargarConsultasIniciales = function() {
        // Se garantiza que se cumplan todas las promesas de carga desde un inicio
        $q.all([ctrl.consultarPosgradosAsociados(), ctrl.consultarPeriodosCorrespondientes(), ctrl.consultarPeriodoAcademicoPrevio()])
          .then(function(resultadoConsultasIniciales) {
            // Se apaga el mensaje de carga
            ctrl.cargandoPosgradosAsociados = false;
            // Y se establecen los resultados obtenidos por las consultas iniciales
            ctrl.posgradosAsociados = resultadoConsultasIniciales[0];
            ctrl.periodosCorrespondientes = resultadoConsultasIniciales[1];
            ctrl.periodoAcademicoPrevio = resultadoConsultasIniciales[2];
          })
          .catch(function(excepcionConsultasIniciales) {
            // Se apaga el mensaje de carga y se muestra el error
            ctrl.cargandoPosgradosAsociados = false;
            ctrl.errorCargandoConsultasIniciales = true;
            ctrl.mensajeErrorCargandoConsultasIniciales = excepcionConsultasIniciales;
          });
      }

      /**
       * Se lanza la función que carga las consultas de posgrado asociado al coordinador y el periodo académico correspondientes
       */
      ctrl.cargarConsultasIniciales();

      /**
       * @ngdoc method
       * @name escogerPosgrado
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que se ejecuta cuando se escoge el posgrado asociado desde la vista.
       * Llama a la función: actualizarSolicitudesAprobadas.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultado
       */
      ctrl.escogerPosgrado = function() {
        // Se notifica que el posgrado asociado ha sido escogido
        ctrl.periodoCorrespondienteHabilitado = true;
        // Se estudia si el periodo ha sido seleccionado
        if (ctrl.periodoSeleccionado) {
          // En ese caso, se renueva la consulta de aprobados
          ctrl.actualizarSolicitudesAprobadas();
        }
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosDetalleSolicitudRespondida
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla detalle_solicitud.
       * El detalle tipo solicitud 37 relaciona el detalle y la modalidad para cursar espacios académicos de posgrado.
       * @param {Number} idSolicitudTrabajoGrado Se recibe el identificador de la solicitud de trabajo de grado asociada al usuario
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosDetalleSolicitudRespondida = function(idSolicitudTrabajoGrado) {
        return $.param({
          query: "DetalleTipoSolicitud.Id.in:37|38," +
            "SolicitudTrabajoGrado.Id:" +
            idSolicitudTrabajoGrado,
          limit: 2
        });
      }

      /**
       * @ngdoc method
       * @name consultarDetalleSolicitudRespondida
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que según la solicitud, carga la información correspondiente al detalle de la misma.
       * Llama a la función: obtenerParametrosDetalleSolicitudRespondida.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los detalles de las solicitudes.
       * @param {Object} solicitudAprobada La solicitud para obtener el identificador y cargar la información correspondiente al detalle
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarDetalleSolicitudRespondida = function(solicitudAprobada) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia el detalle de la solicitud aprobada en la base de datos
        poluxRequest.get("detalle_solicitud", ctrl.obtenerParametrosDetalleSolicitudRespondida(solicitudAprobada.SolicitudTrabajoGrado.Id))
          .then(function(detalleSolicitudRespondida) {
            // Se estudia si la información existe y corresponde al posgrado seleccionado
            if (ctrl.obtenerDatosDelPosgrado(detalleSolicitudRespondida.data[0].Descripcion).Codigo == ctrl.posgradoSeleccionado) {
              // Se actualiza el elemento de la colección
              solicitudAprobada.detalleDeSolicitud = detalleSolicitudRespondida.data[0].Descripcion;
              solicitudAprobada.registrarTG1yTG2 = detalleSolicitudRespondida.data[1].Descripcion;
            }
            // Se resuelve el mensaje correspondiente
            deferred.resolve($translate.instant("ERROR.SIN_DETALLE_SOLICITUD"));
          })
          .catch(function(excepcionDetalleSolicitudRespondida) {
            // En caso de error se rechaza la petición con el mensaje correspondiente
            deferred.reject($translate.instant("ERROR.CARGANDO_DETALLE_SOLICITUD"));
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosRespuestaDeSolicitud
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla respuesta_solicitud.
       * Se traen las solicitudes de acuerdo al periodo correspondiente y cuyo estado sean:
       * 9 - Formalizada exenta de pago;
       * 12 - Oficializada;
       * 14 - Cumplida para espacios académicos de posgrado.
       * @param {Number} idSolicitudTrabajoGrado Se recibe el identificador de la solicitud de trabajo de grado asociada al usuario
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosRespuestaDeSolicitud = function(idSolicitudTrabajoGrado) {
        return $.param({
          query: "Activo:True," +
            "EstadoSolicitud.Id.in:9|12|14," +
            "SolicitudTrabajoGrado:" +
            idSolicitudTrabajoGrado,
          limit: 1
        });
      }

      /**
       * @ngdoc method
       * @name consultarRespuestaDeSolicitud
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que según la solicitud, carga la información correspondiente a la respuesta de la misma.
       * Llama a la función: obtenerParametrosRespuestaDeSolicitud.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer la respuesta de las solicitudes.
       * @param {Object} solicitudAprobada La solicitud para obtener el identificador y cargar la información correspondiente a la respuesta
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarRespuestaDeSolicitud = function(solicitudAprobada) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        poluxRequest.get("respuesta_solicitud", ctrl.obtenerParametrosRespuestaDeSolicitud(solicitudAprobada.SolicitudTrabajoGrado.Id))
          .then(function(respuestaDeSolicitud) {
            // Se estudia si la información existe
            if (respuestaDeSolicitud.data) {
              // Se resuelve la solicitud aprobada con el usuario dentro
              solicitudAprobada.respuestaDeSolicitud = respuestaDeSolicitud.data[0];
            }
            // Se resuelve el mensaje correspondiente
            deferred.resolve($translate.instant("ERROR.SIN_RESPUESTA_SOLICITUD"));
          })
          .catch(function(excepcionRespuestaDeSolicitud) {
            // En caso de error se rechaza la petición con el mensaje correspondiente
            deferred.reject($translate.instant("ERROR.CARGANDO_RESPUESTA_SOLICITUD"));
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name consultarInformacionAcademicaDelEstudiante
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que según la solicitud, carga los datos académicos del estudiante asociado.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica registrada.
       * @param {Object} solicitudAprobada La solicitud para obtener el identificador y cargar la información académica del estudiante asociado
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarInformacionAcademicaDelEstudiante = function(solicitudAsociada) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia los datos del estudiante desde el servicio de académica
        academicaRequest.get("datos_estudiante", [solicitudAsociada.Usuario, ctrl.periodoAcademicoPrevio.anio, ctrl.periodoAcademicoPrevio.periodo])
          .then(function(estudianteConsultado) {
            // Se estudia si los resultados de la consulta son válidos
            if (!angular.isUndefined(estudianteConsultado.data.estudianteCollection.datosEstudiante)) {
              // Se resuelve la información académica del estudiante
              solicitudAsociada.informacionAcademica = estudianteConsultado.data.estudianteCollection.datosEstudiante[0];
            }
            // Se resuelve el mensaje correspondiente
            deferred.resolve($translate.instant("ERROR.SIN_INFO_ESTUDIANTE"));
          })
          .catch(function(excepcionEstudianteConsultado) {
            // En caso de error se rechaza la petición con el mensaje correspondiente
            deferred.reject($translate.instant("ERROR.CARGANDO_INFO_ESTUDIANTE"));
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosUsuarioDeSolicitud
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla usuario_solicitud.
       * La modalidad tipo solicitud 13 relaciona el tipo solicitud y modalidad para cursar espacios académicos de posgrado.
       * @param {undefined} undefined No requiere parámetros
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosUsuarioDeSolicitud = function() {
        return $.param({
          query: "SolicitudTrabajoGrado.ModalidadTipoSolicitud.Id:13," +
            "SolicitudTrabajoGrado.PeriodoAcademico:" +
            ctrl.periodoSeleccionado.anio +
            "-" +
            ctrl.periodoSeleccionado.periodo,
          limit: 0
        });
      }

      /**
       * @ngdoc method
       * @name consultarSolicitudesRespondidas
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que consulta las solicitudes respondidas, y les añade la información necesaria para registrar el trabajo de grado.
       * Llama a las funciones: consultarDetalleSolicitudRespondida, consultarRespuestaDeSolicitud y consultarInformacionAcademicaDelEstudiante.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los usuarios con solicitudes registrados.
       * @param {Object} solicitudAprobada La solicitud para obtener el identificador y cargar la información correspondiente a la respuesta
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarSolicitudesRespondidas = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se establece un conjunto de procesamiento de solicitudes que reúne los procesos que deben cargarse antes de ofrecer funcionalidades
        var conjuntoProcesamientoDeSolicitudes = [];
        // Se establece una colección de solicitudes aprobadas para ser inscritas al posgrado
        ctrl.coleccionSolicitudesAprobadas = [];
        // Se consulta hacia las solicitudes respondidas en la base de datos
        poluxRequest.get("usuario_solicitud", ctrl.obtenerParametrosUsuarioDeSolicitud())
          .then(function(usuariosConSolicitudes) {
            if (usuariosConSolicitudes.data) {
              angular.forEach(usuariosConSolicitudes.data, function(solicitudAprobada) {
                conjuntoProcesamientoDeSolicitudes.push(ctrl.consultarDetalleSolicitudRespondida(solicitudAprobada));
                conjuntoProcesamientoDeSolicitudes.push(ctrl.consultarRespuestaDeSolicitud(solicitudAprobada));
                conjuntoProcesamientoDeSolicitudes.push(ctrl.consultarInformacionAcademicaDelEstudiante(solicitudAprobada));
              });
              $q.all(conjuntoProcesamientoDeSolicitudes)
                .then(function(resultadoSolicitudesProcesadas) {
                  // Se filtra el contenido de las solicitudes aprobadas
                  angular.forEach(usuariosConSolicitudes.data, function(solicitudAprobada) {
                    if (solicitudAprobada.detalleDeSolicitud &&
                      solicitudAprobada.registrarTG1yTG2 &&
                      solicitudAprobada.respuestaDeSolicitud &&
                      solicitudAprobada.informacionAcademica) {
                      ctrl.coleccionSolicitudesAprobadas.push(solicitudAprobada);
                    }
                  });
                  // Se resuelve el resultado del procesamiento
                  deferred.resolve(resultadoSolicitudesProcesadas);
                })
                .catch(function(excepcionSolicitudesProcesadas) {
                  // Se rechaza la carga con la excepción generada
                  deferred.reject(excepcionSolicitudesProcesadas);
                });
            } else {
              // En caso de no estar definida la información, se rechaza el mensaje correspondiente
              deferred.reject($translate.instant("ERROR.SIN_USUARIO_SOLICITUD"));
            }
          })
          .catch(function(excepcionSolicitudesRespondidas) {
            // En caso de error se rechaza la petición con el mensaje correspondiente
            deferred.reject($translate.instant("ERROR.CARGANDO_USUARIO_SOLICITUD"));
          });
        // Se devuelve el diferido que maperneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name mostrarSolicitudesAprobadas
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que carga las solicitudes aprobadas a la cuadrícula con la información correspondiente.
       * Llama a la función: obtenerDatosDelPosgrado.
       * @param {Array} solicitudesAprobadas La colección de solicitudes aprobadas ya consultadas
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.mostrarSolicitudesAprobadas = function(solicitudesAprobadas) {
        // Se recorren las solicitudes aprobadas para obtener los datos correspondientes
        angular.forEach(solicitudesAprobadas, function(solicitudAprobada) {
          // Se asignan los campos reconocidos por la cuadrícula
          solicitudAprobada.idSolicitud = solicitudAprobada.SolicitudTrabajoGrado.Id;
          solicitudAprobada.fechaSolicitud = moment(new Date(solicitudAprobada.SolicitudTrabajoGrado.Fecha)).format("YYYY-MM-DD HH:mm");
          solicitudAprobada.codigoEstudiante = solicitudAprobada.Usuario;
          solicitudAprobada.nombreEstudiante = solicitudAprobada.informacionAcademica.nombre;
          solicitudAprobada.promedioAcademico = solicitudAprobada.informacionAcademica.promedio;
          solicitudAprobada.nombreEstado = solicitudAprobada.respuestaDeSolicitud.EstadoSolicitud.Nombre;
          // Y los campos relacionados con el detalle que se necesitarán para la descripción de la solicitud
          solicitudAprobada.codigoPosgrado = ctrl.obtenerDatosDelPosgrado(solicitudAprobada.detalleDeSolicitud).Codigo;
          solicitudAprobada.nombrePosgrado = ctrl.obtenerDatosDelPosgrado(solicitudAprobada.detalleDeSolicitud).Nombre;
          solicitudAprobada.pensumPosgrado = ctrl.obtenerDatosDelPosgrado(solicitudAprobada.detalleDeSolicitud).Pensum;
        });
        // Se cargan los datos visibles a la cuadrícula
        ctrl.cuadriculaSolicitudesAprobadas.data = solicitudesAprobadas;
      }

      /**
       * @ngdoc method
       * @name actualizarSolicitudesAprobadas
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que actualiza el contenido de la lista de aprobados al posgrado.
       * Llama a las funciones: consultarSolicitudesRespondidas y mostrarSolicitudesAprobadas.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.actualizarSolicitudesAprobadas = function() {
        // Se recargan las solicitudes visibles
        ctrl.cuadriculaSolicitudesAprobadas.data = [];
        // Se establece que inicia la carga de las solicitudes aprobadas
        ctrl.cargandoSolicitudesAprobadas = true;
        ctrl.errorCargandoConsultasIniciales = false;
        ctrl.errorCargandoSolicitudesAprobadas = false;
        // Se consultan las solicitudes respondidas
        ctrl.consultarSolicitudesRespondidas()
          .then(function(resultadoConsultaSolicitudesRespondidas) {
            // Se detiene la carga
            ctrl.cargandoSolicitudesAprobadas = false;
            // Se estudia si hay resultados válidos
            if (ctrl.coleccionSolicitudesAprobadas.length > 0) {
              // Y se muestra la cuadrícula
              ctrl.mostrarSolicitudesAprobadas(ctrl.coleccionSolicitudesAprobadas);
            } else {
              // Se muestra el error
              ctrl.errorCargandoSolicitudesAprobadas = true;
              ctrl.mensajeErrorCargandoSolicitudesAprobadas = resultadoConsultaSolicitudesRespondidas[0];
            }
          })
          .catch(function(excepcionSolicitudesRespondidas) {
            // Se detiene la carga y se muestra el error
            ctrl.cargandoSolicitudesAprobadas = false;
            ctrl.errorCargandoSolicitudesAprobadas = true;
            ctrl.mensajeErrorCargandoSolicitudesAprobadas = excepcionSolicitudesRespondidas;
          });
      }

      /**
       * @ngdoc method
       * @name cargarFila
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que carga la fila asociada según la selección del usuario.
       * Llama a la función: cargarSolicitudSeleccionada.
       * @param {Object} filaAsociada La solicitud que el coordinador seleccionó
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cargarFila = function(filaAsociada) {
        ctrl.cargarSolicitudSeleccionada(filaAsociada.entity);
      }

      /**
       * @ngdoc method
       * @name obtenerDatosDelPosgrado
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que de acuerdo al detalle de la solicitud, obtiene los datos del posgrado.
       * @param {Object} detalleDeSolicitud El detalle de la solicitud con el formato de almacenado en la base de datos
       * @returns {Object} Los datos del posgrado clasificados en una variable
       */
      ctrl.obtenerDatosDelPosgrado = function(detalleDeSolicitud) {
        return JSON.parse(detalleDeSolicitud.split("-")[1]);
      }

      /**
       * @ngdoc method
       * @name obtenerEspaciosAcademicos
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que obtiene la información de los espacios académicos de acuerdo al detalle de la solicitud.
       * @param {Array} detalleDeSolicitud La colección de registros en el formato que se almacenan en la base de datos
       * @returns {Array} La colección de espacios académicos
       */
      ctrl.obtenerEspaciosAcademicos = function(detalleDeSolicitud) {
        // Se prepara una colección que contendrá los espacios académicos
        var espaciosAcademicos = [];
        // Se define una variable que interprete el formato del detalle de la solicitud recibida
        // de modo que se obtenga la información de los espacios académicos (estos inician desde el índice 2)
        var detallePosgrado = detalleDeSolicitud.split("-").slice(2);
        // Se recorre la información de los espacios académicos almacenados
        angular.forEach(detallePosgrado, function(espacioAcademico) {
          // Como el formato de almacenado guarda en cada posición el objeto de espacio académico,
          // se pasa a formato JSON para obtener su contenido
          var objetoEspacioAcademico = JSON.parse(espacioAcademico);
          // Se ajusta la información para conformar el objeto de espacio académico
          var informacionEspacioAcademico = {
            "id": objetoEspacioAcademico.Id,
            "codigo": objetoEspacioAcademico.CodigoAsignatura,
            "nombre": objetoEspacioAcademico.Nombre,
            "creditos": objetoEspacioAcademico.Creditos
          };
          // Se registra el espacio académico en la colección a modo de objeto
          espaciosAcademicos.push(informacionEspacioAcademico);
        });
        return espaciosAcademicos;
      }

      /**
       * @ngdoc method
       * @name cargarSolicitudSeleccionada
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que carga la solicitud seleccionada por el coordinador en sesión.
       * Llama a la función: obtenerEspaciosAcademicos.
       * @param {Object} solicitudSeleccionada La solicitud que el coordinador desea registrar
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cargarSolicitudSeleccionada = function(solicitudSeleccionada) {
        // Se detiene la carga de la transacción
        ctrl.cargandoTransaccionRegistro = false;
        // Se establece la variable que mantiene la solicitud seleccionada
        ctrl.solicitudSeleccionada = solicitudSeleccionada;
        // Se establecen los espacios académicos que se verán en la ventana emergente
        ctrl.cuadriculaEspaciosAcademicosSolicitados.data = ctrl.obtenerEspaciosAcademicos(solicitudSeleccionada.detalleDeSolicitud);
        // Se muestra el modal que describe la solicitud seleccionada
        $('#modalVerSolicitud').modal('show');
      }

      /**
       * @ngdoc method
       * @name confirmarRegistroSolicitud
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que maneja la confirmación del coordinador para registrar la solicitud.
       * Llama a la función: actualizarSolicitudesAprobadas.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.confirmarRegistroSolicitud = function() {
        swal({
            title: $translate.instant("INFORMACION_SOLICITUD"),
            text: $translate.instant("LISTAR_APROBADOS.REGISTRAR_ESTUDIANTE", {
              // Se cargan datos de la solicitud para que el coordinador pueda verificar antes de registrar
              nombre: ctrl.solicitudSeleccionada.nombreEstudiante,
              codigo: ctrl.solicitudSeleccionada.codigoEstudiante,
              estado: ctrl.solicitudSeleccionada.nombreEstado
            }),
            type: "info",
            confirmButtonText: $translate.instant("ACEPTAR"),
            cancelButtonText: $translate.instant("CANCELAR"),
            showCancelButton: true
          })
          .then(function(confirmacionDelUsuario) {
            // Se valida que el coordinador haya confirmado el registro
            if (confirmacionDelUsuario.value) {
              // Se detiene la visualización de solicitudes mientras se formaliza
              ctrl.cuadriculaSolicitudesAprobadas.data = [];
              // Se inicia la carga del formulario mientras se formaliza
              ctrl.cargandoTransaccionRegistro = true;
              // Se lanza la transacción
              ctrl.registrarSolicitudAprobada()
                .then(function(respuestaRegistrarSolicitudAprobada) {
                  // Se estudia si la transacción fue exitosa
                  if (respuestaRegistrarSolicitudAprobada.data[0] === "Success") {
                    // De serlo, se detiene la carga, notifica al usuario y actualizan los resultados
                    ctrl.cargandoTransaccionRegistro = false;
                    swal(
                      $translate.instant("LISTAR_APROBADOS.AVISO"),
                      $translate.instant("LISTAR_APROBADOS.ESTUDIANTE_REGISTRADO"),
                      'success'
                    );
                    ctrl.actualizarSolicitudesAprobadas();
                    $('#modalVerSolicitud').modal('hide');
                  } else {
                    // De lo contrario, se detiene la carga y notifica al usuario
                    ctrl.cargandoTransaccionRegistro = false;
                    swal(
                      $translate.instant("LISTAR_APROBADOS.AVISO"),
                      $translate.instant(respuestaRegistrarSolicitudAprobada.data[1]),
                      'warning'
                    );
                  }
                })
                .catch(function(excepcionRegistrarSolicitudAprobada) {
                  // En caso de fallar el envío de los datos, se detiene la carga y notifica al usuario
                  ctrl.cargandoTransaccionRegistro = false;
                  swal(
                    $translate.instant("LISTAR_APROBADOS.AVISO"),
                    $translate.instant("ERROR.REGISTRANDO_MODALIDAD"),
                    'warning'
                  );
                });
            }
          });
      }

      /**
       * @ngdoc method
       * @name registrarSolicitudAprobada
       * @methodOf poluxClienteApp.controller:MateriasPosgradoListarAprobadosCtrl
       * @description
       * Función que prepara el contenido de la información para actualizar.
       * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para registrar los resultados del registro del trabajo de grado en la base de datos.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.registrarSolicitudAprobada = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se desactiva la solicitud previa y se mantiene el registro
        var solicitudAprobadaSeleccionada = {
          Activo: false,
          EnteResponsable: ctrl.solicitudSeleccionada.respuestaDeSolicitud.EnteResponsable,
          Fecha: ctrl.solicitudSeleccionada.respuestaDeSolicitud.Fecha,
          EstadoSolicitud: {
            Id: ctrl.solicitudSeleccionada.respuestaDeSolicitud.EstadoSolicitud.Id
          },
          Id: ctrl.solicitudSeleccionada.respuestaDeSolicitud.Id,
          Justificacion: ctrl.solicitudSeleccionada.respuestaDeSolicitud.Justificacion,
          SolicitudTrabajoGrado: {
            Id: ctrl.solicitudSeleccionada.SolicitudTrabajoGrado.Id
          },
          Usuario: ctrl.solicitudSeleccionada.respuestaDeSolicitud.Usuario
        };
        // Se establece la nueva solicitud con cumplida para espacios académicos de posgrado
        var solicitudAprobadaActualizada = {
          Activo: true,
          EnteResponsable: ctrl.solicitudSeleccionada.respuestaDeSolicitud.EnteResponsable,
          Fecha: new Date(),
          EstadoSolicitud: {
            // 14 - Cumplida para espacios académicos de posgrado
            Id: 14
          },
          Justificacion: "Se ha registrado el trabajo de grado a solicitud del estudiante",
          SolicitudTrabajoGrado: {
            Id: ctrl.solicitudSeleccionada.SolicitudTrabajoGrado.Id
          },
          Usuario: parseInt(ctrl.usuarioSesion)
        };
        // Se crea el trabajo de grado para ser registrado en la base de datos
        var trabajoDeGradoParaRegistrar = {
          Titulo: "Cursar materias de posgrado en " + ctrl.solicitudSeleccionada.nombrePosgrado,
          Modalidad: {
            Id: ctrl.solicitudSeleccionada.SolicitudTrabajoGrado.ModalidadTipoSolicitud.Modalidad.Id
          },
          EstadoTrabajoGrado: {
            // 20 - Estado de trabajo de grado en cursando espacios académicos de posgrado
            Id: 20
          },
          DistincionTrabajoGrado: null,
          PeriodoAcademico: ctrl.solicitudSeleccionada.SolicitudTrabajoGrado.PeriodoAcademico
        };
        // Se inscribe el estudiante solicitante en la base de datos
        var estudianteAsociadoTrabajoDeGrado = {
          Estudiante: ctrl.solicitudSeleccionada.codigoEstudiante,
          TrabajoGrado: {
            Id: 0
          },
          EstadoEstudianteTrabajoGrado: {
            Id: 1
          }
        };
        // Se prepara una colección que maneje los espacios académicos inscritos
        var espaciosAcademicosInscritos = []
        // Se recorre la colección de espacios académicos mostrados y se añaden los campos correspondientes a la estructura en la base de datos
        angular.forEach(ctrl.cuadriculaEspaciosAcademicosSolicitados.data, function(espacioAcademico) {
          espaciosAcademicosInscritos.push({
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
        // Se prepara una colección que maneje las asignaturas de trabajo de grado
        var asignaturasDeTrabajoDeGrado = [];
        // Se estructura el contenido del objeto asignatura trabajo grado
        var asignaturaTrabajoGrado = {
          CodigoAsignatura: 0,
          Periodo: parseInt(ctrl.periodoSeleccionado.periodo),
          Anio: parseInt(ctrl.periodoSeleccionado.anio),
          Calificacion: 0.0,
          TrabajoGrado: {
            Id: 0
          },
          // El estado asignatura trabajo grado 1 es cursando
          EstadoAsignaturaTrabajoGrado: {
            Id: 1
          }
        }
        // Se estudia si la solicitud indica la inscripción de ambos espacios académicos
        if (ctrl.solicitudSeleccionada.registrarTG1yTG2 == "SI") {
          var numeroAsignaturasTrabajoGrado = 2;
          for (var item = 0; item < numeroAsignaturasTrabajoGrado; item++) {
            asignaturasDeTrabajoDeGrado.push(asignaturaTrabajoGrado);
          }
        } else {
          asignaturasDeTrabajoDeGrado.push(asignaturaTrabajoGrado);
        }
        // Se define el objeto para enviar como información para actualizar
        var informacionParaActualizar = {
          "RespuestaPrevia": solicitudAprobadaSeleccionada,
          "RespuestaActualizada": solicitudAprobadaActualizada,
          "TrabajoGrado": trabajoDeGradoParaRegistrar,
          "EstudianteTrabajoGrado": estudianteAsociadoTrabajoDeGrado,
          "EspaciosAcademicos": espaciosAcademicosInscritos,
          "AsignaturasDeTrabajoDeGrado": asignaturasDeTrabajoDeGrado
        };
        // Se realiza la petición post hacia la transacción con la información para registrar la modalidad
        poluxRequest
          .post("tr_registrar_materias_posgrado", informacionParaActualizar)
          .then(function(respuestaRegistrarMateriasPosgrado) {
            deferred.resolve(respuestaRegistrarMateriasPosgrado);
          })
          .catch(function(excepcionRegistrarMateriasPosgrado) {
            deferred.reject(excepcionRegistrarMateriasPosgrado);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

    });