'use strict';

/**
 * @ngdoc controller
 * @name poluxClienteApp.controller:GeneralConceptoTgCtrl
 * @description
 * # GeneralConceptoTgCtrl
 * Controller of the poluxClienteApp
 * Controlador que permite dar un concepto sobre el trabajo de grado.
 * Este concepto permite que el estado del trabajo de grado pueda cambiar de modo que se atiendan modificaciones, se dé continuación al proceso o se rechace el trabajo de grado.
 * @requires $location
 * @requires $q
 * @requires $routeParams
 * @requires $scope
 * @requires decorators/poluxClienteApp.decorator:TextTranslate
 * @requires services/academicaService.service:academicaRequest
 * @requires services/poluxService.service:nuxeoClient
 * @requires services/poluxService.service:poluxRequest
 * @requires services/poluxClienteApp.service:tokenService
 * @property {Number} idVinculacion Identificador de la vinculación del docente con el trabajo de grado
 * @property {String} userId Documento del usuario en sesión
 * @property {Number} tipoDocumento Tipo de documento escrito sobre el que se está operando
 * @property {Boolean} showc Indicador que maneja la aparición de comentarios sobre la revisión asociada al concepto
 * @property {Object} vinculacion Data del trabajo de grado que se evalúa
 * @property {String} mensajeError Mensaje que se muestra cuando ocurre un error al cargar
 * @property {Object} correccion Objeto que opera la corrección que se está editando sobre el trabajo de grado
 * @property {Object} revisionActual Objeto que carga la información sobre la revisión que será registrada al dar el concepto
 * @property {Boolean} verAnteproyecto Indicador que maneja la visualización del anteproyecto en revisión
 * @property {String} paginaRedireccion Texto que prepara la página de redirección una vez se dé el concepto
 * @property {Array} coleccionRespuesta Colección que maneja las posibles respuestas con respecto al concepto de trabajo de grado
 * @property {Boolean} mostrarPanelRevision Indicador que maneja la visualización del panel que contiene la revisión en curso
 * @property {String} informacionDocente Texto que carga la información del docente para la revisión
 * @property {String} mensajeCargando Mensaje que se muestra cuando se esta cargando
 * @property {Boolean} errorCargando Bandera que indica que ocurrio un error cargando los datos del trabajo de grado
 * @property {Boolean} cargando Bandera que indica que el trabajo de grado está cargando
 */
