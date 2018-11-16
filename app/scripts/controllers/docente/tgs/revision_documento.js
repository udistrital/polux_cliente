'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
 * @description
 * # DocenteTgsRevisionDocumentoCtrl
 * Controller of the poluxClienteApp.
 * Controlador que regula las operaciones de revisión sobre los proyectos de grado del estudiante.
 * Reconoce las vinculaciones del docente en sesión y permite crear revisiones sobre el documento que está dirigiendo.
 * @requires $q
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @property {String} documentoDocente Valor que carga el documento del docente en sesión
 * @property {String} mensajeCargandoProyectos Mensaje que aparece durante la carga de los proyectos de grado
 * @property {Boolean} cargandoProyectos Indicador que maneja el periodo de consulta de los proyectos de grado
 * @property {Boolean} errorCargandoProyectos Indicador que maneja la aparición de error durante la consulta de los proyectos
 * @property {String} nombreDelDocente Texto que carga el nombre del docente vinculado
 * @property {String} mensajeErrorCargandoProyectos Texto que aparece en caso de haber un error al cargar los proyectos de grado
 * @property {Object} proyectoSeleccionado Objeto que carga el proyecto que se selecciona desde la vista
 * @property {Object} revisionesTrabajoGrado Objeto que carga las revisiones asociadas al proyecto de grado
 * @property {Boolean} errorCargandoDocumento Indicador que maneja la aparición de un error durante la carga del documento de trabajo de grado
 * @property {Boolean} errorCargandoRevisiones Indicador que maneja la aparición de un error durante la carga de las revisiones del trabajo de grado
 * @property {Number} documentoTrabajoGrado Valor que carga el identificador del documento seleccionado
 * @property {Object} documentoEscrito Objeto que carga la información del documento escrito seleccionado
 * @property {String} mensajeErrorCargandoRevisiones Mensaje que aparece en caso de haber ocurrido un error durante la carga de las revisiones asociadas al proyecto
 * @property {String} mensajeErrorCargandoDocumento Mensaje que aparece en caso de haber ocurrido un error durante la carga del documento asociado al proyecto
 */
