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
    function($location, $q, $scope, $translate, academicaRequest, poluxRequest, sesionesRequest, token_service) {
      var ctrl = this;

      // El Id del usuario depende de la sesión
      token_service.token.documento = "12237136";
      $scope.userId = token_service.token.documento;

      // En el inicio de la página, se están cargando los posgrados
      $scope.cargandoPosgrados = true;
      $scope.mensajeCargandoPosgrados = $translate.instant("LOADING.CARGANDO_INFO_ACADEMICA");

      // Se inhabilita la selección del periodo correspondiente
      $scope.periodoCorrespondienteHabilitado = false;

      // Se configura el mensaje mientras se cargan los trabajos de grado cursados
      $scope.mensajeCargandoTrabajosDeGrado = $translate.instant("LOADING.CARGANDO_TRABAJOS_DE_GRADO");

      // Se configura el mensaje mientras se carga la transacción de registro
      $scope.mensajeCargandoTransaccionRegistro = $translate.instant("LOADING.CARGANDO_TRANSACCION_REGISTRO");

      $scope.botonRegistrarCalificaciones = [{
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
          'funcion="grid.appScope.cargarFila(row)" ' +
          'grupobotones="grid.appScope.botonRegistrarCalificaciones">' +
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
       * [Función que carga las consultas iniciales para poder listar los admitidos]
       * @return {[void]} [El procedimiento de cargar los parámetros académicos para traer los trabajos de grado cursados]
       */
      ctrl.cargarConsultasIniciales = function() {
        // Se garantiza que se cumplan todas las promesas de carga desde un inicio
        $q.all([ctrl.consultarPosgradosAsociados(), ctrl.consultarPeriodosCorrespondientes(), ctrl.consultarPeriodoAcademicoPrevio()])
          .then(function(resultadoConsultasIniciales) {
            // Se apaga el mensaje de carga
            $scope.cargandoPosgrados = false;
            // Y se establecen los resultados obtenidos por las consultas iniciales
            ctrl.posgradosAsociados = resultadoConsultasIniciales[0];
            ctrl.periodosCorrespondientes = resultadoConsultasIniciales[1];
            ctrl.periodoAcademicoPrevio = resultadoConsultasIniciales[2];
          })
          .catch(function(excepcionConsultasIniciales) {
            // Se apaga el mensaje de carga y se muestra el error
            $scope.cargandoPosgrados = false;
            $scope.errorCargandoConsultasIniciales = true;
            $scope.mensajeErrorCargandoConsultasIniciales = excepcionConsultasIniciales;
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
          ctrl.actualizarTrabajosDeGradoCursados();
        }
      }

      /**
       * [Función que define los parámetros para consultar en la tabla espacio_academico_inscrito]
       * @param  {[integer]} idTrabajoGrado [Se recibe el id del trabajo de grado asociado al espacio académico inscrito]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosEspaciosAcademicosInscritos = function(idTrabajoGrado) {
        return $.param({
          /**
           * Los espacios académicos inscritos que estén activos o cursados
           * ya sea para el primer registro, o para corregir las notas
           * 1 - Activo
           * 3 - Cursado
           * @type {String}
           */
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
       * [Función que según el trabajo de grado, carga la información correspondiente a los espacios académicos inscritos]
       * @param  {[Object]} estudianteConTrabajoDeGrado [El estudiante para obtener el identificador y cargar la información asociada a los espacios académicos inscritos]
       * @return {[Promise]}                   [El trabajo de grado con los espacios académicos asociados dentro, o la excepción generada]
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
       * [Función que consulta los datos académicos del estudiante asociado al usuario]
       * @param  {[Integer]} estudianteConTrabajoDeGrado [El estudiante correspondiente]
       * @return {[Promise]}                             [Los datos académicos del estudiante, o la excepción generada]
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
       * [Función que define los parámetros para consultar en la tabla estudiante_trabajo_grado]
       * @param  {[integer]} idTrabajoGrado [Se recibe el id del trabajo de grado asociado al usuario]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosEstudianteTrabajoGrado = function() {
        return $.param({
          /**
           * [La modalidad 2 corresponde a Espacios Académicos de Posgrado]
           * [El estado del trabajo de grado 20 corresponde a Cursando espacios académicos de posgrado]
           * @type {String}
           */
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
       * [Función que consulta los estudiantes con trabajos de grado bajo la modalidad de espacios académicos de posgrado y añade los detalles necesarios para registrar las notas]
       * @return {[Promise]} [La colección de trabajos de grado terminados, o la excepción generada]
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
                    if (estudianteConTrabajoDeGrado.espaciosAcademicosInscritos && estudianteConTrabajoDeGrado.informacionAcademica) {
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
       * [Función que carga los trabajos de grado cursados a la cuadrícula con la información correspondiente]
       * @param  {[Object]} estudiantesCursandoTrabajoDeGrado [La colección de trabajos de grado cursados ya consultados]
       * @return {[void]}                      [El procedimiento de contruir el arreglo de datos visibles sobre los trabajos de grado cursados]
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
       * [Función que actualiza el contenido de la lista de aprobados al posgrado]
       * @return {[void]} [El procedimiento de carga, o la excepción generada]
       */
      ctrl.actualizarTrabajosDeGradoCursados = function() {
        // Se recargan los trabajos de grado visibles
        ctrl.cuadriculaTrabajosDeGradoModalidadPosgrado.data = [];
        // Se establece que inicia la carga de los trabajos de grado cursados
        $scope.errorCargandoConsultasIniciales = false;
        $scope.errorCargandoTrabajosDeGradoCursados = false;
        $scope.cargandoTrabajosDeGradoCursados = true;
        // Se consultan los trabajos de grado cursados
        ctrl.consultarTrabajosDeGradoCursados()
          .then(function(resultadoConsultaTrabajosDeGradoCursados) {
            // Se detiene la carga
            $scope.cargandoTrabajosDeGradoCursados = false;
            if (ctrl.coleccionEstudiantesParaRegistrarNota.length > 0) {
              // Se muestran los trabajos de grado cursados
              ctrl.mostrarTrabajosDeGradoCursados(ctrl.coleccionEstudiantesParaRegistrarNota);
            } else {
              // Se muestra el error
              $scope.errorCargandoTrabajosDeGradoCursados = true;
              $scope.mensajeErrorCargandoTrabajosDeGradoCursados = resultadoConsultaTrabajosDeGradoCursados[0];
            }
          })
          .catch(function(excepcionTrabajosDeGradoCursados) {
            // Se detiene la carga y se muestra el error
            $scope.cargandoTrabajosDeGradoCursados = false;
            $scope.errorCargandoTrabajosDeGradoCursados = true;
            $scope.mensajeErrorCargandoTrabajosDeGradoCursados = excepcionTrabajosDeGradoCursados;
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
       * [Función que carga la fila asociada según la selección del usuario]
       * @param  {[row]} filaAsociada [Es el trabajo de grado que el usuario seleccionó]
       */
      $scope.cargarFila = function(filaAsociada) {
        ctrl.cargarTrabajoDeGradoSeleccionado(filaAsociada.entity);
      }

      /**
       * [Función que carga el trabajo de grado seleccionado por el coordinador en sesión]
       * @param  {[row]} estudianteSeleccionado [El trabajo de grado al que el usuario registrará la nota]
       */
      ctrl.cargarTrabajoDeGradoSeleccionado = function(estudianteSeleccionado) {
        // Se retiran los elementos de la cuadrícula de espacios académicos
        ctrl.cuadriculaEspaciosAcademicosInscritos.data = [];
        // Se inicia la carga
        $scope.cargandoTrabajosDeGradoCursados = true;
        $scope.cargandoEspaciosAcademicos = true;
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
            $scope.cargandoTrabajosDeGradoCursados = false;
            $scope.cargandoEspaciosAcademicos = false;
            $scope.errorCargandoEspaciosAcademicos = false;
            ctrl.estudianteSeleccionado = estudianteSeleccionado;
            ctrl.cuadriculaEspaciosAcademicosInscritos.data = estudianteSeleccionado.espaciosAcademicosInscritos;
          })
          .catch(function(excepcionEspaciosAcademicosDescritos) {
            // Se detiene la carga y se muestra el error
            $scope.cargandoTrabajosDeGradoCursados = false;
            $scope.cargandoEspaciosAcademicos = false;
            $scope.errorCargandoEspaciosAcademicos = true;
            $scope.mensajeErrorCargandoEspaciosAcademicos = excepcionEspaciosAcademicosDescritos;
          });
      }

      /**
       * [Función que recorre las notas ingresadas por el usuario y verifica que sean válidas]
       * @return {[Promise]} [La respuesta de haber revisado las notas ingresadas]
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
       * [Función que maneja la confirmación del coordinador para registrar las notas]
       * @return {[void]} [El procedimiento que regula la confirmación para poder registrar en la base de datos]
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
                  $scope.cargandoTrabajosDeGradoCursados = true;
                  $scope.cargandoEspaciosAcademicos = true;
                  // Se lanza la transacción
                  ctrl.registrarNotasIngresadas()
                    .then(function(respuestaRegistrarNotasIngresadas) {
                      // Se estudia si la transacción fue exitosa
                      if (respuestaRegistrarNotasIngresadas.data[0] === "Success") {
                        // De serlo, se detiene la carga, notifica al usuario y actualizan los resultados
                        $scope.cargandoTrabajosDeGradoCursados = false;
                        $scope.cargandoEspaciosAcademicos = false;
                        swal(
                          $translate.instant("REGISTRAR_NOTA.AVISO"),
                          $translate.instant("REGISTRAR_NOTA.NOTA_REGISTRADA"),
                          'success'
                        );
                        ctrl.actualizarTrabajosDeGradoCursados();
                        $('#modalVerTrabajoDeGrado').modal('hide');
                      } else {
                        // De lo contrario, se detiene la carga y notifica al usuario
                        $scope.cargandoTrabajosDeGradoCursados = false;
                        $scope.cargandoEspaciosAcademicos = false;
                        swal(
                          $translate.instant("REGISTRAR_NOTA.AVISO"),
                          $translate.instant(respuestaRegistrarNotasIngresadas.data[1]),
                          'warning'
                        );
                      }
                    })
                    .catch(function(excepcionRegistrarNotasIngresadas) {
                      // En caso de fallar el envío de los datos, se detiene la carga y notifica al usuario
                      $scope.cargandoTrabajosDeGradoCursados = false;
                      $scope.cargandoEspaciosAcademicos = false;
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
       * [Función que prepara el contenido de la información para actualizar]
       * @return {[Promise]} [La respuesta de enviar la información para actualizar a la base de datos]
       */
      ctrl.registrarNotasIngresadas = function() {
        // Se trae el diferido desde el servicio para manejar las promesas
        var deferred = $q.defer();
        ctrl.consultarAsignaturasDeTrabajoDeGrado(ctrl.estudianteSeleccionado.TrabajoGrado.Id)
          .then(function(asignaturasDeTrabajoDeGrado) {
            // Se prepara una variable con la calificación final
            var calificacionTrabajoGrado = 0;
            // Se prepara una colección que maneje los espacios académicos inscritos
            ctrl.espaciosAcademicosCalificados = [];
            // Se recorre la colección de espacios académicos mostrados y se añaden los campos correspondientes a la estructura en la base de datos
            angular.forEach(ctrl.cuadriculaEspaciosAcademicosInscritos.data, function(espacioAcademico) {
              calificacionTrabajoGrado += espacioAcademico.nota;
              ctrl.espaciosAcademicosCalificados.push({
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
            console.log(trabajoDeGrado);
            // Se define el objeto para enviar como información para actualizar
            ctrl.informacionParaActualizar = {
              "EspaciosAcademicosCalificados": ctrl.espaciosAcademicosCalificados,
              "AsignaturasDeTrabajoDeGrado": asignaturasDeTrabajoDeGrado,
              "TrabajoDeGradoTerminado": trabajoDeGrado
            };
            // Se realiza la petición post hacia la transacción con la información para registrar la modalidad
            poluxRequest
              .post("tr_registrar_nota", ctrl.informacionParaActualizar)
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
       * [Función que define los parámetros para consultar en la tabla asignatura_trabajo_grado]
       * @param  {[integer]} idTrabajoGrado [Se recibe el id del trabajo de grado asociado al espacio académico inscrito]
       * @return {[param]}                         [Se retorna la sentencia para la consulta]
       */
      ctrl.obtenerParametrosAsignaturaTrabajoGrado = function(idTrabajoGrado) {
        return $.param({
          /**
           * Las asignaturas para trabajo grado estén cursándose o cursadas
           * ya sea para el primer registro, o para corregir las notas
           * 1 - Cursando
           * 2 - Cursado
           * @type {String}
           */
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
       * [Función que según el trabajo de grado, consulta la información correspondiente a la(s) asignatura(s) del trabajo de grado]
       * @param  {[Integer]} idTrabajoGrado [El identificador del trabajo de grado correspondiente]
       * @return {[Promise]}                   [El trabajo de grado con los espacios académicos asociados dentro, o la excepción generada]
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