angular.module('poluxClienteApp')
  .controller('GeneralConceptoTgCtrl',
    function($location, $q, $routeParams, $scope, $translate, academicaRequest, nuxeoClient, poluxRequest, token_service) {
      var ctrl = this;
      ctrl.idVinculacion = $routeParams.idVinculacion;

      token_service.token.documento = "80093200";
      ctrl.userId = token_service.token.documento;
      $scope.showc = true;

      /**
       * @ngdoc method
       * @name consultarDocenteTrabajoGrado
       * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
       * @description
       * Función que recorre la base de datos de acuerdo a la vinculación del trabajo de grado y trae los datos del docente asociado.
       * Consulta el servicio de {@link services/academicaService.service:academicaRequest academicaRequest} para traer la información académica.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} La información del docente asociado o la excepción generada
       */
      ctrl.consultarDocenteTrabajoGrado = function() {
        var deferred = $q.defer();
        academicaRequest.get("docente_tg", [ctrl.userId])
          .then(function(informacionDocente) {
            if (!angular.isUndefined(informacionDocente.data.docenteTg.docente)) {
              deferred.resolve(informacionDocente.data.docenteTg.docente[0].nombre);
            } else {
              deferred.reject($translate.instant("ERROR.SIN_DOCENTE"));
            }
          })
          .catch(function(excepcionInformacionDocente) {
            deferred.reject($translate.instant("ERROR.CARGANDO_DOCENTE"));
          })
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name getDocumentoEscrito
       * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
       * @description 
       * Consula el documento escrito asociado a un trabajo de grado.
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
       * @param {Object} trabajoGrado Trabajo de grado del que se consulta el documento
       * @returns {Promise} Objeto de tipo promesa que se resuelve con la información consultada o la excepción generada
       */
      ctrl.getDocumentoEscrito = function(trabajoGrado) {
        var defer = $q.defer();
        var parametrosDocumentoEscrito = $.param({
          query: "DocumentoEscrito.TipoDocumentoEscrito:" + ctrl.tipoDocumento + ",TrabajoGrado:" + trabajoGrado.Id,
          limit: 1,
        });
        poluxRequest.get("documento_trabajo_grado", parametrosDocumentoEscrito)
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
       * Consulta el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para traer los datos de la base del aplicativo.
       * @param {Integer} idTrabajoGrado El trabajo de grado al que se le realizan las revisiones a consultar
       * @returns {Promise} Objeto de tipo promesa que resuelve la consulta o rechaza la excepción generada
       */
      ctrl.getRevisiones = function(idTrabajoGrado) {
        var defer = $q.defer();
        var parametrosRevisionesTrabajoGrado = $.param({
          query: "DocumentoTrabajoGrado.TrabajoGrado.Id:" + idTrabajoGrado,
          limit: 0,
        });
        poluxRequest.get("revision_trabajo_grado", parametrosRevisionesTrabajoGrado)
          .then(function(responseRevisiones) {
            if (responseRevisiones.data) {
              defer.resolve(responseRevisiones.data);
            } else {
              defer.resolve([]);
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
       * @name agregarCorrecion
       * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
       * @description 
       * Permite agregar una correción a la revisión que se esta realizando
       * @param {undefined} undefined No recibe parametros
       * @returns {Undefined} No retorna ningún valor
       */
      ctrl.agregarCorreccion = function() {
        ctrl.correccion.RevisionTrabajoGrado = {
          Id: ctrl.revisionActual.Id,
        };
        ctrl.correccion.Pagina = 1;
        ctrl.correccion.Documento = false;
        ctrl.revisionActual.Correcciones.push(ctrl.correccion);
        ctrl.correccion = {};
      }

      /**
       * @ngdoc method
       * @name eliminarCorreccion
       * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
       * @description 
       * Permite eliminar una correción a la revisión que se esta realizando
       * @param {Object} correcion Correción que se eliminará
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.eliminarCorreccion = function(correcion) {
        ctrl.revisionActual.Correcciones.splice(ctrl.revisionActual.Correcciones.indexOf(correcion), 1);
      };

      /**
       * @ngdoc method
       * @name editarCorreccion
       * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
       * @description 
       * Permite editar una correción a la revisión que se está realizando.
       * @param {Object} correcion Correción que se edita
       * @param {Object} correcion_temp Correción editada
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.editarCorreccion = function(correcion, correcion_temp) {
        correcion.Observacion = correcion_temp.Observacion;
        correcion.Justificacion = correcion_temp.Justificacion;
      }

      /**
       * @ngdoc method
       * @name copyObject
       * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
       * @description 
       * Realiza una clonación del objeto que se recibe.
       * @param {Object} object El objeto al que se le efectuará la clonación
       * @returns {Object} El objeto clonado
       */
      ctrl.copyObject = function(object) {
        return angular.copy(object);
      }

      /**
       * @ngdoc method
       * @name getDataTg
       * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
       * @description 
       * Consulta los datos básicos del trabajo de grado, llama a las funciones para cargar el documento y cargar las revisiones previas.
       * @param {Number} idVinculacion Identificador de la vincualación con la que se traen los datos relacionados con el trabajo de grado.
       * @returns {undefined} No retorna ningún valor
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
                  ctrl.paginaRedireccion = "/trabajo_grado/revisar_anteproyecto";
                  ctrl.coleccionRespuesta = [{
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
                  ctrl.verAnteproyecto = true;
                  ctrl.verProyectoRevision = true;
                  ctrl.paginaRedireccion = "/trabajo_grado/revisar_proyecto";
                  ctrl.coleccionRespuesta = [{
                    idEstadoTrabajoGrado: 16,
                    nombreEstadoTrabajoGrado: "Modificable",
                  }, {
                    idEstadoTrabajoGrado: 17,
                    nombreEstadoTrabajoGrado: "Listo para sustentar",
                  }];
                }

                //Se obtiene el documento escrito para traer las revisiones
                ctrl.getDocumentoEscrito(trabajoGrado)
                  .then(function(documentoTg) {
                    trabajoGrado.documentoTg = documentoTg;
                    //ctrl.getRevisiones(documentoTg);
                    ctrl.cargando = false;
                    ctrl.getRevisiones(documentoTg.TrabajoGrado.Id)
                      .then(function(revisiones) {
                        trabajoGrado.revisiones = revisiones;
                        //Se habilita la directiva para solicitar la revisión
                        if (trabajoGrado.EstadoTrabajoGrado.Id == 4 || trabajoGrado.EstadoTrabajoGrado.Id == 15) {
                          ctrl.mostrarPanelRevision = true;
                          ctrl.revisionActual = {
                            NumeroRevision: trabajoGrado.revisiones.length + 1,
                            FechaRecepcion: new Date(),
                            FechaRevision: new Date(),
                            Correcciones: [],
                            EstadoRevisionTrabajoGrado: {
                              Id: 3,
                            },
                            DocumentoTrabajoGrado: {
                              Id: documentoTg.Id,
                            },
                            VinculacionTrabajoGrado: {
                              Id: ctrl.vinculacion.Id,
                            }
                          }
                          ctrl.correccion = {};
                        }
                      })
                      .catch(function(excecpionRevisiones) {
                        console.log(excecpionRevisiones);
                        ctrl.errorCargando = true;
                        ctrl.cargando = false;
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

      ctrl.consultarDocenteTrabajoGrado()
        .then(function(informacionDocente) {
          ctrl.informacionDocente = informacionDocente;
          ctrl.getDataTg(ctrl.idVinculacion);
        })
        .catch(function(excepcionInformacionDocente) {
          ctrl.errorCargando = true;
          ctrl.mensajeError = excepcionInformacionDocente;
        });

      /**
       * @ngdoc method
       * @name registrarRevisionTg
       * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
       * @description
       * Función que prepara el contenido de la información para actualizar.
       * Efectúa el servicio de {@link services/poluxService.service:poluxRequest poluxRequest} para registrar los resultados de la revisión en la base de datos.
       * @param {undefined} undefined No requiere parámetros
       * @returns {Promise} La respuesta de operar el registro en la base de datos
       */
      ctrl.registrarRevisionTg = function() {
        var deferred = $q.defer();
        ctrl.vinculacion.TrabajoGrado.EstadoTrabajoGrado = {
          Id: ctrl.revisionActual.respuestaSeleccionada.idEstadoTrabajoGrado
        };
        var fecha = new Date();
        var comentarios = [];
        angular.forEach(ctrl.revisionActual.Correcciones, function(correccion) {
          comentarios.push({
            Comentario: correccion.Justificacion,
            Fecha: fecha,
            Autor: ctrl.informacionDocente,
            Correccion: correccion,
          });
        });
        var informacionParaActualizar = {
          "TrabajoGrado": ctrl.vinculacion.TrabajoGrado,
          "RevisionTrabajoGrado": ctrl.revisionActual,
          "Comentarios": comentarios,
        };
        console.log(informacionParaActualizar);
        poluxRequest
          .post("tr_revisar_tg", informacionParaActualizar)
          .then(function(respuestaRevisarTg) {
            deferred.resolve(respuestaRevisarTg);
          })
          .catch(function(excepcionRevisarTg) {
            console.log("Recuerde el campo de corrección que identifica si es documento");
            deferred.reject(excepcionRevisarTg);
          });
        return deferred.promise;
      }

      /**
       * @ngdoc method
       * @name guardarRevision
       * @methodOf poluxClienteApp.controller:GeneralConceptoTgCtrl
       * @description 
       * Permite guardar la revision realizada.
       * Efectúa el servicio de {@link services/poluxService.service:nuxeoClient nuxeoClient} para hacer gestión documental.
       * @param {undefined} undefined No recibe parámetros
       * @returns {undefined} No retorna ningún valor
       */
      ctrl.guardarRevision = function() {
        console.log(ctrl.revisionActual);
        ctrl.cargando = true;
        swal({
            title: $translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
            text: $translate.instant("REVISAR_PROYECTO.MENSAJE_CONFIRMACION_PLANO"),
            type: "info",
            confirmButtonText: $translate.instant("ACEPTAR"),
            cancelButtonText: $translate.instant("CANCELAR"),
            showCancelButton: true
          })
          .then(function(confirmacionDelUsuario) {
            if (confirmacionDelUsuario.value) {
              if (ctrl.revisionActual.documentModel) {
                nuxeoClient.createDocument(ctrl.vinculacion.TrabajoGrado.Titulo, "Correcciones sobre el proyecto", ctrl.revisionActual.documentModel, "Correcciones", undefined)
                  .then(function(respuestaCrearDocumento) {
                    console.log(respuestaCrearDocumento);
                    ctrl.revisionActual.Correcciones.push({
                      Observacion: respuestaCrearDocumento,
                      Justificacion: "Por favor descargue el documento de observaciones",
                      Pagina: 1,
                      RevisionTrabajoGrado: {
                        Id: 0
                      },
                      Documento: true
                    });
                    ctrl.registrarRevisionTg()
                      .then(function(respuestaRevisarTg) {
                        ctrl.cargando = false;
                        if (respuestaRevisarTg.data[0] === "Success") {
                          swal(
                            $translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
                            $translate.instant("REVISAR_PROYECTO.REVISION_REGISTRADA"),
                            'success'
                          );
                          $location.path(ctrl.paginaRedireccion);
                        } else {
                          swal(
                            $translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
                            $translate.instant(respuestaRevisarTg.data[1]),
                            'warning'
                          );
                        }
                      })
                      .catch(function(excepcionRevisarTg) {
                        console.log(excepcionRevisarTg);
                        ctrl.cargando = false;
                        swal(
                          $translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
                          $translate.instant("ERROR.REGISTRANDO_REVISION"),
                          'warning'
                        );
                      });
                  })
                  .catch(function(excepcionCrearDocumento) {
                    console.log(excepcionCrearDocumento);
                    ctrl.cargando = false;
                    swal(
                      $translate.instant("ERROR.SUBIR_DOCUMENTO"),
                      $translate.instant("VERIFICAR_DOCUMENTO"),
                      'warning'
                    );
                  });
              } else {
                ctrl.registrarRevisionTg()
                  .then(function(respuestaRevisarTg) {
                    ctrl.cargando = false;
                    if (respuestaRevisarTg.data[0] === "Success") {
                      swal(
                        $translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
                        $translate.instant("REVISAR_PROYECTO.REVISION_REGISTRADA"),
                        'success'
                      );
                      $location.path(ctrl.paginaRedireccion);
                    } else {
                      swal(
                        $translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
                        $translate.instant(respuestaRevisarTg.data[1]),
                        'warning'
                      );
                    }
                  })
                  .catch(function(excepcionRevisarTg) {
                    ctrl.cargando = false;
                    swal(
                      $translate.instant("REVISAR_PROYECTO.CONFIRMACION"),
                      $translate.instant("ERROR.REGISTRANDO_REVISION"),
                      'warning'
                    );
                  });
              }
            } else {
              ctrl.cargando = false;
            }
          });
      }

    });