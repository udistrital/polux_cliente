'use strict';

/**
 * @ngdoc function
 * @name poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
 * @description
 * # EstudianteRevisionDocumentoCtrl
 * Controller of the poluxClienteApp.
 * Controlador que regula las operaciones de revisión sobre el documento del trabajo de grado del estudiante.
 * Se carga y enseña el documento asociado al estudiante, al igual que las revisiones que tiene registradas.
 * @requires $q
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @requires services/poluxService.service:gestorDocumentalMidService
 * @requires services/parametrosService.service:parametrosRequest
 * @property {Boolean} mindoc Indicador que maneja la minimización del documento en la vista
 * @property {String} codigoEstudiante Valor que carga el documento del estudiante en sesión
 * @property {String} mensajeCargandoTrabajoGrado Mensaje que aparece durante la carga del trabajo de grado
 * @property {Number} tipoDocumento Valor que carga el tipo de documento a consultarse
 * @property {Object} informacionAcademica Objeto que carga la información académica del estudiante consultado
 * @property {Boolean} cargandoTrabajoGrado Indicador que maneja la carga del trabajo de grado asociado
 * @property {Boolean} errorCargandoTrabajoGrado Indicador que maneja la aparición de un error durante la carga de un trabajo de grado
 * @property {Boolean} errorRevisionesTrabajoGrado Indicador que maneja la aparición de un error durante la carga de las revisiones del trabajo de grado
 * @property {Object} trabajoGrado Objeto que carga la información del trabajo de grado consultado
 * @property {Object} revisionesTrabajoGrado Objeto que carga la información de las revisiones del trabajo de grado consultado
 * @property {String} mensajeErrorRevisionesTrabajoGrado Mensaje que aparece en caso de haber un error al momento de consultar las revisiones del trabajo de grado
 * @property {String} mensajeErrorCargandoTrabajoGrado Mensaje que aparece en caso de haber un error al momento de consultar el trabajo de grado
 * @property {Boolean} revisionSolicitada Inicador que maneja la revisión en proceso de solicitud
 * @property {Boolean} loadingVersion Indicador que maneja la carga de las versión del documento consultado
 * @property {Object} nuevaVersionTrabajoGrado Objeto que carga la información de la nueva versión del trabajo de grado que será cargada
 * @property {Object} docenteRevision Objeto que carga la información del docente asociado a las revisiones del documento
 * @property {Boolean} loadTrabajoGrado Indicador que manjea la carga del trabajo de grado
 * @property {Boolean} cargandoActualizarTg Indicador que manjea la carga de la actualización del documento de trabajo de grado
 */
