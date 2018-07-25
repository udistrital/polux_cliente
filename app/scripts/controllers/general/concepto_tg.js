'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:GeneralConceptoTgCtrl
 * @description
 * # GeneralConceptoTgCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite dar un concepto sobreel trabajo de grado.
 * @requires services/poluxClienteApp.service:tokenService
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/poluxService.service:poluxRequest
 * @requires services/academicaService.service:academicaRequest
 * @requires services/nuxeoService.service:nuxeoClient
 * @requires $routeParams
 * @requires $q
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @property {number} idVinculacion Id de la vinculación del docente con el trabajo de grado
 * @property {Object} vinculacion Data del trabajo de grado que se evalua
 * @property {string} mensajeError Mensaje que se muestra cuando ocurre un error al cargar
 * @property {string} mensajeCargando Mensaje que se muestra cuando se esta cargando
 * @property {boolean} errorCargando Bandera que indica que ocurrio un error cargando los datos del trabajo de grado
 * @property {boolean} cargando Bandera que indica que el trabajo de grado está cargando
 */
angular.module('poluxClienteApp')
  .controller('GeneralConceptoTgCtrl', function($routeParams, token_service, poluxRequest, $q, $translate) {
    var ctrl = this;
    ctrl.idVinculacion = $routeParams.idVinculacion;

    token_service.token.documento = "80093200";
    ctrl.userId = token_service.token.documento;

    /**
     * @ngdoc method
     * @name getDocumentoEscrito
     * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
     * @description 
     * Consula el documento escrito asociado a un trabajo de grado
     * @param {object}  trabajoGrado trabajo de grado del que se consulta el documento
     * @returns {Promise} Objeto de tipo promesa que se resuelve sin ningún valor
     */
    ctrl.getDocumentoEscrito = function(trabajoGrado) {
      var defer = $q.defer();
      var parametrosDocumentoEscrito = $.param({
        query: "DocumentoEscrito.TipoDocumentoEscrito:" + ctrl.tipoDocumento + ",TrabajoGrado:" + trabajoGrado.Id,
        limit: 1,
      });
      poluxRequest.get("documento_trabajo_grado")
        .then(function(responseDocumento) {
          if (responseDocumento.data) {
            defer.resolve(responseDocumento.data[0]);
          } else {
            ctrl.mensajeError = $translate.instant("DOCUMENTO.NO_EXISTE_DOCUMENTO");
            defer.reject(ctrl.mensajeError);
          }
        })
        .catch(function(error) {
          ctrl.mensajeError = $translate.instant("ERROR.CARGAR_DOCUMENTO");
          defer.reject(error);
        });
      return defer.promise;
    }

    /**
     * @ngdoc method
     * @name getRevisiones
     * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
     * @description 
     * Consula las revisiones asociadas a un trabajo de grado
     * @param {Integer} idDocumentoTrabajoGrado El documento al que se le realizan las revisiones a consultar
     * @returns {Promise} Objeto de tipo promesa que resuelve la consulta o rechaza la excepción generada
     */
    ctrl.getRevisiones = function(idDocumentoTrabajoGrado) {
      var defer = $q.defer();
      var parametrosDocumentoEscrito = $.param({
        query: "DocumentoTrabajoGrado:" + idDocumentoTrabajoGrado,
        limit: 0,
      });
      poluxRequest.get("revision_trabajo_grado")
        .then(function(responseRevisiones) {
          if (responseRevisiones.data) {
            defer.resolve(responseRevisiones.data);
          } else {
            ctrl.mensajeError = $translate.instant("ERROR.SIN_REVISIONES");
            defer.reject(ctrl.mensajeError);
          }
        })
        .catch(function(error) {
          ctrl.mensajeError = $translate.instant("ERROR.CARGANDO_REVISIONES");
          defer.reject(error);
        });
      return defer.promise;
    }

    /**
     * @ngdoc method
     * @name getDataTg
     * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
     * @description 
     * Consulta los datos basicos del trabajo de grado, llama a las funciones para cargar el documento y cargar las revisiones previas
     * @param {number}  idVinculacion id de la vincualación con la que se traen los datos del trabajo de grado, entre otros
     * @returns {Undefined} No retorna ningún valor
     */
    ctrl.getDataTg = function(idVinculacion) {
      ctrl.cargando = true;
      ctrl.mensajeCargando = $translate.instant("LOADING.CARGANDO_PROYECTOS");
      if (idVinculacion) {
        var parametrosTg = $.param({
          query: "Id:" + idVinculacion,
          limit: 1,
        });
        poluxRequest.get("vinculacion_trabajo_grado", parametrosTg)
          .then(function(responseVinculacion) {
            if (responseVinculacion.data) {
              ctrl.vinculacion = responseVinculacion.data[0];

              ctrl.tipoDocumento = 0;
              var trabajoGrado = ctrl.vinculacion.TrabajoGrado;

              //Si el trabajo de grado es anteproyecto
              if (trabajoGrado.EstadoTrabajoGrado.Id == 4) {
                ctrl.tipoDocumento = 3;
                ctrl.verAnteproyecto = true;
                ctrl.coleccionRespuestasAnteproyecto = [{
                  idEstadoTrabajoGrado: 5,
                  nombreEstadoTrabajoGrado: "Viable",
                }, {
                  idEstadoTrabajoGrado: 6,
                  nombreEstadoTrabajoGrado: "Modificable",
                }, {
                  //idEstadoTrabajoGrado: 7, porque si le llega a dar no viable, el trabajo de grado se cancela
                  idEstadoTrabajoGrado: 2,
                  nombreEstadoTrabajoGrado: "No viable",
                }];
              } else if (trabajoGrado.EstadoTrabajoGrado.Id == 15) {
                // si el trabajo de grado esta en revisión para versión final
                ctrl.tipoDocumento = 5;
                ctrl.verProyectoRevision = true;
              }
              //Se obtiene el documento escrito para traer las revisiones
              ctrl.getDocumentoEscrito(trabajoGrado)
                .then(function(documentoTg) {
                  trabajoGrado.documentoTg = documentoTg;
                  //ctrl.getRevisiones(documentoTg);
                  ctrl.cargando = false;
                  ctrl.getRevisiones(documentoTg.Id)
                    .then(function(revisiones) {
                      console.log(revisiones);
                    })
                    .catch(function(excecpionRevisiones) {
                      console.log(excecpionRevisiones);
                    });
                })
                .catch(function(error) {
                  console.log(error);
                  ctrl.errorCargando = true;
                  ctrl.cargando = false;
                });
              /*var promesas = [];
              promesas.push(ctrl.getDocumentoEscrito(trabajoGrado));
              $q.all(promesas)
                .then(function(){
                  ctrl.cargando = false;
                })
                .catch(function(error){
                  console.log(error);
                  ctrl.errorCargando = true;
                  ctrl.cargando = false;
                });
              */
            } else {
              console.log("La consulta de las vinculaciones es vacía");
              ctrl.mensajeError = $translate.instant("ERROR.SIN_VINCULACIONES");
              ctrl.errorCargando = true;
              ctrl.cargando = false;
            }
          })
          .catch(function(error) {
            console.log(error);
            ctrl.mensajeError = $translate.instant("ERROR.CARGANDO_VINCULACIONES");
            ctrl.errorCargando = true;
            ctrl.cargando = false;
          });
      } else {
        console.log("No se ha definido el identificador de la vinculación");
        ctrl.mensajeError = $translate.instant("ERROR.IDENTIFICADOR_INDEFINIDO");
        ctrl.errorCargando = true;
        ctrl.cargando = false;
      }
    }

    ctrl.getDataTg(ctrl.idVinculacion);

  });