angular.module('poluxClienteApp')
  .controller('DocenteTgsRevisionDocumentoCtrl',
    function($q, $scope, $translate, academicaRequest, poluxRequest, token_service) {
      var ctrl = this;

      //token_service.token.documento = "51551021";
      //token_service.token.documento = "79777053";
      //token_service.token.documento = "80093200";
      //token_service.token.role.push("DOCENTE");
      //ctrl.documentoDocente = token_service.token.documento;

      ctrl.documentoDocente = token_service.getAppPayload().appUserDocument;

      ctrl.mensajeCargandoProyectos = $translate.instant("LOADING.CARGANDO_PROYECTOS");

      /**
       * @ngdoc method
       * @name consultarDocenteTrabajoGrado
       * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
       * @description
       * Función que recorre la base de datos de acuerdo a la vinculación del trabajo de grado y trae los datos del docente asociado.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} La información consultada o el mensaje para la excepción
       */
      ctrl.consultarDocenteTrabajoGrado = function() {
        var deferred = $q.defer();
        academicaRequest.get("docente_tg", [ctrl.documentoDocente])
          .then(function(docenteDirector) {
            if (!angular.isUndefined(docenteDirector.data.docenteTg.docente)) {
              deferred.resolve(docenteDirector.data.docenteTg.docente[0].nombre);
            } else {
              deferred.reject($translate.instant("ERROR.SIN_DOCENTE"));
            }
          })
          .catch(function(excepcionDocenteDirector) {
            deferred.reject($translate.instant("ERROR.CARGANDO_DOCENTE"));
          })
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosVinculacionTrabajoGrado
       * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla vinculacion_trabajo_grado.
       * Recibe diferentes estados de trabajo de grado.
       * El rol del trabajo de grado 1 pide los docentes cuya vinculación sea como directores del trabajo de grado.
       * @param {undefined} undefined No requiere parámetros
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosVinculacionTrabajoGrado = function() {
        return $.param({
          query: "TrabajoGrado.EstadoTrabajoGrado.Id.in:1|4|5|6|8|9|10|11|12|13|14|15|16|17|18|19|21|22," +
            "RolTrabajoGrado.Id.in:1|4," +
            "Activo:True,Usuario:" +
            ctrl.documentoDocente,
          limit: 0
        });
      }

      /**
       * @ngdoc method
       * @name consultarVinculacionTrabajoGrado
       * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
       * @description
       * Función que recorre la base de datos de acuerdo al trabajo de grado y trae sus vinculaciones asociadas.
       * Llama a la función: obtenerParametrosVinculacionTrabajoGrado.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarVinculacionTrabajoGrado = function() {
        var deferred = $q.defer();
        poluxRequest.get("vinculacion_trabajo_grado", ctrl.obtenerParametrosVinculacionTrabajoGrado())
          .then(function(respuestaVinculaciones) {
            if (Object.keys(respuestaVinculaciones.data[0]).length > 0) {
              deferred.resolve(respuestaVinculaciones.data);
            } else {
              deferred.reject($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
            }
          })
          .catch(function(excepcionVinculacionTrabajoGrado) {
            deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name efectuarConsultasIniciales
       * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
       * @description
       * Función que efectúa la consulta del nombre del docente en sesión, al igual que sus proyectos relacionados.
       * Llama a las funciones: consultarDocenteTrabajoGrado y consultarVinculacionTrabajoGrado.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.efectuarConsultasIniciales = function() {
        ctrl.cargandoProyectos = true;
        ctrl.errorCargandoProyectos = false;
        ctrl.consultarDocenteTrabajoGrado()
          .then(function(nombreDelDocente) {
            ctrl.nombreDelDocente = nombreDelDocente;
            ctrl.consultarVinculacionTrabajoGrado()
              .then(function(respuestaVinculaciones) {
                ctrl.cargandoProyectos = false;
                ctrl.vinculaciones = respuestaVinculaciones;
              })
              .catch(function(excepcionVinculaciones) {
                ctrl.cargandoProyectos = false;
                ctrl.errorCargandoProyectos = true;
                ctrl.mensajeErrorCargandoProyectos = excepcionVinculaciones;
              });
          })
          .catch(function(excepcionNombreDelDocente) {
            ctrl.cargandoProyectos = false;
            ctrl.errorCargandoProyectos = true;
            ctrl.mensajeErrorCargandoProyectos = excepcionNombreDelDocente;
          });
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosDocumentoTrabajoGrado
       * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla documento_trabajo_grado.
       * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosDocumentoTrabajoGrado = function(idTrabajoGrado) {
        return $.param({
          query: "DocumentoEscrito.TipoDocumentoEscrito:4," +
            "TrabajoGrado.Id:" +
            idTrabajoGrado,
          limit: 1
        });
      }

      /**
       * @ngdoc method
       * @name consultarDocumentoTrabajoGrado
       * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
       * @description
       * Función que recorre la base de datos de acuerdo al trabajo de grado vinculado y trae el documento asociado.
       * Llama a la función: obtenerParametrosDocumentoTrabajoGrado.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
       * @param {Object} vinculacionTrabajoGrado La vinculación hacia el trabajo de grado seleccionado
       * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarDocumentoTrabajoGrado = function(vinculacionTrabajoGrado) {
        var deferred = $q.defer();
        poluxRequest.get("documento_trabajo_grado", ctrl.obtenerParametrosDocumentoTrabajoGrado(vinculacionTrabajoGrado.TrabajoGrado.Id))
          .then(function(respuestaDocumentoTrabajoGrado) {
            if (Object.keys(respuestaDocumentoTrabajoGrado.data[0]).length > 0) {
              deferred.resolve(respuestaDocumentoTrabajoGrado.data[0]);
            } else {
              deferred.reject($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
            }
          })
          .catch(function(excepcionDocumentoTrabajoGrado) {
            deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosRevisionTrabajoGrado
       * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla revision_trabajo_grado.
       * @param {undefined} undefined No requiere parámetros
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosRevisionTrabajoGrado = function() {
        return $.param({
          query: "DocumentoTrabajoGrado.TrabajoGrado.Id:" +
            ctrl.proyectoSeleccionado.TrabajoGrado.Id,
          limit: 0
        });
      }

      /**
       * @ngdoc method
       * @name consultarRevisionesTrabajoGrado
       * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
       * @description
       * Función que consulta las revisiones del trabajo de grado asociado.
       * Llama a la función: obtenerParametrosRevisionTrabajoGrado.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los registros de revisiones al trabajo de grado.
       * @param {Object} documentoTrabajoGrado El documento de trabajo de grado asociado
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarRevisionesTrabajoGrado = function(documentoTrabajoGrado) {
        var deferred = $q.defer();
        poluxRequest.get("revision_trabajo_grado", ctrl.obtenerParametrosRevisionTrabajoGrado())
          .then(function(respuestaRevisionesTrabajoGrado) {
            if (Object.keys(respuestaRevisionesTrabajoGrado.data[0]).length > 0) {
              ctrl.revisionesTrabajoGrado = respuestaRevisionesTrabajoGrado.data;
            }
            deferred.resolve($translate.instant("ERROR.SIN_REVISIONES"));
          })
          .catch(function(excepcionRevisionesTrabajoGrado) {
            deferred.reject($translate.instant("ERROR.CARGANDO_REVISIONES"));
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name seleccionarProyecto
       * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
       * @description
       * Función que opera sobre la selección del proyecto que el docente va a revisar.
       * Llama a las funciones: consultarDocumentoTrabajoGrado y consultarRevisionesTrabajoGrado.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.seleccionarProyecto = function() {
        ctrl.errorCargandoDocumento = false;
        ctrl.errorCargandoRevisiones = false;
        ctrl.consultarDocumentoTrabajoGrado(ctrl.proyectoSeleccionado)
          .then(function(resultadoDocumentoTrabajoGrado) {
            ctrl.documentoTrabajoGrado = resultadoDocumentoTrabajoGrado.Id;
            ctrl.documentoEscrito = resultadoDocumentoTrabajoGrado.DocumentoEscrito;
            ctrl.consultarRevisionesTrabajoGrado(ctrl.documentoTrabajoGrado)
              .then(function(resultadoRevisiones) {
                if (!ctrl.revisionesTrabajoGrado) {
                  ctrl.errorCargandoRevisiones = true;
                  ctrl.mensajeErrorCargandoRevisiones = resultadoRevisiones;
                }
              })
              .catch(function(excepcionRevisiones) {
                ctrl.errorCargandoRevisiones = true;
                ctrl.mensajeErrorCargandoRevisiones = excepcionRevisiones;
              });
          })
          .catch(function(excepcionDocumentoTrabajoGrado) {
            ctrl.errorCargandoDocumento = true;
            ctrl.documentoEscrito = null;
            ctrl.mensajeErrorCargandoDocumento = excepcionDocumentoTrabajoGrado;
          });
      }

      ctrl.efectuarConsultasIniciales();

    });