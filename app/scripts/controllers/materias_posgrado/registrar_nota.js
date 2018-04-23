'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
 * @description
 * # MateriasPosgradoRegistrarNotaCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoRegistrarNotaCtrl',
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
      $scope.mensajeCargandoTrabajosDeGrado = $translate.instant("LOADING.CARGANDO_TRABAJOS_DE_GRADO");

      // Se configura el mensaje mientras se carga la transacción de registro
      $scope.mensajeCargandoTransaccionRegistro = $translate.instant("LOADING.CARGANDO_TRANSACCION_REGISTRO");

      $scope.opcionesTrabajoDeGrado = [{
        clase_color: "ver",
        clase_css: "fa fa-edit fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.VER_DETALLES'),
        operacion: 'verDetallesSolicitud',
        estado: true
      }];

      // Se define la cuadrícula de los trabajos de grados bajo la modalidad de espacios académicos de posgrado
      ctrl.cuadriculaTrabajosDeGradoModalidadPosgrado = {};
      ctrl.cuadriculaTrabajosDeGradoModalidadPosgrado.columnDefs = [{
        name: 'idTrabajoGrado',
        displayName: $translate.instant("TRABAJO_GRADO"),
        width: '15%'
      }, {
        name: 'nombreModalidad',
        displayName: $translate.instant("MODALIDAD"),
        type: 'date',
        cellFilter: 'date:\'yyyy-MM-dd\'',
        width: '15%'
      }, {
        name: 'codigoEstudiante',
        displayName: $translate.instant("CODIGO"),
        width: '10%'
      }, {
        name: 'nombreEstudiante',
        displayName: $translate.instant("NOMBRE"),
        width: '25%'
      }, {
        name: 'periodoAcademico',
        displayName: $translate.instant("PERIODO"),
        width: '10%'
      }, {
        name: 'nombreEstado',
        displayName: $translate.instant("ESTADO_SIN_DOSPUNTOS"),
        width: '15%'
      }, {
        name: 'opcionesDeTrabajoDeGrado',
        displayName: $translate.instant("LISTAR_APROBADOS.REGISTRAR"),
        width: '10%',
        cellTemplate: '<btn-registro funcion="grid.appScope.cargarFila(row)" grupobotones="grid.appScope.opcionesTrabajoDeGrado"></btn-registro>'
      }];

      // Se define la cuadrícula para visualizar los espacios académicos solicitudados
      ctrl.cuadriculaEspaciosAcademicosInscritos = {};
      ctrl.cuadriculaEspaciosAcademicosInscritos.columnDefs = [{
        name: 'codigo',
        displayName: $translate.instant("CODIGO"),
        width: '20%'
      }, {
        name: 'nombre',
        displayName: $translate.instant("NOMBRE_ESP_ACADEMICO"),
        width: '40%'
      }, {
        name: 'creditos',
        displayName: $translate.instant("CREDITOS"),
        width: '20%'
      }, {
        name: 'nota',
        displayName: $translate.instant("CALIFICACION"),
        width: '20%',
        cellTemplate: '<input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="row.nota">'
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
            } else {
              // Se define el mensaje de error cuando no se pueden cargar los posgrados asociados y los periodos correspondientes
              $scope.mensajeErrorCargandoConsultasIniciales = $translate.instant("ERROR.INDEFINIDA_INFO_ACADEMICA");
              // Se rechaza la promesa
              deferred.resolve(null);
            }
          })
          .catch(function(excepcionPosgradosAsociados) {
            // Se define el mensaje de error cuando no se pueden cargar los posgrados asociados y los periodos correspondientes
            $scope.mensajeErrorCargandoConsultasIniciales = $translate.instant("ERROR.SIN_INFO_ACADEMICA");
            // Se rechaza la promesa
            deferred.reject(excepcionPosgradosAsociados);
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
            } else {
              // Se define el mensaje de error cuando no se pueden cargar los posgrados asociados y los periodos correspondientes
              $scope.mensajeErrorCargandoConsultasIniciales = $translate.instant("ERROR.INDEFINIDA_INFO_ACADEMICA");
              // Se rechaza la promesa
              deferred.resolve(null);
            }
          })
          .catch(function(excepcionPeriodosCorrespondientes) {
            // Se define el mensaje de error cuando no se pueden cargar los posgrados asociados y los periodos correspondientes
            $scope.mensajeErrorCargandoConsultasIniciales = $translate.instant("ERROR.SIN_INFO_ACADEMICA");
            // Se rechaza la promesa
            deferred.reject(excepcionPeriodosCorrespondientes);
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
            deferred.reject(excepcionPeriodoAcademicoConsultado);
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
       * [Función que define los parámetros para consultar en la tabla espacio_academico_inscrito]
       * @param  {[integer]} idTrabajoGrado [Se recibe el id del trabajo de grado asociado al espacio académico inscrito]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosEspaciosAcademicosInscritos = function(idTrabajoGrado) {
        return $.param({
          query: "TrabajoGrado:" +
            idTrabajoGrado,
          limit: 0
        });
      }

      /**
       * [Función que según la solicitud, carga la información correspondiente al detalle de la misma]
       * @param  {[Object]} trabajoDeGrado [La solicitud para obtener el identificador y cargar la información correspondiente al detalle]
       * @return {[Promise]}                   [La solicitud con el detalle asociado dentro, o la excepción generada]
       */
      ctrl.consultarEspaciosAcademicosInscritos = function(trabajoDeGrado) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia el detalle de la solicitud aprobada en la base de datos
        poluxRequest.get("espacio_academico_inscrito", ctrl.obtenerParametrosEspaciosAcademicosInscritos(trabajoDeGrado.Id))
          .then(function(espaciosAcademicosInscritos) {
            // Se estudia si la información existe
            if (espaciosAcademicosInscritos.data) {
              // Se resuelve la solicitud aprobada con el detalle dentro
              trabajoDeGrado.espaciosAcademicosInscritos = espaciosAcademicosInscritos.data;
              deferred.resolve(trabajoDeGrado);
            } else {
              // Se quita la asociación de la solicitud con nula información de la colección de solicitudes
              var itemInconsistente = ctrl.coleccionTrabajosDeGradoCursados
                .map(function(trabajoDeGradoInconsistente) {
                  return trabajoDeGradoInconsistente.Id;
                })
                .indexOf(trabajoDeGrado.Id);
              ctrl.coleccionTrabajosDeGradoCursados.splice(itemInconsistente, 1);
              // Se establece el mensaje de error con la nula existencia de datos
              $scope.mensajeErrorCargandoTrabajosDeGradoCursados = $translate.instant("ERROR.SIN_ESPACIOS_ACADEMICOS_INSCRITOS");
              deferred.resolve(null);
            }
          })
          .catch(function(excepcionEspaciosAcademicosInscritos) {
            // Se presenta cuando ocurrió un error al traer el detalle de las solicitudes desde la tabla detalle_solicitud
            $scope.mensajeErrorCargandoTrabajosDeGradoCursados = $translate.instant("ERROR.CARGANDO_ESPACIOS_ACADEMICOS_INSCRITOS");
            deferred.reject(excepcionEspaciosAcademicosInscritos);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que define los parámetros para consultar en la tabla estudiante_trabajo_grado]
       * @param  {[integer]} idTrabajoGrado [Se recibe el id del trabajo de grado asociado al usuario]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosEstudianteTrabajoGrado = function(idTrabajoGrado) {
        return $.param({
          query: "TrabajoGrado:" +
            idTrabajoGrado,
          limit: 1
        });
      }

      /**
       * [Función que consulta el usuario desde la tabla usuario_solicitud según la solicitud]
       * @return {[Promise]} [Los datos del usuario asociado a la solicitud, o la excepción generada]
       */
      ctrl.consultarEstudianteTrabajoGrado = function(trabajoDeGrado) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        poluxRequest.get("estudiante_trabajo_grado", ctrl.obtenerParametrosEstudianteTrabajoGrado(trabajoDeGrado.Id))
          .then(function(estudianteTrabajoGrado) {
            // Se estudia si la información existe
            if (estudianteTrabajoGrado.data) {
              // Se resuelve la solicitud aprobada con el usuario dentro
              trabajoDeGrado.estudianteTrabajoGrado = estudianteTrabajoGrado.data[0];
              ctrl.consultarInformacionAcademicaDelEstudiante(estudianteTrabajoGrado.data[0].Estudiante)
                .then(function(estudianteConsultado) {
                  // Se resuelve la información académica del estudiante cargada a la solicitud
                  trabajoDeGrado.datosEstudiante = estudianteConsultado;
                  deferred.resolve(trabajoDeGrado);
                })
                .catch(function(excepcionEstudianteConsultado) {
                  // Se presenta cuando ocurrió un error al traer la información desde la petición académica
                  deferred.reject(excepcionEstudianteConsultado);
                });
            } else {
              // Se quita la asociación de la solicitud con nula información de la colección de solicitudes
              var itemInconsistente = ctrl.coleccionTrabajosDeGradoCursados
                .map(function(trabajoDeGradoInconsistente) {
                  return trabajoDeGradoInconsistente.Id;
                })
                .indexOf(trabajoDeGrado.Id);
              ctrl.coleccionTrabajosDeGradoCursados.splice(itemInconsistente, 1);
              // Se establece el mensaje de error con la nula existencia de datos
              $scope.mensajeErrorCargandoTrabajosDeGradoCursados = $translate.instant("ERROR.SIN_ESTUDIANTE_TRABAJO_GRADO");
              deferred.resolve(null);
            }
          })
          .catch(function(excepcionUsuarioDeSolicitud) {
            // Se presenta cuando ocurrió un error al traer el detalle de las solicitudes desde la tabla detalle_solicitud
            $scope.mensajeErrorCargandoTrabajosDeGradoCursados = $translate.instant("ERROR.CARGANDO_ESTUDIANTE_TRABAJO_GRADO");
            deferred.reject(excepcionUsuarioDeSolicitud);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que define los parámetros para consultar en la tabla respuesta_solicitud]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosTrabajosDeGrado = function() {
        /**
         * Se traen los trabajos de grado de acuerdo al periodo académico seleccionado
         * y cuyo estado sea:
         * 20 - Cursando espacios académicos de posgrado
         */
        return $.param({
          query: "EstadoTrabajoGrado.Id:20," +
            "PeriodoAcademico:" +
            ctrl.periodoSeleccionado.anio +
            "-" +
            ctrl.periodoSeleccionado.periodo,
          limit: 0
        });
      }

      /**
       * [Función que consulta los trabajos de grado bajo la modalidad de espacios académicos de posgrado y añade los detalles necesarios para registrar las notas]
       * @return {[Promise]} [La colección de trabajos de grado terminados, o la excepción generada]
       */
      ctrl.consultarTrabajosDeGradoCursados = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se establece un conjunto de procesamiento de solicitudes que reúne los procesos que deben cargarse antes de ofrecer funcionalidades
        var conjuntoProcesamientoDeTrabajosDeGrado = [];
        // Se establece una colección de solicitudes aprobadas para ser inscritas al posgrado
        ctrl.coleccionTrabajosDeGradoCursados = [];
        // Se consulta hacia las solicitudes respondidas en la base de datos
        poluxRequest.get("trabajo_grado", ctrl.obtenerParametrosTrabajosDeGrado())
          .then(function(trabajosDeGrado) {
            if (trabajosDeGrado.data) {
              angular.forEach(trabajosDeGrado.data, function(trabajoDeGrado) {
                ctrl.coleccionTrabajosDeGradoCursados.push(trabajoDeGrado);
                conjuntoProcesamientoDeTrabajosDeGrado.push(ctrl.consultarEspaciosAcademicosInscritos(trabajoDeGrado));
                conjuntoProcesamientoDeTrabajosDeGrado.push(ctrl.consultarEstudianteTrabajoGrado(trabajoDeGrado));
              });
              $q.all(conjuntoProcesamientoDeTrabajosDeGrado)
                .then(function(resultadoDelProcesamiento) {
                  // Se resuelve la colección de solicitudes para formalizar
                  deferred.resolve(ctrl.coleccionTrabajosDeGradoCursados);
                })
                .catch(function(excepcionDuranteProcesamiento) {
                  // Se rechaza la carga con la excepción generada
                  deferred.reject(excepcionDuranteProcesamiento);
                });
            } else {
              // Se presenta cuando no hay solicitudes respondidas con los parámetros establecidos
              $scope.mensajeErrorCargandoTrabajosDeGradoCursados = $translate.instant("ERROR.SIN_TRABAJO_GRADO");
              deferred.reject(null);
            }
          })
          .catch(function(excepcionTrabajosDeGrado) {
            // Se presenta cuando ocurrió un error al traer las solicitudes desde la tabla respuesta_solicitud
            $scope.mensajeErrorCargandoTrabajosDeGradoCursados = $translate.instant("ERROR.CARGANDO_TRABAJO_GRADO");
            deferred.reject(excepcionTrabajosDeGrado);
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
              $scope.mensajeErrorCargandoTrabajosDeGradoCursados = $translate.instant("ERROR.SIN_INFO_ESTUDIANTE");
              deferred.reject(null);
            }
          })
          .catch(function(excepcionEstudianteConsultado) {
            // Se presenta cuando ocurrió un error al traer la información desde la petición académica
            $scope.mensajeErrorCargandoTrabajosDeGradoCursados = $translate.instant("ERROR.CARGANDO_INFO_ESTUDIANTE");
            deferred.reject(excepcionEstudianteConsultado);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que carga los trabajos de grado cursados a la cuadrícula con la información correspondiente]
       * @param  {[Object]} trabajosDeGradoCursados [La colección de trabajos de grado cursados ya consultados]
       * @return {[void]}                      [El procedimiento de contruir el arreglo de datos visibles sobre los trabajos de grado cursados]
       */
      ctrl.mostrarSolicitudesAprobadas = function(trabajosDeGradoCursados) {
        // Se recorren los trabajos de grado cursados para obtener los datos correspondientes
        angular.forEach(trabajosDeGradoCursados, function(trabajoDeGradoCursado) {
          // Se asignan los campos reconocidos por la cuadrícula
          trabajoDeGradoCursado.idTrabajoGrado = trabajoDeGradoCursado.Id;
          trabajoDeGradoCursado.nombreModalidad = trabajoDeGradoCursado.Modalidad.Nombre;
          trabajoDeGradoCursado.codigoEstudiante = trabajoDeGradoCursado.datosEstudiante.codigo;
          trabajoDeGradoCursado.nombreEstudiante = trabajoDeGradoCursado.datosEstudiante.nombre;
          trabajoDeGradoCursado.periodoAcademico = trabajoDeGradoCursado.PeriodoAcademico;
          trabajoDeGradoCursado.nombreEstado = trabajoDeGradoCursado.EstadoTrabajoGrado.Nombre;
        });
        // Se cargan los datos visibles a la cuadrícula
        ctrl.cuadriculaTrabajosDeGradoModalidadPosgrado.data = trabajosDeGradoCursados;
      }

      /**
       * [Función que actualiza el contenido de la lista de aprobados al posgrado]
       * @return {[void]} [El procedimiento de carga, o la excepción generada]
       */
      ctrl.consultarSolicitudesAprobadas = function() {
        // Se recargan las solicitudes visibles
        ctrl.cuadriculaTrabajosDeGradoModalidadPosgrado.data = [];
        // Se establece que inicia la carga de las solicitudes aprobadas
        $scope.errorCargandoConsultasIniciales = false;
        $scope.errorCargandoTrabajosDeGradoCursados = false;
        $scope.cargandoTrabajosDeGradoCursados = true;
        // Se consultan las solicitudes respondidas
        ctrl.consultarTrabajosDeGradoCursados()
          .then(function(trabajosDeGradoCursados) {
            // Se redefinen los errores, se detiene la carga
            $scope.errorCargandoConsultasIniciales = false;
            $scope.errorCargandoTrabajosDeGradoCursados = false;
            $scope.cargandoTrabajosDeGradoCursados = false;
            // Y se muestra la cuadrícula
            ctrl.mostrarSolicitudesAprobadas(trabajosDeGradoCursados);
          })
          .catch(function(excepcionSolicitudesRespondidas) {
            // Se detiene la carga y se muestra el error
            $scope.errorCargandoTrabajosDeGradoCursados = true;
            $scope.cargandoTrabajosDeGradoCursados = false;
          });
      }

      /**
       * [Función que carga la descripción de los espacios académicos del trabajo de grado]
       * @param  {[Object]} espacioAcademicoInscrito [El espacio académico al que se cargarán los espacios académicos descritos]
       * @return {[Promise]}                [Los espacios académicos descritos y cargados, o la excepción generada]
       */
      ctrl.cargarDescripcionEspaciosAcademicos = function(espacioAcademicoInscrito) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se realiza la petición académica
        academicaRequest.get("asignatura_pensum", [espacioAcademicoInscrito.EspaciosAcademicosElegibles.CodigoAsignatura, espacioAcademicoInscrito.EspaciosAcademicosElegibles.CarreraElegible.CodigoPensum])
        .then(function(espacioAcademicoDescrito) {
          if (espacioAcademicoDescrito.data.asignatura.datosAsignatura) {
            espacioAcademicoInscrito.codigo = espacioAcademicoDescrito.data.asignatura.datosAsignatura[0].codigo;
            espacioAcademicoInscrito.nombre = espacioAcademicoDescrito.data.asignatura.datosAsignatura[0].nombre;
            espacioAcademicoInscrito.creditos = espacioAcademicoDescrito.data.asignatura.datosAsignatura[0].creditos;
            deferred.resolve(espacioAcademicoInscrito);
          } else {
            // Se rechaza la petición en caso de no encontrar datos
            $scope.mensajeErrorCargandoEspaciosAcademicos = $translate.instant("ERROR.CARGANDO_ESPACIOS_ACADEMICOS_INSCRITOS");
            deferred.reject(null);
          }
        })
        .catch(function(excepcionEspacioAcademicoDescrito) {
          // Se rechaza la petición en caso de encontrar excepciones
          $scope.mensajeErrorCargandoEspaciosAcademicos = $translate.instant("ERROR.CARGANDO_ESPACIOS_ACADEMICOS_INSCRITOS");
          deferred.reject(excepcionEspacioAcademicoDescrito);
        });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * [Función que carga la fila asociada según la selección del usuario]
       * @param  {[row]} filaAsociada [Es el trabajo de grado que el usuario seleccionó]
       */
      $scope.cargarFila = function(filaAsociada) {
        ctrl.cargarTrabajoDeGradoSeleccionado(filaAsociada.entity);
      }

      /**
       * [Función que carga el trabajo de grado seleccionado por el coordinador en sesión]
       * @param  {[row]} trabajoDeGradoSeleccionado [El trabajo de grado al que el usuario registrará la nota]
       */
      ctrl.cargarTrabajoDeGradoSeleccionado = function(trabajoDeGradoSeleccionado) {
        // Se inicia la carga
        $scope.cargandoTrabajosDeGradoCursados = true;
        // Se despliega el modal
        $('#modalVerSolicitud').modal('show');
        // Se prepara una colección de procesamiento
        var conjuntoProcesamientoEspaciosAcademicos = [];
        // Se recorren y procesan los espacios académicos inscritos
        angular.forEach(trabajoDeGradoSeleccionado.espaciosAcademicosInscritos, function(espacioAcademicoInscrito) {
          conjuntoProcesamientoEspaciosAcademicos.push(ctrl.cargarDescripcionEspaciosAcademicos(espacioAcademicoInscrito));
        });
        // Se asegura el cumplimiento de todas las promesas
        $q.all(conjuntoProcesamientoEspaciosAcademicos)
        .then(function(espaciosAcademicosDescritos) {
          // Se detiene la carga y se muestran los resultados
          $scope.cargandoTrabajosDeGradoCursados = false;
          $scope.errorCargandoEspaciosAcademicos = false;
          ctrl.trabajoDeGradoSeleccionado = trabajoDeGradoSeleccionado;
          ctrl.cuadriculaEspaciosAcademicosInscritos.data = trabajoDeGradoSeleccionado.espaciosAcademicosInscritos;
        })
        .catch(function(excepcionEspaciosAcademicosDescritos) {
          // Se detiene la carga y se muestra el error
          $scope.cargandoTrabajosDeGradoCursados = false;
          $scope.errorCargandoEspaciosAcademicos = true;
        });
      }

      ctrl.verificarIngresoDeNotas = function() {
        
      }

      /**
       * [Función que maneja la confirmación del coordinador para registrar las notas]
       * @return {[void]} [El procedimiento que regula la confirmación para poder registrar en la base de datos]
       */
      ctrl.confirmarRegistroNotas = function() {
        ctrl.verificarIngresoDeNotas();
        swal({
            title: $translate.instant("REGISTRAR_NOTA.CONFIRMACION"),
            text: $translate.instant("REGISTRAR_NOTA.MENSAJE_CONFIRMACION", {
              // Se cargan datos de la solicitud para que el coordinador pueda verificar antes de registrar
              nombre: ctrl.trabajoDeGradoSeleccionado.nombreEstudiante,
              codigo: ctrl.trabajoDeGradoSeleccionado.codigoEstudiante,
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
              ctrl.cuadriculaTrabajosDeGradoModalidadPosgrado.data = [];
              // Se inicia la carga del formulario mientras se formaliza
              $scope.cargandoTransaccionRegistro = true;
              // Se lanza la transacción
              ctrl.registrarNotasIngresadas()
                .then(function(respuestaRegistrarNotasIngresadas) {
                  // Se estudia si la transacción fue exitosa
                  if (respuestaRegistrarNotasIngresadas.data[0] === "Success") {
                    // De serlo, se detiene la carga, notifica al usuario y actualizan los resultados
                    $scope.cargandoTransaccionRegistro = false;
                    swal(
                      $translate.instant("REGISTRAR_NOTA.AVISO"),
                      $translate.instant("REGISTRAR_NOTA.NOTA_REGISTRADA"),
                      'success'
                    );
                    ctrl.consultarSolicitudesAprobadas();
                    $('#modalVerSolicitud').modal('hide');
                  } else {
                    // De lo contrario, se detiene la carga y notifica al usuario
                    $scope.cargandoTransaccionRegistro = false;
                    swal(
                      $translate.instant("REGISTRAR_NOTA.AVISO"),
                      $translate.instant(respuestaRegistrarNotasIngresadas.data[1]),
                      'warning'
                    );
                  }
                })
                .catch(function(excepcionRegistrarNotasIngresadas) {
                  // En caso de fallar el envío de los datos, se detiene la carga y notifica al usuario
                  $scope.cargandoTransaccionRegistro = false;
                  swal(
                    $translate.instant("REGISTRAR_NOTA.AVISO"),
                    $translate.instant("ERROR.REGISTRANDO_NOTA"),
                    'warning'
                  );
                });
            }
          });
      }

      ctrl.registrarNotasIngresadas = function() {
        var defered = $q.defer();
        // Se prepara una colección que maneje los espacios académicos inscritos
        ctrl.espaciosAcademicosCalificados = []
        // Se recorre la colección de espacios académicos mostrados y se añaden los campos correspondientes a la estructura en la base de datos
        angular.forEach(ctrl.cuadriculaEspaciosAcademicosInscritos.data, function(espacioAcademico) {
          ctrl.espaciosAcademicosCalificados.push({
            Nota: espacioAcademico.nota,
            EspaciosAcademicosElegibles: {
              Id: espacioAcademico.EspaciosAcademicosElegibles.Id
            },
            EstadoEspacioAcademicoInscrito: {
              Id: espacioAcademico.EstadoEspacioAcademicoInscrito.Id
            },
            TrabajoGrado: {
              Id: espacioAcademico.TrabajoGrado.Id
            }
          });
        });
        // Se define el objeto para enviar como información para actualizar
        ctrl.informacionParaActualizar = {
          "espaciosAcademicosInscritos": ctrl.espaciosAcademicosCalificados
        };
        // Se realiza la petición post hacia la transacción con la información para registrar la modalidad
        poluxRequest
          .post("tr_registrar_nota", ctrl.informacionParaActualizar)
          .then(function(respuestaRegistrarNota) {
            defered.resolve(respuestaRegistrarNota);
          })
          .catch(function(excepcionRegistrarNota) {
            defered.reject(excepcionRegistrarNota);
          });
        // Se devuelve el diferido que maneja la promesa
        return defered.promise;
      }

    });