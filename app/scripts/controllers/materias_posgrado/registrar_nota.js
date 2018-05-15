'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
 * @description
 * # MateriasPosgradoRegistrarNotaCtrl
 * Controller of the poluxClienteApp.
 * Controlador que regula las acciones necesarias para que el coordinador del posgrado liste los trabajos de grado cursados y registre las calificaciones finales.
 * Se realiza una selección del posgrado y el periodo académico para listar los trabajos de grado cursados por los estudiantes.
 * El coordinador selecciona cada trabajo de grado guardado, y registra las calificaciones finales obtenidas por el estudiante.
 * Pueden volver a registrarse las calificaciones, en caso de que el coordinador haya cometido algún error durante el ingreso.
 * Este procedimiento actualiza la asginatura de trabajo de grado, y pasa el estado de dicha a "Cursado".
 * El trabajo de grado se actualiza a "Aprobado" o "Reprobado" de acuerdo al promedio aritmético de las calificaciones obtenidas, según el acuerdo vigente.
 * @requires $q
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:sesionesService
 * @requires services/poluxClienteApp.service:tokenService
 * @property {String} usuarioSesion El identificador del coordinador en sesión para consultar los posgrados asociados
 * @property {Boolean} cargandoPosgradosAsociados Indicador que maneja la carga de los posgrados asociados al coordinador en sesión
 * @property {String} mensajeCargandoPosgradosAsociados Mensaje que aparece durante la carga de los posgrados asociados al coordinador
 * @property {Boolean} periodoCorrespondienteHabilitado Indicador que maneja la habilitación del periodo correspondiente
 * @property {String} mensajeCargandoTrabajosDeGrado Mensaje que aparece durante la carga de los trabajos de grado consultados por el coordinador según los parámetros
 * @property {String} mensajeCargandoTransaccionRegistro Mensaje que aparece durante la carga de la transacción que registra las calificaciones del trabajo de grado seleccionado
 * @property {Array} botonRegistrarCalificaciones Establece las propiedades del botón que se muestra para cada trabajo de grado y efectúa el registro de las calificaciones obtenidas
 * @property {Object} cuadriculaTrabajosDeGradoModalidadPosgrado Almacena y adapta la información de los trabajos de grado cursados por cada estudiante, de forma que el coordinador observe la información pertinente
 * @property {Object} cuadriculaEspaciosAcademicosInscritos Almacena y adapta la información de los espacios académicos cursados por cada estudiante seleccionado
 * @property {Array} posgradosAsociados Define el conjunto de posgrados asociados al coordinador en sesión
 * @property {Array} periodosCorrespondientes Define el conjunto de periodos académicos que corresponden a la modalidad de espacios académicos de posgrado
 * @property {Object} periodoAcademicoPrevio Establece el año y el periodo académico anterior a la operación, para traer los registros académicos de cada estudiante
 * @property {Object} periodoSeleccionado Almacena el periodo académico que el coordinador seleccionó desde la vista
 * @property {Boolean} errorCargandoConsultasIniciales Indicador que maneja la aparición de un error durante las consultas de posgrados asociados y periodos correspondientes
 * @property {String} mensajeErrorCargandoConsultasIniciales Mensaje que aparece en caso de que ocurra un error durante las consultas de posgrados asociados y periodos correspondientes
 * @property {Boolean} cargandoTrabajosDeGradoCursados Indicador que maneja la carga de los trabajos de grado cursados
 * @property {Boolean} errorCargandoTrabajosDeGradoCursados Indicador que maneja la aparición de algún error durante la carga de los trabajos de grado cursados
 * @property {String} mensajeErrorCargandoTrabajosDeGradoCursados Mensaje que aparece en caso de que ocurra algún error durante la carga de los trabajos de grado cursados
 * @property {Boolean} cargandoEspaciosAcademicos Indicador que maneja la carga de los espacios académicos cursados por el estudiante seleccionado
 * @property {Boolean} errorCargandoEspaciosAcademicos Indicador que maneja la aparición del algún error durante la carga de los espacios académicos cursados por el estudiante seleccionado
 * @property {String} mensajeErrorCargandoEspaciosAcademicos Mensaje que aparece en caso de que ocurra un error durante la carga de los espacios académicos cursados por el estudiante seleccionado
 * @property {Object} estudianteSeleccionado Es el trabajo de grado que el coordinador seleccionó desde la lista de trabajos de grado cursados
 */
