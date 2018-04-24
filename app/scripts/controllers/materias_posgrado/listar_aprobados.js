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

      // Se inhabilita la selección del periodo correspondiente
      $scope.periodoCorrespondienteHabilitado = false;

      // Se configura el mensaje mientras se cargan las solicitudes aprobadas
      $scope.mensajeCargandoSolicitudesAprobadas = $translate.instant("LOADING.CARGANDO_SOLICITUDES_APROBADAS");

      // Se configura el mensaje mientras se carga la transacción de registro
      $scope.mensajeCargandoTransaccionRegistro = $translate.instant("LOADING.CARGANDO_TRANSACCION_REGISTRO");

      $scope.opcionesSolicitud = [{
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
        displayName: $translate.instant("LISTAR_APROBADOS.REGISTRAR"),
        width: '15%',
        cellTemplate: '<btn-registro funcion="grid.appScope.cargarFila(row)" grupobotones="grid.appScope.opcionesSolicitud"></btn-registro>'
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
            // Se define el mensaje de error cuando no se pueden cargar los posgrados asociados y los periodos correspondientes
            $scope.mensajeErrorCargandoConsultasIniciales = $translate.instant("ERROR.SIN_INFO_ACADEMICA");
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
            // Se define el mensaje de error cuando no se pueden cargar los posgrados asociados y los periodos correspondientes
            $scope.mensajeErrorCargandoConsultasIniciales = $translate.instant("ERROR.SIN_INFO_ACADEMICA");
            // Se rechaza la promesa
            deferred.reject(false);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que obtiene el periodo académico según los parámetros de consulta]
       * @return {[Promise]} [El periodo académico, o la excepción generada]
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
              ctrl.periodoAcademicoPrevio = periodoAcademicoConsultado.data.periodoAcademicoCollection.periodoAcademico[0];
              deferred.resolve(true);
            } else {
              // En caso de error se prepara el mensaje y se rechaza con nulo
              $scope.mensajeErrorCargandoConsultasIniciales = $translate.instant("ERROR.SIN_PERIODO");
              // Se rechaza nulamente la consulta
              deferred.reject(false);
            }
          })
          .catch(function(excepcionPeriodoAcademicoConsultado) {
            // En caso de excepción se prepara el mensaje y se rechaza con nulo
            $scope.mensajeErrorCargandoConsultasIniciales = $translate.instant("ERROR.CARGANDO_PERIODO");
            // Se rechaza nulamente la consulta
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
        $q.all([ctrl.consultarPosgradosAsociados(), ctrl.consultarPeriodosCorrespondientes(), ctrl.consultarPeriodoAcademicoPrevio()])
          .then(function(respuestaConsultas) {
            // Se apaga el mensaje de carga
            $scope.cargandoPosgrados = false;
          })
          .catch(function(excepcionConsultas) {
            // Se apaga el mensaje de carga
            $scope.cargandoPosgrados = false;
            $scope.errorCargandoConsultasIniciales = true;
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
              // Se quita la asociación de la solicitud con nula información de la colección de solicitudes
              var itemInconsistente = ctrl.coleccionSolicitudesParaFormalizar
                .map(function(solicitudAprobadaInconsistente) {
                  return solicitudAprobadaInconsistente.Id;
                })
                .indexOf(solicitudAprobada.Id);
              ctrl.coleccionSolicitudesParaFormalizar.splice(itemInconsistente, 1);
              // Se establece el mensaje de error con la nula existencia de datos
              $scope.mensajeErrorCargandoSolicitudesAprobadas = $translate.instant("ERROR.SIN_DETALLE_SOLICITUD");
              deferred.resolve(null);
            }
          })
          .catch(function(excepcionDetalleSolicitudRespondida) {
            // Se presenta cuando ocurrió un error al traer el detalle de las solicitudes desde la tabla detalle_solicitud
            $scope.mensajeErrorCargandoSolicitudesAprobadas = $translate.instant("ERROR.CARGANDO_DETALLE_SOLICITUD");
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
                  deferred.reject(null);
                });
            } else {
              // Se quita la asociación de la solicitud con nula información de la colección de solicitudes
              var itemInconsistente = ctrl.coleccionSolicitudesParaFormalizar
                .map(function(solicitudAprobadaInconsistente) {
                  return solicitudAprobadaInconsistente.Id;
                })
                .indexOf(solicitudAprobada.Id);
              ctrl.coleccionSolicitudesParaFormalizar.splice(itemInconsistente, 1);
              // Se establece el mensaje de error con la nula existencia de datos
              $scope.mensajeErrorCargandoSolicitudesAprobadas = $translate.instant("ERROR.SIN_USUARIO_SOLICITUD");
              deferred.resolve(null);
            }
          })
          .catch(function(excepcionUsuarioDeSolicitud) {
            // Se presenta cuando ocurrió un error al traer el detalle de las solicitudes desde la tabla detalle_solicitud
            $scope.mensajeErrorCargandoSolicitudesAprobadas = $translate.instant("ERROR.CARGANDO_USUARIO_SOLICITUD");
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
         * Se traen las solicitudes de acuerdo al periodo correspondiente
         * y cuyo estado sean:
         * 9 - Formalizada exenta de pago
         * 12 - Oficializada
         */
        return $.param({
          query: "EstadoSolicitud.Id.in:9|12," +
            "Activo:True," +
            "SolicitudTrabajoGrado.PeriodoAcademico:" +
            ctrl.periodoSeleccionado.anio +
            "-" +
            ctrl.periodoSeleccionado.periodo,
          limit: 0
        });
      }

      /**
       * [Función que consulta las solicitudes respondidas, y les añade los detalles necesarios para registrar el trabajo de grado]
       * @return {[Promise]} [La colección de solicitudes aprobadas, o la excepción generada]
       */
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
                  // Se rechaza la carga con la excepción generada
                  deferred.reject(excepcionDuranteProcesamiento);
                });
            } else {
              // Se presenta cuando no hay solicitudes respondidas con los parámetros establecidos
              $scope.mensajeErrorCargandoSolicitudesAprobadas = $translate.instant("ERROR.SIN_RESPUESTA_SOLICITUD");
              deferred.reject(null);
            }
          })
          .catch(function(excepcionSolicitudesRespondidas) {
            // Se presenta cuando ocurrió un error al traer las solicitudes desde la tabla respuesta_solicitud
            $scope.mensajeErrorCargandoSolicitudesAprobadas = $translate.instant("ERROR.CARGANDO_RESPUESTA_SOLICITUD");
            deferred.reject(null);
          });
        // Se devuelve el diferido que maperneja la promesa
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
        academicaRequest.get("datos_estudiante", [codigoUsuarioConSolicitudAprobada, ctrl.periodoAcademicoPrevio.anio, ctrl.periodoAcademicoPrevio.periodo])
          .then(function(estudianteConsultado) {
            // Se estudia si los resultados de la consulta son válidos
            if (!angular.isUndefined(estudianteConsultado.data.estudianteCollection.datosEstudiante)) {
              // Se resuelve la información académica del estudiante
              deferred.resolve(estudianteConsultado.data.estudianteCollection.datosEstudiante[0]);
            } else {
              // Se presenta cuando no existe registro de estudiantes con dichas características
              $scope.mensajeErrorCargandoSolicitudesAprobadas = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
              deferred.reject(null);
            }
          })
          .catch(function(excepcionEstudianteConsultado) {
            // Se presenta cuando ocurrió un error al traer la información desde la petición académica
            $scope.mensajeErrorCargandoSolicitudesAprobadas = $translate.instant("ERROR.CARGANDO_INFO_ESTUDIANTE");
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
        // Se recorren las solicitudes aprobadas para obtener los datos correspondientes
        angular.forEach(solicitudesAprobadas, function(solicitudAprobada) {
          // Se asignan los campos reconocidos por la cuadrícula
          solicitudAprobada.idSolicitud = solicitudAprobada.SolicitudTrabajoGrado.Id;
          solicitudAprobada.fechaSolicitud = solicitudAprobada.Fecha;
          solicitudAprobada.codigoEstudiante = solicitudAprobada.estudianteAsociado.codigo;
          solicitudAprobada.nombreEstudiante = solicitudAprobada.estudianteAsociado.nombre;
          solicitudAprobada.promedioAcademico = solicitudAprobada.estudianteAsociado.promedio;
          solicitudAprobada.nombreEstado = solicitudAprobada.EstadoSolicitud.Nombre;
        });
        // Se cargan los datos visibles a la cuadrícula
        ctrl.cuadriculaSolicitudesAprobadas.data = solicitudesAprobadas;
      }

      /**
       * [Función que actualiza el contenido de la lista de aprobados al posgrado]
       * @return {[void]} [El procedimiento de carga, o la excepción generada]
       */
      ctrl.consultarSolicitudesAprobadas = function() {
        // Se recargan las solicitudes visibles
        ctrl.cuadriculaSolicitudesAprobadas.data = [];
        // Se establece que inicia la carga de las solicitudes aprobadas
        $scope.errorCargandoConsultasIniciales = false;
        $scope.errorCargandoSolicitudesAprobadas = false;
        $scope.cargandoSolicitudesAprobadas = true;
        // Se consultan las solicitudes respondidas
        ctrl.consultarSolicitudesRespondidas()
          .then(function(solicitudesRespondidas) {
            // Se redefinen los errores, se detiene la carga
            $scope.errorCargandoConsultasIniciales = false;
            $scope.errorCargandoSolicitudesAprobadas = false;
            $scope.cargandoSolicitudesAprobadas = false;
            // Y se muestra la cuadrícula
            ctrl.mostrarSolicitudesAprobadas(solicitudesRespondidas);
          })
          .catch(function(excepcionSolicitudesRespondidas) {
            // Se detiene la carga y se muestra el error
            $scope.errorCargandoSolicitudesAprobadas = true;
            $scope.cargandoSolicitudesAprobadas = false;
          });
      }

      /**
       * [Función que carga la fila asociada según la selección del usuario]
       * @param  {[row]} filaAsociada [Es la solicitud que el usuario seleccionó]
       */
      $scope.cargarFila = function(filaAsociada) {
        ctrl.cargarSolicitudSeleccionada(filaAsociada.entity);
      }

      /**
       * [Función que recibe una fecha extendida y obtiene sus valores generales de presentación]
       * @param  {[Date]} fechaCompleta [La fecha en formato extendido]
       * @return {[String]}               [La cadena de caracteres presentable]
       */
      ctrl.obtenerFechaGeneral = function(fechaCompleta) {
        return fechaCompleta.getFullYear() +
          "-" + fechaCompleta.getMonth() + 1 +
          "-" + fechaCompleta.getDate();
      }

      /**
       * [Función que de acuerdo al detalle de la solicitud, obtiene los datos del posgrado]
       * @param  {[type]} detalleSolicitud [El detalle de la solicitud con el formato de almacenado en la base de datos]
       * @return {[type]}                  [El objeto con los datos del posgrado]
       */
      ctrl.obtenerDatosDelPosgrado = function(detalleSolicitud) {
        return JSON.parse(detalleSolicitud.Descripcion.split("-")[1]);
      }

      /**
       * [Función que obtiene los espacios académicos por su nombre]
       * @param  {[Array]} detalleSolicitud [Tiene la colección de registros en el formato que se almacenan en la base de datos]
       * @return {[Array]}                  [Devuelve la colección de espacios académicos por nombre]
       */
      ctrl.obtenerEspaciosAcademicos = function(detalleSolicitud) {
        // Se prepara una colección que contendrá los espacios académicos
        var espaciosAcademicos = [];
        // Se define una variable que interprete el formato del detalle de la solicitud recibida
        // de modo que se obtenga la información de los espacios académicos (estos inician desde el índice 2)
        var detallePosgrado = detalleSolicitud.Descripcion.split("-").slice(2);
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
       * [Función que carga la solicitud seleccionada por el coordinador en sesión]
       * @param  {[row]} solicitudSeleccionada [La solicitud que el coordinador desea registrar]
       */
      ctrl.cargarSolicitudSeleccionada = function(solicitudSeleccionada) {
        // Se establece la variable que mantiene la solicitud seleccionada
        ctrl.solicitudSeleccionada = solicitudSeleccionada;
        // Se establecen los espacios que se verán en la ventana emergente
        ctrl.nombreEstudianteSolicitante = solicitudSeleccionada.nombreEstudiante;
        ctrl.codigoEstudianteSolicitante = solicitudSeleccionada.codigoEstudiante;
        ctrl.promedioEstudianteSolicitante = solicitudSeleccionada.promedioAcademico;
        ctrl.rendimientoEstudianteSolicitante = solicitudSeleccionada.estudianteAsociado.rendimiento;
        ctrl.numeroSolicitud = solicitudSeleccionada.SolicitudTrabajoGrado.Id;
        ctrl.fechaSolicitud = ctrl.obtenerFechaGeneral(new Date(solicitudSeleccionada.Fecha));
        ctrl.estadoSolicitud = solicitudSeleccionada.nombreEstado;
        ctrl.codigoPosgrado = ctrl.obtenerDatosDelPosgrado(solicitudSeleccionada.detalleSolicitud).Codigo;
        ctrl.nombrePosgrado = ctrl.obtenerDatosDelPosgrado(solicitudSeleccionada.detalleSolicitud).Nombre;
        ctrl.pensumPosgrado = ctrl.obtenerDatosDelPosgrado(solicitudSeleccionada.detalleSolicitud).Pensum;
        ctrl.cuadriculaEspaciosAcademicosSolicitados.data = ctrl.obtenerEspaciosAcademicos(solicitudSeleccionada.detalleSolicitud);
        $scope.cargandoTransaccionRegistro = false;
        $('#modalVerSolicitud').modal('show');
      }

      /**
       * [Función que maneja la confirmación del coordinador para registrar la solicitud]
       * @return {[void]} [El procedimiento que regula la confirmación para poder registrar en la base de datos]
       */
      ctrl.confirmarRegistroSolicitud = function() {
        swal({
            title: $translate.instant("INFORMACION_SOLICITUD"),
            text: $translate.instant("LISTAR_APROBADOS.REGISTRAR_ESTUDIANTE", {
              // Se cargan datos de la solicitud para que el coordinador pueda verificar antes de registrar
              nombre: ctrl.nombreEstudianteSolicitante,
              codigo: ctrl.codigoEstudianteSolicitante,
              estado: ctrl.estadoSolicitud
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
              $scope.cargandoTransaccionRegistro = true;
              // Se lanza la transacción
              ctrl.registrarSolicitudAprobada()
                .then(function(respuestaRegistrarSolicitudAprobada) {
                  // Se estudia si la transacción fue exitosa
                  if (respuestaRegistrarSolicitudAprobada.data[0] === "Success") {
                    // De serlo, se detiene la carga, notifica al usuario y actualizan los resultados
                    $scope.cargandoTransaccionRegistro = false;
                    swal(
                      $translate.instant("LISTAR_APROBADOS.AVISO"),
                      $translate.instant("LISTAR_APROBADOS.ESTUDIANTE_REGISTRADO"),
                      'success'
                    );
                    ctrl.consultarSolicitudesAprobadas();
                    $('#modalVerSolicitud').modal('hide');
                  } else {
                    // De lo contrario, se detiene la carga y notifica al usuario
                    $scope.cargandoTransaccionRegistro = false;
                    swal(
                      $translate.instant("LISTAR_APROBADOS.AVISO"),
                      $translate.instant(respuestaRegistrarSolicitudAprobada.data[1]),
                      'warning'
                    );
                  }
                })
                .catch(function(excepcionRegistrarSolicitudAprobada) {
                  // En caso de fallar el envío de los datos, se detiene la carga y notifica al usuario
                  $scope.cargandoTransaccionRegistro = false;
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
       * [Función que prepara el contenido de la información para actualizar]
       * @return {[Promise]} [La respuesta de enviar la información para actualizar a la base de datos]
       */
      ctrl.registrarSolicitudAprobada = function() {
        var defered = $q.defer();
        // Se desactiva la solicitud previa y se mantiene el registro
        ctrl.solicitudAprobadaSeleccionada = {
          Activo: false,
          EnteResponsable: ctrl.solicitudSeleccionada.EnteResponsable,
          Fecha: ctrl.solicitudSeleccionada.Fecha,
          EstadoSolicitud: {
            Id: ctrl.solicitudSeleccionada.EstadoSolicitud.Id
          },
          Id: ctrl.solicitudSeleccionada.Id,
          Justificacion: ctrl.solicitudSeleccionada.Justificacion,
          SolicitudTrabajoGrado: {
            Id: ctrl.solicitudSeleccionada.SolicitudTrabajoGrado.Id
          },
          Usuario: ctrl.solicitudSeleccionada.Usuario
        };
        // Se establece la nueva solicitud con cumplida para espacios académicos de posgrado
        ctrl.solicitudAprobadaActualizada = {
          Activo: true,
          EnteResponsable: ctrl.solicitudSeleccionada.EnteResponsable,
          Fecha: new Date(),
          EstadoSolicitud: {
            // 14 - Cumplida para espacios académicos de posgrado
            Id: 14
          },
          Justificacion: "Se ha registrado el trabajo de grado a solicitud del estudiante",
          SolicitudTrabajoGrado: {
            Id: ctrl.solicitudSeleccionada.SolicitudTrabajoGrado.Id
          },
          Usuario: parseInt($scope.userId)
        };
        // Se crea el trabajo de grado para ser registrado en la base de datos
        ctrl.trabajoDeGradoParaRegistrar = {
          Titulo: "Cursar materias de posgrado en " + ctrl.nombrePosgrado,
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
        ctrl.estudianteAsociadoTrabajoDeGrado = {
          Estudiante: ctrl.codigoEstudianteSolicitante,
          TrabajoGrado: {
            Id: 0
          },
          EstadoEstudianteTrabajoGrado: {
            Id: 1
          }
        };
        // Se prepara una colección que maneje los espacios académicos inscritos
        ctrl.espaciosAcademicosInscritos = []
        // Se recorre la colección de espacios académicos mostrados y se añaden los campos correspondientes a la estructura en la base de datos
        angular.forEach(ctrl.cuadriculaEspaciosAcademicosSolicitados.data, function(espacioAcademico) {
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
        // Se define el objeto para enviar como información para actualizar
        ctrl.informacionParaActualizar = {
          "RespuestaPrevia": ctrl.solicitudAprobadaSeleccionada,
          "RespuestaActualizada": ctrl.solicitudAprobadaActualizada,
          "TrabajoGrado": ctrl.trabajoDeGradoParaRegistrar,
          "EstudianteTrabajoGrado": ctrl.estudianteAsociadoTrabajoDeGrado,
          "EspaciosAcademicos": ctrl.espaciosAcademicosInscritos
        };
        // Se realiza la petición post hacia la transacción con la información para registrar la modalidad
        poluxRequest
          .post("tr_registrar_materias_posgrado", ctrl.informacionParaActualizar)
          .then(function(respuestaRegistrarMateriasPosgrado) {
            defered.resolve(respuestaRegistrarMateriasPosgrado);
          })
          .catch(function(excepcionRegistrarMateriasPosgrado) {
            defered.reject(excepcionRegistrarMateriasPosgrado);
          });
        // Se devuelve el diferido que maneja la promesa
        return defered.promise;
      }

    });