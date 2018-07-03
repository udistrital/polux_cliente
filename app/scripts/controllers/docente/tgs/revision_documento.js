'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
 * @description
 * # DocenteTgsRevisionDocumentoCtrl
 * Controller of the poluxClienteApp
 */
angular.module('poluxClienteApp')
  .controller('DocenteTgsRevisionDocumentoCtrl', function($scope, nuxeo, poluxRequest, token_service, $q, $http, $translate, academicaRequest) {
    var ctrl = this;

    //ctrl.docente = $routeParams.idDocente;
    token_service.token.documento = "80093200";
    token_service.token.role.push("DOCENTE");
    ctrl.documentoDocente = token_service.token.documento;

    ctrl.mensajeCargandoProyectos = $translate.instant("LOADING.CARGANDO_PROYECTOS");

    /**
     * @ngdoc method
     * @name consultarDocenteTrabajoGrado
     * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
     * @description
     * Función que recorre la base de datos de acuerdo a la vinculación del trabajo de grado y trae los datos del docente asociado.
     * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica
     * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
     * @returns {String} La sentencia para la consulta correspondiente
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
     * @param {undefined} undefined No requiere parámetros
     * @returns {String} La sentencia para la consulta correspondiente
     */
    ctrl.obtenerParametrosVinculacionTrabajoGrado = function() {
      return $.param({
        query: "TrabajoGrado.EstadoTrabajoGrado.Id:13,Activo:True,Usuario:" +
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
     * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
     * @param {Object} trabajoGrado El trabajo de grado para cargar la información del documento
     * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.consultarVinculacionTrabajoGrado = function(trabajoGrado) {
      var deferred = $q.defer();
      //var conjuntoProcesamientoDocentes = [];
      poluxRequest.get("vinculacion_trabajo_grado", ctrl.obtenerParametrosVinculacionTrabajoGrado())
        .then(function(respuestaVinculaciones) {
          if (respuestaVinculaciones.data) {
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
     * Función que efectúa la consulta del nombre del docente en sesión, al igual que sus proyectos relacionados
     * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
     * @returns {String} La sentencia para la consulta correspondiente
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
        query: "TrabajoGrado.Id:" +
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
     * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
     * @param {Object} vinculacionTrabajoGrado La vinculación hacia el trabajo de grado seleccionado
     * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.consultarDocumentoTrabajoGrado = function(vinculacionTrabajoGrado) {
      var deferred = $q.defer();
      poluxRequest.get("documento_trabajo_grado", ctrl.obtenerParametrosDocumentoTrabajoGrado(vinculacionTrabajoGrado.TrabajoGrado.Id))
        .then(function(respuestaDocumentoTrabajoGrado) {
          if (respuestaDocumentoTrabajoGrado.data) {
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
        query: "DocumentoTrabajoGrado.Id:" +
          ctrl.documentoTrabajoGrado,
        limit: 0
      });
    }

    /**
     * @ngdoc method
     * @name consultarRevisionesTrabajoGrado
     * @methodOf poluxClienteApp.controller:DocenteTgsRevisionDocumentoCtrl
     * @description
     * Función que consulta el registro del trabajo de grado asociado al estudiante en sesión.
     * Llama a la función: obtenerParametrosRevisionTrabajoGrado.
     * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los registros de revisiones al trabajo de grado.
     * @param {Object} documentoTrabajoGrado El documento de trabajo de grado asociado
     * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
     */
    ctrl.consultarRevisionesTrabajoGrado = function(documentoTrabajoGrado) {
      var deferred = $q.defer();
      poluxRequest.get("revision_trabajo_grado", ctrl.obtenerParametrosRevisionTrabajoGrado())
        .then(function(respuestaRevisionesTrabajoGrado) {
          if (respuestaRevisionesTrabajoGrado.data) {
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
     * Función que opera sobre la selección del proyecto que el docente va a revisar
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
          ctrl.mensajeErrorCargandoDocumento = excepcionDocumentoTrabajoGrado;
        });
    }

    ctrl.efectuarConsultasIniciales();

  });