angular.module('poluxClienteApp')
  .controller('MateriasPosgradoRegistrarNotaCtrl',
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

      // Se configura el mensaje mientras se cargan los trabajos de grado cursados
      ctrl.mensajeCargandoTrabajosDeGrado = $translate.instant("LOADING.CARGANDO_TRABAJOS_DE_GRADO");

      // Se configura el mensaje mientras se carga la transacción de registro
      ctrl.mensajeCargandoTransaccionRegistro = $translate.instant("LOADING.CARGANDO_TRANSACCION_REGISTRO");

      ctrl.botonRegistrarCalificaciones = [{
        clase_color: "ver",
        clase_css: "fa fa-edit fa-lg  faa-shake animated-hover",
        titulo: $translate.instant('BTN.VER_DETALLES'),
        operacion: 'cargarTrabajoDeGradoSeleccionado',
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
        cellTemplate: '<btn-registro ' +
          'funcion="grid.appScope.registrarNota.cargarFila(row)" ' +
          'grupobotones="grid.appScope.registrarNota.botonRegistrarCalificaciones">' +
          '</btn-registro>'
      }];

      // Se define la cuadrícula para visualizar los espacios académicos inscritos
      ctrl.cuadriculaEspaciosAcademicosInscritos = {};
      ctrl.cuadriculaEspaciosAcademicosInscritos.columnDefs = [{
        name: 'codigo',
        displayName: $translate.instant("CODIGO"),
        width: '20%',
        enableCellEdit: false,
        enableCellEditOnFocus: false
      }, {
        name: 'nombre',
        displayName: $translate.instant("NOMBRE_ESP_ACADEMICO"),
        width: '40%',
        enableCellEdit: false,
        enableCellEditOnFocus: false
      }, {
        name: 'creditos',
        displayName: $translate.instant("CREDITOS"),
        width: '20%',
        enableCellEdit: false,
        enableCellEditOnFocus: false
      }, {
        name: 'nota',
        displayName: $translate.instant("CALIFICACION"),
        width: '20%',
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.nota}}</div>'
      }];

      /**
       * @ngdoc method
       * @name obtenerParametrosPosgradosDelCoordinador
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
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
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
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
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
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
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
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
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que carga las consultas iniciales para poder listar los trabajos de grado.
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
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que se ejecuta cuando se escoge el posgrado asociado desde la vista.
       * Llama a la función: actualizarTrabajosDeGradoCursados.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultado
       */
      ctrl.escogerPosgrado = function() {
        // Se notifica que el posgrado asociado ha sido escogido
        ctrl.periodoCorrespondienteHabilitado = true;
        // Se estudia si el periodo ha sido seleccionado
        if (ctrl.periodoSeleccionado) {
          // En ese caso, se renueva la consulta de aprobados
          ctrl.actualizarTrabajosDeGradoCursados();
        }
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosEspaciosAcademicosInscritos
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla espacio_academico_inscrito.
       * Los espacios académicos inscritos que estén activos o cursados ya sea para el primer registro, o para corregir las notas:
       * 1 - Activo;
       * 3 - Cursado.
       * @param {Number} idTrabajoGrado Se recibe el identificador del trabajo de grado asociado al estudiante
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosEspaciosAcademicosInscritos = function(idTrabajoGrado) {
        return $.param({
          query: "EstadoEspacioAcademicoInscrito.Id.in:1|3," +
            "EspaciosAcademicosElegibles.Activo:True," +
            "EspaciosAcademicosElegibles.CarreraElegible.CodigoCarrera:" +
            ctrl.posgradoSeleccionado +
            ",TrabajoGrado:" +
            idTrabajoGrado,
          limit: 0
        });
      }

      /**
       * @ngdoc method
       * @name consultarEspaciosAcademicosInscritos
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que según el trabajo de grado, carga la información correspondiente a los espacios académicos inscritos.
       * Llama a la función: obtenerParametrosEspaciosAcademicosInscritos.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los espacios académicos registrados.
       * @param {Object} estudianteConTrabajoDeGrado El estudiante para obtener el identificador y cargar la información asociada a los espacios académicos inscritos
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarEspaciosAcademicosInscritos = function(estudianteConTrabajoDeGrado) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia los espacios académicos inscritos del trabajo de grado en la base de datos
        poluxRequest.get("espacio_academico_inscrito", ctrl.obtenerParametrosEspaciosAcademicosInscritos(estudianteConTrabajoDeGrado.TrabajoGrado.Id))
          .then(function(espaciosAcademicosInscritos) {
            // Se estudia si la información existe
            if (espaciosAcademicosInscritos.data) {
              // Se actualiza el elemento de la colección
              estudianteConTrabajoDeGrado.espaciosAcademicosInscritos = espaciosAcademicosInscritos.data;
            }
            // Se resuelve el mensaje correspondiente
            deferred.resolve($translate.instant("ERROR.SIN_ESPACIOS_ACADEMICOS_INSCRITOS"));
          })
          .catch(function(excepcionEspaciosAcademicosInscritos) {
            // En caso de error se rechaza la petición con el mensaje correspondiente
            deferred.reject($translate.instant("ERROR.CARGANDO_ESPACIOS_ACADEMICOS_INSCRITOS"));
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name consultarInformacionAcademicaDelEstudiante
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que según la solicitud, carga los datos académicos del estudiante asociado.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica registrada.
       * @param {Object} estudianteConTrabajoDeGrado El estudiante con trabajo de grado para obtener el identificador y cargar la información académica del estudiante asociado
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarInformacionAcademicaDelEstudiante = function(estudianteConTrabajoDeGrado) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia los datos del estudiante desde el servicio de académica
        academicaRequest.get("datos_estudiante", [estudianteConTrabajoDeGrado.Estudiante, ctrl.periodoAcademicoPrevio.anio, ctrl.periodoAcademicoPrevio.periodo])
          .then(function(estudianteConsultado) {
            // Se estudia si los resultados de la consulta son válidos
            if (!angular.isUndefined(estudianteConsultado.data.estudianteCollection.datosEstudiante)) {
              // Se resuelve la información académica del estudiante
              estudianteConTrabajoDeGrado.informacionAcademica = estudianteConsultado.data.estudianteCollection.datosEstudiante[0];
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
       * @name obtenerParametrosEstudianteTrabajoGrado
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla estudiante_trabajo_grado.
       * La modalidad 2 corresponde a Espacios Académicos de Posgrado.
       * El estado del trabajo de grado 20 corresponde a Cursando espacios académicos de posgrado.
       * @param {undefined} undefined No requiere parámetros
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosEstudianteTrabajoGrado = function() {
        return $.param({
          query: "TrabajoGrado.Modalidad.Id:2," +
            "TrabajoGrado.EstadoTrabajoGrado.Id.in:1|3|20," +
            "TrabajoGrado.PeriodoAcademico:" +
            ctrl.periodoSeleccionado.anio +
            "-" +
            ctrl.periodoSeleccionado.periodo,
          limit: 0
        });
      }

      /**
       * @ngdoc method
       * @name consultarTrabajosDeGradoCursados
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que consulta los estudiantes con trabajos de grado bajo la modalidad de espacios académicos de posgrado y añade los detalles necesarios para registrar las notas.
       * Llama a las funciones: obtenerParametrosEstudianteTrabajoGrado, consultarInformacionAcademicaDelEstudiante y consultarEspaciosAcademicosInscritos.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los estudiantes con trabajos de grado registrados.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarTrabajosDeGradoCursados = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se establece un conjunto de procesamiento de trabajos de grado que reúne los procesos que deben cargarse antes de ofrecer funcionalidades
        var conjuntoProcesamientoDeTrabajosDeGrado = [];
        // Se establece una colección de estudiantes para registrar la nota
        ctrl.coleccionEstudiantesParaRegistrarNota = [];
        // Se consulta hacia los estudiantes con trabajos de grados registrados en la base de datos
        poluxRequest.get("estudiante_trabajo_grado", ctrl.obtenerParametrosEstudianteTrabajoGrado())
          .then(function(estudiantesCursandoTrabajoDeGrado) {
            if (estudiantesCursandoTrabajoDeGrado.data) {
              angular.forEach(estudiantesCursandoTrabajoDeGrado.data, function(estudianteConTrabajoDeGrado) {
                conjuntoProcesamientoDeTrabajosDeGrado.push(ctrl.consultarInformacionAcademicaDelEstudiante(estudianteConTrabajoDeGrado));
                conjuntoProcesamientoDeTrabajosDeGrado.push(ctrl.consultarEspaciosAcademicosInscritos(estudianteConTrabajoDeGrado));
              });
              $q.all(conjuntoProcesamientoDeTrabajosDeGrado)
                .then(function(resultadoEstudiantesProcesados) {
                  angular.forEach(estudiantesCursandoTrabajoDeGrado.data, function(estudianteConTrabajoDeGrado) {
                    if (estudianteConTrabajoDeGrado.espaciosAcademicosInscritos &&
                      estudianteConTrabajoDeGrado.informacionAcademica) {
                      ctrl.coleccionEstudiantesParaRegistrarNota.push(estudianteConTrabajoDeGrado);
                    }
                  });
                  deferred.resolve(resultadoEstudiantesProcesados);
                })
                .catch(function(excepcionEstudiantesProcesados) {
                  deferred.reject(excepcionEstudiantesProcesados);
                });
            } else {
              // En caso de no estar definida la información, se resuelve el mensaje correspondiente
              deferred.reject($translate.instant("ERROR.SIN_ESTUDIANTE_TRABAJO_GRADO"));
            }
          })
          .catch(function(excepcionTrabajosDeGrado) {
            // En caso de error se rechaza la petición con el mensaje correspondiente
            deferred.reject($translate.instant("ERROR.CARGANDO_ESTUDIANTE_TRABAJO_GRADO"));
          });
        // Se devuelve el diferido que maperneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name mostrarTrabajosDeGradoCursados
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que carga los trabajos de grado cursados a la cuadrícula con la información correspondiente.
       * @param {Array} estudiantesCursandoTrabajoDeGrado La colección de trabajos de grado cursados ya consultados
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.mostrarTrabajosDeGradoCursados = function(estudiantesCursandoTrabajoDeGrado) {
        // Se recorren los trabajos de grado cursados para obtener los datos correspondientes
        angular.forEach(estudiantesCursandoTrabajoDeGrado, function(estudianteConTrabajoDeGrado) {
          // Se asignan los campos reconocidos por la cuadrícula
          estudianteConTrabajoDeGrado.idTrabajoGrado = estudianteConTrabajoDeGrado.TrabajoGrado.Id;
          estudianteConTrabajoDeGrado.nombreModalidad = estudianteConTrabajoDeGrado.TrabajoGrado.Modalidad.Nombre;
          estudianteConTrabajoDeGrado.codigoEstudiante = estudianteConTrabajoDeGrado.informacionAcademica.codigo;
          estudianteConTrabajoDeGrado.nombreEstudiante = estudianteConTrabajoDeGrado.informacionAcademica.nombre;
          estudianteConTrabajoDeGrado.periodoAcademico = estudianteConTrabajoDeGrado.TrabajoGrado.PeriodoAcademico;
          estudianteConTrabajoDeGrado.nombreEstado = estudianteConTrabajoDeGrado.TrabajoGrado.EstadoTrabajoGrado.Nombre;
        });
        // Se cargan los datos visibles a la cuadrícula
        ctrl.cuadriculaTrabajosDeGradoModalidadPosgrado.data = estudiantesCursandoTrabajoDeGrado;
      }

      /**
       * @ngdoc method
       * @name actualizarTrabajosDeGradoCursados
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que actualiza el contenido de la lista de trabajos de grado cursados.
       * Llama a las funciones: consultarTrabajosDeGradoCursados y mostrarTrabajosDeGradoCursados.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.actualizarTrabajosDeGradoCursados = function() {
        // Se recargan los trabajos de grado visibles
        ctrl.cuadriculaTrabajosDeGradoModalidadPosgrado.data = [];
        // Se establece que inicia la carga de los trabajos de grado cursados
        ctrl.cargandoTrabajosDeGradoCursados = true;
        ctrl.errorCargandoConsultasIniciales = false;
        ctrl.errorCargandoTrabajosDeGradoCursados = false;
        // Se consultan los trabajos de grado cursados
        ctrl.consultarTrabajosDeGradoCursados()
          .then(function(resultadoConsultaTrabajosDeGradoCursados) {
            // Se detiene la carga
            ctrl.cargandoTrabajosDeGradoCursados = false;
            if (ctrl.coleccionEstudiantesParaRegistrarNota.length > 0) {
              // Se muestran los trabajos de grado cursados
              ctrl.mostrarTrabajosDeGradoCursados(ctrl.coleccionEstudiantesParaRegistrarNota);
            } else {
              // Se muestra el error
              ctrl.errorCargandoTrabajosDeGradoCursados = true;
              ctrl.mensajeErrorCargandoTrabajosDeGradoCursados = resultadoConsultaTrabajosDeGradoCursados[0];
            }
          })
          .catch(function(excepcionTrabajosDeGradoCursados) {
            // Se detiene la carga y se muestra el error
            ctrl.cargandoTrabajosDeGradoCursados = false;
            ctrl.errorCargandoTrabajosDeGradoCursados = true;
            ctrl.mensajeErrorCargandoTrabajosDeGradoCursados = excepcionTrabajosDeGradoCursados;
          });
      }

      /**
       * @ngdoc method
       * @name cargarDescripcionEspaciosAcademicos
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que carga la descripción de los espacios académicos del trabajo de grado.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información sobre los espacios académicos.
       * @param {Object} espacioAcademicoInscrito El espacio académico al que se cargarán los espacios académicos descritos
       * @returns {Promise} Los espacios académicos descritos y cargados, o la excepción generada
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
              espacioAcademicoInscrito.nota = espacioAcademicoInscrito.Nota;
              deferred.resolve(espacioAcademicoInscrito);
            } else {
              // Se rechaza la petición en caso de no encontrar datos
              deferred.reject($translate.instant("ERROR.CARGANDO_ESPACIOS_ACADEMICOS_INSCRITOS"));
            }
          })
          .catch(function(excepcionEspacioAcademicoDescrito) {
            // Se rechaza la petición en caso de encontrar excepciones
            deferred.reject($translate.instant("ERROR.CARGANDO_ESPACIOS_ACADEMICOS_INSCRITOS"));
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name cargarFila
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que carga la fila asociada según la selección del usuario.
       * Llama a la función: cargarTrabajoDeGradoSeleccionado.
       * @param {Object} filaAsociada El trabajo de grado que el coordinador seleccionó
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cargarFila = function(filaAsociada) {
        ctrl.cargarTrabajoDeGradoSeleccionado(filaAsociada.entity);
      }

      /**
       * @ngdoc method
       * @name cargarTrabajoDeGradoSeleccionado
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que carga el trabajo de grado seleccionado por el coordinador en sesión.
       * Llama a la función: cargarDescripcionEspaciosAcademicos.
       * @param {Object} estudianteSeleccionado El trabajo de grado al que el usuario registrará las calificaciones
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.cargarTrabajoDeGradoSeleccionado = function(estudianteSeleccionado) {
        // Se retiran los elementos de la cuadrícula de espacios académicos
        ctrl.cuadriculaEspaciosAcademicosInscritos.data = [];
        // Se inicia la carga
        ctrl.cargandoTrabajosDeGradoCursados = true;
        ctrl.cargandoEspaciosAcademicos = true;
        // Se despliega el modal
        $('#modalVerTrabajoDeGrado').modal('show');
        // Se prepara una colección de procesamiento
        var conjuntoProcesamientoEspaciosAcademicos = [];
        // Se recorren y procesan los espacios académicos inscritos
        angular.forEach(estudianteSeleccionado.espaciosAcademicosInscritos, function(espacioAcademicoInscrito) {
          conjuntoProcesamientoEspaciosAcademicos.push(ctrl.cargarDescripcionEspaciosAcademicos(espacioAcademicoInscrito));
        });
        // Se asegura el cumplimiento de todas las promesas
        $q.all(conjuntoProcesamientoEspaciosAcademicos)
          .then(function(espaciosAcademicosDescritos) {
            // Se detiene la carga y se muestran los resultados
            ctrl.cargandoTrabajosDeGradoCursados = false;
            ctrl.cargandoEspaciosAcademicos = false;
            ctrl.errorCargandoEspaciosAcademicos = false;
            ctrl.estudianteSeleccionado = estudianteSeleccionado;
            ctrl.cuadriculaEspaciosAcademicosInscritos.data = estudianteSeleccionado.espaciosAcademicosInscritos;
          })
          .catch(function(excepcionEspaciosAcademicosDescritos) {
            // Se detiene la carga y se muestra el error
            ctrl.cargandoTrabajosDeGradoCursados = false;
            ctrl.cargandoEspaciosAcademicos = false;
            ctrl.errorCargandoEspaciosAcademicos = true;
            ctrl.mensajeErrorCargandoEspaciosAcademicos = excepcionEspaciosAcademicosDescritos;
          });
      }

      /**
       * @ngdoc method
       * @name verificarIngresoDeNotas
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que recorre las notas ingresadas por el usuario y verifica que sean válidas.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} La respuesta de haber revisado las notas ingresadas
       */
      ctrl.verificarIngresoDeNotas = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        angular.forEach(ctrl.cuadriculaEspaciosAcademicosInscritos.data, function(espacioAcademicoInscrito) {
          if (typeof espacioAcademicoInscrito.nota != 'number' || isNaN(espacioAcademicoInscrito.nota) || !isFinite(espacioAcademicoInscrito.nota) &&
            espacioAcademicoInscrito.nota < 0.0 || espacioAcademicoInscrito.nota > 5.0) {
            deferred.reject(false);
          }
        });
        deferred.resolve(true);
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name confirmarRegistroNotas
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que maneja la confirmación del coordinador para registrar las notas.
       * Llama a las funciones: verificarIngresoDeNotas, registrarNotasIngresadas y actualizarTrabajosDeGradoCursados.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.confirmarRegistroNotas = function() {
        ctrl.verificarIngresoDeNotas()
          .then(function(verificacionNota) {
            swal({
                title: $translate.instant("REGISTRAR_NOTA.CONFIRMACION"),
                text: $translate.instant("REGISTRAR_NOTA.MENSAJE_CONFIRMACION", {
                  // Se cargan datos del estudiante asociado al trabajo de grado para que el coordinador pueda verificar antes de registrar
                  nombre: ctrl.estudianteSeleccionado.nombreEstudiante,
                  codigo: ctrl.estudianteSeleccionado.codigoEstudiante,
                }),
                type: "info",
                confirmButtonText: $translate.instant("ACEPTAR"),
                cancelButtonText: $translate.instant("CANCELAR"),
                showCancelButton: true
              })
              .then(function(confirmacionDelUsuario) {
                // Se valida que el coordinador haya confirmado el registro
                if (confirmacionDelUsuario.value) {
                  // Se detiene la visualización de trabajos de grado
                  ctrl.cargandoTrabajosDeGradoCursados = true;
                  ctrl.cargandoEspaciosAcademicos = true;
                  // Se lanza la transacción
                  ctrl.registrarNotasIngresadas()
                    .then(function(respuestaRegistrarNotasIngresadas) {
                      // Se estudia si la transacción fue exitosa
                      if (respuestaRegistrarNotasIngresadas.data[0] === "Success") {
                        // De serlo, se detiene la carga, notifica al usuario y actualizan los resultados
                        ctrl.cargandoTrabajosDeGradoCursados = false;
                        ctrl.cargandoEspaciosAcademicos = false;
                        swal(
                          $translate.instant("REGISTRAR_NOTA.AVISO"),
                          $translate.instant("REGISTRAR_NOTA.NOTA_REGISTRADA"),
                          'success'
                        );
                        ctrl.actualizarTrabajosDeGradoCursados();
                        $('#modalVerTrabajoDeGrado').modal('hide');
                      } else {
                        // De lo contrario, se detiene la carga y notifica al usuario
                        ctrl.cargandoTrabajosDeGradoCursados = false;
                        ctrl.cargandoEspaciosAcademicos = false;
                        swal(
                          $translate.instant("REGISTRAR_NOTA.AVISO"),
                          $translate.instant(respuestaRegistrarNotasIngresadas.data[1]),
                          'warning'
                        );
                      }
                    })
                    .catch(function(excepcionRegistrarNotasIngresadas) {
                      // En caso de fallar el envío de los datos, se detiene la carga y notifica al usuario
                      ctrl.cargandoTrabajosDeGradoCursados = false;
                      ctrl.cargandoEspaciosAcademicos = false;
                      swal(
                        $translate.instant("REGISTRAR_NOTA.AVISO"),
                        $translate.instant("ERROR.REGISTRANDO_NOTA"),
                        'warning'
                      );
                    });
                }
              });
          })
          .catch(function(excepcionNota) {
            swal(
              $translate.instant("REGISTRAR_NOTA.AVISO"),
              $translate.instant("ERROR.NOTA_INVALIDA"),
              'warning'
            );
          });
      }

      /**
       * @ngdoc method
       * @name registrarNotasIngresadas
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que prepara el contenido de la información para actualizar.
       * Llama a la función: consultarAsignaturasDeTrabajoDeGrado.
       * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para registrar los resultados del registro de las calificaciones en la base de datos.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} La respuesta de enviar la información para actualizar a la base de datos
       */
      ctrl.registrarNotasIngresadas = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        ctrl.consultarAsignaturasDeTrabajoDeGrado(ctrl.estudianteSeleccionado.TrabajoGrado.Id)
          .then(function(asignaturasDeTrabajoDeGrado) {
            // Se prepara una variable con la calificación final
            var calificacionTrabajoGrado = 0;
            // Se prepara una colección que maneje los espacios académicos inscritos
            var espaciosAcademicosCalificados = [];
            // Se recorre la colección de espacios académicos mostrados y se añaden los campos correspondientes a la estructura en la base de datos
            angular.forEach(ctrl.cuadriculaEspaciosAcademicosInscritos.data, function(espacioAcademico) {
              calificacionTrabajoGrado += espacioAcademico.nota;
              espaciosAcademicosCalificados.push({
                EspaciosAcademicosElegibles: {
                  Id: espacioAcademico.EspaciosAcademicosElegibles.Id
                },
                EstadoEspacioAcademicoInscrito: {
                  Id: 3
                },
                Id: espacioAcademico.Id,
                Nota: espacioAcademico.nota,
                TrabajoGrado: {
                  Id: espacioAcademico.TrabajoGrado.Id
                }
              });
              // Se recorre la colección de asignaturas de trabajo de grado
              angular.forEach(asignaturasDeTrabajoDeGrado, function(asignaturaTrabajoGrado) {
                // Se establece el valor promedio de los espacios académicos
                asignaturaTrabajoGrado.Calificacion = calificacionTrabajoGrado/ctrl.cuadriculaEspaciosAcademicosInscritos.data.length;
                asignaturaTrabajoGrado.EstadoAsignaturaTrabajoGrado = {
                  Id: 2
                };
              });
            });
            // Se prepara una variable para el trabajo de grado
            var trabajoDeGrado = ctrl.estudianteSeleccionado.TrabajoGrado;
            // Se estudia si aprobó la modalidad
            if (calificacionTrabajoGrado/ctrl.cuadriculaEspaciosAcademicosInscritos.data.length >= 3.0) {
              trabajoDeGrado.EstadoTrabajoGrado = {
                Id: 1
              };
              trabajoDeGrado.Titulo = "Aprobada la modalidad de cursar espacios académicos de posgrado";
            } else {
              trabajoDeGrado.EstadoTrabajoGrado = {
                Id: 3
              };
              trabajoDeGrado.Titulo = "Reprobada la modalidad de cursar espacios académicos de posgrado";
            }
            // Se define el objeto para enviar como información para actualizar
            var informacionParaActualizar = {
              "EspaciosAcademicosCalificados": espaciosAcademicosCalificados,
              "AsignaturasDeTrabajoDeGrado": asignaturasDeTrabajoDeGrado,
              "TrabajoDeGradoTerminado": trabajoDeGrado
            };
            // Se realiza la petición post hacia la transacción con la información para registrar la modalidad
            poluxRequest
              .post("tr_registrar_nota", informacionParaActualizar)
              .then(function(respuestaRegistrarNota) {
                deferred.resolve(respuestaRegistrarNota);
              })
              .catch(function(excepcionRegistrarNota) {
                deferred.reject(excepcionRegistrarNota);
              });
          })
          .catch(function(excepcionAsignaturasDeTrabajoDeGrado) {
            deferred.reject(excepcionAsignaturasDeTrabajoDeGrado);
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosAsignaturaTrabajoGrado
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla asignatura_trabajo_grado.
       * Las asignaturas para trabajo grado estén cursándose o cursadas ya sea para el primer registro, o para corregir las notas:
       * 1 - Cursando;
       * 2 - Cursado.
       * @param {Number} idTrabajoGrado El identificador del trabajo de grado asociado a la asignatura de trabajo de grado
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosAsignaturaTrabajoGrado = function(idTrabajoGrado) {
        return $.param({
          query: "EstadoAsignaturaTrabajoGrado.Id.in:1|2," +
            "Periodo:" +
            ctrl.periodoSeleccionado.periodo +
            ",Anio:" +
            ctrl.periodoSeleccionado.anio +
            ",TrabajoGrado:" +
            idTrabajoGrado,
          limit: 0
        });
      }

      /**
       * @ngdoc method
       * @name consultarAsignaturasDeTrabajoDeGrado
       * @methodOf poluxClienteApp.controller:MateriasPosgradoRegistrarNotaCtrl
       * @description
       * Función que según el trabajo de grado, consulta la información correspondiente a la(s) asignatura(s) del trabajo de grado.
       * Llama a la función: obtenerParametrosAsignaturaTrabajoGrado.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer la(s) asginatura(s) de trabajo de grado registrada(s).
       * @param {Number} idTrabajoGrado El identificador del trabajo de grado correspondiente
       * @returns {Promise} Las asignaturas de trabajo de grado asociadas, o la excepción generada
       */
      ctrl.consultarAsignaturasDeTrabajoDeGrado = function(idTrabajoGrado) {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        // Se consulta hacia los espacios académicos inscritos del trabajo de grado en la base de datos
        poluxRequest.get("asignatura_trabajo_grado", ctrl.obtenerParametrosAsignaturaTrabajoGrado(idTrabajoGrado))
          .then(function(asignaturasDeTrabajoDeGrado) {
            // Se estudia si la información existe
            if (asignaturasDeTrabajoDeGrado.data) {
              // Se resuelve el resultado
              deferred.resolve(asignaturasDeTrabajoDeGrado.data);
            } else {
              // Se rechaza el mensaje correspondiente
              deferred.reject($translate.instant("ERROR.SIN_ASIGNATURA_TRABAJO_GRADO"));
            }
          })
          .catch(function(excepcionAsignaturaTrabajoGrado) {
            // En caso de error se rechaza la petición con el mensaje correspondiente
            deferred.reject($translate.instant("ERROR.CARGANDO_ASIGNATURA_TRABAJO_GRADO"));
          });
        // Se devuelve el diferido que maneja la promesa
        return deferred.promise;
      }

    });