angular.module('poluxClienteApp')
  .controller('EstudianteRevisionDocumentoCtrl',
    function($q, $scope, $window, $translate, notificacionRequest,academicaRequest,utils,gestorDocumentalMidRequest, parametrosRequest, poluxRequest, token_service) {
      var ctrl = this;

      ctrl.EstadoTrabajoGrado = [];
      ctrl.EstadoEstudianteTrabajoGrado = [];
      ctrl.EstadoRevisionTrabajoGrado = [];
      ctrl.RolTrabajoGrado = [];
      ctrl.codigoEstudiante = token_service.getAppPayload().appUserDocument;
      ctrl.mensajeCargandoTrabajoGrado = $translate.instant("LOADING.CARGANDO_DATOS_TRABAJO_GRADO");
      ctrl.mensajeCargandoActualizarTg = $translate.instant("LOADING.ACTUALIZANDO_TRABAJO_GRADO");
      ctrl.revisionSolicitada = false;

      $scope.mindoc = false;

      /**
       * @ngdoc method
       * @name obtenerParametrosDirectorExterno
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla detalle_pasantia.
       * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosDirectorExterno = function(idTrabajoGrado) {
        return $.param({
          query: "TrabajoGrado.Id:" +
            idTrabajoGrado,
          limit: 1
        });
      }

      /**
       * @ngdoc method
       * @name consultarDirectorExterno
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que recorre la base de datos de acuerdo al trabajo de grado y trae su director externo en caso de existir.
       * Llama a la función: obtenerParametrosDirectorExterno.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
       * @param {Object} vinculacionTrabajoGrado La vinculación al trabajo de grado en revisión
       * @returns {Promise} El resultado de efectuar la consulta
       */
      ctrl.consultarDirectorExterno = function(vinculacionTrabajoGrado) {
        var deferred = $q.defer();
        poluxRequest.get("detalle_pasantia", ctrl.obtenerParametrosDirectorExterno(vinculacionTrabajoGrado.TrabajoGrado.Id))
          .then(function(docenteExterno) {
            if (Object.keys(docenteExterno.data[0]).length > 0) {
              var resultadoDocenteExterno = docenteExterno.data[0].Observaciones.split(" y dirigida por ");
              resultadoDocenteExterno = resultadoDocenteExterno[1].split(" con número de identificacion ");
              vinculacionTrabajoGrado.Nombre = resultadoDocenteExterno[0];
            }
            deferred.resolve($translate.instant("ERROR.SIN_DOCENTE"));
          })
          .catch(function(excepcionDocenteExterno) {
            deferred.reject($translate.instant("ERROR.CARGANDO_DOCENTE"));
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name consultarDocenteTrabajoGrado
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que recorre la base de datos de acuerdo a la vinculación del trabajo de grado y trae los datos del docente asociado.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica.
       * @param {Object} vinculacionTrabajoGrado La vinculación al trabajo de grado en revisión
       * @returns {Promise} El resultado de efectuar la consulta
       */
      ctrl.consultarDocenteTrabajoGrado = function(vinculacionTrabajoGrado) {
        var deferred = $q.defer();
        academicaRequest.get("docente_tg", [vinculacionTrabajoGrado.Usuario])
          .then(function(docenteDirector) {
            if (!angular.isUndefined(docenteDirector.data.docenteTg.docente)) {
              vinculacionTrabajoGrado.Nombre = docenteDirector.data.docenteTg.docente[0].nombre;
            }
            deferred.resolve($translate.instant("ERROR.SIN_DOCENTE"));
          })
          .catch(function(excepcionDocenteDirector) {
            deferred.reject($translate.instant("ERROR.CARGANDO_DOCENTE"));
          })
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosVinculacionTrabajoGrado
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla vinculacion_trabajo_grado.
       * @param {Number} idTrabajoGrado El identificador del trabajo de grado a consultar
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosVinculacionTrabajoGrado = function(idTrabajoGrado) {
        return $.param({
          query: "Activo:True,TrabajoGrado.Id:" +
            idTrabajoGrado,
          limit: 0
        });
      }

      /**
       * @ngdoc method
       * @name consultarVinculacionTrabajoGrado
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que recorre la base de datos de acuerdo al trabajo de grado y trae sus vinculaciones asociadas.
       * Llama a la función: obtenerParametrosVinculacionTrabajoGrado.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
       * @param {Object} trabajoGrado El trabajo de grado para cargar la información del documento
       * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarVinculacionTrabajoGrado = function(trabajoGrado) {
        var deferred = $q.defer();
        var conjuntoProcesamientoDocentes = [];
        poluxRequest.get("vinculacion_trabajo_grado", ctrl.obtenerParametrosVinculacionTrabajoGrado(trabajoGrado.Id))
          .then(function(respuestaVinculaciones) {
            if (Object.keys(respuestaVinculaciones.data[0]).length > 0) {
              angular.forEach(respuestaVinculaciones.data, function(vinculacionTrabajoGrado) {
                let rolTrabajoGrado = ctrl.RolTrabajoGrado.find(rolTrGr => {
                  return rolTrGr.Id == vinculacionTrabajoGrado.RolTrabajoGrado
                })
                vinculacionTrabajoGrado.rolAux = rolTrabajoGrado
                if (rolTrabajoGrado.CodigoAbreviacion == "DIR_EXTERNO_PLX") {
                  conjuntoProcesamientoDocentes.push(ctrl.consultarDirectorExterno(vinculacionTrabajoGrado));
                } else {
                  conjuntoProcesamientoDocentes.push(ctrl.consultarDocenteTrabajoGrado(vinculacionTrabajoGrado));
                }
              });
              $q.all(conjuntoProcesamientoDocentes)
                .then(function(resultadoDelProcesamiento) {
                  trabajoGrado.vinculaciones = respuestaVinculaciones.data.filter(function(vinculacion) { return vinculacion.Nombre });
                  console.log(trabajoGrado.vinculaciones)
                  deferred.resolve(resultadoDelProcesamiento);
                })
                .catch(function(excepcionDelProcesamiento) {
                  deferred.reject(excepcionDelProcesamiento);
                });
            } else {
              deferred.resolve($translate.instant("ERROR.SIN_TRABAJO_GRADO"));
            }
          })
          .catch(function(excepcionVinculacionTrabajoGrado) {
            deferred.reject($translate.instant("ERROR.CARGANDO_TRABAJO_GRADO"));
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosDocumentoTrabajoGrado
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla documento_trabajo_grado.
       * @param {Number} TrabajoGrado Trabajo de grado que se va a consultar
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosDocumentoTrabajoGrado = function(trabajoGrado) {
        //El tipo de documento que se busca 
        ctrl.tipoDocumento = 0;
        //Si el estado del trabajo es
        let estadoTrabajoGrado = ctrl.EstadoTrabajoGrado.find(estTrGr => {
          return estTrGr.Id == trabajoGrado.EstadoTrabajoGrado
        })
        var estadoTrabajoGradoAceptada = ["APR_PLX", "RVS_PLX", "AVI_PLX", "AMO_PLX", "SRV_PLX", "SRVS_PLX", "ASVI_PLX", "ASMO_PLX", "PAEA_PLX", "PECSPR_PLX"]
        if (estadoTrabajoGradoAceptada.includes(estadoTrabajoGrado.CodigoAbreviacion)) {
          ctrl.tipoDocumento = 4;
        }
        if (estadoTrabajoGrado.CodigoAbreviacion == "EC_PLX") {
          ctrl.tipoDocumento = 4;
        }
        estadoTrabajoGradoAceptada = ["PR_PLX", "ER_PLX", "MOD_PLX", "LPS_PLX", "STN_PLX", "NTF_PLX"]
        if (estadoTrabajoGradoAceptada.includes(estadoTrabajoGrado.CodigoAbreviacion)) {
          ctrl.tipoDocumento = 5;
        }
        return $.param({
          query: "DocumentoEscrito.TipoDocumentoEscrito:" + ctrl.tipoDocumento + "," +
            "TrabajoGrado.Id:" +
            trabajoGrado.Id,
          limit: 1
        });
        
      }

      /**
       * @ngdoc method
       * @name consultarDocumentoTrabajoGrado
       * @methodOf poluxClienteApp.controller:GeneralConsultarTrabajoGradoCtrl
       * @description
       * Función que recorre la base de datos de acuerdo al trabajo de grado vinculado y trae el documento asociado.
       * Llama a la función: obtenerParametrosDocumentoTrabajoGrado.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
       * @param {Object} trabajoGrado El trabajo de grado para cargar la información del documento
       * @returns {Promise} La información sobre el documento, el mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarDocumentoTrabajoGrado = function(trabajoGrado) {
        var deferred = $q.defer();
       
        poluxRequest.get("documento_trabajo_grado", ctrl.obtenerParametrosDocumentoTrabajoGrado(trabajoGrado))
          .then(function(respuestaDocumentoTrabajoGrado) {
            if (Object.keys(respuestaDocumentoTrabajoGrado.data[0]).length > 0) {
              trabajoGrado.documentoTrabajoGrado = respuestaDocumentoTrabajoGrado.data[0].Id;
              trabajoGrado.documentoEscrito = respuestaDocumentoTrabajoGrado.data[0].DocumentoEscrito;
            }
            deferred.resolve($translate.instant("ERROR.CARGAR_DOCUMENTO"));
          })
          .catch(function(excepcionDocumentoTrabajoGrado) {
            deferred.reject($translate.instant("ERROR.CARGAR_DOCUMENTO"));
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name consultarPeriodoAcademicoPrevio
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que obtiene el periodo académico previo dado el parámetro "P" de consulta.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer el periodo académico previo al actual.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} El periodo académico previo, o la excepción generada
       */
      ctrl.consultarPeriodoAcademicoPrevio = function() {
        var deferred = $q.defer();
        academicaRequest.get("periodo_academico", "P")
          .then(function(periodoAcademicoPrevio) {
            if (!angular.isUndefined(periodoAcademicoPrevio.data.periodoAcademicoCollection.periodoAcademico)) {
              deferred.resolve(periodoAcademicoPrevio.data.periodoAcademicoCollection.periodoAcademico[0]);
            } else {
              deferred.reject($translate.instant("ERROR.SIN_PERIODO"));
            }
          })
          .catch(function(excepcionPeriodoAcademico) {
            deferred.reject($translate.instant("ERROR.CARGANDO_PERIODO"));
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name consultarInformacionAcademicaDelEstudiante
       * @methodOf poluxClienteApp.controller:TrabajoGradoRevisarAnteproyectoCtrl
       * @description
       * Función que según el estudiante asociado, carga la información académica correspondiente.
       * Llama a la función: consultarPeriodoAcademicoPrevio.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica registrada.
       * @param {Object} estudianteAsociado El estudiante al que se le cargará la información académica
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarInformacionAcademicaDelEstudiante = function(codigoEstudiante) {
        var deferred = $q.defer();
        ctrl.consultarPeriodoAcademicoPrevio()
          .then(function(periodoAcademicoPrevio) {
            academicaRequest.get("datos_estudiante", [codigoEstudiante, periodoAcademicoPrevio.anio, periodoAcademicoPrevio.periodo])
              .then(function(estudianteConsultado) {
                if (!angular.isUndefined(estudianteConsultado.data.estudianteCollection.datosEstudiante)) {
                  ctrl.informacionAcademica = estudianteConsultado.data.estudianteCollection.datosEstudiante[0];
                }
                deferred.resolve($translate.instant("ERROR.SIN_INFO_ESTUDIANTE"));
              })
              .catch(function(excepcionEstudianteConsultado) {
                deferred.reject($translate.instant("ERROR.CARGANDO_INFO_ESTUDIANTE"));
              });
          })
          .catch(function(excepcionPeriodoAcademico) {
            deferred.reject(excepcionPeriodoAcademico);
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosEstudianteTrabajoGrado
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla estudiante_trabajo_grado.
       * El estado del trabajo de grado 13 corresponde a los trabajos de grado en curso
       * El estado del estudiante asociado al trabajo de grado 1 es el activo.
       * @param {undefined} undefined No requiere parámetros
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosEstudianteTrabajoGrado = function() {
        var estadosValidos = ["APR_PLX", "RVS_PLX", "AVI_PLX", "AMO_PLX", "SRV_PLX", "SRVS_PLX", "ASVI_PLX", "ASMO_PLX", "ASNV_PLX", "EC_PLX", "PR_PLX", "ER_PLX",
                              "MOD_PLX", "LPS_PLX", "STN_PLX", "NTF_PLX"]
        var query = "TrabajoGrado.EstadoTrabajoGrado.in:"
        var guardaPrimero = false;
        ctrl.EstadoTrabajoGrado.forEach(estadoTrGt => {
          if (estadosValidos.includes(estadoTrGt.CodigoAbreviacion)) {
            if (guardaPrimero) {
              query += "|";
            } else {
              guardaPrimero = true;
            }
            query += estadoTrGt.Id.toString();
          }
        });
        let estadoEstudianteTrabajoGrado = ctrl.EstadoEstudianteTrabajoGrado.find(estEstTrGr => {
          return estEstTrGr.CodigoAbreviacion == "EST_ACT_PLX"
        })
        query += ",EstadoEstudianteTrabajoGrado:" + estadoEstudianteTrabajoGrado.Id.toString() + ",Estudiante:" + ctrl.codigoEstudiante;
        return $.param({
          query: query,
          limit: 1
        });
      }

      /**
       * @ngdoc method
       * @name consultarTrabajosDeGradoCursados
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que consulta el registro del trabajo de grado asociado al estudiante en sesión.
       * Llama a las funciones: obtenerParametrosEstudianteTrabajoGrado, consultarDocumentoTrabajoGrado y consultarVinculacionTrabajoGrado.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los registros de trabajos de grado según el estudiante en sesión.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarEstudianteTrabajoGrado = async function() {
        var deferred = $q.defer();
        var conjuntoProcesamientoEstudianteTrabajoGrado = [];

        var parametroEstadoTrabajoGrado = $.param({
          query: "TipoParametroId__CodigoAbreviacion:EST_TRG",
          limit: 0
        });
        await parametrosRequest.get("parametro/?", parametroEstadoTrabajoGrado).then(function (responseEstadoTrabajoGrado) {
          ctrl.EstadoTrabajoGrado = responseEstadoTrabajoGrado.data.Data;
        })
        var parametroEstadoEstudianteTrabajoGrado = $.param({
          query: "TipoParametroId__CodigoAbreviacion:EST_ESTU_TRG",
          limit: 0
        });
        await parametrosRequest.get("parametro/?", parametroEstadoEstudianteTrabajoGrado).then(function (responseEstadoEstudTrGr) {
          ctrl.EstadoEstudianteTrabajoGrado = responseEstadoEstudTrGr.data.Data;
        })
        var parametroEstadoRevisionTrabajoGrado = $.param({
          query: "TipoParametroId__CodigoAbreviacion:ESTREV_TRG",
          limit: 0
        });
        await parametrosRequest.get("parametro/?", parametroEstadoRevisionTrabajoGrado).then(function (responseEstRevTrGr) {
          ctrl.EstadoRevisionTrabajoGrado = responseEstRevTrGr.data.Data;
        })
        var parametroRolTrabajoGrado = $.param({
          query: "TipoParametroId__CodigoAbreviacion:ROL_TRG",
          limit: 0
        });
        await parametrosRequest.get("parametro/?", parametroRolTrabajoGrado).then(function (responseRolTrGr) {
          ctrl.RolTrabajoGrado = responseRolTrGr.data.Data;
        })
        poluxRequest.get("estudiante_trabajo_grado", ctrl.obtenerParametrosEstudianteTrabajoGrado())
          .then(function(estudianteConTrabajoDeGrado) {
            console.log("ESTUDIANMTE ", estudianteConTrabajoDeGrado)
            if (Object.keys(estudianteConTrabajoDeGrado.data[0]).length > 0) {
              conjuntoProcesamientoEstudianteTrabajoGrado.push(ctrl.consultarDocumentoTrabajoGrado(estudianteConTrabajoDeGrado.data[0].TrabajoGrado));     
              conjuntoProcesamientoEstudianteTrabajoGrado.push(ctrl.consultarVinculacionTrabajoGrado(estudianteConTrabajoDeGrado.data[0].TrabajoGrado));
              conjuntoProcesamientoEstudianteTrabajoGrado.push(ctrl.consultarInformacionAcademicaDelEstudiante(ctrl.codigoEstudiante));
              $q.all(conjuntoProcesamientoEstudianteTrabajoGrado)
                .then(function(resultadoDelProcesamiento) {
                  if (estudianteConTrabajoDeGrado.data[0].TrabajoGrado.documentoEscrito &&
                    estudianteConTrabajoDeGrado.data[0].TrabajoGrado.documentoTrabajoGrado &&
                    estudianteConTrabajoDeGrado.data[0].TrabajoGrado.vinculaciones &&
                    ctrl.informacionAcademica) {
                    deferred.resolve(estudianteConTrabajoDeGrado.data[0].TrabajoGrado);
                  } else {
                    deferred.resolve(resultadoDelProcesamiento);
                  }
                })
                .catch(function(excepcionDelProcesamiento) {
                  deferred.reject(excepcionDelProcesamiento);
                });
            } else {
              deferred.reject($translate.instant("ERROR.SIN_ESTUDIANTE_TRABAJO_GRADO"));
            }
          })
          .catch(function(excepcionTrabajosDeGrado) {
            deferred.reject($translate.instant("ERROR.CARGANDO_ESTUDIANTE_TRABAJO_GRADO"));
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name actualizarContenidoRevisiones
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que efectúa las consultas iniciales del módulo para cargar el contenido.
       * Opera con: consultarEstudianteTrabajoGrado y consultarRevisionesTrabajoGrado
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.actualizarContenidoRevisiones = function() {
        ctrl.cargandoTrabajoGrado = true;
        ctrl.errorCargandoTrabajoGrado = false;
        ctrl.errorRevisionesTrabajoGrado = false;
        ctrl.consultarEstudianteTrabajoGrado()
          .then(function(trabajoDeGradoConsultado) {
            if (trabajoDeGradoConsultado.documentoEscrito &&
              trabajoDeGradoConsultado.documentoTrabajoGrado &&
              trabajoDeGradoConsultado.vinculaciones &&
              ctrl.informacionAcademica) {
              ctrl.cargandoTrabajoGrado = false;
              ctrl.trabajoGrado = trabajoDeGradoConsultado;
              ctrl.trabajoGrado.EstadoTrabajoGradoAux = ctrl.EstadoTrabajoGrado.find(estTrGr => {
                return estTrGr.Id == ctrl.trabajoGrado.EstadoTrabajoGrado
              })
              console.log(ctrl.trabajoGrado)
              ctrl.consultarRevisionesTrabajoGrado()
                .then(function(respuestaRevisionesTrabajoGrado) {
                  ctrl.revisionesTrabajoGrado = respuestaRevisionesTrabajoGrado;
                  ctrl.revisionesTrabajoGrado.forEach(revision => {
                    revision.EstadoRevisionNombre = ctrl.EstadoRevisionTrabajoGrado.find(estRevTrGr => {
                      return estRevTrGr.Id == revision.EstadoRevisionTrabajoGrado
                    });
                  });
                  console.log(ctrl.revisionesTrabajoGrado)
                })
                .catch(function(excepcionRevisionesTrabajoGrado) {
                  ctrl.errorRevisionesTrabajoGrado = true;
                  ctrl.mensajeErrorRevisionesTrabajoGrado = excepcionRevisionesTrabajoGrado;
                });
            } else {
              ctrl.cargandoTrabajoGrado = false;
              ctrl.errorCargandoTrabajoGrado = true;
              ctrl.mensajeErrorCargandoTrabajoGrado = trabajoDeGradoConsultado[0];
            }
          })
          .catch(function(excepcionEstudianteTrabajoGrado) {
            ctrl.cargandoTrabajoGrado = false;
            ctrl.errorCargandoTrabajoGrado = true;
            ctrl.mensajeErrorCargandoTrabajoGrado = excepcionEstudianteTrabajoGrado;
          });
      }

      /**
       * @ngdoc method
       * @name obtenerParametrosRevisionTrabajoGrado
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que define los parámetros para consultar en la tabla revision_trabajo_grado.
       * @param {undefined} undefined No requiere parámetros
       * @returns {String} La sentencia para la consulta correspondiente
       */
      ctrl.obtenerParametrosRevisionTrabajoGrado = function() {
        return $.param({
          query: "DocumentoTrabajoGrado.TrabajoGrado.Id:" +
            ctrl.trabajoGrado.Id,
          limit: 0
        });
      }

      /**
       * @ngdoc method
       * @name consultarRevisionesTrabajoGrado
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que consulta el registro del trabajo de grado asociado al estudiante en sesión.
       * Llama a la función: obtenerParametrosRevisionTrabajoGrado.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los registros de revisiones al trabajo de grado.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} El mensaje en caso de no corresponder la información, o la excepción generada
       */
      ctrl.consultarRevisionesTrabajoGrado = function() {
        var deferred = $q.defer();
        poluxRequest.get("revision_trabajo_grado", ctrl.obtenerParametrosRevisionTrabajoGrado())        
          .then(function(respuestaRevisionesTrabajoGrado) {
            //console.log(respuestaRevisionesTrabajoGrado);
            if (Object.keys(respuestaRevisionesTrabajoGrado.data[0]).length > 0) {
              angular.forEach(respuestaRevisionesTrabajoGrado.data, function(revision) {
                let estadoRevisionTrabajoGrado = ctrl.EstadoRevisionTrabajoGrado.find(estRevTrGr => {
                  return estRevTrGr.Id == revision.EstadoRevisionTrabajoGrado
                })
                console.log(ctrl.EstadoRevisionTrabajoGrado)
                if (estadoRevisionTrabajoGrado.CodigoAbreviacion == "PENDIENTE_PLX") {
                  ctrl.revisionSolicitada = true;
                }
              });
              deferred.resolve(respuestaRevisionesTrabajoGrado.data);
            } else {
              deferred.reject($translate.instant("ERROR.SIN_REVISIONES"));
            }
          })
          .catch(function(excepcionRevisionesTrabajoGrado) {
            deferred.reject($translate.instant("ERROR.CARGANDO_REVISIONES"));
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name subirNuevaVersionDocumento
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que enseña la ventana emergente que permite subir una nueva versión del documento de trabajo de grado.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.subirNuevaVersionDocumento = function() {
        $('#modalSubirNuevaVersion').modal('show');
      }

      /**
       * @ngdoc method
       * @name actualizarTrabajoGrado
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que prepara el contenido de la información para actualizar.
       * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para registrar la actualización del trabajo de grado.
       * @param {String} respuestaCargarDocumento El enlace generado luego de subir el documento
       * @returns {Promise} La respuesta de operar el registro en la base de datos
       */
      ctrl.actualizarTrabajoGrado = function(respuestaCargarDocumento) {
        var deferred = $q.defer();
        //console.log(respuestaCargarDocumento);
        ctrl.trabajoGrado.documentoEscrito.Enlace = respuestaCargarDocumento;
        poluxRequest
          .put("documento_escrito", ctrl.trabajoGrado.documentoEscrito.Id, ctrl.trabajoGrado.documentoEscrito)
          .then(function(respuestaActualizarAnteproyecto) {
            deferred.resolve(respuestaActualizarAnteproyecto);
          })
          .catch(function(excepcionActualizarAnteproyecto) {
            deferred.reject(excepcionActualizarAnteproyecto);
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name verDocumento
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Permite ver un documento que sea versión de un trabajo de grado.
       * Efectúa el servicio de {@link services/poluxService.service:nuxeoClient nuxeoClient} para realizar gestión documental.
       * @param {Object} doc Documento que se va a descargar
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.verDocumento = function(doc) {
        if (doc.uid) {
          ctrl.loadingVersion = true;
          /*nuxeoClient.getDocument(doc.uid)
            .then(function(documento) {
              ctrl.loadingVersion = false;
              window.open(documento.url);
            })*/
            gestorDocumentalMidRequest.get('/document/'+doc.uid).then(function (response) {  
                var varia = utils.base64ToArrayBuffer(response.data.file);
                var file = new Blob([varia], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                $window.open(fileURL, 'resizable=yes,status=no,location=no,toolbar=no,menubar=no,fullscreen=yes,scrollbars=yes,dependent=no,width=700,height=900');
             })
            .catch(function(error) {
              ctrl.loadingVersion = false;
              swal(
                $translate.instant("MENSAJE_ERROR"),
                $translate.instant("ERROR.CARGAR_DOCUMENTO"),
                'warning'
              );
            });
        }
      }

      /**
       * @ngdoc method
       * @name subirDocumentoTg
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Ordena el llamado de funciones para subir documentos de acuerdo al estado del trabajo de grado.
       * Funciona con: subirNuevoDocumento y subirDocumento
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.subirDocumentoTg = function() {
        let estadoTrabajoGrado = ctrl.EstadoTrabajoGrado.find(estTrGr => {
          return estTrGr.Id == ctrl.trabajoGrado.EstadoTrabajoGrado
        })
        if (estadoTrabajoGrado.CodigoAbreviacion == "EC_PLX") {
          ctrl.subirNuevoDocumento();
        } else {
          ctrl.subirDocumento();
        }
      }

      /**
       * @ngdoc method
       * @name subirNuevoDocumento
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Maneja la operación de subir el documento luego de que el usuario selecciona y efectúa click sobre el botón dentro del modal.
       * Funciona con: actualizarTrabajoGrado y actualizarContenidoRevisiones
       * Efectúa el servicio de {@link services/poluxService.service:nuxeoClient nuxeoClient} para realizar gestión documental.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.subirNuevoDocumento = function() {
        swal({
            title: $translate.instant("CORREGIR_ANTEPROYECTO.CONFIRMACION"),
            text: $translate.instant("CORREGIR_ANTEPROYECTO.MENSAJE_CONFIRMACION"),
            type: "info",
            confirmButtonText: $translate.instant("ACEPTAR"),
            cancelButtonText: $translate.instant("CANCELAR"),
            showCancelButton: true
          })
          .then(function(confirmacionDelUsuario) {
            if (confirmacionDelUsuario) {
              ctrl.cargandoTrabajoGrado = true;
              $('#modalSubirNuevaVersion').modal('hide');
              //ctrl.cargarDocumento(ctrl.trabajoGrado.Titulo, "Versión nueva del trabajo de grado", ctrl.nuevaVersionTrabajoGrado)
             // nuxeoClient.uploadNewVersion(ctrl.trabajoGrado.documentoEscrito.Enlace, ctrl.nuevaVersionTrabajoGrado)
             //   .then(function(respuestaCargarDocumento) {
                  // Upload de nueva version
                  var descripcion;
                  var fileBase64 ;
                  var data = [];
                  var URL = "";
                    descripcion = "Versión nueva del trabajo de grado";
                    utils.getBase64(ctrl.nuevaVersionTrabajoGrado).then(
                      function (base64) {
                       fileBase64 = base64;
                    data = [{
                     IdTipoDocumento: 5, //id tipo documento de documentos_crud
                     nombre: ctrl.trabajoGrado.Titulo ,// nombre formado por nombre de la solicitud
                     metadatos: {
                       NombreArchivo: ctrl.trabajoGrado.Titulo+": "+ctrl.codigoEstudiante,
                       Tipo: "Archivo",
                       Observaciones: "Nueva version trabajo "+ctrl.trabajoGrado.Titulo
                     },
                     descripcion:descripcion,
                     file:  fileBase64,
                    }]
                      gestorDocumentalMidRequest.post('/document/upload',data).then(function (response){
                      URL =  response.data.res.Enlace
                      ctrl.actualizarTrabajoGrado(URL).then(function(respuestaActualizarTg) {
                        console.log(respuestaActualizarTg.statusText)
                        if (respuestaActualizarTg.statusText === "OK") {
                          ctrl.cargandoTrabajoGrado = false;
                          var nick = token_service.getAppPayload().email.split("@").slice(0);
                          academicaRequest.get("datos_basicos_estudiante", [token_service.getAppPayload().appUserDocument])
                          .then(function(responseDatosBasicos) {
                            console.log(responseDatosBasicos)
                              var carrera = responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                              academicaRequest.get("carrera",[carrera]).then(function(ResponseCarrea){
                                carrera = ResponseCarrea.data.carrerasCollection.carrera[0].nombre;
                                notificacionRequest.enviarNotificacion('Solicitud de '+carrera+' de '+nick[0]+' de REVISIÓN NUEVA de Trabajo de grado','PoluxColaDocente','/docente/tgs/revision_documento');
                                var Atributos={
                                  rol:'DOCENTE',
                                }
                                notificacionRequest.enviarCorreo('Petición de revisión',Atributos,['101850341'],'','','e ha realizado la solicitud de revision del trabajo de grado, se ha dado la peticion de parte de '+responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0].nombre+' para la solicitud .Cuando se desee observar el msj se puede copiar el siguiente link para acceder https://polux.portaloas.udistrital.edu.co/');              
//                              notificacionRequest.enviarCorreo('Petición de revisión',Atributos,[ctrl.docenteRevision.Id],'','','Se ha realizado la solicitud de revision del trabajo de grado, se ha dado la peticion de parte de '+responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0].nombre+' para la solicitud');   
                              });
                            });
                            swal(
                            $translate.instant("CORREGIR_ANTEPROYECTO.CONFIRMACION"),
                            $translate.instant("CORREGIR_ANTEPROYECTO.ANTEPROYECTO_ACTUALIZADO"),
                            'success'
                          );
                          ctrl.actualizarContenidoRevisiones();
                          //$('#modalSubirNuevaVersion').modal('hide');
                        } else {
                          ctrl.cargandoTrabajoGrado = false;
                          swal(
                            $translate.instant("CORREGIR_ANTEPROYECTO.CONFIRMACION"),
                            $translate.instant(respuestaActualizarTg.data[1]),
                            'warning'
                          );
                        }
                      })
                      .catch(function(excepcionActualizarTg) {
                        ctrl.cargandoTrabajoGrado = false;
                        console.log(excepcionActualizarTg)
                        swal(
                          $translate.instant("CORREGIR_ANTEPROYECTO.CONFIRMACION"),
                          $translate.instant("ERROR.MODIFICANDO_TG"),
                          'warning'
                        );
                      });
                  })
                })
                .catch(function(excepcionCargarDocumento) {
                  ctrl.cargandoTrabajoGrado = false;
                  swal(
                    $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                    $translate.instant("VERIFICAR_DOCUMENTO"),
                    'warning'
                  );
                });
            }
          });
      }

      /**
       * @ngdoc method
       * @name solicitarRevision
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Enseña la ventana emergente que le permite al estudiante solicitar una nueva revisión.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.solicitarRevision = function() {
        $('#modalSolicitarRevision').modal('show');
      }

      /**
       * @ngdoc method
       * @name registrarRevision
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Pide la confirmación para el registro de la revisión y registra la revisión solicitada en la base de datos.
       * Funciona con: consultarRevisionesTrabajoGrado.
       * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para operar sobre la base de datos del proyecto.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.registrarRevision = function() {
        swal({
            title: $translate.instant("FORMULARIO_SOLICITAR_REVISION.CONFIRMACION"),
            text: $translate.instant("FORMULARIO_SOLICITAR_REVISION.MENSAJE_CONFIRMACION", {
              nombre: ctrl.docenteRevision.Nombre,
              rol: ctrl.docenteRevision.RolTrabajoGrado.Nombre
            }),
            type: "info",
            confirmButtonText: $translate.instant("ACEPTAR"),
            cancelButtonText: $translate.instant("CANCELAR"),
            showCancelButton: true
          })
          .then(function(confirmacionDelUsuario) {
            if (confirmacionDelUsuario) {
              let estadoRevisionTrabajoGrado = ctrl.EstadoRevisionTrabajoGrado.find(estRevTrGr => {
                return estRevTrGr.CodigoAbreviacion == "PENDIENTE_PLX"
              })
              var nuevaRevision = {
                NumeroRevision: (angular.isUndefined(ctrl.revisionesTrabajoGrado)) ? 1 : ctrl.revisionesTrabajoGrado.length + 1,
                FechaRecepcion: new Date(),
                EstadoRevisionTrabajoGrado: estadoRevisionTrabajoGrado.Id,
                DocumentoTrabajoGrado: {
                  Id: ctrl.trabajoGrado.documentoTrabajoGrado
                },
                VinculacionTrabajoGrado: {
                  Id: ctrl.docenteRevision.Id
                }
              };
              poluxRequest.post("revision_trabajo_grado", nuevaRevision)
                .then(function(respuestaSolicitarRevision) {
                  var nick = token_service.getAppPayload().email.split("@").slice(0);
                  academicaRequest.get("datos_basicos_estudiante", [token_service.getAppPayload().appUserDocument])
                  .then(function(responseDatosBasicos) {
                      var carrera = responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                      academicaRequest.get("carrera",[carrera]).then(function(ResponseCarrea){
                        carrera = ResponseCarrea.data.carrerasCollection.carrera[0].nombre;
                        notificacionRequest.enviarNotificacion('Solicitud de '+carrera+' de '+nick[0]+' de REVISIÓN NUEVA de trabajo de grado ','PoluxColaDocente','/docente/tgs/revision_documento'); 
                        var Atributos={
                          rol:'DOCENTE',
                      }
                      notificacionRequest.enviarCorreo('Petición de revisión',Atributos,['101850341'],'','','e ha realizado la solicitud de revision del trabajo de grado, se ha dado la peticion de parte de '+responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0].nombre+' para la solicitud .Cuando se desee observar el msj se puede copiar el siguiente link para acceder https://polux.portaloas.udistrital.edu.co/');
                      //  notificacionRequest.enviarCorreo('Petición de revisión',Atributos,[ctrl.docenteRevision.Id],'','','Se ha realizado la solicitud de revision del trabajo de grado, se ha dado la peticion de parte de '+responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0].nombre+' para la solicitud');                      		
                      });
                    });
                  swal(
                    $translate.instant("FORMULARIO_SOLICITAR_REVISION.CONFIRMACION"),
                    $translate.instant("FORMULARIO_SOLICITAR_REVISION.REVISION_SOLICITADA"),
                    'success'
                  );
                  ctrl.consultarRevisionesTrabajoGrado()
                    .then(function(respuestaRevisionesTrabajoGrado) {
                      ctrl.revisionesTrabajoGrado = respuestaRevisionesTrabajoGrado;
                    })
                    .catch(function(excepcionRevisionesTrabajoGrado) {
                      ctrl.errorRevisionesTrabajoGrado = true;
                      ctrl.mensajeErrorRevisionesTrabajoGrado = excepcionRevisionesTrabajoGrado;
                    });
                  $('#modalSolicitarRevision').modal('hide');
                })
                .catch(function(excepcionSolicitarRevision) {
                  swal(
                    $translate.instant("FORMULARIO_SOLICITAR_REVISION.CONFIRMACION"),
                    $translate.instant("ERROR.SOLICITANDO_REVISION"),
                    'warning'
                  );
                });
            }
          });
      }

      ctrl.actualizarContenidoRevisiones();

      /**
       * @ngdoc method
       * @name actualizarDocumentoTg
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Permite mostrar el contenido del modal que habilita subir el documento nuevo y actualizar el trabajo de grado
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.actualizarDocumentoTg = function() {
        $('#modalActualizarTg').modal('show');
      }

      /**
       * @ngdoc method
       * @name actualizarDocumentoTrabajoGrado
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description
       * Función que prepara el contenido de la información para actualizar.
       * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para registrar la actualización del trabajo de grado.
       * @param {String} respuestaCargarDocumento El enlace generado luego de subir el documento
       * @returns {Promise} La respuesta de operar el registro en la base de datos
       */
      ctrl.actualizarDocumentoTrabajoGrado = function(respuestaCargarDocumento) {
        var deferred = $q.defer();
        let estadoTrabajoGrado = ctrl.EstadoTrabajoGrado.find(estTrGr => {
          return estTrGr.Id == ctrl.trabajoGrado.EstadoTrabajoGrado
        })
        if (estadoTrabajoGrado.CodigoAbreviacion == "AMO_PLX" || estadoTrabajoGrado.CodigoAbreviacion == "ASMO_PLX") {
          let estadoTrabajoGrado = ctrl.EstadoTrabajoGrado.find(estTrGr => {
            return estTrGr.CodigoAbreviacion == "RVS_PLX"
          })
          ctrl.trabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;
          ctrl.trabajoGrado.documentoEscrito.TipoDocumentoEscrito = 3;
        }
        if (estadoTrabajoGrado.CodigoAbreviacion == "AVI_PLX" || estadoTrabajoGrado.CodigoAbreviacion == "ASVI_PLX" || estadoTrabajoGrado.CodigoAbreviacion == "PECSPR_PLX") {
          let estadoTrabajoGrado = ctrl.EstadoTrabajoGrado.find(estTrGr => {
            return estTrGr.CodigoAbreviacion == "EC_PLX"
          })
          ctrl.trabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;
          ctrl.trabajoGrado.documentoEscrito.TipoDocumentoEscrito = 4;
        }
        if (estadoTrabajoGrado.CodigoAbreviacion == "MOD_PLX") {
          let estadoTrabajoGrado = ctrl.EstadoTrabajoGrado.find(estTrGr => {
            return estTrGr.CodigoAbreviacion == "ER_PLX"
          })
          ctrl.trabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;
          ctrl.trabajoGrado.documentoEscrito.TipoDocumentoEscrito = 5;
        }
        if (estadoTrabajoGrado.CodigoAbreviacion == "PAEA_PLX") {
          let estadoTrabajoGrado = ctrl.EstadoTrabajoGrado.find(estTrGr => {
            return estTrGr.CodigoAbreviacion == "PECSPR_PLX"
          })
          ctrl.trabajoGrado.EstadoTrabajoGrado = estadoTrabajoGrado.Id;
          ctrl.trabajoGrado.documentoEscrito.TipoDocumentoEscrito = 7;
        }
        //delete ctrl.trabajoGrado.documentoEscrito.Id
        ctrl.trabajoGrado.documentoEscrito.Enlace = respuestaCargarDocumento;
        var documentoTrabajoGrado = {
          Id: ctrl.trabajoGrado.documentoTrabajoGrado,
          TrabajoGrado: {
            Id: ctrl.trabajoGrado.Id
          },
          DocumentoEscrito: {
            Id: 0,
          }
        }
        var informacionParaActualizar = {
          "DocumentoEscrito": ctrl.trabajoGrado.documentoEscrito,
          "DocumentoTrabajoGrado": documentoTrabajoGrado,
          "TrabajoGrado": ctrl.trabajoGrado
        };
        poluxRequest
          .post("tr_actualizar_documento_tg", informacionParaActualizar)
          .then(function(respuestaActualizarAnteproyecto) {
            deferred.resolve(respuestaActualizarAnteproyecto);
          })
          .catch(function(excepcionActualizarAnteproyecto) {
            deferred.reject(excepcionActualizarAnteproyecto);
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name subirDocumento
       * @methodOf poluxClienteApp.controller:EstudianteRevisionDocumentoCtrl
       * @description 
       * Pide la confirmación y realiza el registro del documento que va a actualizarse.
       * Funciona con: actualizarDocumentoTrabajoGrado y actualizarContenidoRevisiones
       * Efectúa el servicio de {@link services/poluxService.service:nuxeoClient nuxeoClient} para realizar gestión documental.
       * @param {undefined} undefined No requiere parámetros
       * @returns {undefined} No hace retorno de resultados
       */
      ctrl.subirDocumento = function() {
        var descripcionDocumento;
        var titleConfirmacion;
        var mensajeConfirmacion;
        var mensajeSuccess;
        var workspace;
        let estadoTrabajoGrado = ctrl.EstadoTrabajoGrado.find(estTrGr => {
          return estTrGr.Id == ctrl.trabajoGrado.EstadoTrabajoGrado
        })
        if (estadoTrabajoGrado.CodigoAbreviacion == "AMO_PLX" || estadoTrabajoGrado.CodigoAbreviacion == "ASMO_PLX") {
          descripcionDocumento = "Versión nueva del anteproyecto";
          titleConfirmacion = "CORREGIR_ANTEPROYECTO.CONFIRMACION";
          mensajeConfirmacion = "CORREGIR_ANTEPROYECTO.MENSAJE_CONFIRMACION";
          mensajeSuccess = "CORREGIR_ANTEPROYECTO.ANTEPROYECTO_ACTUALIZADO";
          workspace = 'Anteproyectos';
        }
        if (estadoTrabajoGrado.CodigoAbreviacion == "AVI_PLX" || estadoTrabajoGrado.CodigoAbreviacion == "ASVI_PLX" || estadoTrabajoGrado.CodigoAbreviacion == "PECSPR_PLX") {
          descripcionDocumento = "Primera versión del trabajo de grado";
          titleConfirmacion = "PRIMERA_VERSION.CONFIRMACION";
          mensajeConfirmacion = "PRIMERA_VERSION.MENSAJE_CONFIRMACION";
          mensajeSuccess = "PRIMERA_VERSION.TG_ACTUALIZADO";
          workspace = 'versiones_TG';
        }
        if (estadoTrabajoGrado.CodigoAbreviacion == "MOD_PLX") {
          descripcionDocumento = "Versión del trabajo de grado";
          titleConfirmacion = "NUEVA_VERSION.CONFIRMACION";
          mensajeConfirmacion = "NUEVA_VERSION.MENSAJE_CONFIRMACION";
          mensajeSuccess = "NUEVA_VERSION.TG_ACTUALIZADO";
          workspace = 'versiones_TG';
        }
        if (estadoTrabajoGrado.CodigoAbreviacion == "EC_PLX") {
          descripcionDocumento = "Versión del trabajo de grado";
          titleConfirmacion = "NUEVA_VERSION.CONFIRMACION";
          mensajeConfirmacion = "NUEVA_VERSION.MENSAJE_CONFIRMACION";
          mensajeSuccess = "NUEVA_VERSION.TG_ACTUALIZADO";
          workspace = 'versiones_TG';
        }
        // Para certificado de ARL
        if (estadoTrabajoGrado.CodigoAbreviacion == "PAEA_PLX") {
          descripcionDocumento = "Certifiado de ARL de la pasantia";
          titleConfirmacion = "ARL.CONFIRMACION";
          mensajeConfirmacion = "ARL.MENSAJE_CONFIRMACION";
          mensajeSuccess = "ARL.TG_ACTUALIZADO";
          workspace = 'ARL';
        }
        swal({
            title: $translate.instant(titleConfirmacion),
            text: $translate.instant(mensajeConfirmacion),
            type: "info",
            confirmButtonText: $translate.instant("ACEPTAR"),
            cancelButtonText: $translate.instant("CANCELAR"),
            showCancelButton: true
          })
          .then(function(confirmacionDelUsuario) {
            if (confirmacionDelUsuario) {
              ctrl.loadTrabajoGrado = true;
              ctrl.cargandoActualizarTg = true;
              var functionDocument = function(estadoTg, titulo, descripcion, fileModel, workspace) {
                //Actualiza el documento
                let estadoTrabajoGrado = ctrl.EstadoTrabajoGrado.find(estTrGr => {
                  return estTrGr.Id == estadoTg
                })
                var estadosValidos = ["AMO_PLX", "ASMO_PLX", "EC_PLX", "MOD_PLX"]
                if (estadosValidos.includes(estadoTrabajoGrado.CodigoAbreviacion)) {
                  //return nuxeoClient.uploadNewVersion(ctrl.trabajoGrado.documentoEscrito.Enlace, fileModel)     
                  var descripcion;
                  var fileBase64 ;
                  var data = [];
                  var URL = "";
                    descripcion = "Versión nueva del trabajo de grado";
                    utils.getBase64(fileModel).then(
                      function (base64) {
                       fileBase64 = base64;
                    data = [{
                     IdTipoDocumento: 19, //id tipo documento de documentos_crud
                     nombre: ctrl.trabajoGrado.Titulo ,// nombre formado por nombre de la solicitud
                     file:  fileBase64,
                     metadatos: {
                       NombreArchivo: ctrl.trabajoGrado.Titulo  +": "+ctrl.codigoEstudiante,
                       Tipo: "Archivo",
                       Observaciones: "Nueva version trabajo "+ctrl.trabajoGrado.Titulo
                     }, 
                     descripcion:descripcion,
                    }] 
                    return gestorDocumentalMidRequest.post('/document/upload',data)
                  })  
                }
                //Si es primera versión crea el documento
                estadosValidos = ["AVI_PLX", "ASVI_PLX", "PAEA_PLX", "PECSPR_PLX"]
                if (estadosValidos.includes(estadoTrabajoGrado.CodigoAbreviacion)) {
                  //Se carga el documento con el gestor documental
                  var fileBase64 ;
                  var data = [];
                  var URL;
                    utils.getBase64(fileModel).then(
                      function (base64) {
                       fileBase64 = base64;
                    data = [{
                     IdTipoDocumento: 18, //id tipo documento de documentos_crud
                     nombre: titulo ,// nombre formado por el titulo
                     metadatos: {
                       NombreArchivo: titulo,
                       Tipo: "Archivo",
                       Observaciones: workspace
                     },
                     descripcion:descripcion,
                     file:  fileBase64,
                    }]
                      gestorDocumentalMidRequest.post('/document/upload',data).then(function (response){
                        URL = response;
                        ctrl.actualizarDocumentoTrabajoGrado(response.data.res.Enlace).then(function() {
                          swal(
                            $translate.instant(titleConfirmacion),
                            $translate.instant(mensajeSuccess),
                            'success'
                          ).then((result) => {
                            if (result) {
                              $window.location.reload();
                            }
                          });
                        })
                      return URL
                     })
                  })
                 // return nuxeoClient.createDocument(titulo, descripcion, fileModel, workspace, undefined)
                }
              }
              functionDocument(ctrl.trabajoGrado.EstadoTrabajoGrado, ctrl.trabajoGrado.Titulo, descripcionDocumento, ctrl.documentoActualizado, workspace)
                //nuxeoClient.createDocument(ctrl.trabajoGrado.Titulo, descripcionDocumento, ctrl.documentoActualizado, workspace, undefined)
                .then(function(respuestaCargarDocumento) {
                  ctrl.actualizarDocumentoTrabajoGrado(respuestaCargarDocumento)
                    .then(function(respuestaActualizarTG) {
                      if (respuestaActualizarTG.data[0] === "Success") {
                        ctrl.loadTrabajoGrado = false;
                        ctrl.cargandoActualizarTg = false;
                        var nick = token_service.getAppPayload().email.split("@").slice(0);
                        academicaRequest.get("datos_basicos_estudiante", [token_service.getAppPayload().appUserDocument])
                        .then(function(responseDatosBasicos) {
                            var carrera = responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0].carrera;
                            academicaRequest.get("carrera",[carrera]).then(function(ResponseCarrea){
                              carrera = ResponseCarrea.data.carrerasCollection.carrera[0].nombre;
                              notificacionRequest.enviarNotificacion('Solicitud de '+carrera+' de '+nick[0]+' de REVISION de proyecto','PoluxColaDocente','/docente/tgs/revision_documento');               
                              var Atributos={
                                rol:'DOCENTE',
                            }
                            notificacionRequest.enviarCorreo('Petición de revisión',Atributos,['101850341'],'','','e ha realizado la solicitud de revision del trabajo de grado, se ha dado la peticion de parte de '+responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0].nombre+' para la solicitud .Cuando se desee observar el msj se puede copiar el siguiente link para acceder https://polux.portaloas.udistrital.edu.co/');              

                            //  notificacionRequest.enviarCorreo('Petición de revisión',Atributos,[ctrl.docenteRevision.Id],'','','Se ha realizado la solicitud de revision del trabajo de grado, se ha dado la peticion de parte de '+responseDatosBasicos.data.datosEstudianteCollection.datosBasicosEstudiante[0].nombre+' para la solicitud.Cuando se desee puede copiar el siguiente link para acceder https://polux.portaloas.udistrital.edu.co/');   
                            });
                          });
                        swal(
                          $translate.instant(titleConfirmacion),
                          $translate.instant(mensajeSuccess),
                          'success'
                        );
                        $('#modalActualizarTg').modal('hide');
                        ctrl.actualizarContenidoRevisiones();
                      } else {
                        ctrl.loadTrabajoGrado = false;
                        ctrl.cargandoActualizarTg = false;
                        $('#modalActualizarTg').modal('hide');
                        swal(
                          $translate.instant(titleConfirmacion),
                          $translate.instant(respuestaActualizarTG.data[1]),
                          'warning'
                        );
                      }
                    })
                    .catch(function(excepcionActualizarAnteproyecto) {
                      ctrl.loadTrabajoGrado = false;
                      ctrl.cargandoActualizarTg = false;
                      swal(
                        $translate.instant(titleConfirmacion),
                        $translate.instant("ERROR.MODIFICANDO_TG"),
                        'warning'
                      );
                    });
                })
                .catch(function(excepcionCargarDocumento) {
                  swal(
                    $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                    $translate.instant("VERIFICAR_DOCUMENTO"),
                    'warning'
                  );
                  ctrl.loadTrabajoGrado = false;
                  ctrl.cargandoActualizarAnteproyecto = false;
                });
            }
          });
      }

    });